'use server';
import { getTranslations } from 'next-intl/server';
import { sendOtp } from '@/utils/sms';

import * as z from 'zod';
const REG = /^09\d{9}$/;
const RegisterSchema = z.object({
  phoneNumber: z.string().length(11).regex(REG),
});
import db from '@/server/db';

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const t = await getTranslations('Auth');
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Invalid Fields!' };
  }

  const { phoneNumber } = validatedFields.data;
  const randNumber = Math.floor(1000 + Math.random() * 9000);
  const currentDate = new Date();
  const twoMinutesLater = new Date(currentDate.getTime() + 120 * 1000);

  const existingUser = await db.user.findUnique({
    where: {
      phoneNumber,
    },
  });
  if (existingUser) {
    if (checkValidOtp(existingUser.otpExpiresIn)) {
      await db.user.update({
        where: {
          phoneNumber,
        },
        data: {
          otpCode: randNumber.toString(),
          otpExpiresIn: twoMinutesLater,
        },
      });
      sendOtp(existingUser.phoneNumber, randNumber);

      return {
        success: t('message.codeSent'),
        sec: countSecons(twoMinutesLater),
      };
    } else {
      return {
        error: t('message.receivedCode'),
        sec: countSecons(existingUser.otpExpiresIn),
      };
    }
  }
  await db.user.create({
    data: {
      phoneNumber,
      otpCode: randNumber.toString(),
      otpExpiresIn: twoMinutesLater,
      role: 'USER',
      credit: '0',
      creditInCirculation: '0',
    },
  });
  sendOtp(phoneNumber, randNumber);

  return {
    success: t('message.codeSent'),
    sec: countSecons(twoMinutesLater),
  };
};

function countSecons(time: Date): number {
  const currentDate = new Date();
  const diff = Math.floor((time.getTime() - currentDate.getTime()) / 1000);
  return diff;
}
function checkValidOtp(otpValidTime: Date) {
  const currentDate = new Date();
  const diff = Math.floor(
    (otpValidTime.getTime() - currentDate.getTime()) / 1000
  );

  if (diff < 0) {
    return true;
  }
}
