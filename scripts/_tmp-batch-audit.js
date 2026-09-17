#!/usr/bin/env node
/** Per-round audit: DELIVERED model (from stamps, never uploads.model), chain rung per render, and any
 *  gemini that is not explained by (a) a genuine gemini roll or (b) chain step 3 after a refused flux single. */
const fs=require('fs');
const {createClient}=require('@supabase/supabase-js');
const env=Object.fromEntries(fs.readFileSync('.env.local','utf8').split('\n').filter(l=>l.includes('=')&&!l.startsWith('#'))
  .map(l=>{const i=l.indexOf('=');return[l.slice(0,i).trim(),l.slice(i+1).trim().replace(/^"|"$/g,'')];}));
const sb=createClient(env.EXPO_PUBLIC_SUPABASE_URL,env.SUPABASE_SERVICE_ROLE_KEY);
const ARM=(process.argv[2]||'R1').replace(/^--arm=/,'');
const short=m=>String(m||'').split('/').pop();
(async()=>{
  const {data:ups}=await sb.from('uploads').select('id,caption,face_swap_mode,dream_medium,created_at')
    .eq('user_id','eab700d8-f11a-4f47-a3a1-addda6fb67ec').like('caption',`AB-${ARM}%`).order('created_at');
  const rows=[];
  for(const u of ups||[]){
    const {data:l}=await sb.from('ai_generation_log').select('fallback_reasons,model_used').eq('upload_id',u.id).limit(1);
    const st=((l&&l[0]&&l[0].fallback_reasons)||[]).map(String).join(' ');
    const rolled=(st.match(/policy:(?:couple|solo):1:([a-z0-9.\-]+)/)||[])[1]||'?';
    const isCouple=/dual_engine|dual_target|dual_degrade|rebuilt_solo|no_dual_split/.test(st);
    let delivered, rung;
    if(/chain_2of|look_model_exhausted/.test(st)){delivered='gemini-2-image';rung='couple→gemini couple';}
    else if(/rebuilt_solo:/.test(st)){delivered=(st.match(/rebuilt_solo:([a-z0-9.\-]+)/)||[])[1];rung='couple→'+short(delivered)+' single';}
    else if(/solo_model_move:/.test(st)){delivered=(st.match(/solo_model_move:([a-z0-9.\-]+)/)||[])[1];rung='single→moved';}
    else if(/SHIPPED_FACELESS/.test(st)){delivered='(none)';rung='NOBODY';}
    else {delivered=short(l&&l[0]&&l[0].model_used);rung=isCouple?(/dual_attempts:1\b/.test(st)?'couple held':'couple (retried)'):(/solo_probes:1\b/.test(st)?'single held':'single (retried)');}
    const explained = delivered!=='gemini-2-image' || rolled==='gemini-2-image' || /chain_2of|look_model_exhausted|solo_model_move/.test(st);
    const extra=[];
    if(/look_medium_ban_model:/.test(st)) extra.push((st.match(/look_medium_ban_model:\S+/)||[])[0]);
    if(/pin_model_fit:/.test(st)) extra.push((st.match(/pin_model_fit:\S+/)||[])[0]);
    if(/dual_degrade_single:\w+_refused_gender/.test(st)) extra.push('flux-single REFUSED');
    rows.push({n:u.caption.replace(`AB-${ARM} `,''),type:isCouple?'couple':'single',rolled:short(rolled),delivered:short(delivered),rung,silent:!explained,extra:extra.join(' ')});
  }
  const pad=(s,n)=>String(s).padEnd(n);
  console.log(`\n${ARM}: ${rows.length} renders\n`);
  console.log(pad('#',4)+pad('type',8)+pad('rolled',15)+pad('delivered',16)+pad('rung',26)+'notes');
  for(const r of rows) console.log(pad(r.n,4)+pad(r.type,8)+pad(r.rolled,15)+pad(r.delivered,16)+pad(r.rung,26)+(r.silent?'⚠ SILENT GEMINI ':'')+r.extra);
  const n=rows.length, g=rows.filter(r=>r.delivered==='gemini-2-image').length, f=rows.filter(r=>/flux/.test(r.delivered)).length;
  const gRoll=rows.filter(r=>r.delivered==='gemini-2-image'&&r.rolled==='gemini-2-image').length;
  const gChain=rows.filter(r=>r.rung==='couple→gemini couple'&&r.rolled!=='gemini-2-image').length;
  const silent=rows.filter(r=>r.silent).length;
  const couples=rows.filter(r=>r.type==='couple'), held=couples.filter(r=>r.rung==='couple held').length, toSingle=couples.filter(r=>/single$/.test(r.rung)).length, toGem=couples.filter(r=>r.rung==='couple→gemini couple').length, nobody=rows.filter(r=>r.rung==='NOBODY').length;
  console.log(`\nDELIVERED  flux ${f}/${n} (${Math.round(100*f/n)}%)   gemini ${g}/${n} (${Math.round(100*g/n)}%)   nobody ${nobody}`);
  console.log(`GEMINI WHY  rolled gemini ${gRoll}   chain after flux single refused ${gChain}   SILENT/unexplained ${silent}`);
  console.log(`COUPLES ${couples.length}: held ${held}   → flux single ${toSingle}   → gemini couple ${toGem}`);
  fs.writeFileSync(`/tmp/audit-${ARM}.json`,JSON.stringify(rows,null,2));
})();
