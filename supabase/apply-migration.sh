#!/bin/bash

# Verifica se o Supabase CLI está instalado
if ! command -v supabase &> /dev/null; then
    echo "Supabase CLI não encontrado. Instalando..."
    npm install -g supabase
fi

# Inicia o Supabase localmente
echo "Iniciando Supabase..."
supabase start

# Aplica a migração
echo "Aplicando migração..."
supabase db reset

echo "Migração concluída com sucesso!" 