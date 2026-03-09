import PortfolioCard from "./PortfolioCard";

interface PortfolioItem {
  _id: string;
  title: string;
  description: string;
  muxPlaybackId: string;
  token: string;
  thumbnailUrl: string;
  tags: string[];
}

interface PortfolioGridProps {
  items: PortfolioItem[];
  noVideosText: string;
}

export default function PortfolioGrid({ items, noVideosText }: PortfolioGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 text-lg">{noVideosText}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <PortfolioCard
          key={item._id}
          title={item.title}
          description={item.description}
          playbackId={item.muxPlaybackId}
          token={item.token}
          thumbnailUrl={item.thumbnailUrl}
          tags={item.tags}
        />
      ))}
    </div>
  );
}
