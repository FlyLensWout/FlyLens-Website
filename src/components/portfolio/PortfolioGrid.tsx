"use client";

import { useMemo } from "react";
import PortfolioCard from "./PortfolioCard";
import dynamic from "next/dynamic";
const StaggerChildren = dynamic(() => import("@/components/animations/StaggerChildren"), { ssr: true });
const StaggerItem = dynamic(() => import("@/components/animations/StaggerChildren").then(mod => mod.StaggerItem), { ssr: true });

function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

interface PortfolioItem {
  _id: string;
  title: string;
  description: string;
  videoFileName: string;
  tags: string[];
}

interface PortfolioGridProps {
  items: PortfolioItem[];
  noVideosText: string;
}

export default function PortfolioGrid({ items, noVideosText }: PortfolioGridProps) {
  const shuffledItems = useMemo(() => shuffle(items), [items]);

  if (shuffledItems.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 text-lg">{noVideosText}</p>
      </div>
    );
  }

  return (
    <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {shuffledItems.map((item) => (
        <StaggerItem key={item._id}>
          <PortfolioCard
            title={item.title}
            description={item.description}
            videoFileName={item.videoFileName}
            tags={item.tags}
          />
        </StaggerItem>
      ))}
    </StaggerChildren>
  );
}
