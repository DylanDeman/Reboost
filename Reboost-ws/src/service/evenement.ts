import { prisma } from '../data';
import type { Evenement, EvenementCreateInput, EvenementUpdateInput } from '../types/evenement';
import * as placeService from './plaats';

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
    throw new Error('Er bestaat geen evenement met dit Id');
  }

  return Evenement;
};

export const create = async ({
  naam,
  datum,
  plaats_id,
  auteur_id,
}: EvenementCreateInput): Promise<Evenement> => {
  const existingPlace = await placeService.getById(plaats_id);

  if (!existingPlace) {
    throw new Error(`Er bestaat geen plaats met id: ${plaats_id}.`);
  }

  return prisma.evenement.create({
    data: {
      naam: naam,
      datum: datum,
      auteur_id: auteur_id,
      plaats_id: plaats_id,
    },
    select: Evenement_SELECT,
  });
};

export const updateById = async (id: number, {
  naam,
  datum,
  plaats_id,
  auteur_id,
}: EvenementUpdateInput): Promise<Evenement> => {
  const existingPlace = await placeService.getById(plaats_id);

  if (!existingPlace) {
    throw new Error(`Er bestaat geen plaats met id: ${plaats_id}.`);
  }

  return prisma.evenement.update({
    where: {
      id,
      auteur_id: auteur_id,
    },
    data: {
      naam: naam,
      datum: datum,
      plaats_id: plaats_id,
    },
    select: Evenement_SELECT,
  });
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
