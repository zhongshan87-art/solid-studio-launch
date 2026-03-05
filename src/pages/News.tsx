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
      <div className="pt-[280px]">
        <div className="px-4 md:px-[50px] py-8">
          <h1 className="text-3xl font-medium mb-8"> </h1>
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : (
            <div className="flex flex-col gap-10 md:gap-y-16">
              {(() => {
                const rows: React.ReactNode[] = [];
                let i = 0;
                let rowIndex = 0;
                while (i < cards.length) {
                  const count = rowIndex % 2 === 0 ? 3 : 2;
                  const rowCards = cards.slice(i, i + count);
                  rows.push(
                    <div key={rowIndex} className={`grid grid-cols-1 ${count === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-10 md:gap-x-10`}>
                      {rowCards.map((card) => (
                        <MediaCardItem key={card.id} card={card} />
                      ))}
                    </div>
                  );
                  i += count;
                  rowIndex++;
                }
                return rows;
              })()}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default News;
