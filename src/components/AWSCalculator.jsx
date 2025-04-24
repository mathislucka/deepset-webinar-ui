import React, { useState, useEffect } from 'react';
import '../styles/AWSCalculator.css';

// AWS pricing data
const AWS_PRICING = {
  // EC2 instance pricing - monthly cost (730 hours)
  ec2: {
    // High-powered GPU instances
    gpuInstances: [
      { name: 'p4d.24xlarge', vram: '320 GB', vCPU: 96, ram: '1152 GB', price: 32.7726, region: 'eu-west-1', description: 'A100 GPUs' },
      { name: 'p5.48xlarge', vram: '160 GB', vCPU: 192, ram: '2048 GB', price: 64.08, region: 'eu-west-1', description: 'H100 GPUs' },
      { name: 'p4de.24xlarge', vram: '320 GB', vCPU: 96, ram: '1152 GB', price: 32.7726, region: 'eu-west-2', description: 'A100 GPUs' },
      { name: 'p5.48xlarge', vram: '160 GB', vCPU: 192, ram: '2048 GB', price: 64.08, region: 'eu-west-2', description: 'H100 GPUs' }
    ],
    // Low-powered CPU instances
    cpuInstances: [
      { name: 't4g.micro', vCPU: 2, ram: '1 GB', price: 0.0084, region: 'eu-west-1', description: 'ARM-based' },
      { name: 't3.micro', vCPU: 2, ram: '1 GB', price: 0.0104, region: 'eu-west-1', description: 'x86-based' },
      { name: 't3.small', vCPU: 2, ram: '2 GB', price: 0.0208, region: 'eu-west-1', description: 'x86-based' },
      { name: 't4g.micro', vCPU: 2, ram: '1 GB', price: 0.0084, region: 'eu-west-2', description: 'ARM-based' },
      { name: 't3.micro', vCPU: 2, ram: '1 GB', price: 0.0104, region: 'eu-west-2', description: 'x86-based' },
      { name: 't3.small', vCPU: 2, ram: '2 GB', price: 0.0208, region: 'eu-west-2', description: 'x86-based' }
    ]
  },
  // S3 storage pricing per GB per month
  s3: [
    { tier: 'Standard (First 50 TB)', price: 0.023, region: 'eu-west-1' },
    { tier: 'Standard-IA', price: 0.0125, region: 'eu-west-1' },
    { tier: 'One Zone-IA', price: 0.01, region: 'eu-west-1' },
    { tier: 'Glacier Instant Retrieval', price: 0.004, region: 'eu-west-1' },
    { tier: 'Standard (First 50 TB)', price: 0.024, region: 'eu-west-2' },
    { tier: 'Standard-IA', price: 0.0131, region: 'eu-west-2' },
    { tier: 'One Zone-IA', price: 0.0105, region: 'eu-west-2' },
    { tier: 'Glacier Instant Retrieval', price: 0.0042, region: 'eu-west-2' }
  ],
  // OpenSearch pricing
  opensearch: [
    { instanceType: 'm6g.large.search', cpu: '2 vCPU', memory: '8 GB', storage: 'EBS only', price: 0.149, region: 'eu-west-1' },
    { instanceType: 'r6g.xlarge.search', cpu: '4 vCPU', memory: '32 GB', storage: 'EBS only', price: 0.312, region: 'eu-west-1' },
    { instanceType: 'c6g.2xlarge.search', cpu: '8 vCPU', memory: '16 GB', storage: 'EBS only', price: 0.296, region: 'eu-west-1' },
    { instanceType: 'm6g.large.search', cpu: '2 vCPU', memory: '8 GB', storage: 'EBS only', price: 0.156, region: 'eu-west-2' },
    { instanceType: 'r6g.xlarge.search', cpu: '4 vCPU', memory: '32 GB', storage: 'EBS only', price: 0.328, region: 'eu-west-2' },
    { instanceType: 'c6g.2xlarge.search', cpu: '8 vCPU', memory: '16 GB', storage: 'EBS only', price: 0.312, region: 'eu-west-2' }
  ],
  // Regions for EU and UK
  regions: {
    'eu-west-1': 'EU (Ireland)',
    'eu-west-2': 'UK (London)'
  }
};

// Main calculator component
const AWSCalculator = () => {
  // State variables
  const [selectedRegion, setSelectedRegion] = useState('eu-west-1');
  const [activeTab, setActiveTab] = useState('ec2');
  const [ec2Counts, setEC2Counts] = useState({
    gpuInstances: {},
    cpuInstances: {}
  });
  const [s3Storage, setS3Storage] = useState({
    'Standard (First 50 TB)': 1000,
    'Standard-IA': 5000,
    'One Zone-IA': 10000,
    'Glacier Instant Retrieval': 20000
  });
  const [opensearchCount, setOpensearchCount] = useState({});
  
  // Set default instance counts
  useEffect(() => {
    // Initialize EC2 counts
    const initializeEC2Counts = () => {
      const newGpuCounts = {};
      const newCpuCounts = {};
      
      AWS_PRICING.ec2.gpuInstances.forEach(instance => {
        if (instance.region === selectedRegion) {
          newGpuCounts[instance.name] = 1;
        }
      });
      
      AWS_PRICING.ec2.cpuInstances.forEach(instance => {
        if (instance.region === selectedRegion) {
          newCpuCounts[instance.name] = 2;
        }
      });
      
      setEC2Counts({
        gpuInstances: newGpuCounts,
        cpuInstances: newCpuCounts
      });
    };
    
    // Initialize OpenSearch counts
    const initializeOpensearchCounts = () => {
      const newCounts = {};
      
      AWS_PRICING.opensearch.forEach(instance => {
        if (instance.region === selectedRegion) {
          newCounts[instance.instanceType] = 1;
        }
      });
      
      setOpensearchCount(newCounts);
    };
    
    initializeEC2Counts();
    initializeOpensearchCounts();
  }, [selectedRegion]);
  
  // Calculate total costs
  const calculateTotalCosts = () => {
    // Calculate EC2 costs
    let ec2GpuCost = 0;
    let ec2CpuCost = 0;
    
    AWS_PRICING.ec2.gpuInstances
      .filter(instance => instance.region === selectedRegion)
      .forEach(instance => {
        ec2GpuCost += (ec2Counts.gpuInstances[instance.name] || 0) * instance.price * 730; // 730 hours in a month
      });
      
    AWS_PRICING.ec2.cpuInstances
      .filter(instance => instance.region === selectedRegion)
      .forEach(instance => {
        ec2CpuCost += (ec2Counts.cpuInstances[instance.name] || 0) * instance.price * 730; // 730 hours in a month
      });
      
    // Calculate S3 costs
    let s3Cost = 0;
    AWS_PRICING.s3
      .filter(tier => tier.region === selectedRegion)
      .forEach(tier => {
        s3Cost += (s3Storage[tier.tier] || 0) * tier.price;
      });
      
    // Calculate OpenSearch costs
    let opensearchCost = 0;
    AWS_PRICING.opensearch
      .filter(instance => instance.region === selectedRegion)
      .forEach(instance => {
        opensearchCost += (opensearchCount[instance.instanceType] || 0) * instance.price * 730; // 730 hours in a month
      });
    
    // Return all costs  
    return {
      ec2: {
        gpu: ec2GpuCost.toFixed(2),
        cpu: ec2CpuCost.toFixed(2),
        total: (ec2GpuCost + ec2CpuCost).toFixed(2)
      },
      s3: s3Cost.toFixed(2),
      opensearch: opensearchCost.toFixed(2),
      total: (ec2GpuCost + ec2CpuCost + s3Cost + opensearchCost).toFixed(2)
    };
  };
  
  const costs = calculateTotalCosts();
  
  // Update EC2 instance count
  const updateEC2Count = (instanceName, instanceType, value) => {
    const newValue = Math.max(0, value);
    if (instanceType === 'gpu') {
      setEC2Counts({
        ...ec2Counts,
        gpuInstances: {
          ...ec2Counts.gpuInstances,
          [instanceName]: newValue
        }
      });
    } else {
      setEC2Counts({
        ...ec2Counts,
        cpuInstances: {
          ...ec2Counts.cpuInstances,
          [instanceName]: newValue
        }
      });
    }
  };
  
  // Update S3 storage
  const updateS3Storage = (tier, value) => {
    const newValue = Math.max(0, value);
    setS3Storage({
      ...s3Storage,
      [tier]: newValue
    });
  };
  
  // Update OpenSearch count
  const updateOpensearchCount = (instanceType, value) => {
    const newValue = Math.max(0, value);
    setOpensearchCount({
      ...opensearchCount,
      [instanceType]: newValue
    });
  };
  
  // Render EC2 tab content
  const renderEC2Tab = () => {
    return (
      <div className="tab-content">
        <div className="instance-section">
          <h3>GPU Instances (≥ 80GB VRAM)</h3>
          <div className="instance-grid">
            {AWS_PRICING.ec2.gpuInstances
              .filter(instance => instance.region === selectedRegion)
              .map((instance, index) => (
                <div key={index} className="instance-card">
                  <div className="instance-header">
                    <h4>{instance.name}</h4>
                    <span className="instance-badge gpu">{instance.description}</span>
                  </div>
                  <div className="instance-details">
                    <p><strong>VRAM:</strong> {instance.vram}</p>
                    <p><strong>vCPU:</strong> {instance.vCPU}</p>
                    <p><strong>RAM:</strong> {instance.ram}</p>
                    <p><strong>Hourly:</strong> ${instance.price.toFixed(2)}</p>
                    <p><strong>Monthly:</strong> ${(instance.price * 730).toFixed(2)}</p>
                  </div>
                  <div className="instance-controls">
                    <label>Count:</label>
                    <div className="count-control">
                      <button onClick={() => updateEC2Count(instance.name, 'gpu', (ec2Counts.gpuInstances[instance.name] || 0) - 1)}>-</button>
                      <input 
                        type="number" 
                        value={ec2Counts.gpuInstances[instance.name] || 0} 
                        onChange={(e) => updateEC2Count(instance.name, 'gpu', parseInt(e.target.value) || 0)}
                      />
                      <button onClick={() => updateEC2Count(instance.name, 'gpu', (ec2Counts.gpuInstances[instance.name] || 0) + 1)}>+</button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        
        <div className="instance-section">
          <h3>Low-Cost CPU Instances</h3>
          <div className="instance-grid">
            {AWS_PRICING.ec2.cpuInstances
              .filter(instance => instance.region === selectedRegion)
              .map((instance, index) => (
                <div key={index} className="instance-card">
                  <div className="instance-header">
                    <h4>{instance.name}</h4>
                    <span className="instance-badge cpu">{instance.description}</span>
                  </div>
                  <div className="instance-details">
                    <p><strong>vCPU:</strong> {instance.vCPU}</p>
                    <p><strong>RAM:</strong> {instance.ram}</p>
                    <p><strong>Hourly:</strong> ${instance.price.toFixed(4)}</p>
                    <p><strong>Monthly:</strong> ${(instance.price * 730).toFixed(2)}</p>
                  </div>
                  <div className="instance-controls">
                    <label>Count:</label>
                    <div className="count-control">
                      <button onClick={() => updateEC2Count(instance.name, 'cpu', (ec2Counts.cpuInstances[instance.name] || 0) - 1)}>-</button>
                      <input 
                        type="number" 
                        value={ec2Counts.cpuInstances[instance.name] || 0} 
                        onChange={(e) => updateEC2Count(instance.name, 'cpu', parseInt(e.target.value) || 0)}
                      />
                      <button onClick={() => updateEC2Count(instance.name, 'cpu', (ec2Counts.cpuInstances[instance.name] || 0) + 1)}>+</button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        
        <div className="cost-summary">
          <h3>EC2 Cost Summary</h3>
          <div className="cost-summary-grid">
            <div className="cost-card">
              <h4>GPU Instances</h4>
              <p className="cost-value">${costs.ec2.gpu}</p>
            </div>
            <div className="cost-card">
              <h4>CPU Instances</h4>
              <p className="cost-value">${costs.ec2.cpu}</p>
            </div>
            <div className="cost-card total">
              <h4>Total EC2</h4>
              <p className="cost-value">${costs.ec2.total}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render S3 tab content
  const renderS3Tab = () => {
    return (
      <div className="tab-content">
        <div className="storage-section">
          <h3>S3 Storage Tiers</h3>
          <div className="storage-grid">
            {AWS_PRICING.s3
              .filter(tier => tier.region === selectedRegion)
              .map((tier, index) => (
                <div key={index} className="storage-card">
                  <div className="storage-header">
                    <h4>{tier.tier}</h4>
                  </div>
                  <div className="storage-details">
                    <p><strong>Price per GB:</strong> ${tier.price.toFixed(4)}</p>
                    <p><strong>Region:</strong> {AWS_PRICING.regions[tier.region]}</p>
                  </div>
                  <div className="storage-controls">
                    <label>Storage (GB):</label>
                    <div className="storage-input">
                      <input 
                        type="number" 
                        value={s3Storage[tier.tier] || 0} 
                        onChange={(e) => updateS3Storage(tier.tier, parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="storage-cost">
                      <p><strong>Cost:</strong> ${((s3Storage[tier.tier] || 0) * tier.price).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        
        <div className="cost-summary">
          <h3>S3 Storage Cost Summary</h3>
          <div className="cost-chart">
            <div className="chart-container">
              <div className="chart-bars">
                {AWS_PRICING.s3
                  .filter(tier => tier.region === selectedRegion)
                  .map((tier, index) => {
                    const cost = (s3Storage[tier.tier] || 0) * tier.price;
                    const percentage = (cost / parseFloat(costs.s3)) * 100;
                    return (
                      <div key={index} className="chart-bar-container">
                        <div 
                          className={`chart-bar tier-${index}`}
                          style={{ height: `${percentage}%` }}
                          title={`${tier.tier}: $${cost.toFixed(2)}`}
                        ></div>
                        <div className="chart-label">{tier.tier.split(' ')[0]}</div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="chart-legend">
              <h4>Total S3 Cost: ${costs.s3}</h4>
              <div className="legend-items">
                {AWS_PRICING.s3
                  .filter(tier => tier.region === selectedRegion)
                  .map((tier, index) => {
                    const cost = (s3Storage[tier.tier] || 0) * tier.price;
                    return (
                      <div key={index} className="legend-item">
                        <div className={`legend-color tier-${index}`}></div>
                        <div className="legend-text">
                          <span>{tier.tier}</span>
                          <span>${cost.toFixed(2)}</span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render OpenSearch tab content
  const renderOpenSearchTab = () => {
    return (
      <div className="tab-content">
        <div className="instance-section">
          <h3>OpenSearch Service Instances</h3>
          <div className="instance-grid">
            {AWS_PRICING.opensearch
              .filter(instance => instance.region === selectedRegion)
              .map((instance, index) => (
                <div key={index} className="instance-card">
                  <div className="instance-header">
                    <h4>{instance.instanceType}</h4>
                  </div>
                  <div className="instance-details">
                    <p><strong>CPU:</strong> {instance.cpu}</p>
                    <p><strong>Memory:</strong> {instance.memory}</p>
                    <p><strong>Storage:</strong> {instance.storage}</p>
                    <p><strong>Hourly:</strong> ${instance.price.toFixed(3)}</p>
                    <p><strong>Monthly:</strong> ${(instance.price * 730).toFixed(2)}</p>
                  </div>
                  <div className="instance-controls">
                    <label>Count:</label>
                    <div className="count-control">
                      <button onClick={() => updateOpensearchCount(instance.instanceType, (opensearchCount[instance.instanceType] || 0) - 1)}>-</button>
                      <input 
                        type="number" 
                        value={opensearchCount[instance.instanceType] || 0} 
                        onChange={(e) => updateOpensearchCount(instance.instanceType, parseInt(e.target.value) || 0)}
                      />
                      <button onClick={() => updateOpensearchCount(instance.instanceType, (opensearchCount[instance.instanceType] || 0) + 1)}>+</button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
        
        <div className="cost-summary">
          <h3>OpenSearch Cost Summary</h3>
          <div className="cost-summary-grid">
            <div className="cost-card total">
              <h4>Total OpenSearch</h4>
              <p className="cost-value">${costs.opensearch}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="aws-calculator">
      <div className="calculator-header">
        <h2>AWS Cost Calculator</h2>
        <p>Calculate AWS costs for EC2, S3, and OpenSearch</p>
      </div>
      
      <div className="calculator-toolbar">
        <div className="region-selector">
          <label htmlFor="region">Region:</label>
          <select 
            id="region" 
            value={selectedRegion} 
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            {Object.entries(AWS_PRICING.regions).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>
        
        <div className="tabs">
          <button 
            className={`tab-button ${activeTab === 'ec2' ? 'active' : ''}`}
            onClick={() => setActiveTab('ec2')}
          >
            EC2 Instances
          </button>
          <button 
            className={`tab-button ${activeTab === 's3' ? 'active' : ''}`}
            onClick={() => setActiveTab('s3')}
          >
            S3 Storage
          </button>
          <button 
            className={`tab-button ${activeTab === 'opensearch' ? 'active' : ''}`}
            onClick={() => setActiveTab('opensearch')}
          >
            OpenSearch
          </button>
        </div>
      </div>
      
      <div className="calculator-content">
        {activeTab === 'ec2' && renderEC2Tab()}
        {activeTab === 's3' && renderS3Tab()}
        {activeTab === 'opensearch' && renderOpenSearchTab()}
      </div>
      
      <div className="total-cost-banner">
        <div className="total-cost-content">
          <h3>Total Monthly AWS Cost</h3>
          <div className="total-cost-breakdown">
            <div className="cost-item">
              <span>EC2:</span>
              <span>${costs.ec2.total}</span>
            </div>
            <div className="cost-item">
              <span>S3:</span>
              <span>${costs.s3}</span>
            </div>
            <div className="cost-item">
              <span>OpenSearch:</span>
              <span>${costs.opensearch}</span>
            </div>
            <div className="cost-item total">
              <span>Total:</span>
              <span>${costs.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AWSCalculator;
