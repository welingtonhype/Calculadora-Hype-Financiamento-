import { calculateFinanciamento, AmortizationSystem, Indexador } from './calculators';

// Função auxiliar para formatar moeda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(value);
};

// Função para executar e exibir os resultados do teste
function runTest(
  description: string,
  valorImovel: number,
  entrada: number,
  rendaMensal: number,
  sistema: AmortizationSystem = 'SAC',
  prazoMeses: number = 420,
  indexador: Indexador = 'TR'
) {
  console.log('\n=== ' + description + ' ===');
  const resultado = calculateFinanciamento(
    valorImovel,
    entrada,
    rendaMensal,
    sistema,
    prazoMeses,
    indexador
  );

  console.log('Dados de entrada:');
  console.log('- Valor do imóvel:', formatCurrency(valorImovel));
  console.log('- Entrada:', formatCurrency(entrada));
  console.log('- Renda mensal:', formatCurrency(rendaMensal));
  console.log('- Sistema:', sistema);
  console.log('- Prazo:', prazoMeses, 'meses');
  console.log('- Indexador:', indexador);
  console.log('- Taxa de juros:', resultado.taxaJurosAnual.toFixed(2) + '% a.a.');

  console.log('\nResultados:');
  console.log('- Valor financiado:', formatCurrency(resultado.valorFinanciado));
  console.log('- Primeira parcela:', formatCurrency(resultado.parcela));
  console.log('- Última parcela:', formatCurrency(resultado.parcelaFinal));
  console.log('- Total de juros:', formatCurrency(resultado.totalJuros));
  console.log('- Total pago:', formatCurrency(resultado.totalPago));
  console.log('- Capacidade de pagamento:', formatCurrency(resultado.capacidadePagamento!));

  // Validações
  const percentualRenda = (resultado.parcela / rendaMensal) * 100;
  console.log('\nValidações:');
  console.log('- Percentual da renda comprometido:', percentualRenda.toFixed(2) + '%');
  console.log('- Dentro do limite de 30%:', percentualRenda <= 30 ? 'SIM ✅' : 'NÃO ❌');
  console.log('- Entrada >= 5%:', (entrada / valorImovel) * 100 >= 5 ? 'SIM ✅' : 'NÃO ❌');
}

// Cenário 1: Financiamento SAC com entrada mínima
runTest(
  'Cenário 1: SAC com entrada mínima',
  500000, // Valor do imóvel
  25000,  // Entrada (5%)
  10000,  // Renda mensal
  'SAC',
  420,
  'TR'
);

// Cenário 2: Financiamento PRICE com entrada maior
runTest(
  'Cenário 2: PRICE com entrada maior',
  500000, // Valor do imóvel
  150000, // Entrada (30%)
  10000,  // Renda mensal
  'PRICE',
  420,
  'TR'
);

// Cenário 3: SAC com indexador POUPANÇA
runTest(
  'Cenário 3: SAC com indexador POUPANÇA',
  500000, // Valor do imóvel
  100000, // Entrada (20%)
  15000,  // Renda mensal
  'SAC',
  420,
  'POUPANCA'
);

// Cenário 4: PRICE com indexador IPCA
runTest(
  'Cenário 4: PRICE com indexador IPCA',
  500000, // Valor do imóvel
  100000, // Entrada (20%)
  15000,  // Renda mensal
  'PRICE',
  420,
  'IPCA'
);

// Cenário 5: Prazo menor (20 anos)
runTest(
  'Cenário 5: Prazo menor (20 anos)',
  500000, // Valor do imóvel
  100000, // Entrada (20%)
  20000,  // Renda mensal
  'SAC',
  240,    // 20 anos
  'TR'
); 