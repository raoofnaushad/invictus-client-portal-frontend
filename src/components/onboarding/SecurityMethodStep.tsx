
import React from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, MessageSquare, Ban } from 'lucide-react';

interface SecurityMethodStepProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function SecurityMethodStep({
  selectedMethod,
  onMethodChange,
  onNext,
  onBack
}: SecurityMethodStepProps) {
  const methods = [
    {
      value: 'sms',
      icon: MessageSquare,
      title: 'Text Message',
      description: "We'll send a code to the number you choose.",
      recommended: true
    },
    {
      value: 'email',
      icon: Mail,
      title: 'Email',
      description: "We'll send a code to your email.",
      recommended: false
    },
    {
      value: 'skip',
      icon: Ban,
      title: 'Skip Second Factor Authentication',
      description: 'You can always set up two-factor authentication later',
      recommended: false
    }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold">Set Up Your Two-Factor Authentication</h2>
        <p className="text-sm text-muted-foreground">
          To complete your security settings, choose your authentication method.
        </p>
      </div>

      <div className="space-y-4">
        <Label className="text-sm font-medium">Select your preferred authentication method</Label>
        
        <RadioGroup value={selectedMethod} onValueChange={onMethodChange}>
          {methods.map((method) => {
            const Icon = method.icon;
            return (
              <Card key={method.value} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start space-x-3">
                      <Icon className="h-5 w-5 mt-0.5" />
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <Label className="font-medium">{method.title}</Label>
                          {method.recommended && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              Recommended
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {method.description}
                        </p>
                      </div>
                    </div>
                    <RadioGroupItem value={method.value} id={method.value} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </RadioGroup>
      </div>

      <div className="flex justify-between space-x-4">
        <Button variant="outline" onClick={onBack} className="flex-1">
          Previous
        </Button>
        <Button onClick={onNext} className="flex-1">
          Next
        </Button>
      </div>
    </div>
  );
}
