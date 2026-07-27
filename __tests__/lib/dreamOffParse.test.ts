/**
 * Wire-contract lock for the Dream Off RPC parsers. These pure functions map the
 * jsonb each RPC returns into the client domain types. The tests assert BOTH the
 * happy path AND that malformed/partial payloads degrade to safe defaults — so if
 * a future migration renames or drops an RPC field, a test breaks here instead of
 * a screen crashing at runtime.
 */

import {
  asObj,
  asObjArr,
  str,
  strOrNull,
  numOr,
  isTrue,
  parseRoom,
  parseGalleryEntry,
  parsePodium,
  parseMyGame,
  parsePack,
  parseGamePlayer,
  parseActivityItem,
  parseBallot,
  parseResults,
  parseInvitePreview,
} from '@/lib/dreamOffParse';

describe('coercers', () => {
  it('asObj returns the object or {} for non-objects', () => {
    expect(asObj({ a: 1 })).toEqual({ a: 1 });
    expect(asObj(null)).toEqual({});
    expect(asObj([1, 2])).toEqual({});
    expect(asObj('x')).toEqual({});
  });
  it('asObjArr keeps only object elements', () => {
    expect(asObjArr([{ a: 1 }, null, 'x', { b: 2 }])).toEqual([{ a: 1 }, { b: 2 }]);
    expect(asObjArr(null)).toEqual([]);
    expect(asObjArr({})).toEqual([]);
  });
  it('str / strOrNull / numOr / isTrue guard types', () => {
    expect(str('hi')).toBe('hi');
    expect(str(5)).toBe('');
    expect(strOrNull('hi')).toBe('hi');
    expect(strOrNull(5)).toBeNull();
    expect(numOr(3)).toBe(3);
    expect(numOr('3')).toBe(0);
    expect(numOr(undefined, 2)).toBe(2);
    expect(isTrue(true)).toBe(true);
    expect(isTrue('true')).toBe(false);
    expect(isTrue(1)).toBe(false);
  });
});

describe('parseRoom', () => {
  it('maps a full ok room', () => {
    const r = parseRoom({
      status: 'ok',
      id: 'g1',
      topic: 'a cute taco',
      pack_category: 'cast',
      cast_mode: 'couple',
      phase: 'voting',
      phase_expires_at: '2026-07-27T00:00:00Z',
      is_owner: true,
      owner_name: 'kev',
      invite_code: 'ABCDEFGHJK',
      join_approval: false,
      player_count: 4,
      entry_count: 3,
      my_status: 'active',
      my_submitted: true,
      my_voted: false,
    });
    expect(r).toMatchObject({
      status: 'ok',
      id: 'g1',
      pack_category: 'cast',
      cast_mode: 'couple',
      phase: 'voting',
      is_owner: true,
      player_count: 4,
      entry_count: 3,
      my_submitted: true,
      my_voted: false,
    });
  });
  it('defaults safely on a sparse / malformed payload', () => {
    const r = parseRoom({});
    expect(r.status).toBe('ok');
    expect(r.pack_category).toBe('scene'); // unknown → scene
    expect(r.cast_mode).toBeNull();
    expect(r.player_count).toBe(0);
    expect(r.is_owner).toBe(false);
    expect(r.invite_code).toBeNull();
  });
  it('normalizes not_member + an invalid cast_mode', () => {
    expect(parseRoom({ status: 'not_member' }).status).toBe('not_member');
    expect(parseRoom({ pack_category: 'cast', cast_mode: 'trio' }).cast_mode).toBeNull();
  });
});

describe('parseGalleryEntry', () => {
  it('submission shape: is_mine + render_status only', () => {
    const e = parseGalleryEntry({
      entry_id: 'e1',
      image: null,
      is_mine: true,
      render_status: 'in_progress',
    });
    expect(e).toEqual({
      entry_id: 'e1',
      image: null,
      is_mine: true,
      render_status: 'in_progress',
      roses_by_me: undefined,
      author_id: undefined,
      author_name: undefined,
      rose_count: undefined,
      superlative: undefined,
    });
  });
  it('voting shape: roses_by_me, author hidden', () => {
    const e = parseGalleryEntry({ entry_id: 'e2', image: 'u', is_mine: false, roses_by_me: true });
    expect(e.roses_by_me).toBe(true);
    expect(e.author_name).toBeUndefined();
    expect(e.rose_count).toBeUndefined();
  });
  it('reveal shape: author + rose_count + superlative', () => {
    const e = parseGalleryEntry({
      entry_id: 'e3',
      image: 'u',
      author_id: 'a1',
      author_name: 'maya',
      rose_count: 5,
      superlative: 'winner',
    });
    expect(e).toMatchObject({ author_name: 'maya', rose_count: 5, superlative: 'winner' });
  });
});

describe('parseBallot', () => {
  it('defaults roses_max to 2 and filters non-string entry_ids', () => {
    expect(parseBallot(null)).toEqual({ roses_max: 2, entry_ids: [] });
    expect(parseBallot({ roses_max: 3, entry_ids: ['a', 5, 'b', null] })).toEqual({
      roses_max: 3,
      entry_ids: ['a', 'b'],
    });
  });
});

describe('parseResults', () => {
  it('maps ok with a podium', () => {
    const r = parseResults({
      status: 'ok',
      phase: 'results',
      topic: 't',
      owner_name: 'kev',
      podium: [
        {
          key: 'winner',
          entry_id: 'e1',
          rose_count: 5,
          image: 'u',
          author_id: 'a',
          author_name: 'maya',
        },
      ],
    });
    expect(r.status).toBe('ok');
    expect(r.podium).toHaveLength(1);
    expect(r.podium?.[0]).toMatchObject({ key: 'winner', rose_count: 5, author_name: 'maya' });
  });
  it('maps not_ready with an empty podium', () => {
    const r = parseResults({ status: 'not_ready', phase: 'voting' });
    expect(r.status).toBe('not_ready');
    expect(r.podium).toEqual([]);
  });
});

describe('parsePodium', () => {
  it('coerces fields', () => {
    expect(parsePodium({ key: 'dark_horse', entry_id: 'e', rose_count: 1 })).toMatchObject({
      key: 'dark_horse',
      entry_id: 'e',
      rose_count: 1,
      author_name: null,
    });
  });
});

describe('parsePack', () => {
  it('maps a full pack and nulls optionals', () => {
    const p = parsePack({
      key: 'cute',
      display_name: 'Cute',
      tagline: 'adorable',
      emoji: '🥰',
      accent: '#F9A8D4',
      has_scene: true,
      has_cast: true,
      is_holiday: false,
      sort_order: 10,
    });
    expect(p).toMatchObject({ key: 'cute', has_scene: true, has_cast: true, sort_order: 10 });
    expect(p.group_key).toBeNull();
    expect(p.season_start).toBeNull();
  });
});

describe('parseGamePlayer', () => {
  it('maps flags + owner', () => {
    expect(
      parseGamePlayer({
        user_id: 'u1',
        name: 'bob',
        avatar_url: null,
        submitted: true,
        voted: false,
        is_owner: true,
      })
    ).toEqual({
      user_id: 'u1',
      name: 'bob',
      avatar_url: null,
      submitted: true,
      voted: false,
      is_owner: true,
    });
  });
});

describe('parseMyGame + parseActivityItem', () => {
  it('parseMyGame coerces phase/flags', () => {
    const g = parseMyGame({
      id: 'g',
      topic: 't',
      phase: 'submission',
      my_submitted: false,
      player_count: 3,
    });
    expect(g).toMatchObject({ id: 'g', phase: 'submission', my_submitted: false, player_count: 3 });
  });
  it('parseActivityItem', () => {
    expect(parseActivityItem({ kind: 'joined', actor_name: 'bob', at: 't' })).toEqual({
      kind: 'joined',
      actor_name: 'bob',
      at: 't',
    });
    expect(parseActivityItem({ kind: 'created' }).actor_name).toBeNull();
  });
});

describe('parseInvitePreview', () => {
  it('maps ok + joinable', () => {
    const p = parseInvitePreview({
      status: 'ok',
      topic: 't',
      phase: 'setup',
      owner_name: 'kev',
      player_count: 2,
      max_players: 12,
      joinable: true,
    });
    expect(p).toMatchObject({ status: 'ok', joinable: true, player_count: 2, max_players: 12 });
  });
  it('maps not_found', () => {
    expect(parseInvitePreview({ status: 'not_found' }).status).toBe('not_found');
    expect(parseInvitePreview(null).status).toBe('not_found');
  });
});
