import { PodcastList } from "@/components/PodcastList";

export function PodcastsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold text-[#0B2F33] mb-6">Podcasts</h1>
      <PodcastList />
    </div>
  );
}
