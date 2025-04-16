import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import Header from '@/components/Header';
import FinanciamentoForm from '@/components/financiamento/FinanciamentoForm';
import { Apartamento } from '@/types/apartamento';
import { supabase } from '@/integrations/supabase/client';
import { FinanciamentoProvider } from '@/components/financiamento/core/FinanciamentoContext';

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
          .select('id, nome, metragem, quartos, valor, url, bairro, imagem_url')
          .order('valor', { ascending: true });
          
        if (error) {
          throw error;
        }
        
        // Transform data to match our Apartamento interface
        const transformedData: Apartamento[] = data.map(item => ({
          id: item.id, // Keep the UUID as is
          nome: item.nome,
          metragem: item.metragem,
          quartos: item.quartos,
          valor: item.valor,
          url: item.url,
          bairro: item.bairro,
          imagem: item.imagem_url
        }));
        
        setApartamentos(transformedData);
      } catch (error) {
        console.error('Erro ao buscar apartamentos:', error);
        toast({
          title: "Erro ao carregar imóveis",
          description: "Não foi possível carregar a lista de imóveis. Usando dados de demonstração.",
          variant: "destructive"
        });
        
        // Fallback to demo data if Supabase query fails
        const mockData: Apartamento[] = [
          {
            id: "1",
            nome: "Hype Residence",
            metragem: 85,
            quartos: 2,
            valor: 850000,
            url: "https://example.com/apartamento/1",
            bairro: "Jardins",
            imagem: "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          },
          {
            id: "2",
            nome: "Hype Garden",
            metragem: 120,
            quartos: 3,
            valor: 1250000,
            url: "https://example.com/apartamento/2",
            bairro: "Pinheiros",
            imagem: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          },
          {
            id: "3",
            nome: "Hype Sky",
            metragem: 65,
            quartos: 1,
            valor: 650000,
            url: "https://example.com/apartamento/3",
            bairro: "Vila Mariana",
            imagem: "https://images.unsplash.com/photo-1560184897-67f4a3f9a7fa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          },
          {
            id: "4",
            nome: "Hype Premium",
            metragem: 150,
            quartos: 4,
            valor: 1800000,
            url: "https://example.com/apartamento/4",
            bairro: "Moema",
            imagem: "https://images.unsplash.com/photo-1517541866997-ea18e32ea9e9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          },
          {
            id: "5",
            nome: "Hype Compact",
            metragem: 45,
            quartos: 1,
            valor: 450000,
            url: "https://example.com/apartamento/5",
            bairro: "Consolação",
            imagem: "https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          }
        ];
        
        setApartamentos(mockData);
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
        
        <main className="flex-1 mt-12 pt-12 container mx-auto max-w-[1200px] px-6 md:px-8">
          <div className="max-w-2xl mx-auto">
            <div className="mb-10 text-left">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                Calcule seu Financiamento Imobiliário
              </h2>
              <p className="text-gray-500 max-w-xl mt-2 text-base">
                Simule o financiamento do seu imóvel Hype com base nos sistemas PRICE e SAC.
                Escolha um dos nossos empreendimentos e calcule as condições ideais para você.
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
              <FinanciamentoForm 
                apartamentos={apartamentos}
                isLoading={isLoading}
              />
            )}
          </div>
        </main>
        
        <footer className="mt-auto py-6 bg-[#020817] border-t border-gray-800">
          <div className="container mx-auto px-4 text-center">
            <p className="text-[11px] md:text-sm text-gray-400">© {new Date().getFullYear()} Simulador Hype – Financiamento Imobiliário</p>
            <p className="mt-1 text-[11px] md:text-sm text-gray-400">Desenvolvido com ❤️ pela equipe Hype</p>
          </div>
        </footer>
      </div>
    </FinanciamentoProvider>
  );
};

export default Index;
