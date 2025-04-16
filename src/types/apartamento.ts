export interface ApartamentoVariacao {
  id: string;
  metragem: number;
  quartos: number;
  valor: number;
  url: string;
}

export interface Apartamento {
  id: string;
  nome: string;
  bairro: string;
  imagem?: string;
  variacoes: ApartamentoVariacao[];
  // Campos para compatibilidade com código existente
  metragem?: number;
  quartos?: number;
  valor?: number;
  url?: string;
}
