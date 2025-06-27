'use client';

import { useActionState, useState } from 'react';
// import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import Image from 'next/image';
import { ActionState, loginAction } from '@/lib/actions';
// import logoToleka from '@/public/images/toleka-no-bg.png';

function SubmitButton({pending}: {pending: boolean}) {
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
          Connexion...
        </div>
      ) : (
        'Se connecter'
      )}
    </Button>
  );
}

export default function LoginPage() {
  const [state, action, pending] = useActionState<ActionState | undefined, FormData>(
    loginAction,
    undefined,
  );
  const [showPassword, setShowPassword] = useState(false);
  

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-effect">
        <CardHeader className="text-center space-y-4">
            <Image
              src="/images/toleka-no-bg.png"
              alt="Logo"
              width={256}
              height={256}
              className="mx-auto mb-2"
            />
          <div>
            <CardTitle className="text-2xl font-bold">{`Panel d'Administration`}</CardTitle>
            <CardDescription className="text-muted-foreground">
              Connectez-vous pour accéder au tableau de bord
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" action={action}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  name='email'
                  placeholder="admin@taxibooking.com"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  name='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>
            <SubmitButton pending={pending} />
            {state?.error && (
              <div className="text-red-500 text-sm mt-2">
                {state.error}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}