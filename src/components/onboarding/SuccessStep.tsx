
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

interface SuccessStepProps {
  onContinue: () => void;
}

export function SuccessStep({ onContinue }: SuccessStepProps) {
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-600" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Success!</h2>
        <h3 className="text-lg font-medium">Your Security Settings have been Saved</h3>
      </div>

      <p className="text-sm text-muted-foreground">
        Your security settings have been saved for user ID, password and for
        receiving authentication codes to your mobile phone number.
      </p>

      <Button onClick={onContinue} className="w-full max-w-xs">
        Continue to Login
      </Button>
    </div>
  );
}
