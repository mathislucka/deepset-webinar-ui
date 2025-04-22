import React, { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import AppCard from './AppCard';
import RAGCalculator from './RAGCalculator';
import '../styles/Dashboard.css';

// App cards data
const appCards = [
  {
    id: 'rag-calculator',
    title: 'RAG Cost Calculator',
    description: 'Calculate LLM costs for your Retrieval Augmented Generation applications',
    icon: <span className="app-icon">💰</span>
  }
  // Future apps will be added here
];

const Dashboard = () => {
  const [activeApp, setActiveApp] = useState(null);

  const handleAppClick = (appId) => {
    setActiveApp(appId);
  };

  const renderActiveApp = () => {
    if (activeApp === 'rag-calculator') {
      return <RAGCalculator />;
    }
    return null;
  };

  return (
    <div className="dashboard-container">
      <DashboardHeader />
      
      <main className="dashboard-content">
        {!activeApp ? (
          <>
            <section className="welcome-section">
              <h2>Welcome to the deepset App Suite</h2>
              <p>Select an application to get started</p>
            </section>
            
            <section className="apps-grid">
              {appCards.map((app) => (
                <AppCard
                  key={app.id}
                  title={app.title}
                  description={app.description}
                  icon={app.icon}
                  onClick={() => handleAppClick(app.id)}
                />
              ))}
            </section>
          </>
        ) : (
          <div className="active-app-container">
            <div className="app-breadcrumb">
              <button onClick={() => setActiveApp(null)} className="back-button">
                ← Back to Dashboard
              </button>
              <h2>{appCards.find(app => app.id === activeApp)?.title}</h2>
            </div>
            <div className="app-content">
              {renderActiveApp()}
            </div>
          </div>
        )}
      </main>

      <footer className="dashboard-footer">
        <p>© {new Date().getFullYear()} deepset - AI for your documents</p>
      </footer>
    </div>
  );
};

export default Dashboard;