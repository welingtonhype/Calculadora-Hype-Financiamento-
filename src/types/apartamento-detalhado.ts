
import { Apartamento } from './apartamento';

export interface ApartamentoDetalhado extends Omit<Apartamento, 'bairro' | 'imagem'> {
  bairro?: string;
  imagem?: string;
  dataScraping: string;
}
