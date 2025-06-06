'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { sendVerificationEmail } from '@/lib/auth-client';
import {
  type ResendVerificationEmailSchema,
  resendVerificationEmailSchema
} from '@/schemas/auth.schema';

export default function ResendVerificationEmailForm() {
  const [isPending, setIsPending] = useState(false);

  const form = useForm<ResendVerificationEmailSchema>({
    resolver: zodResolver(resendVerificationEmailSchema),
    defaultValues: {
      email: ''
    }
  });

  const onSubmit = async (data: ResendVerificationEmailSchema) => {
    setIsPending(true);

    await sendVerificationEmail({
      email: data.email,
      callbackURL: '/email-verified',
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
          toast('Sending verification link...');
        },
        onSuccess: () => {
          toast.success(
            'If an account exists with this email, you will receive a verification link.'
          );
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: ctx => {
          toast.error(ctx.error.message);
          setIsPending(false);
        }
      }
    });
  };

  return (
    <Card className='w-full max-w-sm'>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='grid gap-4'>
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <div className='grid gap-2'>
                    <FormLabel htmlFor='email'>Email</FormLabel>
                    <FormControl>
                      <Input
                        id='email'
                        type='email'
                        placeholder='email@example.com'
                        required
                        {...field}
                        autoComplete='email'
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full' disabled={isPending}>
              {isPending ? (
                <Loader2 size={16} className='animate-spin' />
              ) : (
                <>
                  <Mail className='size-4' />
                  Send Verification Link
                </>
              )}
            </Button>

            <Separator />

            <div className='text-center'>
              <Link
                href='/sign-in'
                className='flex items-center justify-center gap-1 text-sm underline'
              >
                <ArrowLeft className='size-4' />
                Back to Sign In
              </Link>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
