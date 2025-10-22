import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TEST_CREDENTIALS } from "@/services/loginApi";

interface TestCredentialsProps {
  onCredentialSelect: (username: string, password: string) => void;
}

export const TestCredentials = ({ onCredentialSelect }: TestCredentialsProps) => {
  return (
    <Card className="w-full max-w-md mx-auto mb-6">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Test Credentials</CardTitle>
        <CardDescription className="text-xs">
          Click to quickly fill in credentials for testing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-xs"
          onClick={() => onCredentialSelect(TEST_CREDENTIALS.VALID.username, TEST_CREDENTIALS.VALID.password)}
        >
          ✅ Valid Login: {TEST_CREDENTIALS.VALID.username}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-xs"
          onClick={() => onCredentialSelect(TEST_CREDENTIALS.INVALID.username, TEST_CREDENTIALS.INVALID.password)}
        >
          ❌ Invalid Credentials
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start text-xs"
          onClick={() => onCredentialSelect(TEST_CREDENTIALS.NETWORK_ERROR.username, TEST_CREDENTIALS.NETWORK_ERROR.password)}
        >
          🌐 Network Error
        </Button>
      </CardContent>
    </Card>
  );
};