'use client';

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { cn } from "../../lib/utils";

interface HeroAction {
  text: string;
  href: string;
  icon?: React.ReactNode;
  variant?: "default" | "glow";
}

interface HeroProps {
  badge?: {
    text: string;
    action: {
      text: string;
      href: string;
    };
  };
  title: string;
  description: string;
  actions: HeroAction[];
  image: {
    light: string;
    dark: string;
    alt: string;
  };
}

export function HeroSection({
  badge,
  title,
  description,
  actions,
  image,
}: HeroProps) {
  const { resolvedTheme } = useTheme();
  const imageSrc = resolvedTheme === "light" ? image.light : image.dark;

  return (
    <section className="relative overflow-hidden py-20">
      <div className="container relative z-10 mx-auto px-4">
        <div className="text-center">
          {badge && (
            <Badge variant="outline" className="mb-8 inline-flex animate-fade-in">
              <span className="text-muted-foreground">{badge.text}</span>
              <a href={badge.action.href} className="ml-2 flex items-center">
                {badge.action.text}
                <ArrowRightIcon className="ml-1 h-3 w-3" />
              </a>
            </Badge>
          )}

          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {title}
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            {description}
          </p>

          <div className="flex justify-center space-x-4">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant}
                asChild
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <a href={action.href} className="inline-flex items-center">
                  {action.text}
                  {action.icon}
                </a>
              </Button>
            ))}
          </div>

          <div className="mt-16 animate-fade-in" style={{ animationDelay: "300ms" }}>
            <div className="relative mx-auto max-w-5xl overflow-hidden rounded-lg shadow-xl">
              <Image
                src={imageSrc}
                alt={image.alt}
                width={1200}
                height={675}
                className="w-full"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 