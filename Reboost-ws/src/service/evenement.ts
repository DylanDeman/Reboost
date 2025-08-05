import { prisma } from '../data';
import type {
  Evenement,
  EvenementCreateInput,
  EvenementUpdateInput,
} from '../types/evenement';
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
  gereedschappen: {
    select: {
      id: true,
      naam: true,
      beschrijving: true,
      beschikbaar: true,
    },
  },
};

export const getAll = async (): Promise<Evenement[]> => {
  return prisma.evenement.findMany({
    select: Evenement_SELECT,
  });
};

export const getById = async (id: number): Promise<Evenement> => {
  const evenement = await prisma.evenement.findUnique({
    where: { id },
    select: Evenement_SELECT,
  });

  if (!evenement) {
    throw ServiceError.notFound('Er bestaat geen evenement met dit Id');
  }

  return evenement;
};

export const create = async ({
  naam,
  datum,
  plaats_id,
  auteur_id,
  gereedschap_ids = [],
}: EvenementCreateInput & { gereedschap_ids?: number[] }): Promise<Evenement> => {
  try {
    await plaatsService.getById(plaats_id);

    const evenement = await prisma.evenement.create({
      data: {
        naam,
        datum,
        auteur_id,
        plaats_id,
      },
      select: Evenement_SELECT,
    });
   
    if (gereedschap_ids.length > 0) {
      await prisma.gereedschap.updateMany({
        where: { id: { in: gereedschap_ids } },
        data: {
          evenement_id: evenement.id,
          beschikbaar: false,
        },
      });
    }

    return prisma.evenement.findUnique({
      where: { id: evenement.id },
      select: Evenement_SELECT,
    }) as Promise<Evenement>;
  } catch (error: any) {
    throw handleDBError(error);
  }
};

export const updateById = async (
  id: number,
  {
    naam,
    datum,
    plaats_id,
    auteur_id,
    gereedschap_ids = [],
  }: EvenementUpdateInput & { gereedschap_ids?: number[] },
): Promise<Evenement> => {
  try {
    await plaatsService.getById(plaats_id);

    const currentlyLinked = await prisma.gereedschap.findMany({
      where: { evenement_id: id },
      select: { id: true },
    });
    const currentlyLinkedIds = currentlyLinked.map((g) => g.id);

    const toDisconnect = currentlyLinkedIds.filter((id) => !gereedschap_ids.includes(id));
  
    const toConnect = gereedschap_ids.filter((id) => !currentlyLinkedIds.includes(id));

    if (toDisconnect.length > 0) {
      await prisma.gereedschap.updateMany({
        where: { id: { in: toDisconnect } },
        data: {
          evenement_id: null,
          beschikbaar: true,
        },
      });
    }
 
    if (toConnect.length > 0) {
      await prisma.gereedschap.updateMany({
        where: { id: { in: toConnect } },
        data: {
          evenement_id: id,
          beschikbaar: false,
        },
      });
    }

    const evenement = await prisma.evenement.update({
      where: { id },
      data: {
        naam,
        datum,
        auteur_id,
        plaats_id,
      },
      select: Evenement_SELECT,
    });

    return evenement;
  } catch (error: any) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number): Promise<void> => {
  await prisma.evenement.delete({
    where: { id },
  });
};

export const getEvenementenByPlaceId = async (
  plaats_id: number,
): Promise<Evenement[]> => {
  return prisma.evenement.findMany({
    where: { plaats_id },
    select: Evenement_SELECT,
  });
};

