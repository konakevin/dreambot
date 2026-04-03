Enter dream engine testing mode. Kevin will generate dreams in the app and say "k" after each one.

When Kevin says "k", automatically:

1. Get the latest screenshot from the Desktop:
   ```
   ls -t ~/Desktop/*.png | head -1
   ```

2. Read and view the screenshot image.

3. Pull the latest generation log:
   ```bash
   export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && SUPABASE_SERVICE_ROLE_KEY=$(grep SUPABASE_SERVICE_ROLE_KEY .env.local | cut -d= -f2) node -e "const{createClient}=require('@supabase/supabase-js');const s=createClient('https://jimftynwrinwenonjrlj.supabase.co',process.env.SUPABASE_SERVICE_ROLE_KEY);(async()=>{const{data}=await s.from('ai_generation_log').select('enhanced_prompt,rolled_axes').eq('user_id','eab700d8-f11a-4f47-a3a1-addda6fb67ec').order('created_at',{ascending:false}).limit(1);if(!data||!data.length)return;const a=data[0].rolled_axes;console.log('MODE:',a.dreamMode,'| PATH:',a.promptPath);console.log('ARCH:',a.archetype);console.log('MED:',a.medium?.slice(0,50));console.log('MOOD:',a.mood,'| INT:',JSON.stringify(a.interests));console.log('---');console.log('PROMPT:',data[0].enhanced_prompt)})()"
   ```

4. Analyze and report:
   - **Mode**: Which of the three paths hit (Chord/Solo/Song)?
   - **Match**: Does the image match the prompt? What came through, what didn't?
   - **Style**: Did the art medium render correctly or did Flux default to photorealistic?
   - **Quality**: Is this a "stop scrolling" image or generic AI art?
   - **Archetype**: If Solo, did the archetype's identity come through?
   - **Tweaks**: Any engine adjustments worth making based on this result?

Keep responses concise. Kevin is rapid-fire testing — don't write essays.

If Kevin says "last N" (e.g., "last 5"), pull the last N logs and screenshots and do a batch analysis.

To swap test personas: `node scripts/persona.js <1-5|kevin>` then relaunch the app.
To check matched archetypes: query user_archetypes joined with dream_archetypes.
