// app/layout.tsx
"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import MaxWidthWrapper from "./utility/MaxWidthWrapper";

const inter = Inter({ subsets: ["latin"] });
const queryClient = new QueryClient();

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={false} />
          <SidebarProvider>
            <div className="flex min-h-screen">
              {/* Sidebar: hidden on sm, shown on md+ */}
              <div className="hidden md:block w-72">
                <AppSidebar />
              </div>

              <div className="flex-1 flex flex-col">
                <MaxWidthWrapper>
                  <main className="flex-1 py-5 md:min-w-6xl">{children}</main>
                </MaxWidthWrapper>
              </div>
            </div>
          </SidebarProvider>
          <Toaster position="top-right" richColors />
        </QueryClientProvider>
      </body>
    </html>
  );
}
