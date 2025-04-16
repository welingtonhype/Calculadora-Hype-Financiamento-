-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL,
    telefone TEXT NOT NULL,
    data TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    consentimento BOOLEAN DEFAULT false,
    
    -- Dados do apartamento
    apartamento_id UUID REFERENCES public.apartamentos(id),
    apartamento_nome TEXT,
    apartamento_simulado TEXT,
    apartamento_metragem NUMERIC,
    apartamento_quartos INTEGER,
    
    -- Dados do financiamento
    renda_mensal NUMERIC,
    valor_entrada NUMERIC,
    sistema_amortizacao TEXT,
    valor_imovel NUMERIC,
    valor_financiado NUMERIC,
    valor_parcela NUMERIC,
    prazo_meses INTEGER DEFAULT 360,
    taxa_juros NUMERIC DEFAULT 9
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_apartamento_id ON public.leads(apartamento_id);
CREATE INDEX IF NOT EXISTS idx_leads_data ON public.leads(data);

-- Configurar RLS (Row Level Security)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Criar política para permitir inserção anônima
CREATE POLICY "Permitir inserção anônima" ON public.leads
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Criar política para permitir leitura apenas para usuários autenticados
CREATE POLICY "Permitir leitura apenas para autenticados" ON public.leads
    FOR SELECT
    TO authenticated
    USING (true); 