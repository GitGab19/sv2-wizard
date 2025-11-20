// Main deployment result content component - routes to specific deployment components

import { FullStackDockerDeployment } from './FullStackDockerDeployment';
import { FullStackBinariesDeployment } from './FullStackBinariesDeployment';
import { PoolConnectionDockerDeployment } from './PoolConnectionDockerDeployment';
import { PoolConnectionBinariesDeployment } from './PoolConnectionBinariesDeployment';

export const DeploymentResultContent = ({ 
  type, 
  method, 
  data 
}: { 
  type: 'full-stack' | 'pool-connection', 
  method: 'docker' | 'binaries', 
  data?: any 
}) => {
  if (type === 'full-stack' && method === 'docker') {
    return <FullStackDockerDeployment data={data} />;
  }
  
  if (type === 'full-stack' && method === 'binaries') {
    return <FullStackBinariesDeployment data={data} />;
  }
  
  if (type === 'pool-connection' && method === 'docker') {
    return <PoolConnectionDockerDeployment data={data} />;
  }
  
  // Pool Connection Binaries
  return <PoolConnectionBinariesDeployment data={data} />;
};

