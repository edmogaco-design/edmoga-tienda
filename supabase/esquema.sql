-- EDMOGA — esquema de Supabase. Pegar completo en Supabase → SQL Editor → Run.
-- Se puede correr varias veces sin dañar nada.
-- RLS activado SIN políticas: solo el servidor (llave service_role) lee y escribe.

create table if not exists public.pedidos (
  id bigint generated always as identity primary key,
  creado timestamptz not null default now(),
  codigo text not null,
  metodo text not null check (metodo in ('contra_entrega', 'bold', 'transferencia')),
  estado text not null,
  producto text not null,
  cantidad int not null,
  subtotal int not null,
  envio int not null,
  total int not null,
  nombre text not null,
  telefono text not null,
  departamento text not null,
  ciudad text not null,
  direccion text not null,
  notas text,
  orden_bold text,
  transaccion_bold text,
  dropi text not null,
  dropi_pedido text,
  unique (codigo, metodo)
);

create table if not exists public.pagos_bold (
  id bigint generated always as identity primary key,
  recibido timestamptz not null default now(),
  evento text not null unique,
  tipo text,
  transaccion text,
  orden text,
  total int,
  crudo jsonb
);

create index if not exists pagos_bold_orden on public.pagos_bold (orden);

-- Métodos de pago permitidos (actualiza tablas creadas antes de agregar transferencia).
alter table public.pedidos drop constraint if exists pedidos_metodo_check;
alter table public.pedidos add constraint pedidos_metodo_check
  check (metodo in ('contra_entrega', 'bold', 'transferencia'));

alter table public.pedidos enable row level security;
alter table public.pagos_bold enable row level security;
