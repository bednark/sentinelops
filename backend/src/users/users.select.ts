import { Prisma } from '../../generated/prisma/client';

export const userRestSelect = {
  id: true,
  email: true,
  role: true,
  createdAt: true,
} satisfies Prisma.UserSelect;
