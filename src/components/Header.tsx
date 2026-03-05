import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-background shadow-sm">
      <div className="flex justify-between items-center py-12 px-4 md:px-[50px]">
        {/* Left side - Logo (hidden on mobile) */}
        <div className="hidden md:block">
          <img src={logo} alt="尺度森林工作室 FoliFoli Works" className="h-[90px]" />
        </div>

        {/* Right side - Navigation */}
        <nav className="flex items-end gap-16 md:ml-auto" style={{ fontSize: "2.625rem" }}>
          <Link to="/" className="font-medium hover:text-primary transition-colors">
            Works
          </Link>
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
