"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { useEffect, useState } from "react";

interface ClerkProviderWrapperProps {
  children: React.ReactNode;
}

export function ClerkProviderWrapper({ children }: ClerkProviderWrapperProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by only rendering ClerkProvider after mount
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          <p className="text-sm text-muted-foreground">
            Loading authentication...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ClerkProvider
      appearance={{
        elements: {
          // Customize Clerk appearance if needed
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
