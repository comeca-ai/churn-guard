# ChurnAI - SQL Migrations para Supabase

Execute estes scripts SQL no SQL Editor do seu Supabase, na ordem indicada.

## 1. Schema (001_schema.sql)

```sql
-- ChurnAI Database Schema

-- ===========================================
-- 1. ENUMS
-- ===========================================

CREATE TYPE public.app_role AS ENUM ('admin', 'cs', 'leadership');
CREATE TYPE public.risk_zone AS ENUM ('low', 'moderate', 'high', 'extreme');
CREATE TYPE public.action_type AS ENUM ('meeting', 'training', 'technical', 'discount', 'other');
CREATE TYPE public.action_status AS ENUM ('open', 'in_progress', 'completed');
CREATE TYPE public.action_result AS ENUM ('success', 'failure');
CREATE TYPE public.alert_trigger AS ENUM ('to_high', 'to_extreme', 'any_increase');
CREATE TYPE public.alert_channel AS ENUM ('email', 'slack', 'webhook');

-- ===========================================
-- 2. ORGANIZATIONS (Multi-tenant root)
-- ===========================================

CREATE TABLE public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ===========================================
-- 3. PROFILES (User profiles linked to auth.users)
-- ===========================================

CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    organization_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- ===========================================
-- 4. USER_ROLES (RBAC - separate table for security)
-- ===========================================

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE (user_id, role)
);

-- ===========================================
-- 5. CUSTOMERS (Clients being monitored)
-- ===========================================

CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    mrr DECIMAL(12,2) DEFAULT 0,
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    risk_zone public.risk_zone DEFAULT 'low',
    risk_score INTEGER DEFAULT 0 CHECK (risk_score >= 0 AND risk_score <= 100),
    risk_variation INTEGER DEFAULT 0,
    last_snapshot_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_customers_organization ON public.customers(organization_id);
CREATE INDEX idx_customers_owner ON public.customers(owner_id);
CREATE INDEX idx_customers_risk ON public.customers(risk_zone, risk_score DESC);

-- ===========================================
-- 6. RISK_SCORES (Historical snapshots)
-- ===========================================

CREATE TABLE public.risk_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    zone public.risk_zone NOT NULL,
    horizon TEXT DEFAULT '30d',
    drivers_snapshot JSONB,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_risk_scores_customer ON public.risk_scores(customer_id, created_at DESC);

-- ===========================================
-- 7. RISK_DRIVERS (Factors explaining risk)
-- ===========================================

CREATE TABLE public.risk_drivers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('up', 'down')),
    impact TEXT,
    value DECIMAL(10,2) NOT NULL,
    previous_value DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_risk_drivers_customer ON public.risk_drivers(customer_id);

-- ===========================================
-- 8. CUSTOMER_METRICS
-- ===========================================

CREATE TABLE public.customer_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    tickets_open INTEGER DEFAULT 0,
    last_login TIMESTAMPTZ,
    payment_status TEXT DEFAULT 'current',
    nps INTEGER CHECK (nps IS NULL OR (nps >= -100 AND nps <= 100)),
    login_count_30d INTEGER DEFAULT 0,
    features_used INTEGER DEFAULT 0,
    total_features INTEGER DEFAULT 0,
    recorded_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_customer_metrics_customer ON public.customer_metrics(customer_id, recorded_at DESC);

-- ===========================================
-- 9. ACTION_PLANS
-- ===========================================

CREATE TABLE public.action_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
    type public.action_type NOT NULL,
    description TEXT NOT NULL,
    owner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    due_date DATE,
    status public.action_status DEFAULT 'open',
    result public.action_result,
    retained_revenue DECIMAL(12,2),
    lost_revenue DECIMAL(12,2),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_action_plans_customer ON public.action_plans(customer_id);
CREATE INDEX idx_action_plans_owner ON public.action_plans(owner_id);
CREATE INDEX idx_action_plans_status ON public.action_plans(status, due_date);

-- ===========================================
-- 10. ALERTS
-- ===========================================

CREATE TABLE public.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    trigger public.alert_trigger NOT NULL,
    scope TEXT DEFAULT 'all' CHECK (scope IN ('all', 'specific')),
    customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE,
    channel public.alert_channel DEFAULT 'email',
    recipients TEXT[] DEFAULT '{}',
    frequency TEXT DEFAULT 'immediate',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE INDEX idx_alerts_organization ON public.alerts(organization_id);

-- ===========================================
-- 11. VARIABLES_BOOK
-- ===========================================

CREATE TABLE public.variables_book (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    key TEXT NOT NULL,
    label TEXT NOT NULL,
    source TEXT,
    transform TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    UNIQUE (organization_id, key)
);

CREATE INDEX idx_variables_book_organization ON public.variables_book(organization_id);

-- ===========================================
-- 12. EXECUTION_LOGS
-- ===========================================

CREATE TABLE public.execution_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE NOT NULL,
    run_type TEXT NOT NULL,
    status TEXT DEFAULT 'running',
    customers_processed INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    finished_at TIMESTAMPTZ
);

CREATE INDEX idx_execution_logs_organization ON public.execution_logs(organization_id, started_at DESC);
```

## 2. Functions & Triggers (002_functions.sql)

```sql
-- ChurnAI Security Functions & Triggers

-- ===========================================
-- HELPER FUNCTIONS (SECURITY DEFINER)
-- ===========================================

-- Get user's organization ID
CREATE OR REPLACE FUNCTION public.get_user_organization_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT organization_id 
    FROM public.profiles 
    WHERE id = auth.uid()
$$;

-- Check if user has a specific role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
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
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = ANY(_roles)
    )
$$;

-- ===========================================
-- TRIGGER: Auto-create profile on signup
-- ===========================================

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
    RETURN NEW;
END;
$$;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===========================================
-- TRIGGER: Update updated_at timestamp
-- ===========================================

CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Apply to tables with updated_at
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON public.organizations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON public.customers
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_action_plans_updated_at
    BEFORE UPDATE ON public.action_plans
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_alerts_updated_at
    BEFORE UPDATE ON public.alerts
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_variables_book_updated_at
    BEFORE UPDATE ON public.variables_book
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
```

## 3. Row Level Security (003_rls.sql)

```sql
-- ChurnAI Row Level Security Policies

-- ===========================================
-- ENABLE RLS ON ALL TABLES
-- ===========================================

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

-- ===========================================
-- ORGANIZATIONS POLICIES
-- ===========================================

CREATE POLICY "Users can view their organization"
    ON public.organizations FOR SELECT
    TO authenticated
    USING (id = public.get_user_organization_id());

CREATE POLICY "Admins can update their organization"
    ON public.organizations FOR UPDATE
    TO authenticated
    USING (
        id = public.get_user_organization_id()
        AND public.has_role(auth.uid(), 'admin')
    );

-- ===========================================
-- PROFILES POLICIES
-- ===========================================

CREATE POLICY "Users can view profiles in their organization"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (id = auth.uid());

-- ===========================================
-- USER_ROLES POLICIES
-- ===========================================

CREATE POLICY "Users can view roles in their organization"
    ON public.user_roles FOR SELECT
    TO authenticated
    USING (
        user_id IN (
            SELECT id FROM public.profiles 
            WHERE organization_id = public.get_user_organization_id()
        )
    );

CREATE POLICY "Admins can manage roles"
    ON public.user_roles FOR ALL
    TO authenticated
    USING (
        public.has_role(auth.uid(), 'admin')
        AND user_id IN (
            SELECT id FROM public.profiles 
            WHERE organization_id = public.get_user_organization_id()
        )
    );

-- ===========================================
-- CUSTOMERS POLICIES
-- ===========================================

CREATE POLICY "Users can view customers in their organization"
    ON public.customers FOR SELECT
    TO authenticated
    USING (organization_id = public.get_user_organization_id());

CREATE POLICY "CS and Admins can create customers"
    ON public.customers FOR INSERT
    TO authenticated
    WITH CHECK (
        organization_id = public.get_user_organization_id()
        AND public.has_any_role(auth.uid(), ARRAY['admin', 'cs']::public.app_role[])
    );

CREATE POLICY "CS and Admins can update customers"
    ON public.customers FOR UPDATE
    TO authenticated
    USING (
        organization_id = public.get_user_organization_id()
        AND public.has_any_role(auth.uid(), ARRAY['admin', 'cs']::public.app_role[])
    );

CREATE POLICY "Admins can delete customers"
    ON public.customers FOR DELETE
    TO authenticated
    USING (
        organization_id = public.get_user_organization_id()
        AND public.has_role(auth.uid(), 'admin')
    );

-- ===========================================
-- RISK_SCORES POLICIES
-- ===========================================

CREATE POLICY "Users can view risk scores for their customers"
    ON public.risk_scores FOR SELECT
    TO authenticated
    USING (
        customer_id IN (
            SELECT id FROM public.customers 
            WHERE organization_id = public.get_user_organization_id()
        )
    );

CREATE POLICY "System can insert risk scores"
    ON public.risk_scores FOR INSERT
    TO authenticated
    WITH CHECK (
        customer_id IN (
            SELECT id FROM public.customers 
            WHERE organization_id = public.get_user_organization_id()
        )
        AND public.has_any_role(auth.uid(), ARRAY['admin', 'cs']::public.app_role[])
    );

-- ===========================================
-- RISK_DRIVERS POLICIES
-- ===========================================

CREATE POLICY "Users can view risk drivers for their customers"
    ON public.risk_drivers FOR SELECT
    TO authenticated
    USING (
        customer_id IN (
            SELECT id FROM public.customers 
            WHERE organization_id = public.get_user_organization_id()
        )
    );

CREATE POLICY "System can manage risk drivers"
    ON public.risk_drivers FOR ALL
    TO authenticated
    USING (
        customer_id IN (
            SELECT id FROM public.customers 
            WHERE organization_id = public.get_user_organization_id()
        )
        AND public.has_any_role(auth.uid(), ARRAY['admin', 'cs']::public.app_role[])
    );

-- ===========================================
-- CUSTOMER_METRICS POLICIES
-- ===========================================

CREATE POLICY "Users can view metrics for their customers"
    ON public.customer_metrics FOR SELECT
    TO authenticated
    USING (
        customer_id IN (
            SELECT id FROM public.customers 
            WHERE organization_id = public.get_user_organization_id()
        )
    );

CREATE POLICY "System can manage metrics"
    ON public.customer_metrics FOR ALL
    TO authenticated
    USING (
        customer_id IN (
            SELECT id FROM public.customers 
            WHERE organization_id = public.get_user_organization_id()
        )
        AND public.has_any_role(auth.uid(), ARRAY['admin', 'cs']::public.app_role[])
    );

-- ===========================================
-- ACTION_PLANS POLICIES
-- ===========================================

CREATE POLICY "Users can view action plans in their organization"
    ON public.action_plans FOR SELECT
    TO authenticated
    USING (
        customer_id IN (
            SELECT id FROM public.customers 
            WHERE organization_id = public.get_user_organization_id()
        )
    );

CREATE POLICY "CS and Admins can create action plans"
    ON public.action_plans FOR INSERT
    TO authenticated
    WITH CHECK (
        customer_id IN (
            SELECT id FROM public.customers 
            WHERE organization_id = public.get_user_organization_id()
        )
        AND public.has_any_role(auth.uid(), ARRAY['admin', 'cs']::public.app_role[])
    );

CREATE POLICY "CS and Admins can update action plans"
    ON public.action_plans FOR UPDATE
    TO authenticated
    USING (
        customer_id IN (
            SELECT id FROM public.customers 
            WHERE organization_id = public.get_user_organization_id()
        )
        AND public.has_any_role(auth.uid(), ARRAY['admin', 'cs']::public.app_role[])
    );

CREATE POLICY "Admins can delete action plans"
    ON public.action_plans FOR DELETE
    TO authenticated
    USING (
        customer_id IN (
            SELECT id FROM public.customers 
            WHERE organization_id = public.get_user_organization_id()
        )
        AND public.has_role(auth.uid(), 'admin')
    );

-- ===========================================
-- ALERTS POLICIES
-- ===========================================

CREATE POLICY "Users can view alerts in their organization"
    ON public.alerts FOR SELECT
    TO authenticated
    USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Admins can manage alerts"
    ON public.alerts FOR ALL
    TO authenticated
    USING (
        organization_id = public.get_user_organization_id()
        AND public.has_role(auth.uid(), 'admin')
    );

-- ===========================================
-- VARIABLES_BOOK POLICIES
-- ===========================================

CREATE POLICY "Users can view variables in their organization"
    ON public.variables_book FOR SELECT
    TO authenticated
    USING (organization_id = public.get_user_organization_id());

CREATE POLICY "Admins can manage variables"
    ON public.variables_book FOR ALL
    TO authenticated
    USING (
        organization_id = public.get_user_organization_id()
        AND public.has_role(auth.uid(), 'admin')
    );

-- ===========================================
-- EXECUTION_LOGS POLICIES
-- ===========================================

CREATE POLICY "Admins can view execution logs"
    ON public.execution_logs FOR SELECT
    TO authenticated
    USING (
        organization_id = public.get_user_organization_id()
        AND public.has_role(auth.uid(), 'admin')
    );

CREATE POLICY "System can create execution logs"
    ON public.execution_logs FOR INSERT
    TO authenticated
    WITH CHECK (
        organization_id = public.get_user_organization_id()
        AND public.has_role(auth.uid(), 'admin')
    );

CREATE POLICY "System can update execution logs"
    ON public.execution_logs FOR UPDATE
    TO authenticated
    USING (
        organization_id = public.get_user_organization_id()
        AND public.has_role(auth.uid(), 'admin')
    );
```

## Configuração do Frontend

Após executar os SQLs, configure as variáveis de ambiente no seu projeto:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key
```

Ou conecte o projeto Supabase via integração do Lovable.
