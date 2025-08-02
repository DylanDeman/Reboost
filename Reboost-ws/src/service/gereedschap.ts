import { prisma } from '../data';
import type { Gereedschap, GereedschapCreateInput, GereedschapUpdateInput } from '../types/gereedschap';
import * as evenementService from './evenement';
import handleDBError from './_handleDBError';
import ServiceError from '../core/serviceError';

const Gereedschap_SELECT = {
  id: true,
  naam: true,
  beschrijving: true,
  beschikbaar: true,
  evenement: {
    select: {
      id: true,
      naam: true,
      datum: true,
    },
  },
};

export const getAll = async (): Promise<Gereedschap[]> => {
  try {
    console.log('Fetching gereedschap with select:', Gereedschap_SELECT);
    const result = await prisma.gereedschap.findMany({
      select: Gereedschap_SELECT,
    });
    console.log('Raw result from database:', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('Error in getAll:', error);
    throw error;
  }
};

export const getById = async (id: number): Promise<Gereedschap> => {
  const gereedschap = await prisma.gereedschap.findUnique({
    where: {
      id,
    },
    select: Gereedschap_SELECT,
  });

  if (!gereedschap) {
    throw ServiceError.notFound('Er bestaat geen gereedschap met dit Id');
  }

  return gereedschap;
};

export const create = async ({
  naam,
  beschrijving,
  beschikbaar,
  evenementId,
}: GereedschapCreateInput): Promise<Gereedschap> => {
  try {
    if (evenementId !== undefined && evenementId !== null) {
      await evenementService.getById(evenementId);
    }

    const createData: any = {
      naam: naam,
      beschrijving: beschrijving,
      beschikbaar: beschikbaar,
    };

    if (evenementId !== undefined && evenementId !== null) {
      createData.evenement_id = evenementId;
    }

    return await prisma.gereedschap.create({
      data: createData,
      select: Gereedschap_SELECT,
    });
  } catch (error: any) {
    throw handleDBError(error);
  }
};

export const updateById = async (id: number, {
  naam,
  beschrijving,
  beschikbaar,
  evenementId,
}: GereedschapUpdateInput): Promise<Gereedschap> => {
  try {
    if (evenementId !== undefined && evenementId !== null) {
      await evenementService.getById(evenementId);
    }

    const updateData: any = {
      naam: naam,
      beschrijving: beschrijving,
      beschikbaar: beschikbaar,
    };

    if (evenementId !== undefined) {
      updateData.evenement_id = evenementId;
    }

    return await prisma.gereedschap.update({
      where: {
        id: id,
      },
      data: updateData,
      select: Gereedschap_SELECT,
    });
  } catch (error: any) {
    throw handleDBError(error);
  }
};

export const deleteById = async (id: number): Promise<void> => {
  await prisma.gereedschap.delete({
    where: {
      id,
    },
  });
};

export const getGereedschapByEvenementId = async (evenement_id: number): Promise<Gereedschap[]> => {
  return prisma.gereedschap.findMany({
    where: {
      evenement_id: evenement_id,
    },
    select: Gereedschap_SELECT,
  });
};

// Temporary debug version - try without select
export const getAllDebug = async () => {
  try {
    console.log('Fetching ALL gereedschap fields...');
    const result = await prisma.gereedschap.findMany({
      include: {
        evenement: true,
      },
    });
    console.log('Debug result (all fields):', JSON.stringify(result, null, 2));
    return result;
  } catch (error) {
    console.error('Error in getAllDebug:', error);
    throw error;
  }
};
