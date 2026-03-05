import { Link } from "react-router-dom";
import logoHeader from "@/assets/logo-header.png";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-background shadow-sm">
      <div className="relative flex items-center py-12 px-4 md:px-[50px]" style={{ fontSize: "2.625rem" }}>
        {/* Left side - Logo Image */}
        <div className="hidden md:block">
          <img src={logoHeader} alt="尺度森林工作室 FoliFoli Works" className="h-[90px]" />
        </div>

        {/* Center - FoliFoli Works text */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <span className="font-medium" style={{ letterSpacing: "0.05em" }}>
            FoliFoli Works
          </span>
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
