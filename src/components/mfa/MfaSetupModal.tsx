import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { SecurityMethodStep } from '@/components/onboarding/SecurityMethodStep';
import { VerificationStep } from '@/components/onboarding/VerificationStep';
import { MfaConfirmationStep } from './MfaConfirmationStep';
import { profileApi, ProfileApiError } from '@/services/profileApi';
import { toast } from 'sonner';

interface MfaSetupModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userEmail: string;
  userPhone: string;
}

type MfaStep = 'method' | 'verification' | 'confirmation';

export function MfaSetupModal({ 
  open, 
  onClose, 
  onSuccess,
  userEmail,
  userPhone 
}: MfaSetupModalProps) {
  const [currentStep, setCurrentStep] = useState<MfaStep>('method');
  const [selectedMethod, setSelectedMethod] = useState<string>('sms');
  const [verificationCode, setVerificationCode] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const handleMethodNext = async () => {
    if (selectedMethod === 'skip') {
      onClose();
      return;
    }

    setIsLoading(true);
    try {
      // Initiate MFA setup
      await profileApi.initiateMfa({ method: selectedMethod as 'sms' | 'email' });
      setCurrentStep('verification');
    } catch (error) {
      console.error('Error initiating MFA:', error);
      if (error instanceof ProfileApiError) {
        toast.error(error.message);
      } else {
        toast.error('Failed to initiate MFA setup');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationNext = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) return;

    setIsLoading(true);
    try {
      // Confirm MFA setup
      await profileApi.confirmMfa({ 
        method: selectedMethod as 'sms' | 'email',
        code 
      });
      setCurrentStep('confirmation');
    } catch (error) {
      console.error('Error confirming MFA:', error);
      if (error instanceof ProfileApiError) {
        toast.error(error.message);
      } else {
        toast.error('Invalid verification code');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      await profileApi.initiateMfa({ method: selectedMethod as 'sms' | 'email' });
      setVerificationCode(['', '', '', '', '', '']);
      toast.success('Verification code sent');
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast.error('Failed to resend verification code');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmationNext = () => {
    onSuccess();
    onClose();
  };

  const handleBack = () => {
    if (currentStep === 'verification') {
      setCurrentStep('method');
    } else if (currentStep === 'confirmation') {
      setCurrentStep('verification');
    }
  };

  const handleClose = () => {
    setCurrentStep('method');
    setSelectedMethod('sms');
    setVerificationCode(['', '', '', '', '', '']);
    setIsLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {currentStep === 'method' && (
          <SecurityMethodStep
            selectedMethod={selectedMethod}
            onMethodChange={setSelectedMethod}
            onNext={handleMethodNext}
            onBack={handleClose}
          />
        )}
        
        {currentStep === 'verification' && (
          <VerificationStep
            selectedMethod={selectedMethod}
            countryCode=""
            phoneNumber={userPhone}
            verificationCode={verificationCode}
            onVerificationCodeChange={setVerificationCode}
            onNext={handleVerificationNext}
            onBack={handleBack}
            onResendOTP={handleResendOTP}
            isLoading={isLoading}
          />
        )}
        
        {currentStep === 'confirmation' && (
          <MfaConfirmationStep
            selectedMethod={selectedMethod}
            onNext={handleConfirmationNext}
            onBack={handleBack}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}