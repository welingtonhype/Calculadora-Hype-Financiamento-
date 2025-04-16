import { useToast } from "@/components/ui/use-toast";

// Níveis de log
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

// Interface para mensagens de log
interface LogMessage {
  level: LogLevel;
  message: string;
  error?: Error;
  context?: Record<string, unknown>;
}

// Configuração de logging
const LOG_CONFIG = {
  showToasts: process.env.NODE_ENV === 'production',
  logToConsole: process.env.NODE_ENV !== 'production'
};

// Função de logging centralizada
export const logger = {
  error: (message: string, error?: Error, context?: Record<string, unknown>) => {
    const logMessage: LogMessage = {
      level: LogLevel.ERROR,
      message,
      error,
      context
    };

    if (LOG_CONFIG.logToConsole) {
      console.error(`[ERROR] ${message}`, error || '', context || '');
    }

    if (LOG_CONFIG.showToasts) {
      // Aqui você pode implementar o envio de logs para um serviço de monitoramento
      // como Sentry, LogRocket, etc.
    }
  },

  warn: (message: string, context?: Record<string, unknown>) => {
    const logMessage: LogMessage = {
      level: LogLevel.WARN,
      message,
      context
    };

    if (LOG_CONFIG.logToConsole) {
      console.warn(`[WARN] ${message}`, context || '');
    }
  },

  info: (message: string, context?: Record<string, unknown>) => {
    const logMessage: LogMessage = {
      level: LogLevel.INFO,
      message,
      context
    };

    if (LOG_CONFIG.logToConsole) {
      console.info(`[INFO] ${message}`, context || '');
    }
  },

  debug: (message: string, context?: Record<string, unknown>) => {
    const logMessage: LogMessage = {
      level: LogLevel.DEBUG,
      message,
      context
    };

    if (LOG_CONFIG.logToConsole) {
      console.debug(`[DEBUG] ${message}`, context || '');
    }
  }
}; 