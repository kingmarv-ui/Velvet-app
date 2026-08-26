-- Bookings for Velvet Moon Wellness.
-- Applied automatically on deploy (Neon) and at startup (PGLite preview).

create table if not exists bookings (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  service_ids jsonb not null default '[]'::jsonb,
  services jsonb not null default '[]'::jsonb,
  date date not null,
  time text not null,
  duration_hours numeric not null default 1,
  location_type text not null,
  client jsonb not null,
  payment_method text not null,
  deposit_only boolean not null default true,
  total integer not null,
  paid integer not null,
  status text not null default 'pending',
  proof_data_url text
);

create index if not exists bookings_status_idx on bookings (status);
create index if not exists bookings_created_at_idx on bookings (created_at desc);
create index if not exists bookings_date_idx on bookings (date);
