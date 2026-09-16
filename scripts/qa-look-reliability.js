#!/usr/bin/env node
/**
 * Does the pinned LOOK actually land? One look, N renders, current production engine.
 *
 * Built 2026-09-16 to answer "does a nightly render in the style we assign it". Measured a pinned
 * nightly_classical_oil on flux-1.1-pro at 2/9 before the framing fix and 7/9 after — full write-up in
 * NIGHTLY_LOOK_FIDELITY_INVESTIGATION.md.
 *
 *   node scripts/qa-look-reliability.js <look_key> <n>
 *
 * Judge look fidelity at n >= 9. At n = 1-3 render-to-render variance dominates and produced two wrong
 * conclusions in that investigation. Pins the look with `qa_pin_look`, NEVER `force_look` — the latter
 * aliases to force_medium and silently skips the minimal contract build, so you would be measuring a
 * DISABLED looks engine without any error to tell you.
 */
const fs=require('fs'),path=require('path'),https=require('https');
const {createClient}=require('@supabase/supabase-js');
const {waitForHeadroom}=require('./lib/poolHeadroom');
const env=Object.fromEntries(fs.readFileSync('.env.local','utf8').split('\n').filter(l=>l.includes('='))
  .map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(),l.slice(i+1).trim()];}));
const sb=createClient(env.EXPO_PUBLIC_SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY);
const KEVIN='eab700d8-f11a-4f47-a3a1-addda6fb67ec', TOK=env.DREAM_QUEUE_WORKER_TOKEN;
const LOOK=process.argv[2]||'nightly_classical_oil';
const N=Number(process.argv[3]||10);
const OUT='/private/tmp/claude-501/-Users-kevinmchenry-Development-apps-dreambot/8f7586d7-85ff-4f4f-aa92-3bfa523a75a4/scratchpad/look-reliability';
fs.mkdirSync(OUT,{recursive:true});
function dl(u,d){return new Promise((r,j)=>{const f=fs.createWriteStream(d);
  https.get(u,x=>{if(x.statusCode!==200){f.close();return j(new Error('HTTP'+x.statusCode));}x.pipe(f);f.on('finish',()=>f.close(r));}).on('error',j);});}
(async()=>{
  const rows=[];
  for(let n=1;n<=N;n++){
    await waitForHeadroom({min:25,label:`look:${n}`});
    process.stdout.write(`#${String(n).padStart(2)} … `);
    const t=Date.now();
    let res,p;
    try{
      res=await fetch('https://jimftynwrinwenonjrlj.supabase.co/functions/v1/nightly-dreams',{
        method:'POST',headers:{Authorization:'Bearer '+TOK,'Content-Type':'application/json'},
        body:JSON.stringify({user_id:KEVIN,persist:true,qa_pin_look:LOOK,
          force_cast_role:'self',force_face_swap_eligible:true,
          force_model:'black-forest-labs/flux-1.1-pro'})});
      p=await res.json().catch(()=>({}));
    }catch(e){console.log('FETCH FAIL');rows.push({n,ok:false});continue;}
    const el=Math.round((Date.now()-t)/1000);
    if(!res.ok||!p.image_url){console.log('FAILED',p.error||res.status);rows.push({n,ok:false,error:p.error||res.status});
      fs.writeFileSync(path.join(OUT,'report.json'),JSON.stringify(rows,null,2));continue;}
    await sb.from('uploads').update({caption:`✨ LOOKREL ${LOOK} #${n}`}).eq('id',p.upload_id);
    const local=path.join(OUT,`${n}.jpg`);
    try{await dl(p.image_url,local);}catch{}
    const {data:l}=await sb.from('ai_generation_log').select('rolled_axes,fallback_reasons').eq('upload_id',p.upload_id).limit(1);
    const a=(l&&l[0]&&l[0].rolled_axes)||{};
    rows.push({n,ok:true,upload_id:p.upload_id,local,elapsed_s:el,vibe:a.vibe,place:a.userPlace||null});
    console.log(`ok ${el}s · vibe ${a.vibe} · ${p.upload_id.slice(0,8)}`);
    fs.writeFileSync(path.join(OUT,'report.json'),JSON.stringify(rows,null,2));
  }
  console.log(`\ndone: ${rows.filter(r=>r.ok).length}/${rows.length}`);
})();
