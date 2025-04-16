
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.43/deno-dom-wasm.ts";

// Obter variáveis de ambiente
const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

serve(async (req) => {
  // Cria cliente Supabase com a service_role key para poder escrever no banco
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  try {
    // Configurar cabeçalhos para simular um navegador
    const headers = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    };

    // Fazer a requisição para a página de apartamentos
    const url = "https://hypeempreendimentos.com.br/apartamentos-a-venda";
    console.log(`Iniciando scraping de: ${url}`);
    
    const response = await fetch(url, { headers });
    const html = await response.text();
    
    // Usar o DOM parser para analisar o HTML
    const parser = new DOMParser();
    const document = parser.parseFromString(html, "text/html");
    
    if (!document) {
      throw new Error("Falha ao analisar o HTML");
    }

    // Extrair os apartamentos (ajustar os seletores conforme a estrutura real do site)
    // Nota: Os seletores abaixo são exemplos e precisam ser ajustados com base na estrutura real do site
    const apartamentosNodes = document.querySelectorAll(".imovel-card, .apartamento-item, .property-card");
    console.log(`Encontrados ${apartamentosNodes.length} apartamentos`);
    
    const apartamentos = [];
    
    for (let i = 0; i < apartamentosNodes.length; i++) {
      const apartamento = apartamentosNodes[i];
      
      try {
        // Obter dados do apartamento (ajustar os seletores conforme a estrutura real do site)
        const nome = apartamento.querySelector(".titulo, .nome, h3")?.textContent?.trim() || "Sem nome";
        
        // Extrair metragem e converter para número
        const metragemText = apartamento.querySelector(".metragem, .area, .metros")?.textContent?.trim() || "0";
        const metragem = parseFloat(metragemText.replace(/[^\d.,]/g, "").replace(",", "."));
        
        // Extrair quartos e converter para número
        const quartosText = apartamento.querySelector(".quartos, .bedrooms, .dormitorios")?.textContent?.trim() || "0";
        const quartos = parseInt(quartosText.match(/\d+/)?.[0] || "0", 10);
        
        // Extrair valor e converter para número
        const valorText = apartamento.querySelector(".valor, .price, .preco")?.textContent?.trim() || "0";
        const valor = parseFloat(valorText.replace(/[^\d.,]/g, "").replace(".", "").replace(",", "."));
        
        // Obter URL do apartamento
        const urlElement = apartamento.querySelector("a[href]");
        const urlPath = urlElement?.getAttribute("href") || "";
        const url = urlPath.startsWith("http") ? urlPath : `https://hypeempreendimentos.com.br${urlPath}`;
        
        // Obter bairro (opcional)
        const bairro = apartamento.querySelector(".bairro, .location, .localizacao")?.textContent?.trim();
        
        // Obter URL da imagem (opcional)
        const imagemElement = apartamento.querySelector("img");
        const imagemUrl = imagemElement?.getAttribute("src") || "";
        const imagem = imagemUrl.startsWith("http") ? imagemUrl : `https://hypeempreendimentos.com.br${imagemUrl}`;
        
        // Criar objeto do apartamento
        const apartamentoObj = {
          id: i + 1, // Usar um ID sequencial como exemplo
          nome,
          metragem: !isNaN(metragem) ? metragem : 0,
          quartos: !isNaN(quartos) ? quartos : 0,
          valor: !isNaN(valor) ? valor : 0,
          url,
          bairro: bairro || undefined,
          imagem: imagem || undefined,
          dataScraping: new Date().toISOString(),
        };
        
        apartamentos.push(apartamentoObj);
        console.log(`Processado apartamento: ${nome}`);
      } catch (error) {
        console.error(`Erro ao processar apartamento ${i}:`, error);
      }
    }
    
    if (apartamentos.length === 0) {
      throw new Error("Nenhum apartamento encontrado. Verificar seletores CSS.");
    }
    
    // Upsert dos apartamentos no Supabase
    const { error } = await supabase
      .from("apartamentos")
      .upsert(apartamentos, { onConflict: "id" });
    
    if (error) {
      throw error;
    }
    
    console.log(`${apartamentos.length} apartamentos salvos com sucesso!`);
    
    return new Response(
      JSON.stringify({
        success: true,
        message: `${apartamentos.length} apartamentos processados com sucesso`,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Erro durante o scraping:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
