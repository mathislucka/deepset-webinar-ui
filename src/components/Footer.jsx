const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="container">
        <div className="footer-content">
          <div>
            <p>&copy; {currentYear} LLM Cost Calculator for RAG Chat</p>
            <p className="text-sm">Prices updated April 2025</p>
          </div>
          <div className="footer-links">
            <a href="#" className="footer-link">About</a>
            <a href="#" className="footer-link">Pricing Updates</a>
            <a href="#" className="footer-link">API</a>
            <a href="#" className="footer-link">Contact</a>
          </div>
        </div>
        <div className="footer-disclaimer text-xs mt-4">
          The pricing information provided is for estimation purposes only. Actual prices may vary. Always refer to the official provider documentation for the most current pricing details.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
