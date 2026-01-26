import { z } from "zod";

export const mspStepOneSchema = z.object({
  companyName: z.string().min(2, "Nome da empresa é obrigatório"),
  cnpj: z.string().min(14, "CNPJ inválido"),
  phone: z.string().min(10, "Telefone inválido"),
  sector: z.string().min(2, "Setor é obrigatório"),
  contactEmail: z.string().email("E-mail inválido"),
  cep: z.string().min(8, "CEP inválido"),
  locality: z.string().min(1, "Localização é obrigatória"),
});

export const mspStepTwoSchema = z.object({
  mspDomain: z.string().min(3, "Domínio inválido"),
  admName: z.string().min(2, "Nome é obrigatório"),
  admEmail: z.string().email("E-mail inválido"),
  username: z.string().min(3, "Usuário é obrigatório"),
});
