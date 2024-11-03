import db from '@/server/db';

export async function getUserByPhoneNumber(phoneNumber: string) {
  try {
    const user = await db.user.findUnique({ where: { phoneNumber } });

    return user;
  } catch {
    return null;
  }
}

export async function getUserById(id: string) {
  try {
    const user = await db.user.findUnique({
      where: { id },
    });

    return user;
  } catch {
    return null;
  }
}
