import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { User, Mail, Phone, Send, Lock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Apartamento } from '@/types/apartamento';

interface LeadFormProps {
  apartamento: Apartamento;
  onSubmitSuccess: () => void;
  showConsentCheckbox?: boolean;
  ctaButtonText?: string;
  rendaMensal?: string;
  valorEntrada?: string;
  sistemaAmortizacao?: string;
  valorParcela?: number;
  prazoMeses?: number;
  taxaJuros?: number;
}

const leadFormSchema = z.object({
  nome: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres' }),
  email: z.string().email({ message: 'Digite um e-mail válido' }),
  telefone: z
    .string()
    .min(10, { message: 'Digite um telefone válido com DDD' })
    .max(15, { message: 'Telefone muito longo' })
    .refine((val) => /^\d+$/.test(val.replace(/\D/g, '')), { message: 'O telefone deve conter apenas números' }),
  consent: z.boolean().optional(),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

const LeadForm = ({ 
  apartamento, 
  onSubmitSuccess, 
  showConsentCheckbox = false,
  ctaButtonText = "Receber contato da Hype",
  rendaMensal,
  valorEntrada,
  sistemaAmortizacao,
  valorParcela,
  prazoMeses,
  taxaJuros
}: LeadFormProps) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      consent: false,
    },
  });

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  const onSubmit = async (data: LeadFormValues) => {
    try {
      setIsSubmitting(true);
      
      // Format phone number for consistency in the database
      const formattedPhone = data.telefone.replace(/\D/g, '');
      
      // Preparar os dados do lead com os novos campos
      const leadData = {
        nome: data.nome,
        email: data.email,
        telefone: formattedPhone,
        apartamento_simulado: apartamento.nome,
        data: new Date().toISOString(),
        consentimento: data.consent,
        // Novos campos da simulação
        renda_mensal: rendaMensal ? parseFloat(rendaMensal.replace(/\D/g, '')) / 100 : null,
        valor_entrada: valorEntrada ? parseFloat(valorEntrada.replace(/\D/g, '')) / 100 : null,
        sistema_amortizacao: sistemaAmortizacao || null,
        valor_imovel: apartamento.valor,
        valor_financiado: apartamento.valor - (valorEntrada ? parseFloat(valorEntrada.replace(/\D/g, '')) / 100 : 0),
        valor_parcela: valorParcela || null,
        prazo_meses: prazoMeses || 360, // Valor padrão de 30 anos
        taxa_juros: taxaJuros || 9, // Valor padrão de 9% ao ano
        apartamento_id: apartamento.id,
        apartamento_nome: apartamento.nome,
        apartamento_metragem: apartamento.metragem,
        apartamento_quartos: apartamento.quartos,
      };
      
      console.log('Dados do lead a serem salvos:', leadData); // Log para debug
      
      const { error } = await supabase
        .from('leads')
        .insert(leadData);
      
      if (error) {
        console.error('Erro ao salvar lead:', error); // Log para debug
        throw error;
      }
      
      toast({
        title: 'Dados enviados com sucesso!',
        description: 'Agora você pode ver a simulação detalhada.',
        variant: 'default',
      });
      
      form.reset();
      onSubmitSuccess();
    } catch (error) {
      console.error('Erro ao enviar lead:', error);
      toast({
        title: 'Erro ao enviar seus dados',
        description: 'Por favor, tente novamente mais tarde.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl p-6">
      {!showConsentCheckbox && (
        <h3 className="text-xl font-semibold mb-6 text-hype-black flex items-center gap-2">
          <User className="h-5 w-5 text-hype-green" />
          Tenho interesse neste imóvel
        </h3>
      )}
      
      {showConsentCheckbox && (
        <h3 className="text-xl font-semibold mb-6 text-hype-black text-center">
          📊 Estamos quase lá! Preencha seus dados e veja o plano completo do seu financiamento.
        </h3>
      )}
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem className="mb-8">
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder="Ex: Ana Oliveira" 
                      className="pl-10 border-gray-200 focus-visible:ring-hype-green" 
                      {...field} 
                    />
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-hype-gray-dark" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="mb-8">
                <FormLabel>E-mail</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder="Ex: ana@email.com" 
                      type="email" 
                      className="pl-10 border-gray-200 focus-visible:ring-hype-green" 
                      {...field} 
                    />
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-hype-gray-dark" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="telefone"
            render={({ field: { onChange, ...fieldProps } }) => (
              <FormItem className="mb-8">
                <FormLabel>Telefone com DDD</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder="Ex: (41) 98765-4321" 
                      className="pl-10 border-gray-200 focus-visible:ring-hype-green" 
                      onChange={(e) => {
                        const formatted = formatPhoneNumber(e.target.value);
                        e.target.value = formatted;
                        onChange(e);
                      }}
                      {...fieldProps} 
                    />
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-hype-gray-dark" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {showConsentCheckbox && (
            <FormField
              control={form.control}
              name="consent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 pt-2 mb-10">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm font-normal">
                      Autorizo a Hype a entrar em contato comigo sobre este e outros imóveis.
                    </FormLabel>
                    <p className="text-xs text-hype-gray-dark mt-2">
                      Prometemos não compartilhar suas informações com terceiros.
                    </p>
                  </div>
                </FormItem>
              )}
            />
          )}
          
          <div className="pt-4">
            <Button 
              type="submit" 
              className="w-full bg-hype-green hover:bg-hype-green/90 text-white gap-2 py-6 text-base font-semibold"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <circle 
                        className="opacity-25" 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                        fill="none"
                      />
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </span>
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>{ctaButtonText}</span>
                </>
              )}
            </Button>
            
            <div className="mt-6 flex items-center justify-center gap-2 text-gray-500">
              <Lock className="h-4 w-4" />
              <p className="text-xs">
                Seus dados estão protegidos. Não enviaremos spam.
              </p>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default LeadForm;
