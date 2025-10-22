
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { EmailStep } from '@/components/onboarding/EmailStep';
import { PasswordStep } from '@/components/onboarding/PasswordStep';
import { SecurityMethodStep } from '@/components/onboarding/SecurityMethodStep';
import { PhoneNumberStep } from '@/components/onboarding/PhoneNumberStep';
import { VerificationStep } from '@/components/onboarding/VerificationStep';
import { SuccessStep } from '@/components/onboarding/SuccessStep';
import { TestTokens } from '@/components/onboarding/TestTokens';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { onboardingApi, OnboardingApiError, ProfileResponse } from '@/services/onboardingApi';

const OnboardingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('sms');
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(''));
  const [isLoading, setIsLoading] = useState(true);
  const [stepLoading, setStepLoading] = useState(false);
  const [activationToken, setActivationToken] = useState('');
  const [tempPassword, setTempPassword] = useState('');
  const [profile, setProfile] = useState<ProfileResponse | null>(null);

  useEffect(() => {
    const activationToken = searchParams.get('activationToken');
    
    if (!activationToken) {
      toast({
        title: "Missing Activation Token",
        description: "Please contact Asbitech to create an account.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    fetchProfileByActivationToken(activationToken);
  }, [searchParams]);

  const fetchProfileByActivationToken = async (token: string) => {
    try {
      const profileData = await onboardingApi.getProfileByActivationToken(token);
      
      // Set the fetched data
      setEmail(profileData.userCredential?.username || '');
      setFullName(profileData.userCredential?.fullName || '');
      setActivationToken(token);
      setProfile(profileData);
      setIsLoading(false);

    } catch (error) {
      console.error('Error fetching profile:', error);
      
      if (error instanceof OnboardingApiError) {
        if (error.code === 'INVALID_TOKEN') {
          toast({
            title: "Invalid Activation Token",
            description: "Please contact Asbitech to create an account.",
            variant: "destructive",
          });
        } else if (error.code === 'ACCOUNT_NOT_ELIGIBLE') {
          toast({
            title: "Account Not Eligible",
            description: "Please contact Asbitech to create an account.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: error.message || "Failed to load account details. Please contact Asbitech to create an account.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to load account details. Please contact Asbitech to create an account.",
          variant: "destructive",
        });
      }
      
      setIsLoading(false);
    }
  };

  const steps = ['Email', 'Password', 'Security Method', 'Phone Number', 'Verification', 'Success'];
  const progressValue = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleContinue = () => {
    // Navigate to login page after successful onboarding
    navigate('/login');
  };

  const handlePasswordNext = async () => {
    setStepLoading(true);
    try {
      // Use activation token as temporary password
      setTempPassword(activationToken);
      
      const updatedProfile = await onboardingApi.activateAccount({
        activationToken,
        tempPassword: activationToken,
        newPassword: password,
      });
      
      setProfile(updatedProfile);
      // Use the new activation token from the response for MFA operations
      if (updatedProfile.userCredential?.activationToken) {
        setActivationToken(updatedProfile.userCredential.activationToken);
      }
      
      if (updatedProfile.userCredential?.status === 'PENDING_MFA_ACTIVATION') {
        toast({
          title: "Password Set Successfully",
          description: "Please set up multi-factor authentication.",
          variant: "default",
        });
        handleNext();
      } else {
        toast({
          title: "Account Activated",
          description: "Your account has been successfully activated.",
          variant: "default",
        });
        setCurrentStep(5); // Go to success step
      }
    } catch (error) {
      console.error('Error activating account:', error);
      if (error instanceof OnboardingApiError) {
        toast({
          title: "Activation Failed",
          description: error.message || "Failed to activate account. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Activation Failed",
          description: "Failed to activate account. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setStepLoading(false);
    }
  };

  const handleMfaNext = async () => {
    setStepLoading(true);
    try {
      const request = {
        activationToken,
        channel: selectedMethod as 'sms' | 'email',
        ...(selectedMethod === 'sms' 
          ? { phoneNumber: `${countryCode}${phoneNumber}` }
          : { email }
        )
      };

      await onboardingApi.activateMfa(request);
      
      toast({
        title: "Verification Code Sent",
        description: `A verification code has been sent to your ${selectedMethod === 'sms' ? 'phone' : 'email'}.`,
        variant: "default",
      });
      
      handleNext();
    } catch (error) {
      console.error('Error activating MFA:', error);
      if (error instanceof OnboardingApiError) {
        toast({
          title: "MFA Activation Failed",
          description: error.message || "Failed to activate MFA. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "MFA Activation Failed",
          description: "Failed to activate MFA. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setStepLoading(false);
    }
  };

  const handleVerificationNext = async () => {
    setStepLoading(true);
    try {
      await onboardingApi.confirmMfa({
        activationToken,
        otp: verificationCode.join(''),
      });
      
      toast({
        title: "Account Setup Complete",
        description: "Your account has been successfully set up.",
        variant: "default",
      });
      
      handleNext();
    } catch (error) {
      console.error('Error confirming MFA:', error);
      if (error instanceof OnboardingApiError) {
        toast({
          title: "Verification Failed",
          description: error.message || "Invalid verification code. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Verification Failed",
          description: "Invalid verification code. Please try again.",
          variant: "destructive",
        });
      }
      // Reset verification code on error
      setVerificationCode(Array(6).fill(''));
    } finally {
      setStepLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setStepLoading(true);
    try {
      const request = {
        activationToken,
        channel: selectedMethod as 'sms' | 'email',
        ...(selectedMethod === 'sms' 
          ? { phoneNumber: `${countryCode}${phoneNumber}` }
          : { email }
        )
      };

      await onboardingApi.activateMfa(request);
      
      toast({
        title: "Code Resent",
        description: `A new verification code has been sent to your ${selectedMethod === 'sms' ? 'phone' : 'email'}.`,
        variant: "default",
      });
      
      setVerificationCode(Array(6).fill(''));
    } catch (error) {
      console.error('Error resending OTP:', error);
      toast({
        title: "Resend Failed",
        description: "Failed to resend verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setStepLoading(false);
    }
  };

  const handleTokenSelect = (token: string) => {
    setActivationToken(token);
    setCurrentStep(0);
    setIsLoading(true);
    fetchProfileByActivationToken(token);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <EmailStep
            email={email}
            onEmailChange={setEmail}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <PasswordStep
            password={password}
            confirmPassword={confirmPassword}
            onPasswordChange={setPassword}
            onConfirmPasswordChange={setConfirmPassword}
            onNext={handlePasswordNext}
            onBack={handleBack}
            isLoading={stepLoading}
          />
        );
      case 2:
        return (
          <SecurityMethodStep
            selectedMethod={selectedMethod}
            onMethodChange={setSelectedMethod}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <PhoneNumberStep
            countryCode={countryCode}
            phoneNumber={phoneNumber}
            onCountryCodeChange={setCountryCode}
            onPhoneNumberChange={setPhoneNumber}
            onNext={handleMfaNext}
            onBack={handleBack}
            isLoading={stepLoading}
          />
        );
      case 4:
        return (
          <VerificationStep
            selectedMethod={selectedMethod}
            countryCode={countryCode}
            phoneNumber={phoneNumber}
            verificationCode={verificationCode}
            onVerificationCodeChange={setVerificationCode}
            onNext={handleVerificationNext}
            onBack={handleBack}
            onResendOTP={handleResendOTP}
            isLoading={stepLoading}
          />
        );
      case 5:
        return (
          <SuccessStep
            onContinue={handleContinue}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-semibold">
              Welcome, Register for
              <br />
              Asbitech's Client Portal
            </h1>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
                <p className="text-muted-foreground">Loading your account details...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-semibold">
            Welcome, Register for
            <br />
            Asbitech's Client Portal
          </h1>
          
          <div className="w-full">
            <Progress value={progressValue} variant="success" className="h-2" />
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {renderStep()}
          </CardContent>
        </Card>

        {import.meta.env.DEV && (
          <TestTokens 
            currentToken={activationToken} 
            onTokenSelect={handleTokenSelect} 
          />
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
