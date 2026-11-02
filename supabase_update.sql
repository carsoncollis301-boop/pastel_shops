-- Run once in Supabase SQL Editor before testing the updated website.
-- This uses a NEW table so previous card-reference demo records remain untouched.
create table if not exists public.shop_email_id_verifications (
 id bigint generated always as identity primary key,
 shop_name text not null,
 email text not null,
 id_number text not null,
 selected_price text not null,
 created_at timestamptz not null default now()
);
alter table public.shop_email_id_verifications enable row level security;
create unique index if not exists shop_email_id_unique_email on public.shop_email_id_verifications(shop_name,lower(email));
create unique index if not exists shop_email_id_unique_id on public.shop_email_id_verifications(shop_name,id_number);
create or replace function public.verify_shop_email_id(p_shop_name text,p_email text,p_id_number text,p_price text)
returns text language plpgsql security definer set search_path = public as $$
begin
 perform pg_advisory_xact_lock(hashtextextended(p_shop_name,0));
 if exists(select 1 from public.shop_email_id_verifications where shop_name=p_shop_name and lower(email)=lower(p_email)) then return 'duplicate_email'; end if;
 if exists(select 1 from public.shop_email_id_verifications where shop_name=p_shop_name and id_number=p_id_number) then return 'duplicate_id'; end if;
 insert into public.shop_email_id_verifications(shop_name,email,id_number,selected_price) values(p_shop_name,lower(p_email),p_id_number,p_price);
 return 'ok';
end $$;
revoke all on function public.verify_shop_email_id(text,text,text,text) from public, anon, authenticated;
grant execute on function public.verify_shop_email_id(text,text,text,text) to service_role;
