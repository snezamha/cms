'use client';

import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { useState, useTransition, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormError } from './form-error';
import { FormSuccess } from './form-success';
import { register } from './actions/register';
import { signIn } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useLocale } from 'next-intl';

import { Button } from '@/components/ui/button';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/components/ui/input-otp';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
export default function AuthForm() {
  const t = useTranslations('Auth');
  const router = useRouter();

  const locale = useLocale();
  const [errorRegister, setErrorRegister] = useState<string | undefined>('');
  const [successRegister, setSuccessRegister] = useState<string | undefined>(
    ''
  );
  const [errorLogin, setErrorLogin] = useState<string | undefined>('');
  const [successLogin, setSuccessLogin] = useState<string | undefined>('');
  const [isPendingRegister, startTransitionRegister] = useTransition();
  const [isPendingLogin] = useTransition();

  const [checked, setChecked] = useState(false);
  const [time, setTime] = useState(0);
  const REG = /^09\d{9}$/;
  const RegisterSchema = z.object({
    phoneNumber: z
      .string()
      .length(11, {
        message:
          locale === 'fa'
            ? 'لطفاً تلفن همراه را مطابق نمونه و 11 رقم وارد کنید'
            : 'Please enter the mobile phone according to the example and 11 digits',
      })
      .regex(
        REG,
        locale === 'fa'
          ? 'تلفن همراه معتبر نیست، فرمت صحیح این است: 09XXXXXXXXX'
          : 'The mobile phone is not valid, the correct format is: 09XXXXXXXX'
      ),
  });
  const formRegister = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      phoneNumber: '',
    },
  });
  const LoginSchema = z.object({
    phoneNumber: z.string(),
    otpCode: z.string().length(4, {
      message:
        locale === 'fa'
          ? 'لطفاً یک کد تأیید 4 رقمی وارد کنید'
          : 'Please enter a 4-digit verification code',
    }),
  });
  const formLogin = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      phoneNumber: '',
      otpCode: '',
    },
  });
  useEffect(() => {
    const timer = time > 0 && setInterval(() => setTime((t) => t - 1), 1000);
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [time]);

  const onSubmitRegister = (values: z.infer<typeof RegisterSchema>) => {
    setErrorRegister('');
    setSuccessRegister('');

    startTransitionRegister(() => {
      register(values).then((data) => {
        setErrorRegister(data.error);
        setSuccessRegister(data.success);
        setChecked((prev) => !prev);
        if (data.sec !== undefined) {
          setTime(data.sec);
        } else {
          setTime(120);
        }
      });
    });
  };
  const onSubmitLogin = async (values: z.infer<typeof LoginSchema>) => {
    setErrorLogin('');
    setSuccessLogin('');
    values.phoneNumber = formRegister.getValues().phoneNumber;
    try {
      const result = await signIn('credentials', {
        phoneNumber: values.phoneNumber,
        otpCode: values.otpCode,
        redirect: false,
      });

      if (result?.error) {
        formLogin.reset();
        setErrorLogin(t('message.WrongCode'));
      } else {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      setErrorLogin('An error has occurred');
    }
  };
  const changeNumber = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    setErrorRegister('');
    setSuccessRegister('');
    setErrorLogin('');
    setSuccessLogin('');
    setChecked((prev) => !prev);
  };
  return (
    <>
      <div className='w-80 sm:w-96 m-auto'>
        <Card className='bg-background'>
          <CardHeader className='space-y-1'>
            <CardTitle className='text-xl text-center'>{t('header')}</CardTitle>
          </CardHeader>
          <CardContent className='grid gap-4'>
            <Form {...formRegister}>
              <form
                onSubmit={formRegister.handleSubmit(onSubmitRegister)}
                className='space-y-6'
              >
                <div className={'space-y-4 ' + (checked ? 'hidden' : 'block')}>
                  <FormField
                    control={formRegister.control}
                    name='phoneNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel> {t('phoneNumber')}</FormLabel>
                        <FormControl>
                          <Input
                            dir='ltr'
                            {...field}
                            disabled={isPendingRegister || checked}
                            placeholder='09XXXXXXXXX'
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormError message={errorRegister} />
                <FormSuccess message={successRegister} />
                <Button
                  disabled={isPendingRegister || checked}
                  type='submit'
                  className={'w-full ' + (checked ? 'hidden' : 'block')}
                >
                  {t('sendCode')}
                </Button>
              </form>
            </Form>
            <Form {...formLogin}>
              <form
                onSubmit={formLogin.handleSubmit(onSubmitLogin)}
                className={'space-y-6 py-6 ' + (checked ? 'block' : 'hidden')}
              >
                <div className='space-y-4'>
                  <FormField
                    control={formLogin.control}
                    name='otpCode'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('verificationCode')}</FormLabel>
                        <FormControl>
                          <div dir='ltr' className='flex justify-center'>
                            <InputOTP
                              maxLength={4}
                              {...field}
                              disabled={isPendingLogin}
                            >
                              <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                              </InputOTPGroup>
                            </InputOTP>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormError message={errorLogin} />
                <FormSuccess message={successLogin} />
                <Button
                  disabled={isPendingLogin}
                  type='submit'
                  className='w-full'
                >
                  {t('checkCode')}
                </Button>
                <Button
                  className='w-full'
                  disabled={time > 0}
                  onClick={(e) => changeNumber(e)}
                >
                  {time > 0 ? (
                    <span className='text-xs'>
                      {t('resendCodeText')}
                      <span className='text-lg text-red-600'> {time} </span>
                      {t('second')}
                    </span>
                  ) : (
                    t('resendCode')
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
