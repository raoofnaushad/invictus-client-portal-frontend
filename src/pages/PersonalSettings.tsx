
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { profileApi, ProfileResponse, ProfileApiError } from "@/services/profileApi";
import { settingsApi, SettingsApiError } from "@/services/settingsApi";
import { MfaSetupModal } from "@/components/mfa/MfaSetupModal";

const PersonalSettings: React.FC = () => {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [togglingMfa, setTogglingMfa] = useState<boolean>(false);
  const [showMfaSetup, setShowMfaSetup] = useState<boolean>(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await profileApi.getProfile();
        setProfile(profileData);
        setFullName(profileData.userCredential.fullName);
        setEmail(profileData.userCredential.username);
        setPhoneNumber(profileData.userCredential.phoneNumber);
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async (): Promise<void> => {
    if (!profile) return;
    
    setSaving(true);
    try {
      await settingsApi.updateSettings({
        fullName,
        phoneNumber,
        organizationName: profile.alias,
        email,
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      if (error instanceof SettingsApiError) {
        toast.error(error.message);
      } else {
        toast.error('Failed to save changes');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleMfaToggle = async (): Promise<void> => {
    if (!profile) return;
    
    // If MFA is already activated, disable it directly
    if (profile.userCredential.mfaActivated) {
      setTogglingMfa(true);
      try {
        await profileApi.toggleMfa({ enable: false });
        
        // Update local state
        setProfile(prev => prev ? {
          ...prev,
          userCredential: {
            ...prev.userCredential,
            mfaActivated: false,
            mfaChannel: null
          }
        } : null);
        
        toast.success('MFA disabled successfully');
      } catch (error) {
        console.error('Error disabling MFA:', error);
        if (error instanceof ProfileApiError) {
          toast.error(error.message);
        } else {
          toast.error('Failed to disable MFA');
        }
      } finally {
        setTogglingMfa(false);
      }
    } else {
      // If MFA is not activated, open setup modal
      setShowMfaSetup(true);
    }
  };

  const handleMfaSetupSuccess = () => {
    // Update local state to reflect MFA activation
    setProfile(prev => prev ? {
      ...prev,
      userCredential: {
        ...prev.userCredential,
        mfaActivated: true
      }
    } : null);
    
    toast.success('MFA enabled successfully');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-32 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-foreground">Personal Settings</h1>
          <div className="space-x-2">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  disabled
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <Button variant="outline" className="w-48">
                    Change Password
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleMfaToggle}
                  disabled={togglingMfa}
                >
                  {togglingMfa 
                    ? "Updating..." 
                    : profile?.userCredential.mfaActivated 
                      ? "Disable Two Factor Authentication (2FA)" 
                      : "Enable Two Factor Authentication (2FA)"
                  }
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <MfaSetupModal
        open={showMfaSetup}
        onClose={() => setShowMfaSetup(false)}
        onSuccess={handleMfaSetupSuccess}
        userEmail={email}
        userPhone={phoneNumber}
      />
    </div>
  );
};

export default PersonalSettings;