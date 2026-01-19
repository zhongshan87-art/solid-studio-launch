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
          {isLoading ? (
            <p className="text-center text-muted-foreground">Loading...</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
              {/* Left column - Text content */}
              <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="text-sm leading-relaxed w-full md:w-[70%] space-y-6 text-justify">
                  <h1 className="text-2xl font-medium text-left">About us</h1>
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

                  <h2 className="text-2xl font-medium text-left pt-4">Join us </h2>
                  <div className="font-medium space-y-1">
                    <p>加入森林，一起成长。</p>
                    <p>
                      建筑、室内、产品、设计相关专业，有良好的设计品味，热爱设计，擅长团队合作。提供职位：实习生、设计师。
                    </p>
                    <p>工作地点：上海市愚园路。简历和作品集投递：info@scalefa.com</p>
                  </div>
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
