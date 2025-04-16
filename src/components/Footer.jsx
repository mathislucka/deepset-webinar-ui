const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="app-footer">
      <div className="container">
        <p>&copy; {currentYear} LLM Cost Calculator for RAG Chat</p>
        <p className="text-sm">Prices updated April 2025</p>
      </div>
    </footer>
  );
};

export default Footer;
