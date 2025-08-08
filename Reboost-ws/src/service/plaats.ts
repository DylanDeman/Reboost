import { prisma } from '../data';
import type { Plaats, PlaatsCreateInput, PlaatsUpdateInput } from '../types/plaats';

export const getAll = async (): Promise<(Plaats & { _count: { evenementen: number } })[]> => {
  return prisma.plaats.findMany({
    include: {
      _count: {
        select: { evenementen: true },
      },
    },
  });
};

export const getById = async (id: number): Promise<Plaats> => {
  const plaats = await prisma.plaats.findUnique({
    where: {
      id,
    }, 
    include: {
      evenementen: {
        select: {
          id: true,
          naam: true,
          datum: true,
          auteur: true,
        },
      },
    },
  });

  if (!plaats) {
    throw new Error('Er bestaat geen plaats met dit id');
  }

  return plaats;
};

export const create = async (plaats: PlaatsCreateInput): Promise<Plaats> => {
  return prisma.plaats.create({
    data: plaats,
  });
};

export const updateById = async (id: number, changes: PlaatsUpdateInput): Promise<Plaats> => {
  return prisma.plaats.update({
    where: {
      id,
    },
    data: changes,
  });
};

export const deleteById = async (id: number) => {
  await prisma.plaats.delete({
    where: {
      id,
    },
  });
};
