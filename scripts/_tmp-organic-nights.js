#!/usr/bin/env node
/** 20 ORGANIC nightly dreams — nothing forced. Cast role, look, vibe, model, place, pose all roll exactly
 *  as they would on a real night, so the spread shows what users actually get after today's fixes. */
const fs=require('fs'),path=require('path'),https=require('https');
const {createClient}=require('@supabase/supabase-js');
const {waitForHeadroom}=require('./lib/poolHeadroom');
const env=Object.fromEntries(fs.readFileSync('.env.local','utf8').split('\n').filter(l=>l.includes('='))
  .map(l=>{const i=l.indexOf('=');return [l.slice(0,i).trim(),l.slice(i+1).trim()];}));
const sb=createClient(env.EXPO_PUBLIC_SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY);
const KEVIN='eab700d8-f11a-4f47-a3a1-addda6fb67ec', TOK=env.DREAM_QUEUE_WORKER_TOKEN;
const N=Number(process.argv[2]||20);
const OUT='/private/tmp/claude-501/-Users-kevinmchenry-Development-apps-dreambot/8f7586d7-85ff-4f4f-aa92-3bfa523a75a4/scratchpad/organic-nights';
fs.mkdirSync(OUT,{recursive:true});
function dl(u,d){return new Promise((r,j)=>{const f=fs.createWriteStream(d);
  https.get(u,x=>{if(x.statusCode!==200){f.close();return j(new Error('HTTP'+x.statusCode));}x.pipe(f);f.on('finish',()=>f.close(r));}).on('error',j);});}
(async()=>{
  const rows=[];
  for(let n=1;n<=N;n++){
    await waitForHeadroom({min:25,label:`night${n}`});
    process.stdout.write(`night ${String(n).padStart(2)} … `);
    const t=Date.now();
    let res,p;
    try{
      res=await fetch('https://jimftynwrinwenonjrlj.supabase.co/functions/v1/nightly-dreams',{
        method:'POST',headers:{Authorization:'Bearer '+TOK,'Content-Type':'application/json'},
        body:JSON.stringify({user_id:KEVIN,persist:true})});   // ← nothing else. fully organic.
      p=await res.json().catch(()=>({}));
    }catch(e){console.log('FETCH FAIL',e.message);rows.push({n,ok:false});continue;}
    const el=Math.round((Date.now()-t)/1000);
    if(!res.ok||!p.image_url){console.log('FAILED',(p.error||res.status));rows.push({n,ok:false,error:p.error||res.status});
      fs.writeFileSync(path.join(OUT,'report.json'),JSON.stringify(rows,null,2));continue;}
    await sb.from('uploads').update({caption:`✨ NIGHT ${n}`}).eq('id',p.upload_id);
    let l=null;
    for(let i=0;i<6&&!l;i++){const{data}=await sb.from('ai_generation_log')
      .select('rolled_axes,fallback_reasons,model_used').eq('upload_id',p.upload_id).limit(1);
      l=data&&data[0]; if(!l)await new Promise(r=>setTimeout(r,2000));}
    const a=(l&&l.rolled_axes)||{}, st=((l&&l.fallback_reasons)||[]).map(String);
    const deg=st.join(' ').includes('dual_degrade_single');
    const local=path.join(OUT,`${n}.jpg`);
    try{await dl(p.image_url,local);}catch{}
    rows.push({n,ok:true,elapsed_s:el,upload_id:p.upload_id,local,
      look:a.look||a.medium,vibe:a.vibe,model:String(a.model||l.model_used||'').replace(/^.*\//,''),
      type:a.dreamType,place:a.userPlace,degraded:deg});
    console.log(`ok ${el}s · ${String(a.dreamType||'').padEnd(16)} ${String(a.look||a.medium||'').replace('nightly_','').padEnd(22)} ${String(a.vibe||'').padEnd(20)} ${String(a.model||'').replace(/^.*\//,'')}${deg?' · DEGRADED':''}`);
    fs.writeFileSync(path.join(OUT,'report.json'),JSON.stringify(rows,null,2));
  }
  console.log(`\ndone: ${rows.filter(r=>r.ok).length}/${rows.length}`);
})();
