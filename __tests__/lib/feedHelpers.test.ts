/**
 * Tests for the feed-cache mutation helper.
 *
 * Specifically covers the "delete breaks pagination" bug fixed 2026-05-02.
 * The bug: getNextPageParam derived `hasNextPage` from current cached row count
 * (`lastPage.rows.length < PAGE_SIZE`). Optimistic deletes shrunk that count
 * below PAGE_SIZE → React Query thought pagination was exhausted → fetchNextPage
 * became a no-op.
 *
 * Fix: store hasMore / nextCursor on the page at FETCH time. Optimistic mutations
 * remove rows but preserve the metadata via spread (`{ ...page, rows: ... }`).
 *
 * These tests verify:
 *  1. removeUploadFromPages preserves metadata fields (hasMore, nextOffset, etc.)
 *  2. Both page shapes are handled correctly (RowPage and FlatPage)
 *  3. The simulated getNextPageParam pattern (read hasMore from page) survives
 *     optimistic deletion as expected.
 */

import { removeUploadFromPages, isRowPage } from '@/lib/feedHelpers';

interface TestRow {
  id: string;
  data: string;
}

const row = (id: string, data = 'x'): TestRow => ({ id, data });

describe('isRowPage', () => {
  it('identifies a {rows: [...]} object as a RowPage', () => {
    expect(isRowPage<TestRow>({ rows: [row('a')] })).toBe(true);
    expect(isRowPage<TestRow>({ rows: [] })).toBe(true);
  });

  it('identifies a flat array as NOT a RowPage', () => {
    expect(isRowPage<TestRow>([row('a'), row('b')])).toBe(false);
    expect(isRowPage<TestRow>([])).toBe(false);
  });
});

describe('removeUploadFromPages', () => {
  describe('RowPage shape', () => {
    it('removes the row by id from the page', () => {
      const pages = [{ rows: [row('a'), row('b'), row('c')] }];
      const result = removeUploadFromPages(pages, 'b');
      expect((result[0] as { rows: TestRow[] }).rows.map((r) => r.id)).toEqual(['a', 'c']);
    });

    it('preserves all metadata fields on the page (hasMore, nextOffset, custom fields)', () => {
      const pages = [
        {
          rows: [row('a'), row('b'), row('c')],
          hasMore: true,
          nextOffset: 20,
          userId: 'u1',
          customField: 'preserved',
        },
      ];
      const result = removeUploadFromPages(pages, 'b');
      const page = result[0] as unknown as Record<string, unknown>;
      expect(page.hasMore).toBe(true);
      expect(page.nextOffset).toBe(20);
      expect(page.userId).toBe('u1');
      expect(page.customField).toBe('preserved');
    });

    it('does NOT mutate the original page object (immutability)', () => {
      const original = {
        rows: [row('a'), row('b'), row('c')],
        hasMore: true,
        nextOffset: 20,
      };
      const pages = [original];
      removeUploadFromPages(pages, 'b');
      // Original is untouched
      expect(original.rows.map((r) => r.id)).toEqual(['a', 'b', 'c']);
      expect(original.hasMore).toBe(true);
    });

    it('handles empty rows array', () => {
      const pages = [{ rows: [] as TestRow[], hasMore: false }];
      const result = removeUploadFromPages(pages, 'anything');
      expect((result[0] as { rows: TestRow[] }).rows).toEqual([]);
    });

    it('handles non-existent id (no rows match) — returns same content', () => {
      const pages = [{ rows: [row('a'), row('b')], hasMore: true }];
      const result = removeUploadFromPages(pages, 'nonexistent');
      expect((result[0] as { rows: TestRow[] }).rows.map((r) => r.id)).toEqual(['a', 'b']);
    });

    it('removes the matching id across multiple pages', () => {
      const pages = [
        { rows: [row('a'), row('b')], hasMore: true, nextOffset: 2 },
        { rows: [row('c'), row('d'), row('b')], hasMore: false, nextOffset: 5 }, // 'b' duplicate
      ];
      const result = removeUploadFromPages(pages, 'b');
      const page0 = result[0] as { rows: TestRow[]; hasMore: boolean };
      const page1 = result[1] as { rows: TestRow[]; hasMore: boolean };
      expect(page0.rows.map((r) => r.id)).toEqual(['a']);
      expect(page1.rows.map((r) => r.id)).toEqual(['c', 'd']);
      expect(page0.hasMore).toBe(true);
      expect(page1.hasMore).toBe(false);
    });
  });

  describe('FlatPage shape (legacy)', () => {
    it('removes the row by id from a flat array page', () => {
      const pages = [[row('a'), row('b'), row('c')]];
      const result = removeUploadFromPages(pages, 'b');
      expect((result[0] as TestRow[]).map((r) => r.id)).toEqual(['a', 'c']);
    });

    it('handles mixed page shapes in the same array', () => {
      const pages = [
        [row('a'), row('b')], // FlatPage
        { rows: [row('c'), row('d')], hasMore: true }, // RowPage
      ];
      const result = removeUploadFromPages(pages, 'a');
      expect((result[0] as TestRow[]).map((r) => r.id)).toEqual(['b']);
      expect((result[1] as { rows: TestRow[] }).rows.map((r) => r.id)).toEqual(['c', 'd']);
    });
  });

  describe('regression: pagination cursor stability under delete', () => {
    // Simulate the exact failure mode of the bug: hasMore captured at fetch
    // time, optimistic delete shrinks rows, getNextPageParam should still work.

    interface Page {
      rows: TestRow[];
      hasMore: boolean;
      nextOffset: number;
    }

    const PAGE_SIZE = 5;

    // The fixed pattern — read hasMore from the page metadata, not derived
    // from current row count.
    const getNextPageParam = (lastPage: Page): number | undefined =>
      lastPage.hasMore ? lastPage.nextOffset : undefined;

    // The OLD broken pattern — derive from current row count.
    const buggyGetNextPageParam = (lastPage: Page): number | undefined =>
      lastPage.rows.length < PAGE_SIZE ? undefined : lastPage.nextOffset;

    it('FIXED pattern: hasMore stays true after optimistic delete shrinks rows', () => {
      const lastPage: Page = {
        rows: [row('a'), row('b'), row('c'), row('d'), row('e')], // 5 rows = PAGE_SIZE
        hasMore: true,
        nextOffset: 5,
      };
      // Before delete: more pages available
      expect(getNextPageParam(lastPage)).toBe(5);

      // Optimistic delete via the helper
      const after = removeUploadFromPages([lastPage], 'c');
      const updated = after[0] as Page;
      expect(updated.rows).toHaveLength(4); // shrunk to 4

      // After delete: STILL says more pages available (because hasMore preserved)
      expect(getNextPageParam(updated)).toBe(5);
    });

    it('BROKEN pattern (regression): old code would return undefined after delete', () => {
      const lastPage: Page = {
        rows: [row('a'), row('b'), row('c'), row('d'), row('e')], // 5 rows = PAGE_SIZE
        hasMore: true,
        nextOffset: 5,
      };
      // Before delete: more pages available
      expect(buggyGetNextPageParam(lastPage)).toBe(5);

      // Optimistic delete via the helper
      const after = removeUploadFromPages([lastPage], 'c');
      const updated = after[0] as Page;

      // After delete: BROKEN — pagination thinks it's exhausted because rows.length < PAGE_SIZE
      expect(buggyGetNextPageParam(updated)).toBeUndefined();
      // This documents the original bug. The fixed pattern above doesn't have this issue.
    });

    it('FIXED pattern: hasMore correctly false on a partial last page (no false-positive)', () => {
      const lastPage: Page = {
        rows: [row('a'), row('b'), row('c')], // 3 rows < PAGE_SIZE
        hasMore: false, // server returned partial page = no more
        nextOffset: 3,
      };
      // Pagination correctly reports exhausted
      expect(getNextPageParam(lastPage)).toBeUndefined();

      // Even after a delete (still partial)
      const after = removeUploadFromPages([lastPage], 'b');
      const updated = after[0] as Page;
      expect(getNextPageParam(updated)).toBeUndefined();
    });
  });
});
