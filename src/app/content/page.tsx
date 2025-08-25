"use client";

import { ContentAnalyser } from "@/components/content/content-analyser";
import { ImageGenerator } from "@/components/content/image-generator";
import VideoClipper from "@/components/content/video-clipper";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SSOButton } from "@/components/unified/sso-button";
import { BarChart3, Key, Palette, Scissors } from "lucide-react";
import { useSearchParams } from "next/navigation";

export default function ContentPage() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") || "clipper";

  return (
    <div className="space-y-8">
      {/* Main Content Tabs */}
      <div className="border rounded-xl p-6 bg-white shadow-sm">
        <Tabs value={activeTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-14">
            <TabsTrigger
              value="analyser"
              className="flex items-center gap-2 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
            >
              <BarChart3 className="h-4 w-4" />
              Content Analyser
            </TabsTrigger>
            <TabsTrigger
              value="generator"
              className="flex items-center gap-2 data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 data-[state=active]:border-purple-200"
            >
              <Palette className="h-4 w-4" />
              Image Generator
            </TabsTrigger>
            <TabsTrigger
              value="clipper"
              className="flex items-center gap-2 data-[state=active]:bg-green-100 data-[state=active]:text-green-700 data-[state=active]:border-green-200"
            >
              <Scissors className="h-4 w-4" />
              Video Clipper
            </TabsTrigger>
            <TabsTrigger
              value="sso"
              className="flex items-center gap-2 data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 data-[state=active]:border-orange-200"
            >
              <Key className="h-4 w-4" />
              SSO Generator
            </TabsTrigger>
          </TabsList>

          {/* Content Analyser Tab */}
          <TabsContent value="analyser" className="space-y-6">
            <ContentAnalyser />
          </TabsContent>

          {/* Image Generator Tab */}
          <TabsContent value="generator" className="space-y-6">
            <ImageGenerator />
          </TabsContent>

          {/* Video Clipper Tab */}
          <TabsContent value="clipper" className="space-y-6">
            <VideoClipper />
          </TabsContent>

          {/* SSO Generator Tab */}
          <TabsContent value="sso" className="space-y-6">
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  Single Sign-On (SSO) URL Generator
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Generate secure authentication URLs to connect your social
                  media accounts to the Ayrshare platform without sharing
                  sensitive credentials.
                </p>
              </div>

              <div className="max-w-3xl mx-auto">
                <SSOButton showDetails={true} />
              </div>

              <div className="max-w-4xl mx-auto space-y-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      What is SSO?
                    </h3>
                    <div className="space-y-3 text-gray-700 leading-relaxed">
                      <p>
                        <strong>Single Sign-On (SSO)</strong> is a secure
                        authentication method that allows users to access
                        multiple applications with a single set of credentials.
                      </p>
                      <p>
                        In the context of Ayrshare, SSO enables you to connect
                        your social media accounts (Twitter, Facebook,
                        Instagram, etc.) without sharing your passwords or login
                        credentials.
                      </p>
                      <p>
                        The system generates a secure, time-limited URL that
                        provides temporary access to connect your accounts
                        securely.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2">
                      How to Use
                    </h3>
                    <div className="space-y-3 text-gray-700 leading-relaxed">
                      <ol className="list-decimal list-inside space-y-2">
                        <li>
                          Click the <strong>&quot;Generate SSO&quot;</strong>{" "}
                          button above
                        </li>
                        <li>Wait for the secure URL to be generated</li>
                        <li>Copy the generated URL to your clipboard</li>
                        <li>Open the URL in a new browser tab</li>
                        <li>
                          Follow the authentication prompts to connect your
                          social accounts
                        </li>
                        <li>
                          The URL will expire after a set time for security
                        </li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-blue-900 mb-3">
                    Security Features
                  </h4>
                  <ul className="space-y-2 text-blue-800">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Time-limited URLs that expire automatically</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>No password or credential sharing required</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>Secure token-based authentication</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>One-time use URLs for enhanced security</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
