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
  const handleAppClick = (appId) => {
    // This would navigate to the appropriate app in a real implementation
    console.log(`Navigating to app: ${appId}`);
    // Example: history.push(`/apps/${appId}`);
  };

  return (
    <div className="dashboard-container">
      <DashboardHeader />
      
      <main className="dashboard-content">
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
      </main>

      <footer className="dashboard-footer">
        <p>© {new Date().getFullYear()} deepset - AI for your documents</p>
      </footer>
    </div>
  );
};

export default Dashboard;