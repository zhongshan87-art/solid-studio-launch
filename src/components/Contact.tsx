export const Contact = () => {
  return <section id="about" className="section-padding">
      <div className="container-studio">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-title mb-12">
              Get In Touch
            </h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-caption mb-3 text-studio-gray-medium">
                  General Inquiries
                </h3>
                <p className="text-lg">hello@designstudio.com</p>
              </div>
              
              <div>
                <h3 className="text-caption mb-3 text-studio-gray-medium">
                  New Business
                </h3>
                <p className="text-lg">work@designstudio.com</p>
              </div>
              
              <div>
                <h3 className="text-caption mb-3 text-studio-gray-medium">
                  Studio Location
                </h3>
                <address className="text-lg not-italic leading-relaxed">
                  123 Design Avenue<br />
                  New York, NY 10001<br />
                  United States
                </address>
              </div>
            </div>
          </div>
          
          <div>
            <div className="space-y-8">
              <div>
                <h3 className="text-caption mb-3 text-studio-gray-medium">
                  Social
                </h3>
                <div className="space-y-2 text-lg">
                  <a href="#" className="block hover:text-studio-gray-medium transition-colors">Instagram</a>
                  <a href="#" className="block hover:text-studio-gray-medium transition-colors">
                    Behance  
                  </a>
                  <a href="#" className="block hover:text-studio-gray-medium transition-colors">
                    LinkedIn
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="text-caption mb-3 text-studio-gray-medium">
                  Phone
                </h3>
                <p className="text-lg">+1 (555) 123-4567</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};