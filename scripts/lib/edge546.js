/**
 * edge546 — the pure half of scripts/check-edge-546.js (NO_PIXELS_IN_ISOLATE_PLAN.md §5).
 *
 * HTTP 546 = WORKER_RESOURCE_LIMIT: the Edge isolate exceeded its fixed 2 s CPU (or 256 MB) budget.
 * Measured 2026-09-17 at 7.8% of nightly-dreams requests, every one "CPU Time exceeded" from pixel work.
 * That work now runs on the Fly image-ops service; this evaluation is the alarm that says it came back.
 *
 * The threshold is a FIXED SLO (3%), deliberately not derived from any engine_config field — nothing a
 * dashboard change can rescale, so the config-coupled-alarm rule (CLAUDE.md) does not apply.
 */

/** Logflare SQL: requests + status per function over the query window. */
const SQL =
  'select m.function_id as fid, response.status_code as status, count(*) as c ' +
  'from function_edge_logs cross join unnest(metadata) as m cross join unnest(m.response) as response ' +
  'group by fid, status';

const MAX_546_RATE = 0.03;
/** A function with fewer requests than this in the window is reported but never alarmed (1 of 5 = 20%). */
const MIN_REQUESTS = 20;

/**
 * @param {{fid:string,status:number,c:number}[]} rows   the logs query result
 * @param {{id:string,slug:string}[]} functions          GET /v1/projects/:ref/functions
 * @param {{maxRate?:number,minRequests?:number}} [opts]
 * @returns {{table:{name:string,total:number,limit:number,rate:number,alarm:boolean}[], alarms:string[]}}
 */
function evaluate(rows, functions, opts = {}) {
  const maxRate = opts.maxRate ?? MAX_546_RATE;
  const minRequests = opts.minRequests ?? MIN_REQUESTS;
  const names = new Map(functions.map((f) => [f.id, f.slug]));
  const byFn = new Map();
  for (const r of rows) {
    const name = names.get(r.fid) || r.fid;
    const e = byFn.get(name) || { name, total: 0, limit: 0 };
    e.total += Number(r.c) || 0;
    if (Number(r.status) === 546) e.limit += Number(r.c) || 0;
    byFn.set(name, e);
  }
  const table = [...byFn.values()]
    .map((e) => {
      const rate = e.total > 0 ? e.limit / e.total : 0;
      return { ...e, rate, alarm: e.total >= minRequests && rate > maxRate };
    })
    .sort((a, b) => b.limit - a.limit || b.total - a.total);
  const alarms = table
    .filter((e) => e.alarm)
    .map(
      (e) =>
        `${e.name}: ${e.limit} of ${e.total} requests hit 546 (${(e.rate * 100).toFixed(1)}% > ${maxRate * 100}%)`
    );
  return { table, alarms };
}

function formatTable(table) {
  const w = Math.max(8, ...table.map((e) => e.name.length));
  const lines = [`${'function'.padEnd(w)}  requests  546   rate`];
  for (const e of table) {
    lines.push(
      `${e.name.padEnd(w)}  ${String(e.total).padStart(8)}  ${String(e.limit).padStart(3)}  ${(e.rate * 100).toFixed(1).padStart(5)}%${e.alarm ? '  ← ALARM' : ''}`
    );
  }
  return lines.join('\n');
}

module.exports = { SQL, MAX_546_RATE, MIN_REQUESTS, evaluate, formatTable };
