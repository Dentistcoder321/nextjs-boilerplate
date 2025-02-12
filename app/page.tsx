'use client';

import { HeroSection } from "@/components/blocks/hero-section";
import { WagmiConfig } from "wagmi";
import { config } from "@/config/wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function Home() {
  return (
    <WagmiConfig config={config}>
      <QueryClientProvider client={queryClient}>
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <HeroSection
            badge={{
              text: "Introducing DentalChain",
              action: {
                text: "Learn More",
                href: "#features",
              },
            }}
            title="Secure Dental Records on the Blockchain"
            description="A decentralized solution for managing dental records with enhanced security, transparency, and accessibility. Built for dentists and patients."
            actions={[
              {
                text: "Patient",
                href: "/patient",
                variant: "glow",
              },
              {
                text: "Dentist",
                href: "/dentist",
                variant: "default",
              },
            ]}
            image={{
              light: "/screenshots/dashboard-light.png",
              dark: "/screenshots/dashboard-dark.png",
              alt: "DentalChain Dashboard",
            }}
          />
        </main>
      </QueryClientProvider>
    </WagmiConfig>
  );
} 