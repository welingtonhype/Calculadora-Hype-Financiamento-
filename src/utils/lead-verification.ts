import { Apartamento } from '@/types/apartamento';
import { logger } from './logger';

interface LeadData {
  email: string;
  apartamentoId: string;
  timestamp: number;
}

const LEAD_STORAGE_KEY = '@hype/lead-data';
const LEAD_EXPIRATION_TIME = 7 * 24 * 60 * 60 * 1000; // 7 dias em milissegundos

export const LeadVerificationService = {
  saveLead: async (email: string, apartamento: Apartamento) => {
    const leadData: LeadData = {
      email,
      apartamentoId: apartamento.id,
      timestamp: Date.now()
    };

    try {
      // Recupera leads existentes ou inicia array vazio
      const existingLeads = await this.getLeads();
      existingLeads.push(leadData);
      
      // Salva no localStorage
      localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(existingLeads));
    } catch (error) {
      logger.error('Erro ao salvar lead', error as Error);
      throw error;
    }
  },

  hasRecentLead: async (apartamentoId: string): Promise<boolean> => {
    try {
      const leads = await this.getLeads();
      const now = Date.now();

      // Verifica se existe algum lead recente para este apartamento
      return leads.some(lead => 
        lead.apartamentoId === apartamentoId && 
        (now - lead.timestamp) < LEAD_EXPIRATION_TIME
      );
    } catch (error) {
      logger.error('Erro ao verificar lead', error as Error);
      return false;
    }
  },

  // Método interno com prefixo _ para indicar que é privado
  getLeads: async (): Promise<LeadData[]> => {
    try {
      const storedData = localStorage.getItem(LEAD_STORAGE_KEY);
      if (!storedData) return [];

      const leads: LeadData[] = JSON.parse(storedData);
      
      // Limpa leads expirados
      const now = Date.now();
      const validLeads = leads.filter(lead => 
        (now - lead.timestamp) < LEAD_EXPIRATION_TIME
      );

      // Atualiza storage se houve limpeza
      if (validLeads.length !== leads.length) {
        localStorage.setItem(LEAD_STORAGE_KEY, JSON.stringify(validLeads));
      }

      return validLeads;
    } catch (error) {
      logger.error('Erro ao recuperar leads', error as Error);
      throw error;
    }
  }
}; 