
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';

interface VerificationStepProps {
  selectedMethod: string;
  countryCode: string;
  phoneNumber: string;
  verificationCode: string[];
  onVerificationCodeChange: (code: string[]) => void;
  onNext: () => void;
  onBack: () => void;
  onResendOTP?: () => void;
  isLoading?: boolean;
}

export function VerificationStep({
  selectedMethod,
  countryCode,
  phoneNumber,
  verificationCode,
  onVerificationCodeChange,
  onNext,
  onBack,
  onResendOTP,
  isLoading = false
}: VerificationStepProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      onVerificationCodeChange(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOTP = () => {
    onVerificationCodeChange(['', '', '', '', '', '']);
  };

  const isCodeComplete = verificationCode.join('').length === 6;
  const displayNumber = selectedMethod === 'sms' 
    ? `${countryCode}****${phoneNumber.slice(-2)}` 
    : 'your email';

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Enter confirmation code</h2>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code we sent to {displayNumber}.
        </p>
        <p className="text-sm text-muted-foreground">
          It may take up to a minute for you to receive this code.
        </p>
      </div>

      <div className="flex justify-center gap-3">
        {verificationCode.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleCodeChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            disabled={isLoading}
            className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          />
        ))}
      </div>

      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">Didn't get the OTP?</p>
        <Button
          variant="link"
          onClick={onResendOTP || handleResendOTP}
          disabled={isLoading}
          className="text-primary p-0 h-auto"
        >
          {isLoading ? 'Sending...' : 'Resend OTP'}
        </Button>
      </div>

      <div className="flex justify-between space-x-4">
        <Button variant="outline" onClick={onBack} disabled={isLoading} className="flex-1">
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={!isCodeComplete || isLoading}
          className="flex-1"
        >
          {isLoading ? 'Verifying...' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
