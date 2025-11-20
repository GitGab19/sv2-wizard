/**
 * Full Stack Wizard
 * 
 * Guides users through deploying the complete SRI (Stratum V2 Reference Implementation) stack locally.
 * 
 * Components deployed:
 * - SRI Pool (always) - Requires Bitcoin Core node for block templates
 * - Job Declarator Server (JDS) (always) - Connects to Bitcoin Core via RPC
 * - Job Declarator Client (JDC) (optional) - Only if user chooses JD mode
 * - Translator Proxy (always) - Connects miners to the pool
 * 
 * Bitcoin Core node is required for:
 * - SRI Pool: To fetch block templates
 * - JDC (if used): To construct custom block templates
 */

import { Wizard, WizardConfig } from "./components/ui/wizard-framework";
import { 
  Box, Terminal, Cpu, Layers, Globe, Activity
} from "lucide-react";
import {
  PoolConfigForm,
  ClientConfigForm,
  TranslatorProxyConfigForm,
  BitcoinSetupContent,
  DeploymentResultContent
} from "./wizard";

export interface FullStackWizardProps {
  className?: string;
  onComplete?: (finalStepId: string) => void;
}

const FULL_STACK_WIZARD_CONFIG: WizardConfig = {
  initialStepId: 'bitcoin_network_selection',
  title: "SRI Full Stack Deployment",
  subtitle: "Deploy an entire mining pool locally. This requires a Bitcoin Core node and is for advanced users.",
  steps: {
    bitcoin_network_selection: {
      id: 'bitcoin_network_selection',
      type: 'question',
      title: "Select Bitcoin Network",
      description: "Which network will your Bitcoin Node operate on?",
      options: [
        { id: 'opt_main', label: "Mainnet", subLabel: "Production Network", value: "mainnet", nextStepId: "bitcoin_setup_mainnet", icon: Globe },
        { id: 'opt_test', label: "Testnet4", subLabel: "Testing Network", value: "testnet4", nextStepId: "bitcoin_setup_testnet4", icon: Activity }
      ]
    },
    bitcoin_setup_mainnet: {
        id: 'bitcoin_setup_mainnet',
        type: 'instruction',
        title: "Bitcoin Core Setup (Mainnet)",
        component: <BitcoinSetupContent network="mainnet" description="A running Bitcoin Core node is required for full-stack deployment." />,
        nextStepId: 'pool_configuration_mainnet'
    },
    bitcoin_setup_testnet4: {
        id: 'bitcoin_setup_testnet4',
        type: 'instruction',
        title: "Bitcoin Core Setup (Testnet4)",
        component: <BitcoinSetupContent network="testnet4" description="A running Bitcoin Core node is required for full-stack deployment." />,
        nextStepId: 'pool_configuration_testnet4'
    },
    pool_configuration_mainnet: {
      id: 'pool_configuration_mainnet',
      type: 'custom',
      title: "Pool Configuration",
      description: "Configure your local mining pool settings.",
      component: <PoolConfigForm />,
      nextStepId: 'client_template_decision'
    },
    pool_configuration_testnet4: {
      id: 'pool_configuration_testnet4',
      type: 'custom',
      title: "Pool Configuration",
      description: "Configure your local mining pool settings.",
      component: <PoolConfigForm />,
      nextStepId: 'client_template_decision'
    },
    client_template_decision: {
      id: 'client_template_decision',
      type: 'question',
      title: "Miner Configuration",
      description: "Do you want to construct your own block templates (JDC)?",
      options: [
        { id: 'opt_client_tpl_yes', label: "Yes, construct templates", subLabel: "Use your Bitcoin Core node", value: "yes", nextStepId: "client_configuration", icon: Layers },
        { id: 'opt_client_tpl_no', label: "No, standard mining", subLabel: "Pool constructs templates", value: "no", nextStepId: "translator_proxy_configuration", icon: Cpu }
      ]
    },
    client_configuration: {
      id: 'client_configuration',
      type: 'custom',
      title: "JD Client Configuration",
      description: "Configure your Job Declarator Client settings.",
      component: <ClientConfigForm />,
      nextStepId: 'translator_proxy_configuration'
    },
    translator_proxy_configuration: {
      id: 'translator_proxy_configuration',
      type: 'custom',
      title: "Translator Proxy Configuration",
      description: "Configure the translator proxy settings.",
      component: <TranslatorProxyConfigForm />,
      nextStepId: 'deployment_jd'
    },
    deployment_jd: {
      id: 'deployment_jd',
      type: 'question',
      title: "Choose Deployment Method",
      description: "How would you like to deploy the Full Stack components?",
      options: [
        { id: 'deploy_docker', label: "Docker", subLabel: "Recommended for ease of use", value: "docker", nextStepId: "result_jd_docker", icon: Box },
        { id: 'deploy_bin', label: "Binaries", subLabel: "Manual setup for advanced users", value: "binaries", nextStepId: "result_jd_binaries", icon: Terminal }
      ]
    },
    result_jd_docker: { id: 'result_jd_docker', type: 'result', title: "Full Stack via Docker", component: <DeploymentResultContent type="full-stack" method="docker" /> },
    result_jd_binaries: { id: 'result_jd_binaries', type: 'result', title: "Full Stack via Binaries", component: <DeploymentResultContent type="full-stack" method="binaries" /> },
  }
};

export function FullStackWizard({ className, onComplete }: FullStackWizardProps) {
  return (
    <Wizard config={FULL_STACK_WIZARD_CONFIG} onComplete={onComplete} className={className} />
  );
}

export default FullStackWizard;

