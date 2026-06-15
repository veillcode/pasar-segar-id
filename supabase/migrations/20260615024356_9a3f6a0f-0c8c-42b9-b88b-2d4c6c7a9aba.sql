
-- 1) Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2) Product overrides (catalog stays static in code; admin can override price/stock)
CREATE TABLE public.product_overrides (
  product_id text PRIMARY KEY,
  price integer,
  stock integer,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.product_overrides TO anon, authenticated;
GRANT ALL ON public.product_overrides TO authenticated, service_role;

ALTER TABLE public.product_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read overrides" ON public.product_overrides FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins write overrides" ON public.product_overrides FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update overrides" ON public.product_overrides FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete overrides" ON public.product_overrides FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_product_overrides_updated BEFORE UPDATE ON public.product_overrides
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3) Shipping options
CREATE TABLE public.shipping_options (
  key text PRIMARY KEY,
  label text NOT NULL,
  description text NOT NULL,
  price integer NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.shipping_options TO anon, authenticated;
GRANT ALL ON public.shipping_options TO authenticated, service_role;

ALTER TABLE public.shipping_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read shipping" ON public.shipping_options FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins write shipping" ON public.shipping_options FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update shipping" ON public.shipping_options FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete shipping" ON public.shipping_options FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_shipping_options_updated BEFORE UPDATE ON public.shipping_options
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

INSERT INTO public.shipping_options (key, label, description, price, sort_order) VALUES
  ('instan', 'Instan (Same Day)', 'Sampai hari ini · 08.00 - 20.00', 12000, 1),
  ('reguler', 'Reguler', '2-3 hari kerja', 8000, 2),
  ('hemat', 'Hemat', '3-5 hari kerja', 5000, 3);
