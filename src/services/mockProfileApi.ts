import { ProfileResponse, UpdateProfileRequest, MfaToggleRequest, InitiateMfaRequest, ConfirmMfaRequest } from './profileApi';

// Mock profile data
let mockProfile: ProfileResponse = {
  id: "pcl-c71cbd65-6c75-489e-98c6-94d487c48162",
  createdAt: "2025-09-26T11:44:04.49762373",
  updatedAt: "2025-09-26T11:44:04.497625936",
  lasEventType: null,
  lastEventAt: null,
  businessSpecInfo: null,
  alias: "est9990",
  principalType: null,
  individualSpecInfo: null,
  phoneNumbers: null,
  emails: null,
  thirdPartyConnections: null,
  userCredential: {
    id: "ucd-73fdf5d5-25d9-4688-832b-6e40310d37aa",
    createdAt: "2025-09-26T11:44:04.497571361",
    updatedAt: "2025-09-26T11:44:04.497579666",
    lasEventType: null,
    lastEventAt: null,
    username: "est937701@gmail.com",
    fullName: "est9990",
    phoneNumber: "+21621131881",
    iamUserId: "bb4ce0c4-f16e-482f-8b16-9f5faa604c89",
    status: "PENDING_EMAIL_VERIFICATION",
    activationToken: "UrC7m7k52D0ZLgikO.lh7XFFOYydUo",
    activationTokenExpiry: "2025-09-28T11:44:04.497582696",
    mfaActivated: false,
    mfaChannel: null,
    totpSecret: null,
    refreshToken: null,
    isNew: true,
    authResponse: null
  },
  isNew: true
};

export const mockProfileApi = {
  async getProfile(): Promise<ProfileResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return { ...mockProfile };
  },

  async updateProfile(request: UpdateProfileRequest): Promise<ProfileResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Update mock data
    if (request.fullName) {
      mockProfile.userCredential.fullName = request.fullName;
    }
    if (request.phoneNumber) {
      mockProfile.userCredential.phoneNumber = request.phoneNumber;
    }
    if (request.alias) {
      mockProfile.alias = request.alias;
    }
    
    // Update timestamps
    mockProfile.updatedAt = new Date().toISOString();
    mockProfile.userCredential.updatedAt = new Date().toISOString();
    
    return { ...mockProfile };
  },

  async toggleMfa(request: MfaToggleRequest): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    mockProfile.userCredential.mfaActivated = request.enable;
    mockProfile.userCredential.mfaChannel = request.enable ? 'sms' : null;
    mockProfile.userCredential.updatedAt = new Date().toISOString();
    mockProfile.updatedAt = new Date().toISOString();
  },

  async initiateMfa(request: InitiateMfaRequest): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('MFA initiation request sent:', request);
  },

  async confirmMfa(request: ConfirmMfaRequest): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock validation - accept any 6-digit code
    if (request.code.length !== 6) {
      throw new Error('Invalid verification code');
    }
    
    // Enable MFA after successful confirmation
    mockProfile.userCredential.mfaActivated = true;
    mockProfile.userCredential.mfaChannel = request.method;
    mockProfile.userCredential.updatedAt = new Date().toISOString();
    mockProfile.updatedAt = new Date().toISOString();
  },
};