'use client';

import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useStore } from "@/store/useStore";

export default function LoginPage() {
  const { theme } = useStore();

  return (
    <SignIn 
      routing="path" 
      path="/login"
      signUpUrl="/signup" 
      forceRedirectUrl="/dashboard"
      appearance={{
        baseTheme: theme === 'dark' ? dark : undefined,
        variables: {
          colorPrimary: '#818cf8',
          colorBackground: theme === 'dark' ? '#0a0a0f' : '#ffffff',
          colorText: theme === 'dark' ? '#ffffff' : '#0f172a',
          colorTextSecondary: theme === 'dark' ? '#ffffff' : '#475569',
          colorInputBackground: theme === 'dark' ? '#050507' : '#f8fafc',
          colorInputText: theme === 'dark' ? '#ffffff' : '#0f172a',
          colorTextOnPrimaryButton: '#ffffff',
        },
        elements: {
          card: "glass-card",
          headerTitle: "gradient-text",
          formButtonPrimary: "btn-primary",
          footerActionLink: "text-accent",
        }
      }}
    />
  );
}
