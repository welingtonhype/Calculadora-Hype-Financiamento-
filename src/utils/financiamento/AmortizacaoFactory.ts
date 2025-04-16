import { SistemaAmortizacao } from './types';
import { AmortizacaoStrategy } from './strategies/AmortizacaoStrategy';
import { PriceStrategy } from './strategies/PriceStrategy';
import { SacStrategy } from './strategies/SacStrategy';

export class AmortizacaoFactory {
  private static strategies = {
    PRICE: new PriceStrategy(),
    SAC: new SacStrategy()
  };

  static getStrategy(sistema: SistemaAmortizacao): AmortizacaoStrategy {
    const strategy = this.strategies[sistema];
    if (!strategy) {
      throw new Error(`Sistema de amortização '${sistema}' não suportado`);
    }
    return strategy;
  }
} 