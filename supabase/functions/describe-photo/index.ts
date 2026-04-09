/**
 * describe-photo — Takes a photo URL, sends it to Llama Vision (via Replicate),
 * returns a detailed text description of the person/pet's appearance.
 * One-time cost at profile save time.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { describeWithVision, VISION_PROMPTS } from '../_shared/vision.ts';

const REPLICATE_TOKEN = Deno.env.get('REPLICATE_API_TOKEN')!;

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'authorization, content-type',
      },
    });
  }

  try {
    // Auth check
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const authHeader = req.headers.get('authorization') ?? '';
    const supabaseUser = createClient(
      supabaseUrl,
      Deno.env.get('SUPABASE_ANON_KEY') ?? serviceRoleKey,
      { global: { headers: { Authorization: authHeader } } }
    );
    const {
      data: { user },
      error: authError,
    } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Not authenticated' }), { status: 401 });
    }

    const { image_url, role } = await req.json();
    if (!image_url || !role) {
      return new Response(JSON.stringify({ error: 'image_url and role required' }), {
        status: 400,
      });
    }

    const prompt = role === 'pet' ? VISION_PROMPTS.castPet : VISION_PROMPTS.castPerson;
    const description = await describeWithVision(image_url, prompt, REPLICATE_TOKEN, 300);

    console.log(`[describe-photo] ${role}:`, description.slice(0, 120));

    return new Response(JSON.stringify({ description }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[describe-photo] Error:', (err as Error).message);
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
});
