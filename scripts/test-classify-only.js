const { createClient } = require('@supabase/supabase-js');
const sb = createClient('https://jimftynwrinwenonjrlj.supabase.co', process.env.SUPABASE_SERVICE_ROLE_KEY);
const EMAIL = 'konakevin@gmail.com';
const URL = 'https://jimftynwrinwenonjrlj.supabase.co';

const TESTS = [
  { label: 'group-from-behind (current test)', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80' },
  { label: 'group-front-facing', url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80' },
  { label: 'couple-selfie', url: 'https://images.unsplash.com/photo-1521575107034-e0fa0b594529?w=800&q=80' },
  { label: 'group-candid', url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&q=80' },
];

async function getJwt() {
  const { data: linkData } = await sb.auth.admin.generateLink({ type: 'magiclink', email: EMAIL });
  const { data: otpData } = await sb.auth.verifyOtp({ token_hash: linkData.properties.hashed_token, type: 'magiclink' });
  return otpData.session.access_token;
}

(async () => {
  for (const t of TESTS) {
    const jwt = await getJwt();
    const res = await fetch(`${URL}/functions/v1/classify-photo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({ input_image: t.url }),
    });
    const data = await res.json();
    console.log(`\n${t.label}:`);
    console.log(`  type: ${data.type}`);
    console.log(`  desc: ${(data.subject_description || '').slice(0, 200)}`);
  }
})().catch((e) => console.error(e.message));
