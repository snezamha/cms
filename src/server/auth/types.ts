import { UserRole } from '@prisma/client';
import { DefaultSession } from 'next-auth';

export type ExtendedUser = DefaultSession['user'] & {
  id: string;
  fullName: string;
  phoneNumber: string;
  role: UserRole;
  createdAt: Date;
};
