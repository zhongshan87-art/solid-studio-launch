import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-background shadow-sm">
      <div className="flex justify-between items-center py-6 px-4 md:px-[50px]">
        {/* Left side - Logo (hidden on mobile) */}
        <div className="hidden md:block">
          <img src={logo} alt="尺度森林工作室 FoliFoli Works" className="h-10" />
        </div>

        {/* Right side - Navigation */}
        <nav className="flex items-end gap-8 text-2xl md:ml-auto">
          <Link
            to="/"
            className="text-caption font-medium hover:text-primary transition-colors inline-flex items-baseline"
          >
            <span
              className="animate-grow-up"
              style={{
                color: "#498422",
                fontSize: "2em",
                lineHeight: "1",
                transformOrigin: "bottom center",
              }}
            >
              F
            </span>
            orest
          </Link>
          <Link to="/works" className="text-caption font-medium hover:text-primary transition-colors">
            Works
          </Link>
          <Link to="/news" className="text-caption font-medium hover:text-primary transition-colors">
            News
          </Link>
          <Link to="/studio" className="text-caption font-medium hover:text-primary transition-colors">
            Studio
          </Link>
        </nav>
      </div>
    </header>
  );
};
