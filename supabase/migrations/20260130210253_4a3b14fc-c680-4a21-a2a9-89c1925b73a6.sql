-- =============================================
-- ENUMS
-- =============================================
CREATE TYPE public.app_role AS ENUM ('admin', 'cs', 'leadership');
CREATE TYPE public.risk_zone AS ENUM ('low', 'moderate', 'high', 'extreme');
CREATE TYPE public.action_type AS ENUM ('meeting', 'training', 'technical', 'discount', 'other');
CREATE TYPE public.action_status AS ENUM ('open', 'in_progress', 'completed');
CREATE TYPE public.action_result AS ENUM ('success', 'failure');
CREATE TYPE public.alert_trigger AS ENUM ('to_high', 'to_extreme', 'any_increase');
CREATE TYPE public.alert_channel AS ENUM ('email', 'slack', 'webhook');

-- =============================================
-- TABLES
-- =============================================

-- Organizations (multi-tenant root)
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Profiles (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User Roles (separate table for RBAC - prevents privilege escalation)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Customers
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  mrr NUMERIC NOT NULL DEFAULT 0,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  risk_zone public.risk_zone NOT NULL DEFAULT 'low',
  risk_score NUMERIC NOT NULL DEFAULT 0,
  risk_variation NUMERIC NOT NULL DEFAULT 0,
  last_snapshot_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Risk Scores (historical snapshots)
CREATE TABLE public.risk_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  score NUMERIC NOT NULL,
  zone public.risk_zone NOT NULL,
  horizon TEXT NOT NULL DEFAULT '30d',
  drivers_snapshot JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Risk Drivers
CREATE TABLE public.risk_drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  direction TEXT NOT NULL CHECK (direction IN ('up', 'down')),
  impact TEXT,
  value NUMERIC NOT NULL,
  previous_value NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Customer Metrics
CREATE TABLE public.customer_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  tickets_open INTEGER NOT NULL DEFAULT 0,
  last_login TIMESTAMPTZ,
  payment_status TEXT NOT NULL DEFAULT 'current',
  nps INTEGER,
  login_count_30d INTEGER NOT NULL DEFAULT 0,
  features_used INTEGER NOT NULL DEFAULT 0,
  total_features INTEGER NOT NULL DEFAULT 0,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Action Plans
CREATE TABLE public.action_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  type public.action_type NOT NULL,
  description TEXT NOT NULL,
  owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  due_date DATE,
  status public.action_status NOT NULL DEFAULT 'open',
  result public.action_result,
  retained_revenue NUMERIC,
  lost_revenue NUMERIC,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Alerts
CREATE TABLE public.alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trigger public.alert_trigger NOT NULL,
  scope TEXT NOT NULL DEFAULT 'all' CHECK (scope IN ('all', 'specific')),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
  channel public.alert_channel NOT NULL DEFAULT 'email',
  recipients TEXT[] NOT NULL DEFAULT '{}',
  frequency TEXT NOT NULL DEFAULT 'immediate',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Variables Book
CREATE TABLE public.variables_book (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  label TEXT NOT NULL,
  source TEXT,
  transform TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(organization_id, key)
);

-- Execution Logs
CREATE TABLE public.execution_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  run_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'running',
  customers_processed INTEGER NOT NULL DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  finished_at TIMESTAMPTZ
);

-- =============================================
-- SECURITY DEFINER FUNCTIONS (prevent RLS recursion)
-- =============================================

-- Get user's organization ID
CREATE OR REPLACE FUNCTION public.get_user_organization_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT organization_id FROM public.profiles WHERE id = auth.uid()
$$;

-- Check if user has specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Check if user has any of the specified roles
CREATE OR REPLACE FUNCTION public.has_any_role(_user_id UUID, _roles public.app_role[])
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = ANY(_roles)
  )
$$;

-- =============================================
-- ENABLE RLS ON ALL TABLES
-- =============================================
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.action_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variables_book ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.execution_logs ENABLE ROW LEVEL SECURITY;

-- =============================================
-- RLS POLICIES
-- =============================================

-- Organizations: users see their own org
CREATE POLICY "Users view own organization" ON public.organizations
  FOR SELECT TO authenticated
  USING (id = public.get_user_organization_id());

CREATE POLICY "Admins manage own organization" ON public.organizations
  FOR ALL TO authenticated
  USING (id = public.get_user_organization_id() AND public.has_role(auth.uid(), 'admin'));

-- Profiles: users manage own profile
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (id = auth.uid());

CREATE POLICY "System inserts profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (id = auth.uid());

CREATE POLICY "Admins view org profiles" ON public.profiles
  FOR SELECT TO authenticated
  USING (
    organization_id = public.get_user_organization_id() 
    AND public.has_role(auth.uid(), 'admin')
  );

-- User Roles: only admins manage roles
CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins manage org user roles" ON public.user_roles
  FOR ALL TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin')
    AND user_id IN (
      SELECT id FROM public.profiles 
      WHERE organization_id = public.get_user_organization_id()
    )
  );

-- Customers: org-scoped access
CREATE POLICY "Users view org customers" ON public.customers
  FOR SELECT TO authenticated
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "CS and Admin manage customers" ON public.customers
  FOR ALL TO authenticated
  USING (
    organization_id = public.get_user_organization_id()
    AND public.has_any_role(auth.uid(), ARRAY['admin', 'cs']::public.app_role[])
  );

-- Risk Scores: org-scoped via customer
CREATE POLICY "Users view org risk scores" ON public.risk_scores
  FOR SELECT TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM public.customers 
      WHERE organization_id = public.get_user_organization_id()
    )
  );

CREATE POLICY "CS and Admin manage risk scores" ON public.risk_scores
  FOR ALL TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM public.customers 
      WHERE organization_id = public.get_user_organization_id()
    )
    AND public.has_any_role(auth.uid(), ARRAY['admin', 'cs']::public.app_role[])
  );

-- Risk Drivers: org-scoped via customer
CREATE POLICY "Users view org risk drivers" ON public.risk_drivers
  FOR SELECT TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM public.customers 
      WHERE organization_id = public.get_user_organization_id()
    )
  );

CREATE POLICY "CS and Admin manage risk drivers" ON public.risk_drivers
  FOR ALL TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM public.customers 
      WHERE organization_id = public.get_user_organization_id()
    )
    AND public.has_any_role(auth.uid(), ARRAY['admin', 'cs']::public.app_role[])
  );

-- Customer Metrics: org-scoped via customer
CREATE POLICY "Users view org customer metrics" ON public.customer_metrics
  FOR SELECT TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM public.customers 
      WHERE organization_id = public.get_user_organization_id()
    )
  );

CREATE POLICY "CS and Admin manage customer metrics" ON public.customer_metrics
  FOR ALL TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM public.customers 
      WHERE organization_id = public.get_user_organization_id()
    )
    AND public.has_any_role(auth.uid(), ARRAY['admin', 'cs']::public.app_role[])
  );

-- Action Plans: org-scoped via customer
CREATE POLICY "Users view org action plans" ON public.action_plans
  FOR SELECT TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM public.customers 
      WHERE organization_id = public.get_user_organization_id()
    )
  );

CREATE POLICY "CS and Admin manage action plans" ON public.action_plans
  FOR ALL TO authenticated
  USING (
    customer_id IN (
      SELECT id FROM public.customers 
      WHERE organization_id = public.get_user_organization_id()
    )
    AND public.has_any_role(auth.uid(), ARRAY['admin', 'cs']::public.app_role[])
  );

-- Alerts: org-scoped
CREATE POLICY "Users view org alerts" ON public.alerts
  FOR SELECT TO authenticated
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "CS and Admin manage alerts" ON public.alerts
  FOR ALL TO authenticated
  USING (
    organization_id = public.get_user_organization_id()
    AND public.has_any_role(auth.uid(), ARRAY['admin', 'cs']::public.app_role[])
  );

-- Variables Book: admin only
CREATE POLICY "Users view org variables" ON public.variables_book
  FOR SELECT TO authenticated
  USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Admins manage variables" ON public.variables_book
  FOR ALL TO authenticated
  USING (
    organization_id = public.get_user_organization_id()
    AND public.has_role(auth.uid(), 'admin')
  );

-- Execution Logs: admin only
CREATE POLICY "Admins view execution logs" ON public.execution_logs
  FOR SELECT TO authenticated
  USING (
    organization_id = public.get_user_organization_id()
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "System inserts execution logs" ON public.execution_logs
  FOR INSERT TO authenticated
  WITH CHECK (organization_id = public.get_user_organization_id());

-- =============================================
-- TRIGGER: Auto-create profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  
  -- Assign default 'cs' role to new users
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'cs');
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- INDEXES for performance
-- =============================================
CREATE INDEX idx_profiles_organization ON public.profiles(organization_id);
CREATE INDEX idx_customers_organization ON public.customers(organization_id);
CREATE INDEX idx_customers_owner ON public.customers(owner_id);
CREATE INDEX idx_risk_scores_customer ON public.risk_scores(customer_id);
CREATE INDEX idx_risk_drivers_customer ON public.risk_drivers(customer_id);
CREATE INDEX idx_customer_metrics_customer ON public.customer_metrics(customer_id);
CREATE INDEX idx_action_plans_customer ON public.action_plans(customer_id);
CREATE INDEX idx_alerts_organization ON public.alerts(organization_id);
CREATE INDEX idx_user_roles_user ON public.user_roles(user_id);