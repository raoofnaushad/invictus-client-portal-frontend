import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TEST_TOKENS } from "@/services/onboardingApi";

interface TestTokensProps {
  currentToken?: string;
  onTokenSelect: (token: string) => void;
}

export const TestTokens = ({ currentToken, onTokenSelect }: TestTokensProps) => {
  const tokens = [
    { label: "✅ Working Token", value: TEST_TOKENS.WORKING, description: "Complete flow successfully" },
    { label: "❌ Invalid Token", value: TEST_TOKENS.INVALID, description: "401 error - Invalid token" },
    { label: "⚠️ Not Eligible", value: TEST_TOKENS.NOT_ELIGIBLE, description: "Wrong account status" },
    { label: "📱 MFA Error", value: TEST_TOKENS.MFA_ERROR, description: "Error sending verification code" },
    { label: "🔢 Confirm Error", value: TEST_TOKENS.CONFIRM_ERROR, description: "Error confirming OTP (use 123456 to pass)" },
  ];

  if (!import.meta.env.DEV) return null;

  return (
    <Card className="mt-4 border-dashed border-amber-300">
      <CardHeader>
        <CardTitle className="text-sm text-amber-600">🔧 Developer Test Tokens</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {tokens.map((token) => (
          <div key={token.value} className="flex items-center justify-between p-2 rounded bg-muted/50">
            <div className="flex-1">
              <div className="text-sm font-medium">{token.label}</div>
              <div className="text-xs text-muted-foreground">{token.description}</div>
              <div className="text-xs font-mono text-muted-foreground mt-1">{token.value}</div>
            </div>
            <Button
              size="sm"
              variant={currentToken === token.value ? "default" : "outline"}
              onClick={() => onTokenSelect(token.value)}
              className="ml-2"
            >
              {currentToken === token.value ? "Current" : "Use"}
            </Button>
          </div>
        ))}
        <div className="text-xs text-muted-foreground mt-4 p-2 bg-blue-50 dark:bg-blue-950/20 rounded">
          💡 <strong>Testing Tips:</strong>
          <br />• Use OTP "123456" for successful verification
          <br />• Password must be at least 6 characters
          <br />• Mock APIs have realistic delays for testing
        </div>
      </CardContent>
    </Card>
  );
};