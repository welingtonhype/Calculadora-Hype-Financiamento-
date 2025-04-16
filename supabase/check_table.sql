-- Verificar estrutura da tabela
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM 
    information_schema.columns 
WHERE 
    table_name = 'leads'
ORDER BY 
    ordinal_position;

-- Verificar índices
SELECT 
    indexname, 
    indexdef
FROM 
    pg_indexes 
WHERE 
    tablename = 'leads';

-- Verificar políticas de segurança
SELECT 
    polname, 
    polcmd, 
    polpermissive, 
    polroles, 
    polqual
FROM 
    pg_policy 
WHERE 
    tablename = 'leads'; 