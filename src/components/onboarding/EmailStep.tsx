
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EmailStepProps {
  email: string;
  onEmailChange: (email: string) => void;
  onNext: () => void;
}

export function EmailStep({ email, onEmailChange, onNext }: EmailStepProps) {
  const [canChangeEmail, setCanChangeEmail] = useState(false);

  const isEmailValid = email && email.includes('@');

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Confirm or Change Your Username</h2>
        <p className="text-sm text-muted-foreground">
          Your email address will be your username for signing into your account.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            readOnly={!canChangeEmail}
            className={!canChangeEmail ? "bg-muted" : ""}
          />
        </div>

        <div className="text-center">
          <Button
            variant="link"
            onClick={() => setCanChangeEmail(!canChangeEmail)}
            className="text-primary"
          >
            Change email
          </Button>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onNext}
          disabled={!isEmailValid}
          className="w-full max-w-xs"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
