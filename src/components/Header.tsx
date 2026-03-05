import { Link } from "react-router-dom";
import { useRef, useCallback } from "react";
import logoGif from "@/assets/logo-animation.gif";

export const Header = () => {
  const imgRef = useRef<HTMLImageElement>(null);

  const playOnce = useCallback(() => {
    const img = imgRef.current;
    if (img) {
      // Force reload GIF to replay animation
      const src = img.src;
      img.src = "";
      img.src = src;
    }
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-background shadow-sm">
      <div className="relative flex items-center py-12 px-4 md:px-[50px]" style={{ fontSize: "2.625rem" }}>
        {/* Left side - Logo GIF (hidden on mobile) */}
        <div className="hidden md:block">
          <img
            ref={imgRef}
            src={logoGif}
            alt="FoliFoli Logo"
            className="h-[90px]"
          />
        </div>

        {/* Center - FoliFoli Works */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link to="/" className="font-medium hover:text-primary transition-colors" style={{ color: "#35AE3B" }}>
            FoliFoli Works
          </Link>
        </div>

        {/* News - between center and right */}
        <div className="absolute left-3/4 -translate-x-1/2">
          <Link to="/news" className="font-medium hover:text-primary transition-colors" onClick={playOnce}>
            Award&News
          </Link>
        </div>

        {/* Right side - Studio */}
        <nav className="ml-auto">
          <Link to="/studio" className="font-medium hover:text-primary transition-colors" onClick={playOnce}>
            Studio
          </Link>
        </nav>
      </div>
    </header>
  );
};
