"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
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

interface Tab {
  label: string;
  tag: string;
}

interface PortfolioGridProps {
  items: PortfolioItem[];
  noVideosText: string;
  loadMoreText: string;
  tabs: Tab[];
}

export default function PortfolioGrid({ items, noVideosText, loadMoreText, tabs }: PortfolioGridProps) {
  const searchParams = useSearchParams();
  const initialTab = tabs.find((t) => t.tag === searchParams.get("tab"))?.tag ?? tabs[0]?.tag ?? "";
  const [activeTag, setActiveTag] = useState(initialTab);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const filteredItems = items.filter((item) =>
    item.tags?.some((t) => t.toLowerCase() === activeTag.toLowerCase())
  );

  function handleTabChange(tag: string) {
    setActiveTag(tag);
    setVisibleCount(ITEMS_PER_PAGE);
  }

  const visibleItems = filteredItems.slice(0, visibleCount);
  const hasMore = visibleCount < filteredItems.length;

  // Split visible items into page-sized batches so each batch gets its own
  // StaggerChildren animation when it appears
  const batches: PortfolioItem[][] = [];
  for (let i = 0; i < visibleItems.length; i += ITEMS_PER_PAGE) {
    batches.push(visibleItems.slice(i, i + ITEMS_PER_PAGE));
  }

  return (
    <>
      <div className="flex justify-center gap-4 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.tag}
            onClick={() => handleTabChange(tab.tag)}
            className={`px-6 py-2.5 rounded-lg font-semibold transition-colors ${
              activeTag === tab.tag
                ? "bg-accent text-primary"
                : "bg-primary/5 text-primary/60 hover:bg-primary/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-600 text-lg">{noVideosText}</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {batches.map((batch, batchIndex) => (
              <StaggerChildren
                key={`${activeTag}-${batchIndex}`}
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
      )}
    </>
  );
}
