import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useStudioData } from "@/hooks/useStudioData";

const Studio = () => {
  const { studio, isLoading } = useStudioData();

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-24 md:pt-28">
        <div className="px-4 md:px-[50px] py-8">
          <h1 className="text-2xl font-medium mb-8">About</h1>
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
              {/* Left column - Display text */}
              <div className="flex flex-col items-center lg:justify-center mt-10 md:mt-0">
                <div className="text-sm leading-relaxed w-full md:w-[60%] space-y-6 text-justify">
                  <p className="font-medium">{studio.introChinese}</p>
                  <p
                    className="font-light"
                    style={{
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    }}
                  >
                    {studio.introEnglish}
                  </p>
                  <p
                    className="font-light"
                    style={{
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                    }}
                  >
                    {studio.contact}
                  </p>
                </div>
              </div>

              {/* Right column - Display image */}
              <div className="flex flex-col gap-4">
                <div className="overflow-hidden rounded-none md:rounded-md">
                  <img
                    src={studio.image}
                    alt="Studio"
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
};

export default Studio;
