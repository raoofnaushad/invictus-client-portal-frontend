import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Mail, MessageSquare } from 'lucide-react';

interface MfaConfirmationStepProps {
  selectedMethod: string;
  onNext: () => void;
  onBack: () => void;
}

export function MfaConfirmationStep({
  selectedMethod,
  onNext,
  onBack
}: MfaConfirmationStepProps) {
  const methodIcon = selectedMethod === 'sms' ? MessageSquare : Mail;
  const methodName = selectedMethod === 'sms' ? 'Text Message' : 'Email';

  return (
    <div className="space-y-6 text-center">
      <div className="space-y-4">
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Two-Factor Authentication Enabled!</h2>
          <p className="text-sm text-muted-foreground">
            Your account is now secured with two-factor authentication.
          </p>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-4">
          <div className="flex items-center justify-center space-x-2 mb-2">
            {React.createElement(methodIcon, { className: "h-5 w-5" })}
            <span className="font-medium">{methodName}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            You'll receive a verification code via {methodName.toLowerCase()} when signing in.
          </p>
        </div>
      </div>

      <div className="flex justify-between space-x-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={onNext} className="flex-1">
          Complete
        </Button>
      </div>
    </div>
  );
}