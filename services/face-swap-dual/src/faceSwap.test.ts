// genderRouteConflict — the engine's genderage read of the two faces it will swap must AGREE with a Haiku
// override, else the attempt is rejected (2026-09-12, the mural cross).
import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts';
import { genderRouteConflict } from './faceSwap.ts';

Deno.test('no override → no conflict (engine routes on genderage as before)', () => {
  assertEquals(genderRouteConflict(null, { gender: 'male' }, { gender: 'female' }), null);
  assertEquals(genderRouteConflict(undefined, { gender: 'male' }, { gender: 'female' }), null);
});

Deno.test('override agrees with a confident one-of-each genderage read → no conflict', () => {
  assertEquals(
    genderRouteConflict(
      { left: 'male', right: 'female' },
      { gender: 'male' },
      {
        gender: 'female',
      }
    ),
    null
  );
});

Deno.test(
  'override DISAGREES with a confident one-of-each genderage read → conflict (the mural cross)',
  () => {
    assertEquals(
      genderRouteConflict(
        { left: 'female', right: 'male' },
        { gender: 'male' },
        {
          gender: 'female',
        }
      ),
      'gender_conflict:haiku=female/male,genderage=male/female'
    );
  }
);

Deno.test(
  'genderage unreadable or same-gender → the override still fills in (2026-08-05 painted-face case)',
  () => {
    assertEquals(
      genderRouteConflict(
        { left: 'female', right: 'male' },
        { gender: null },
        {
          gender: 'male',
        }
      ),
      null
    );
    assertEquals(genderRouteConflict({ left: 'female', right: 'male' }, {}, {}), null);
    assertEquals(
      genderRouteConflict(
        { left: 'female', right: 'male' },
        { gender: 'male' },
        {
          gender: 'male',
        }
      ),
      null
    );
  }
);
