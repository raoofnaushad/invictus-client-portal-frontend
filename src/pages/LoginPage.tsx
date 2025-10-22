
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { loginApi, LoginApiError } from "@/services/loginApi";
import { TestCredentials } from "@/components/TestCredentials";
import invictusLogo from "@/assets/invictus-logo.png";
import matarLogo from "@/assets/matar-partners-logo.png";

function LoginPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Clean tokens when login page loads
    loginApi.clearTokens();
  }, []);

  const [loginError, setLoginError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-US');

  const languages = [
    { code: 'en-US', label: 'English (US)', flag: '🇺🇸' },
    { code: 'ar', label: 'Arabic', flag: '🇸🇦' },
    { code: 'pl', label: 'Polish', flag: '🇵🇱' },
    { code: 'de', label: 'Germany', flag: '🇩🇪' }
  ];

  const handleLogin = async () => {
    setIsLoading(true);
    setLoginError(false);

    try {
      const response = await loginApi.login({
        username: email,
        password: password
      });

      // Store tokens
      loginApi.setTokens(response);
      
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      navigate('/dashboard', { replace: true });
    } catch (error) {
      setLoginError(true);
      let errorMessage = "Login failed. Please try again.";
      
      if (error instanceof LoginApiError) {
        switch (error.code) {
          case 'INVALID_CREDENTIALS':
            errorMessage = "Invalid email or password.";
            break;
          case 'NETWORK_ERROR':
            errorMessage = "Network error. Please check your connection.";
            break;
          default:
            errorMessage = error.message;
        }
      }
      
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCredentialSelect = (username: string, password: string) => {
    setEmail(username);
    setPassword(password);
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleForgotPassword = () => {
    toast({
      title: "Forgot Password",
      description: "Password reset functionality would be implemented here.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="w-full px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <img src={invictusLogo} alt="INVICTUS-AI" className="h-8" />
        </div>
        <div className="flex items-center">
          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-auto border-0 bg-transparent h-auto p-1 gap-1 hover:bg-gray-100 rounded-lg">
              <SelectValue>
                <div className="flex items-center gap-2">
                  <span className="text-lg">{languages.find(lang => lang.code === selectedLanguage)?.flag}</span>
                </div>
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg z-50">
              {languages.map((language) => (
                <SelectItem 
                  key={language.code} 
                  value={language.code}
                  className="flex items-center gap-2 px-4 py-2 pl-4 hover:bg-gray-100 cursor-pointer [&>span:first-child]:hidden"
                >
                  <span className="text-lg mr-2">{language.flag}</span>
                  <span className="text-sm text-gray-700">{language.label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 relative">
        {/* Test Credentials */}
        <div className="absolute top-8 left-8 z-10">
          <TestCredentials onCredentialSelect={handleCredentialSelect} />
        </div>
        {/* Login Card */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[464px] h-[552px] bg-white/80 backdrop-blur-[20px] rounded-[24px] shadow-[0_0_44px_rgba(0,0,0,0.04)] flex flex-col justify-center items-center p-10 gap-[38px]">
          {/* Logo */}
          <div className="w-[133px] h-[68px] flex-none">
            <img src={matarLogo} alt="Matar Partners" className="w-full h-full object-contain" />
          </div>

          {/* Text Section */}
          <div className="w-[374px] h-[60px] flex flex-col justify-center items-start gap-2 rounded-lg flex-none">
            <h1 className="w-[374px] h-8 text-2xl font-semibold leading-8 text-center text-black flex-none">
              Login
            </h1>
            <p className="w-[374px] h-5 text-sm font-normal leading-5 text-center text-[#4D4D4D] flex-none">
              Login with the data you entered during your registration.
            </p>
          </div>

          {/* Form Section */}
          <div className="w-96 h-[132px] flex flex-col items-end gap-4 flex-none">
            {/* Email Input */}
            <div className="w-96 min-w-[313px] h-10 bg-black/[0.04] rounded-xl flex flex-col justify-center items-start px-3 gap-1 flex-none">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-[360px] h-7 min-h-7 bg-transparent border-0 outline-none text-sm leading-5 placeholder:text-black/20 rounded-lg p-1"
              />
            </div>

            {/* Password Input */}
            <div className="w-96 min-w-[313px] h-10 bg-black/[0.04] rounded-xl flex flex-col justify-center items-start px-3 gap-1 flex-none">
              <div className="w-[360px] h-7 flex flex-row justify-between items-center gap-1">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 w-[329px] h-7 min-h-7 bg-transparent border-0 outline-none text-sm leading-5 placeholder:text-black/20 rounded-lg p-1"
                />
                <button
                  type="button"
                  onClick={handleClickShowPassword}
                  className="w-[31px] h-5 text-xs leading-5 flex items-center letter-spacing-[0.25px] underline text-black flex-none"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="w-[121px] h-5 rounded-lg flex-none">
              <button
                onClick={handleForgotPassword}
                className="w-[121px] h-5 text-sm font-medium leading-5 text-black"
              >
                Forgot Password?
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading || !email || !password}
            className="w-96 min-w-[313px] h-10 bg-black rounded-xl flex flex-row justify-center items-center px-4 py-2 gap-2 flex-none disabled:opacity-50"
          >
            <div className="w-[52px] h-6 rounded-lg flex-none">
              <span className="w-[52px] h-6 text-base font-normal leading-6 flex items-center text-center text-white">
                {isLoading ? 'Loading...' : 'Sign In'}
              </span>
            </div>
          </button>

          {/* Contact Link */}
          <div className="w-[169px] h-5 rounded-lg flex flex-col justify-center items-start flex-none">
            <button className="w-[169px] h-5 text-sm font-medium leading-5 text-black">
              Forgot Email? Contact Us
            </button>
          </div>

          {/* Error Message */}
          {loginError && (
            <p className="text-sm text-red-500 text-center">Invalid credentials</p>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full px-8 py-4 text-right">
        <p className="text-xs text-gray-400">© 2025 Invictus. All Right Reserved.</p>
      </footer>
    </div>
  );
}

export default LoginPage;
