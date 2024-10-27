import { prisma } from '../data';
import type { Gebruiker, GebruikerCreateInput, GebruikerUpdateInput } from '../types/gebruiker';

export const getAll = async (): Promise<Gebruiker[]> => {
  return prisma.gebruiker.findMany();
};

export const getById = async (id: number): Promise<Gebruiker> => {
  const Gebruiker = await prisma.gebruiker.findUnique({ where: { id } });

  if (!Gebruiker) {
    throw new Error('Er bestaat geen gebruiker met dit Id');
  }

  return Gebruiker;
};

export const create = async ({ naam , wachtwoord}: GebruikerCreateInput): Promise<Gebruiker> => {
  return prisma.gebruiker.create({ data: { naam, wachtwoord } });
};

export const updateById = async (id: number, { naam }: GebruikerUpdateInput): Promise<Gebruiker> => {
  return prisma.gebruiker.update({
    where: { id },
    data: { naam },
  });
};
 
export const deleteById = async (id: number): Promise<void> => {
  await prisma.gebruiker.delete({ where: { id } });
};
