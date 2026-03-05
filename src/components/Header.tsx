import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-background shadow-sm">
      <div className="relative flex items-center py-12 px-4 md:px-[50px]" style={{ fontSize: "2.625rem" }}>
        {/* Left side - Logo (hidden on mobile) */}
        <div className="hidden md:block">
          <img src={logo} alt="尺度森林工作室 FoliFoli Works" className="h-[90px]" />
        </div>

        {/* Center - FoliFoli Works */}
        <div className="absolute left-1/2 -translate-x-1/2">
          <Link to="/" className="font-medium hover:text-primary transition-colors" style={{ color: '#35AE3B' }}>
            FoliFoli Works
          </Link>
        </div>

        {/* Right side - News & Studio */}
        <nav className="flex items-end gap-16 ml-auto">
          <Link to="/news" className="font-medium hover:text-primary transition-colors">
            News
          </Link>
          <Link to="/studio" className="font-medium hover:text-primary transition-colors">
            Studio
          </Link>
        </nav>
      </div>
    </header>
  );
};
