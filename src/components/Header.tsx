import { Link } from "react-router-dom";
import { useRef, useCallback, useEffect, useState } from "react";
import logoGif from "@/assets/logo-animation.gif";

const GIF_DURATION = 3000; // matches actual GIF duration (3s)

export const Header = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showGif, setShowGif] = useState(true);
  const [gifSrc, setGifSrc] = useState(logoGif + "?t=" + Date.now());

  const freezeOnLastFrame = useCallback(() => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
        }
      }
      setShowGif(false);
    };
    // Load a fresh copy to get the last frame snapshot after animation
    img.src = gifSrc;
  }, [gifSrc]);

  const playOnce = useCallback(() => {
    const newSrc = logoGif + "?t=" + Date.now();
    setGifSrc(newSrc);
    setShowGif(true);
    setTimeout(() => {
      // After GIF plays, capture frame and freeze
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0);
          }
        }
        setShowGif(false);
      };
      img.src = newSrc;
    }, GIF_DURATION);
  }, []);

  useEffect(() => {
    // On mount, let GIF play then freeze
    const timer = setTimeout(() => freezeOnLastFrame(), GIF_DURATION);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-background shadow-sm">
      <div className="relative flex items-center py-12 px-4 md:px-[50px]" style={{ fontSize: "2.625rem" }}>
        {/* Left side - Logo */}
        <div className="hidden md:block relative h-[90px]">
          {showGif && (
            <img
              src={gifSrc}
              alt="FoliFoli Logo"
              className="h-[90px]"
            />
          )}
          <canvas
            ref={canvasRef}
            className="h-[90px]"
            style={{ display: showGif ? "none" : "block" }}
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
