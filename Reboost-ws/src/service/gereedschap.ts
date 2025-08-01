import { PrismaClient } from '@prisma/client';
import type {
  GereedschapCreateInput,
  GereedschapUpdateInput,
} from '../types/gereedschap';

const prisma = new PrismaClient();

export const GereedschapService = {
  async list() {
    const gereedschappen = await prisma.gereedschap.findMany({
      include: {
        evenement: true,
      },
    });

    const totalCount = await prisma.gereedschap.count();

    return { gereedschappen, totalCount };
  },

  async getById(id: number) {
    const gereedschap = await prisma.gereedschap.findUnique({
      where: { id },
      include: {
        evenement: true,
      },
    });

    if (!gereedschap) {
      throw new Error(`Gereedschap met ID ${id} niet gevonden`);
    }

    return gereedschap;
  },

  async create(data: GereedschapCreateInput) {
    const createData: any = {
      naam: data.naam,
      beschrijving: data.beschrijving,
      beschikbaar: data.beschikbaar,
    };

    if (data.evenementId) {
      createData.evenement = { connect: { id: data.evenementId } };
    }

    const gereedschap = await prisma.gereedschap.create({
      data: createData,
      include: { evenement: true },
    });

    return gereedschap;
  },

  async update(id: number, data: GereedschapUpdateInput) {
    const updateData: any = {
      naam: data.naam,
      beschrijving: data.beschrijving,
      beschikbaar: data.beschikbaar,
    };

    if (data.evenementId !== undefined) {
      updateData.evenement = data.evenementId
        ? { connect: { id: data.evenementId } }
        : { disconnect: true };
    }

    const gereedschap = await prisma.gereedschap.update({
      where: { id },
      data: updateData,
      include: { evenement: true },
    });

    return gereedschap;
  },

  async delete(id: number) {
    await prisma.gereedschap.delete({
      where: { id },
    });

    return {
      success: true,
      message: `Gereedschap met ID ${id} is succesvol verwijderd`,
    };
  },

  async getEventByGereedschapId(id: number) {
    const gereedschap = await prisma.gereedschap.findUnique({
      where: { id },
      include: { evenement: true },
    });

    if (!gereedschap) {
      throw new Error(`Gereedschap met ID ${id} niet gevonden`);
    }

    if (!gereedschap.evenement) {
      throw new Error(`Gereedschap met ID ${id} is niet gekoppeld aan een evenement`);
    }

    return {
      gereedschap,
      evenement: gereedschap.evenement,
    };
  },
};
