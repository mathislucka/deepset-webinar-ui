const Header = () => {
  return (
    <header className="app-header">
      <div className="container">
        <h1>LLM Cost Calculator</h1>
        <p className="subtitle">Estimate your RAG Chat application costs with real-time pricing comparisons</p>
        <div className="header-tags">
          <span className="header-tag">OpenAI</span>
          <span className="header-tag">Anthropic</span>
          <span className="header-tag">Google</span>
          <span className="header-tag">RAG</span>
          <span className="header-tag">Cost Analysis</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
