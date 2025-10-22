
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Check, X } from 'lucide-react';

interface PasswordStepProps {
  password: string;
  confirmPassword: string;
  onPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (confirmPassword: string) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function PasswordStep({
  password,
  confirmPassword,
  onPasswordChange,
  onConfirmPasswordChange,
  onNext,
  onBack,
  isLoading = false
}: PasswordStepProps) {
  const requirements = {
    length: password.length >= 8 && password.length <= 30,
    uppercase: /[A-Z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+.]/.test(password),
    confirmation: password === confirmPassword && password !== ''
  };

  const allRequirementsMet = Object.values(requirements).every(Boolean);

  const RequirementItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className="flex items-center space-x-2 text-sm">
      {met ? (
        <Check className="h-4 w-4 text-green-600" />
      ) : (
        <X className="h-4 w-4 text-gray-400" />
      )}
      <span className={met ? "text-green-600" : "text-gray-600"}>{text}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Create Your Password</h2>
        <p className="text-sm text-muted-foreground">
          Enter your new password following the guidelines below.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">New Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Enter Password"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Enter New Password Again</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => onConfirmPasswordChange(e.target.value)}
            placeholder="Re-enter Password"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">Password must contain:</Label>
          <div className="space-y-2">
            <RequirementItem met={requirements.length} text="8 to 30 characters" />
            <RequirementItem met={requirements.uppercase} text="Uppercase and lowercase letters" />
            <RequirementItem met={requirements.number} text="At least 1 number" />
            <RequirementItem met={requirements.special} text='At least 1 special character "!@#$%^&*()_+."' />
            <RequirementItem met={requirements.confirmation} text="Passwords match" />
          </div>
        </div>
      </div>

      <div className="flex justify-between space-x-4">
        <Button variant="outline" onClick={onBack} disabled={isLoading} className="flex-1">
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={!allRequirementsMet || isLoading}
          className="flex-1"
        >
          {isLoading ? 'Setting Password...' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
