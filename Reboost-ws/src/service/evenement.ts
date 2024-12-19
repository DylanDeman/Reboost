import { prisma } from '../data';
import type { Evenement, EvenementCreateInput, EvenementUpdateInput } from '../types/evenement';
import * as plaatsService from './plaats';
import handleDBError from './_handleDBError';
import ServiceError from '../core/serviceError';

const Evenement_SELECT = {
  id: true,
  naam: true,
  datum: true,
  plaats: true,
  auteur: {
    select: {
      id: true,
      naam: true,
    },
  },
};

export const getAll = async (): Promise<Evenement[]> => {
  return prisma.evenement.findMany({
    select: Evenement_SELECT,
  });
};

export const getById = async (id: number): Promise<Evenement> => {
  const Evenement = await prisma.evenement.findUnique({
    where: {
      id,
    },
    select: Evenement_SELECT,
  });

  if (!Evenement) {
    throw ServiceError.notFound('Er bestaat geen evenement met dit Id');
  }

  return Evenement;
};

export const create = async ({
  naam,
  datum,
  plaats_id,
  auteur_id,
}: EvenementCreateInput): Promise<Evenement> => {
  try{
    await plaatsService.getById(plaats_id);

    return await prisma.evenement.create({data: {
      naam: naam,
      datum: datum,
      auteur_id: auteur_id,
      plaats_id: plaats_id,
    },
    select: Evenement_SELECT,
    });
  } catch (error:any) {
    throw handleDBError(error);
  }
};

export const updateById = async (id: number, {
  naam,
  datum,
  plaats_id,
  auteur_id,
}: EvenementUpdateInput): Promise<Evenement> => {
  try{
    await plaatsService.getById(plaats_id);

    return await prisma.evenement.update({
      where: {
        id: id,
      },
      data: {
        naam: naam,
        datum: datum,
        auteur_id: auteur_id,
        plaats_id: plaats_id,
      },
      select: Evenement_SELECT,
    });
  } catch (error:any) {
    throw handleDBError(error);
  };
};

export const deleteById = async (id: number): Promise<void> => {
  await prisma.evenement.delete({
    where: {
      id,
    },
  });
};

export const getEvenementenByPlaceId = async (plaats_id: number): Promise<Evenement[]> => {
  return prisma.evenement.findMany({
    where: {
      AND: [
        { plaats_id: plaats_id },
      ],
    },
    select: Evenement_SELECT,
  });
};
