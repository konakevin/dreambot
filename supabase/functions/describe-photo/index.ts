/**
 * describe-photo — Takes a photo URL, sends it to Llama 3.2 Vision (via Replicate),
 * returns a detailed text description of the person/pet's appearance.
 * Uses Llama instead of Anthropic because it never refuses to describe people.
 * One-time cost at profile save time.
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const REPLICATE_TOKEN = Deno.env.get('REPLICATE_API_TOKEN')!;

async function describePhoto(imageUrl: string, role: string): Promise<string> {
  const prompt =
    role === 'pet'
      ? 'Describe this animal for an AI artist. Include: species, breed, coat color/pattern, fur texture (curly/straight/wiry/fluffy), eye color, ear shape, size, build, age (puppy/young/adult/senior), distinguishing features. 2-3 sentences. Output ONLY the description.'
      : 'Describe this person for an AI artist creating a stylized character. Include: exact age estimate, face shape, eye color, hair (exact color like sandy brown or chestnut, length, texture, style), facial hair if any, skin tone, build, clothing colors/style, any distinguishing features (glasses, freckles, jewelry, tattoos). 3 sentences max. Be EXTREMELY specific — the more detail, the better the resemblance. Output ONLY the description.';

  // Call Llama 3.2 Vision via Replicate
  const createRes = await fetch(
    'https://api.replicate.com/v1/models/meta/llama-3.2-90b-vision/predictions',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${REPLICATE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        input: {
          image: imageUrl,
          prompt,
          max_tokens: 300,
        },
      }),
    }
  );

  if (!createRes.ok) {
    const err = await createRes.text();
    console.error('[describe-photo] Replicate create error:', createRes.status, err);
    throw new Error(`Vision API failed: ${createRes.status}`);
  }

  const pred = await createRes.json();
  if (!pred.id) throw new Error('No prediction ID');

  // Poll for result
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const pollRes = await fetch(`https://api.replicate.com/v1/predictions/${pred.id}`, {
      headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` },
    });
    const data = await pollRes.json();
    if (data.status === 'succeeded') {
      // Llama returns an array of strings or a single string
      const output = Array.isArray(data.output) ? data.output.join('') : (data.output ?? '');
      console.log(`[describe-photo] ${role}:`, output.slice(0, 120));
      return output.trim();
    }
    if (data.status === 'failed') {
      console.error('[describe-photo] Replicate failed:', data.error);
      throw new Error(`Vision failed: ${data.error}`);
    }
  }
  throw new Error('Vision API timed out');
}

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

    const description = await describePhoto(image_url, role);

    return new Response(JSON.stringify({ description }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('[describe-photo] Error:', (err as Error).message);
    return new Response(JSON.stringify({ error: (err as Error).message }), { status: 500 });
  }
});
