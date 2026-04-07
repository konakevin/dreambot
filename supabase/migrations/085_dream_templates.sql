-- Dream scene templates — Sonnet-generated surreal scenes for the nightly dream engine.
-- Each template has optional ${character}/${place}/${thing} slots filled from user's dream seeds.

create table dream_templates (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  template text not null,
  disabled boolean not null default false,
  seasonal boolean not null default false,   -- true = only active during its season (christmas, halloween, etc)
  active_from date,                           -- seasonal start (null = always active)
  active_until date,                          -- seasonal end (null = always active)
  created_at timestamptz not null default now()
);

-- Fast random pick, excluding disabled
create index idx_dream_templates_active on dream_templates(category) where not disabled;

-- RLS: readable by service role only (edge functions), no client access needed
alter table dream_templates enable row level security;
