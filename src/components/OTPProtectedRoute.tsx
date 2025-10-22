
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface OTPProtectedRouteProps {
  isOpen: boolean;
  onClose: () => void;
  targetRoute: string;
  title?: string;
}

export function OTPProtectedRoute({ 
  isOpen, 
  onClose, 
  targetRoute,
  title = "Security Verification Required"
}: OTPProtectedRouteProps) {
  const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(''));
  const navigate = useNavigate();
  const { toast } = useToast();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

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

  const handleNext = () => {
    const code = verificationCode.join('');
    if (code.length === 6) {
      // Simulate OTP verification
      toast({
        title: "Verification Successful",
        description: "Access granted to Document Vault",
      });
      onClose();
      navigate(targetRoute);
    } else {
      toast({
        title: "Invalid Code",
        description: "Please enter a valid 6-digit code",
        variant: "destructive"
      });
    }
  };

  const handleBack = () => {
    onClose();
  };

  const handleResendOTP = () => {
    setVerificationCode(Array(6).fill(''));
  };

  const isCodeComplete = verificationCode.join('').length === 6;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">
              Please verify your identity to access the Document Vault.
            </p>
            <p className="text-sm text-muted-foreground">
              Enter the 6-digit code we sent to +1****90.
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
                className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-lg focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            ))}
          </div>

          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">Didn't get the OTP?</p>
            <Button
              variant="link"
              onClick={handleResendOTP}
              className="text-primary p-0 h-auto"
            >
              Resend OTP
            </Button>
          </div>

          <div className="flex justify-between space-x-4">
            <Button variant="outline" onClick={handleBack} className="flex-1">
              Previous
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isCodeComplete}
              className="flex-1"
            >
              Next
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
