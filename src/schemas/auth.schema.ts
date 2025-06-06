import { object, string, type z } from 'zod';

const getPasswordSchema = (type: 'password' | 'confirmPassword') =>
  string({ required_error: `${type} is required` })
    .min(8, `${type} must be atleast 8 characters`)
    .max(32, `${type} can not exceed 32 characters`);

const getEmailSchema = () =>
  string({ required_error: 'Email is required' })
    .min(1, 'Email is required')
    .email('Invalid email');

const getNameSchema = () =>
  string({ required_error: 'Name is required' })
    .min(1, 'Name is required')
    .max(50, 'Name must be less than 50 characters');

export const signUpSchema = object({
  name: getNameSchema(),
  email: getEmailSchema(),
  password: getPasswordSchema('password'),
  confirmPassword: getPasswordSchema('confirmPassword'),
  image: string().optional()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

export const signInSchema = object({
  email: getEmailSchema(),
  password: getPasswordSchema('password')
});

export const signInWithMagicLinkSchema = object({
  email: getEmailSchema()
});

export const resendVerificationEmailSchema = object({
  email: getEmailSchema()
});

export const forgotPasswordSchema = object({
  email: getEmailSchema()
});

export const resetPasswordSchema = object({
  token: string({ required_error: 'Token is required' }),
  password: getPasswordSchema('password'),
  confirmPassword: getPasswordSchema('confirmPassword')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

export type SignUpSchema = z.infer<typeof signUpSchema>;
export type SignInSchema = z.infer<typeof signInSchema>;
export type SignInWithMagicLinkSchema = z.infer<
  typeof signInWithMagicLinkSchema
>;

export type ResendVerificationEmailSchema = z.infer<
  typeof resendVerificationEmailSchema
>;
export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
