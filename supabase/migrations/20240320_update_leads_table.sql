-- Adicionar novas colunas se não existirem
DO $$ 
BEGIN
    -- Dados do apartamento
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'apartamento_id') THEN
        ALTER TABLE public.leads ADD COLUMN apartamento_id UUID REFERENCES public.apartamentos(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'apartamento_nome') THEN
        ALTER TABLE public.leads ADD COLUMN apartamento_nome TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'apartamento_simulado') THEN
        ALTER TABLE public.leads ADD COLUMN apartamento_simulado TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'apartamento_metragem') THEN
        ALTER TABLE public.leads ADD COLUMN apartamento_metragem NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'apartamento_quartos') THEN
        ALTER TABLE public.leads ADD COLUMN apartamento_quartos INTEGER;
    END IF;
    
    -- Dados do financiamento
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'renda_mensal') THEN
        ALTER TABLE public.leads ADD COLUMN renda_mensal NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'valor_entrada') THEN
        ALTER TABLE public.leads ADD COLUMN valor_entrada NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'sistema_amortizacao') THEN
        ALTER TABLE public.leads ADD COLUMN sistema_amortizacao TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'valor_imovel') THEN
        ALTER TABLE public.leads ADD COLUMN valor_imovel NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'valor_financiado') THEN
        ALTER TABLE public.leads ADD COLUMN valor_financiado NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'valor_parcela') THEN
        ALTER TABLE public.leads ADD COLUMN valor_parcela NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'prazo_meses') THEN
        ALTER TABLE public.leads ADD COLUMN prazo_meses INTEGER DEFAULT 360;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'leads' AND column_name = 'taxa_juros') THEN
        ALTER TABLE public.leads ADD COLUMN taxa_juros NUMERIC DEFAULT 9;
    END IF;
END $$;

-- Criar índices se não existirem
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_leads_email') THEN
        CREATE INDEX idx_leads_email ON public.leads(email);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_leads_apartamento_id') THEN
        CREATE INDEX idx_leads_apartamento_id ON public.leads(apartamento_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_leads_data') THEN
        CREATE INDEX idx_leads_data ON public.leads(data);
    END IF;
END $$;

-- Configurar RLS se ainda não estiver configurado
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Criar ou atualizar políticas
DROP POLICY IF EXISTS "Permitir inserção anônima" ON public.leads;
CREATE POLICY "Permitir inserção anônima" ON public.leads
    FOR INSERT
    TO anon
    WITH CHECK (true);

DROP POLICY IF EXISTS "Permitir leitura apenas para autenticados" ON public.leads;
CREATE POLICY "Permitir leitura apenas para autenticados" ON public.leads
    FOR SELECT
    TO authenticated
    USING (true); 