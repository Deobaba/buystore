'use client';

import { useForm } from 'react-hook-form';
import Link from "next/link";
import { zodResolver } from '@hookform/resolvers/zod';
import { signInSchema, SignInData } from '@/validation/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const SignInForm = () => {
  const form = useForm<SignInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });

  const handleSubmit = (data: SignInData) => {
    console.log(data);
    // Handle sign-in logic here
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <h2 className="text-2xl text-center mb-4">Sign In</h2>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  value={field.value ?? ''}
                  type="email"
                  placeholder="Enter your email" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  {...field}
                  value={field.value ?? ''}
                  type="password" 
                  placeholder="Enter your password" 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Sign In
        </Button>
        
        <p className="text-center">
          Don't have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline">
            Create Account
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default SignInForm;