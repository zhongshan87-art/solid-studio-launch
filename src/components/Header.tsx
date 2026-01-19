import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-background shadow-sm">
      <div className="flex justify-between items-center py-6 px-4 md:px-[50px]">
        {/* Left side - Studio name (hidden on mobile) */}
        <div className="hidden md:block">
          <span className="text-2xl font-medium inline-flex items-baseline">
            尺度森林S.
            <span>F</span>
            .A
          </span>
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
