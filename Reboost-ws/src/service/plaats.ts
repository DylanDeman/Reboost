import { prisma } from '../data';
import type { Plaats, PlaatsCreateInput, PlaatsUpdateInput } from '../types/plaats';
import ServiceError from '../core/serviceError';
import handleDBError from './_handleDBError';

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
  try {
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
      throw ServiceError.notFound('Er bestaat geen plaats met dit id');
    }

    return plaats;
  } catch (error) {
    throw handleDBError(error);
  }
};

export const create = async (plaats: PlaatsCreateInput): Promise<Plaats> => {
  try {
    return prisma.plaats.create({
      data: plaats,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const updateById = async (id: number, changes: PlaatsUpdateInput): Promise<Plaats> => {
  try {
    // First check if plaats exists
    const exists = await prisma.plaats.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      throw ServiceError.notFound('Er bestaat geen plaats met dit id');
    }

    return prisma.plaats.update({
      where: {
        id,
      },
      data: changes,
    });
  } catch (error) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number) => {
  try {
    // First check if plaats exists
    const exists = await prisma.plaats.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      throw ServiceError.notFound('Er bestaat geen plaats met dit id');
    }

    await prisma.plaats.delete({
      where: {
        id,
      },
    });
  } catch (error) {
    throw handleDBError(error);
  }
};
