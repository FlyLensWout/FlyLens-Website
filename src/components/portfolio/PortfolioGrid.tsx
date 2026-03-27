"use client";

import { useState } from "react";
import PortfolioCard from "./PortfolioCard";
import StaggerChildren from "@/components/animations/StaggerChildren";
import { StaggerItem } from "@/components/animations/StaggerChildren";

const ITEMS_PER_PAGE = 9;

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
  loadMoreText: string;
}

export default function PortfolioGrid({ items, noVideosText, loadMoreText }: PortfolioGridProps) {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 text-lg">{noVideosText}</p>
      </div>
    );
  }

  const visibleItems = items.slice(0, visibleCount);
  const hasMore = visibleCount < items.length;

  // Split visible items into page-sized batches so each batch gets its own
  // StaggerChildren animation when it appears
  const batches: PortfolioItem[][] = [];
  for (let i = 0; i < visibleItems.length; i += ITEMS_PER_PAGE) {
    batches.push(visibleItems.slice(i, i + ITEMS_PER_PAGE));
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {batches.map((batch, batchIndex) => (
          <StaggerChildren
            key={batchIndex}
            className="col-span-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {batch.map((item) => (
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
        ))}
      </div>
      {hasMore && (
        <div className="text-center mt-12">
          <button
            onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
            className="btn-press px-8 py-3 bg-accent text-primary font-semibold rounded-lg hover:bg-accent-hover transition-colors"
          >
            {loadMoreText}
          </button>
        </div>
      )}
    </>
  );
}
