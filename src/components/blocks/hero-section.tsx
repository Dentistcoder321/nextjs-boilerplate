'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, UserCircle, ClipboardList, Lock, Stethoscope, User, Wallet } from 'lucide-react';
import { cn } from "@/lib/utils";
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';

const features = [
  {
    title: "Secure Storage",
    description: "Your dental records are encrypted and stored securely on the blockchain",
    icon: Shield,
    color: "text-blue-500",
    gradient: "from-blue-500/10 to-transparent",
    delay: 400
  },
  {
    title: "Easy Access",
    description: "Access your records anytime, anywhere with proper authentication",
    icon: UserCircle,
    color: "text-purple-500",
    gradient: "from-purple-500/10 to-transparent",
    delay: 500
  },
  {
    title: "Complete History",
    description: "Maintain a comprehensive history of all dental procedures",
    icon: ClipboardList,
    color: "text-pink-500",
    gradient: "from-pink-500/10 to-transparent",
    delay: 600
  },
  {
    title: "Privacy Control",
    description: "Full control over who can access your dental records",
    icon: Lock,
    color: "text-emerald-500",
    gradient: "from-emerald-500/10 to-transparent",
    delay: 700
  }
];

export function HeroSection() {
  const { open } = useWeb3Modal();
  const { isConnected, address } = useAccount();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRoleSelection = async (role: 'dentist' | 'patient') => {
    if (!isConnected) {
      await open();
      return;
    }
    router.push(`/${role}-dashboard`);
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-bl from-blue-100/30 to-transparent dark:from-blue-500/10 rounded-full transform rotate-45"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-purple-100/30 to-transparent dark:from-purple-500/10 rounded-full transform -rotate-45"></div>
      </div>

      {/* Wallet Status */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={() => open()}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white/90 dark:hover:bg-gray-800/90 transition-all"
        >
          <Wallet className="w-4 h-4 mr-2" />
          {isConnected ? (
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              {`${address?.slice(0, 6)}...${address?.slice(-4)}`}
            </span>
          ) : (
            'Connect Wallet'
          )}
        </Button>
      </div>

      <div className="relative container mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="space-y-4 animate-fade-in">
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              Secure Dental Records
              <span className="block text-gray-900 dark:text-white mt-2">
                on the Blockchain
              </span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-lg leading-8 text-gray-600 dark:text-gray-300 animate-fade-in animation-delay-200">
              A decentralized solution for managing dental records with enhanced security, transparency, and accessibility. Built for dentists and patients.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6 animate-fade-in animation-delay-300">
            <Button 
              size="lg" 
              onClick={() => handleRoleSelection('dentist')}
              className={cn(
                "w-full sm:w-auto relative group overflow-hidden px-8 py-3 rounded-lg transform transition-all hover:scale-105",
                "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700",
                "dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600",
                "text-white shadow-lg hover:shadow-xl",
                !isConnected && "opacity-75 cursor-not-allowed"
              )}
              disabled={!isConnected}
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-500"></div>
              <Stethoscope className="w-5 h-5 mr-2 inline-block" />
              {!isConnected ? 'Connect Wallet First' : 'Enter as Dentist'}
            </Button>
            <Button 
              size="lg"
              onClick={() => handleRoleSelection('patient')}
              className={cn(
                "w-full sm:w-auto relative group overflow-hidden px-8 py-3 rounded-lg transform transition-all hover:scale-105",
                "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700",
                "dark:from-purple-500 dark:to-pink-500 dark:hover:from-purple-600 dark:hover:to-pink-600",
                "text-white shadow-lg hover:shadow-xl",
                !isConnected && "opacity-75 cursor-not-allowed"
              )}
              disabled={!isConnected}
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-500"></div>
              <User className="w-5 h-5 mr-2 inline-block" />
              {!isConnected ? 'Connect Wallet First' : 'Enter as Patient'}
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className={cn(
                "relative overflow-hidden border-none bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
                "shadow-lg hover:shadow-2xl transition-all duration-300",
                "transform hover:-translate-y-1",
                "animate-fade-in",
                `animation-delay-${feature.delay}`
              )}
            >
              <div className={cn(
                "absolute inset-0 bg-gradient-to-br opacity-10",
                feature.gradient
              )} />
              <CardHeader>
                <div className={cn(
                  "p-3 w-12 h-12 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center mb-4",
                  "shadow-lg transform transition-transform group-hover:scale-110",
                  "ring-1 ring-gray-200/50 dark:ring-gray-700/50",
                  feature.color
                )}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <CardTitle className="text-xl text-gray-900 dark:text-white">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base text-gray-600 dark:text-gray-300">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 