
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PhoneNumberStepProps {
  countryCode: string;
  phoneNumber: string;
  onCountryCodeChange: (code: string) => void;
  onPhoneNumberChange: (number: string) => void;
  onNext: () => void;
  onBack: () => void;
  isLoading?: boolean;
}

export function PhoneNumberStep({
  countryCode,
  phoneNumber,
  onCountryCodeChange,
  onPhoneNumberChange,
  onNext,
  onBack,
  isLoading = false
}: PhoneNumberStepProps) {
  const countryCodes = [
    { value: '+1', label: 'USA (+1)' },
    { value: '+44', label: 'UK (+44)' },
    { value: '+91', label: 'India (+91)' },
    { value: '+216', label: 'TN (+216)' },
    { value: '+86', label: 'China (+86)' },
    { value: '+971', label: 'UAE (+971)' }
  ];

  const isValidPhoneNumber = (phone: string): boolean => {
    const onlyDigits = /^\d+$/;
    return phone === '' || (onlyDigits.test(phone) && phone.length <= 20);
  };

  const handlePhoneChange = (value: string) => {
    if (isValidPhoneNumber(value)) {
      onPhoneNumberChange(value);
    }
  };

  const isPhoneValid = phoneNumber && phoneNumber.length > 0;

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Enter your Mobile Phone Number</h2>
        <p className="text-sm text-muted-foreground">
          Enter your mobile number to receive authentication codes for Second Factor Authentication.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Country Code</Label>
          <Select value={countryCode} onValueChange={onCountryCodeChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {countryCodes.map((country) => (
                <SelectItem key={country.value} value={country.value}>
                  {country.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => handlePhoneChange(e.target.value)}
            placeholder="Enter Phone Number"
          />
        </div>

        <p className="text-sm text-muted-foreground">
          This phone number will be enabled for two-factor authentication and log in. 
          We may also use the number added here to help protect our community.
        </p>
      </div>

      <div className="flex justify-between space-x-4">
        <Button variant="outline" onClick={onBack} disabled={isLoading} className="flex-1">
          Previous
        </Button>
        <Button
          onClick={onNext}
          disabled={!isPhoneValid || isLoading}
          className="flex-1"
        >
          {isLoading ? 'Sending Code...' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
