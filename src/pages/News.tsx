import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { useMediaData } from "@/hooks/useMediaData";

interface MediaCardItemProps {
  card: {
    id: string;
    image: string;
    description: string;
  };
}

const MediaCardItem = ({ card }: MediaCardItemProps) => {
  return (
    <Card className="overflow-hidden w-full md:w-[80%] mx-auto rounded-none md:rounded-lg">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={card.image}
            alt="Media card"
            className="w-full aspect-[3/4] object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
        </div>
        <div className="p-2.5 md:p-3">
          <p className="text-base leading-relaxed whitespace-pre-line text-foreground font-bold">
            {card.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

const News = () => {
  const { cards, isLoading } = useMediaData();

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24 md:pt-28">
        <div className="px-4 md:px-[50px] py-8">
          <h1 className="text-2xl font-medium mb-8">奖项和新闻 Awards & News</h1>
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-[72px]">
              {cards.map((card) => (
                <MediaCardItem key={card.id} card={card} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default News;
