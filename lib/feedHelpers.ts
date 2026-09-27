/**
 * Pure helpers for paginated feed cache mutations.
 *
 * Extracted from hooks/useDeletePost.ts so they can be unit-tested without
 * pulling in the full mutation hook + Supabase setup.
 */

interface RowPage<T> {
  rows: T[];
}
type FlatPage<T> = T[];
type AnyPage<T> = RowPage<T> | FlatPage<T>;

export function isRowPage<T>(page: AnyPage<T>): page is RowPage<T> {
  return !Array.isArray(page) && Array.isArray((page as RowPage<T>).rows);
}

/**
 * Remove a row by id from every page in an InfiniteData['pages'] array.
 *
 * Handles both page shapes used in the codebase:
 *  - RowPage { rows: T[], ...other metadata }  (preserves metadata via spread)
 *  - FlatPage T[]                              (legacy — most hooks have moved off this)
 *
 * The metadata-preserving spread is critical: it keeps fields like `hasMore`,
 * `nextOffset`, `nextCursor` intact when an optimistic delete fires. Without
 * the spread, those metadata fields would be dropped and pagination would
 * break (the bug we're testing for).
 */
export function removeUploadFromPages<T extends { id: string }>(
  pages: AnyPage<T>[],
  uploadId: string
): AnyPage<T>[] {
  return pages.map((page) => {
    if (isRowPage(page)) {
      return { ...page, rows: page.rows.filter((p) => p.id !== uploadId) };
    }
    return page.filter((p) => p.id !== uploadId);
  });
}

/**
 * Remove every row matching `shouldRemove` from every page, keeping page metadata
 * (same shapes as removeUploadFromPages). Returns the SAME array when nothing
 * matched, so a removal that touches nothing doesn't re-render a feed.
 */
export function removePostsFromPages<T>(
  pages: AnyPage<T>[],
  shouldRemove: (row: T) => boolean
): AnyPage<T>[] {
  let changed = false;
  const next = pages.map((page) => {
    const rows = isRowPage(page) ? page.rows : page;
    const kept = rows.filter((row) => !shouldRemove(row));
    if (kept.length === rows.length) return page;
    changed = true;
    return isRowPage(page) ? { ...page, rows: kept } : kept;
  });
  return changed ? next : pages;
}
