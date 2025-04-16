import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import Header from '@/components/Header';
import FinanciamentoForm from '@/components/financiamento/FinanciamentoForm';
import { Apartamento } from '@/types/apartamento';
import { supabase } from '@/integrations/supabase/client';
import { FinanciamentoProvider } from '@/components/financiamento/core/FinanciamentoContext';
import { logger } from '@/utils/logger';

const Index = () => {
  const [apartamentos, setApartamentos] = useState<Apartamento[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchApartamentos = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('apartamentos')
          .select('id, nome, metragem, quartos, valor, url, bairro, imagem_url, modelo')
          .order('valor', { ascending: true });
          
        if (error) {
          throw error;
        }
        
        // Agrupar apartamentos por modelo
        const apartamentosPorModelo = data.reduce((acc, item) => {
          const modelo = item.modelo || item.nome; // Se não tiver modelo, usa o nome como modelo
          
          if (!acc[modelo]) {
            acc[modelo] = {
              id: item.id,
              nome: modelo,
              bairro: item.bairro,
              imagem: item.imagem_url,
              variacoes: []
            };
          }
          
          acc[modelo].variacoes.push({
            id: item.id,
            metragem: item.metragem,
            quartos: item.quartos,
            valor: item.valor,
            url: item.url
          });
          
          return acc;
        }, {});
        
        // Transformar em array e ordenar por valor
        const transformedData: Apartamento[] = Object.values(apartamentosPorModelo)
          .map((modelo: any) => ({
            ...modelo,
            // Campos para compatibilidade com código existente
            metragem: modelo.variacoes[0].metragem,
            quartos: modelo.variacoes[0].quartos,
            valor: modelo.variacoes[0].valor,
            url: modelo.variacoes[0].url
          }))
          .sort((a, b) => a.variacoes[0].valor - b.variacoes[0].valor);
        
        setApartamentos(transformedData);
      } catch (error) {
        logger.error('Erro ao buscar apartamentos', error as Error);
        toast({
          title: "Erro ao carregar imóveis",
          description: "Não foi possível carregar a lista de imóveis. Por favor, tente novamente mais tarde.",
          variant: "destructive"
        });
        setApartamentos([]);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchApartamentos();
  }, [toast]);
  
  return (
    <FinanciamentoProvider>
      <div className="min-h-screen bg-[#f9f9fa] flex flex-col">
        <Header />
        
        <main className="flex-1 container mx-auto max-w-[1200px] px-4 md:px-8 py-8 md:py-12">
          <div className="w-full max-w-2xl mx-auto space-y-6 px-4 md:px-0">
            <div className="text-left space-y-1.5 md:space-y-2">
              <h1 className="text-2xl md:text-3xl font-semibold text-hype-black">
                Calcule seu Financiamento Imobiliário
              </h1>
              <p className="text-sm text-gray-500">
                Simule o financiamento do seu imóvel Hype com base nos sistemas PRICE e SAC. Escolha um dos nossos empreendimentos e calcule as condições ideais para você.
              </p>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-[#00C896]" />
                <span className="ml-2 text-gray-900">Carregando imóveis...</span>
              </div>
            ) : apartamentos.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl shadow-card">
                <p className="text-gray-900">
                  Não há imóveis cadastrados no momento. Por favor, tente novamente mais tarde.
                </p>
              </div>
            ) : (
              <div className="mb-8">
                <FinanciamentoForm 
                  apartamentos={apartamentos}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>
        </main>
        
        <footer className="py-4 bg-[#020817] border-t border-gray-800 mt-auto">
          <div className="container mx-auto px-4 text-center">
            <p className="text-[11px] md:text-xs text-gray-400">© {new Date().getFullYear()} Simulador Hype – Financiamento Imobiliário</p>
            <p className="mt-1 text-[11px] md:text-xs text-gray-400">Desenvolvido com ❤️ pela equipe Hype</p>
          </div>
        </footer>
      </div>
    </FinanciamentoProvider>
  );
};

export default Index;
