import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-background shadow-sm">
      <div className="relative flex items-center py-12 px-4 md:px-[50px]" style={{ fontSize: "2.625rem" }}>
        {/* Left side - Logo Text */}
        <div className="hidden md:block">
          <Link to="/" style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 700, fontSize: "2rem", letterSpacing: "0.05em" }}>
            尺度森林工作室
          </Link>
        </div>

        {/* Center - FoliFoli Works */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link to="/" className="font-medium hover:text-primary transition-colors" style={{ color: "#35AE3B" }}>
            FoliFoli Works
          </Link>
        </div>

        {/* News - between center and right */}
        <div className="absolute left-3/4 -translate-x-1/2">
          <Link to="/news" className="font-medium hover:text-primary transition-colors">
            Award&News
          </Link>
        </div>

        {/* Right side - Studio */}
        <nav className="ml-auto">
          <Link to="/studio" className="font-medium hover:text-primary transition-colors">
            Studio
          </Link>
        </nav>
      </div>
    </header>
  );
};
