import { ClerkProviderWrapper } from "@/components/clerk-provider-wrapper";
import { TopNavigation } from "@/components/top-navigation";
import { ProfileProvider } from "@/contexts/profile-context";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ayrshare Social Media Manager",
  description: "Manage your social media accounts across all platforms",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProviderWrapper>
          <ProfileProvider>
            <TopNavigation />
            {children}
          </ProfileProvider>
        </ClerkProviderWrapper>
      </body>
    </html>
  );
}
