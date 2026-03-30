create extension if not exists pgcrypto;

create table if not exists public.brand_inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  mobile text not null,
  email text not null,
  address text,
  product_type text,
  budget_range text,
  service_required text not null,
  source_page text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.artist_registrations (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  profession text not null,
  mobile text not null,
  email text not null,
  city text not null,
  instagram_url text,
  youtube_url text,
  facebook_url text,
  portfolio_url text,
  expected_price text,
  photo_path text,
  photo_url text,
  source_page text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.brand_inquiries enable row level security;
alter table public.artist_registrations enable row level security;

drop policy if exists "Public can insert brand inquiries" on public.brand_inquiries;
create policy "Public can insert brand inquiries"
on public.brand_inquiries
for insert
to anon, authenticated
with check (true);

drop policy if exists "Public can insert artist registrations" on public.artist_registrations;
create policy "Public can insert artist registrations"
on public.artist_registrations
for insert
to anon, authenticated
with check (true);

insert into storage.buckets (id, name, public)
values ('artist-photos', 'artist-photos', true)
on conflict (id) do update set public = true;

drop policy if exists "Public can upload artist photos" on storage.objects;
create policy "Public can upload artist photos"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'artist-photos');

drop policy if exists "Public can view artist photos" on storage.objects;
create policy "Public can view artist photos"
on storage.objects
for select
to public
using (bucket_id = 'artist-photos');
