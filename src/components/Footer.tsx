export const Footer = () => {
  return (
    <footer className="section-padding border-t border-border">
      <div className="container-studio">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-caption text-studio-gray-medium">
            © 2024 Design Studio. All rights reserved.
          </div>
          
          <div className="flex space-x-8">
            <a href="#" className="text-caption text-studio-gray-medium hover:text-foreground transition-colors">
              Privacy
            </a>
            <a href="#" className="text-caption text-studio-gray-medium hover:text-foreground transition-colors">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};