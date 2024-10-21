'use client';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Icons } from '../ui/icons';
import { signInWithEmailPassword, signInWithGooglePopup } from '@/util/platform/firebase';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormMessage } from '../ui/form';

const formSchema = z.object({
  email: z.string().email({
    message: 'Invalid email address.'
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.'
  })
});

export default function LoginForm({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    signInWithEmailPassword(values.email, values.password).catch((error) => {
      console.error(error);
      setIsLoading(false);
      form.setError('password', {
        type: 'manual',
        message: 'Invalid email or password.'
      });
    });
  }

  async function handleSignInWithGoogle() {
    setIsLoading(true);
    signInWithGooglePopup().catch((error) => {
      console.error(error);
      setIsLoading(false);
    });
  }

  return (
    <div className={cn('grid gap-6', className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-2">
            <div className="grid gap-1">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="name@example.com" autoComplete="email" {...field} />
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
                    <FormControl>
                      <Input type="password" placeholder="password" autoComplete="current-password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" automation-id="btn-sign-in" disabled={isLoading}>
              {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </div>
        </form>
      </Form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <Button variant="outline" type="button" disabled={isLoading} onClick={handleSignInWithGoogle}>
        {isLoading ? <Icons.spinner className="mr-2 h-4 w-4 animate-spin" /> : <Icons.google className="mr-2 h-4 w-4" />} Google
      </Button>
    </div>
  );
}
