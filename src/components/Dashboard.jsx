import React, { useState } from 'react';
import DashboardHeader from './DashboardHeader';
import AppCard from './AppCard';
import RAGCalculator from './RAGCalculator';
import '../styles/Dashboard.css';

// Application cards data
const appCards = [
  {
    id: 'rag-calculator',
    title: 'RAG Calculator',
    description: 'Calculate Large Language Model costs for your RAG application',
    icon: <span className="app-icon">🧮</span>
  },
  {
    id: 'app2',
    title: 'AI Assistant',
    description: 'Get intelligent answers to your questions using our AI technology',
    icon: <span className="app-icon">🤖</span>
  },
  {
    id: 'app3',
    title: 'Document Analyzer',
    description: 'Extract insights from documents using AI-powered analysis',
    icon: <span className="app-icon">📝</span>
  },
  {
    id: 'app4',
    title: 'Knowledge Base',
    description: 'Access your organization\'s knowledge base and documentation',
    icon: <span className="app-icon">📚</span>
  },
  {
    id: 'app5',
    title: 'Model Training',
    description: 'Train and fine-tune machine learning models for your use case',
    icon: <span className="app-icon">🧠</span>
  },
  {
    id: 'app6',
    title: 'Settings',
    description: 'Configure your workspace and application preferences',
    icon: <span className="app-icon">⚙️</span>
  }
];

const Dashboard = () => {
  const [activeApp, setActiveApp] = useState(null);

  const handleAppClick = (appId) => {
    setActiveApp(appId);
    console.log(`Opening app: ${appId}`);
  };

  const handleBackToApps = () => {
    setActiveApp(null);
  };

  // Render the selected app or the app grid
  const renderContent = () => {
    if (activeApp === 'rag-calculator') {
      return (
        <div className="app-container">
          <div className="app-header">
            <button className="back-button" onClick={handleBackToApps}>
              ← Back to Apps
            </button>
          </div>
          <RAGCalculator />
        </div>
      );
    } else if (activeApp) {
      // Placeholder for other apps
      return (
        <div className="app-container">
          <div className="app-header">
            <button className="back-button" onClick={handleBackToApps}>
              ← Back to Apps
            </button>
          </div>
          <div className="app-placeholder">
            <h2>{appCards.find(app => app.id === activeApp)?.title}</h2>
            <p>This application is not yet implemented.</p>
          </div>
        </div>
      );
    }

    // Default: Show the app grid
    return (
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
    );
  };

  return (
    <div className="dashboard-container">
      <DashboardHeader />
      
      <main className="dashboard-content">
        {renderContent()}
      </main>

      <footer className="dashboard-footer">
        <p>© {new Date().getFullYear()} deepset - AI for your documents</p>
      </footer>
    </div>
  );
};

export default Dashboard;