import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
    <div className="flex flex-row gap-4 items-start">
      <div className="w-[45%] flex-shrink-0">
        <img
          src={card.image}
          alt="Media card"
          className="w-full aspect-[3/4] object-cover block"
          onError={(e) => {
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
      </div>
      <div className="flex-1 pt-1">
        <p className="text-sm md:text-base leading-relaxed whitespace-pre-line text-foreground font-normal">{card.description}</p>
      </div>
    </div>
  );
};

const News = () => {
  const { cards, isLoading } = useMediaData();

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24 md:pt-28">
        <div className="px-4 md:px-[50px] py-8">
          <h1 className="text-3xl font-medium mb-8"> </h1>
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-y-16 md:gap-x-10">
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
