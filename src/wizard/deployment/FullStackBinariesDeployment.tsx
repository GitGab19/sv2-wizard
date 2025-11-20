// Full Stack Binaries deployment component
// Deploys: SRI Pool + JDS + JDC (optional) + Translator Proxy

import { useState } from "react";
import { Download, Play, FileDown, Network, CheckCircle2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { CodeBlock, InfoCard } from '../ui';
import { 
  buildJdClientConfig,
  buildTranslatorConfig,
  buildPoolServerConfig,
  buildJdsConfig
} from '../../config-templates';
import type { ConfigTemplateData } from '../../config-templates';
import { downloadFile } from '../utils';

export const FullStackBinariesDeployment = ({ data }: { data?: any }) => {
  const socketPath = data?.bitcoinSocketPath || "/path/to/node.sock";
  const downloadUrl = "https://github.com/stratum-mining/sv2-apps/releases/tag/v0.1.0";
  const network = (data?.selectedNetwork || "mainnet") as 'mainnet' | 'testnet4' | 'signet';
  const constructTemplates = data?.constructTemplates !== false; // Default to true for full-stack
  
  const [poolConfigConfirmed, setPoolConfigConfirmed] = useState(false);
  const [jdcConfigConfirmed, setJdcConfigConfirmed] = useState(false);
  const [translatorConfigConfirmed, setTranslatorConfigConfirmed] = useState(false);
  const [completedClicked, setCompletedClicked] = useState(false);
  
  const allConfigsConfirmed = poolConfigConfirmed && jdcConfigConfirmed && translatorConfigConfirmed;
  
  // Prepare config data
  const configData: ConfigTemplateData = {
    network,
    socketPath,
    poolSignature: data?.poolSignature,
    poolPayoutAddress: data?.poolPayoutAddress,
    listenAddress: data?.listenAddress,
    feeThreshold: data?.feeThreshold,
    minInterval: data?.minInterval,
    sharesPerMinute: data?.sharesPerMinute,
    shareBatchSize: data?.shareBatchSize,
    userIdentity: data?.userIdentity,
    jdcSignature: data?.jdcSignature,
    coinbaseRewardAddress: data?.coinbaseRewardScript,
    clientSharesPerMinute: data?.clientSharesPerMinute,
    aggregateChannels: data?.aggregateChannels,
    minIndividualMinerHashrate: data?.minIndividualMinerHashrate,
    coreRpcUser: data?.coreRpcUser,
    coreRpcPass: data?.coreRpcPass
  };
  
  // Generate config files using builders
  const poolConfig = buildPoolServerConfig(configData);
  
  // Only generate JDS config if user wants to construct templates (JD case)
  let jdsConfigContent = "";
  if (constructTemplates) {
    jdsConfigContent = buildJdsConfig(configData);
  }
  
  // Only generate JD client config if user wants to construct templates
  let jdcConfigContent = "";
  if (constructTemplates) {
    jdcConfigContent = buildJdClientConfig(configData);
  }
  
  // Translator config: different upstream based on JD vs non-JD
  const translatorConfigContent = buildTranslatorConfig(configData, {
    useJdc: constructTemplates
  });
  
  // Function to download all configs as a zip file with config/ folder structure
  const downloadAllConfigs = async () => {
    try {
      // Dynamically import JSZip
      const JSZipModule = await import('jszip');
      const JSZip = JSZipModule.default;
      const zip = new JSZip();
      const configFolder = zip.folder('config');
      
      if (configFolder) {
        configFolder.file('pool-config.toml', poolConfig);
        if (constructTemplates) {
          configFolder.file('jd-server-config.toml', jdsConfigContent);
          configFolder.file('jd-client-config.toml', jdcConfigContent);
        }
        configFolder.file('translator-config.toml', translatorConfigContent);
      }
      
      // Generate zip file and download
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'config.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      // Fallback: download files individually if JSZip is not available
      console.warn('JSZip not available, downloading files individually');
      downloadFile(poolConfig, 'pool-config.toml');
      setTimeout(() => downloadFile(jdsConfigContent, 'jd-server-config.toml'), 100);
      if (constructTemplates) {
        setTimeout(() => downloadFile(jdcConfigContent, 'jd-client-config.toml'), 200);
      }
      setTimeout(() => downloadFile(translatorConfigContent, 'translator-config.toml'), constructTemplates ? 300 : 200);
    }
  };
  
  // Build launch command based on whether user wants to construct templates
  const launchCommand = constructTemplates
    ? "cd pool-apps\n./pool -c ../config/pool-config.toml &\n./jd_server -c ../config/jd-server-config.toml &\ncd ../miner-apps\n./jd_client -c ../config/jd-client-config.toml &\n./translator -c ../config/translator-config.toml"
    : "cd pool-apps\n./pool -c ../config/pool-config.toml &\ncd ../miner-apps\n./translator -c ../config/translator-config.toml";
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
         <InfoCard number={1} title="Download binaries" icon={Download}>
           <p className="text-sm text-muted-foreground mb-3">
             Download {constructTemplates ? "both tarballs" : "the required tarballs"} for your OS/architecture:
           </p>
           <ul className="text-xs text-muted-foreground mb-3 space-y-1 list-disc list-inside">
             <li><code className="text-[10px]">pool-apps-{"{architecture}"}.tar.gz</code></li>
             {constructTemplates && <li><code className="text-[10px]">miner-apps-{"{architecture}"}.tar.gz</code></li>}
             {!constructTemplates && <li><code className="text-[10px]">miner-apps-{"{architecture}"}.tar.gz</code></li>}
           </ul>
           <Button variant="secondary" size="sm" className="w-full text-xs mb-3" asChild>
             <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
               Visit Releases Page
             </a>
           </Button>
           <p className="text-xs text-muted-foreground">
             {constructTemplates 
               ? <>Extract both archives. <code className="text-[10px]">pool-apps</code> contains <code className="text-[10px]">pool</code> and <code className="text-[10px]">jd_server</code>. <code className="text-[10px]">miner-apps</code> contains <code className="text-[10px]">jd_client</code> and <code className="text-[10px]">translator</code>. Both include <code className="text-[10px]">config-examples/</code>.</>
               : <>Extract the archives. <code className="text-[10px]">pool-apps</code> contains <code className="text-[10px]">pool</code>. <code className="text-[10px]">miner-apps</code> contains <code className="text-[10px]">translator</code>. Both include <code className="text-[10px]">config-examples/</code>.</>}
           </p>
         </InfoCard>
         <InfoCard number={2} title="Download config files" icon={FileDown}>
           <p className="text-sm text-muted-foreground mb-3">
             Download all generated configuration files:
           </p>
           <Button 
            variant="secondary" 
            size="sm" 
            className="w-full mb-3"
            onClick={downloadAllConfigs}
          >
            <FileDown className="w-4 h-4 mr-2" />
            Download All Config Files
          </Button>
          <p className="text-xs text-muted-foreground mb-2">
            This will download a <code className="text-[10px]">config.zip</code> file containing:
          </p>
          <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside mb-2">
            <li><code className="text-[10px]">config/pool-config.toml</code></li>
            {constructTemplates && <li><code className="text-[10px]">config/jd-server-config.toml</code></li>}
            {constructTemplates && <li><code className="text-[10px]">config/jd-client-config.toml</code></li>}
            <li><code className="text-[10px]">config/translator-config.toml</code></li>
          </ul>
          <p className="text-xs text-muted-foreground">
            Extract the zip file to get the <code className="text-[10px]">config/</code> folder with all configuration files.
          </p>
         </InfoCard>
      </div>

      {/* Confirmation checkbox */}
      <div className="space-y-3">
        <div className="border border-white/10 rounded-lg p-4 bg-white/5">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={allConfigsConfirmed}
              onChange={(e) => {
                const checked = e.target.checked;
                if (checked) {
                  setCompletedClicked(true);
                }
                setPoolConfigConfirmed(checked);
                setJdcConfigConfirmed(checked);
                setTranslatorConfigConfirmed(checked);
              }}
              className="w-5 h-5 rounded border-white/20 bg-black/20 text-primary focus:ring-primary focus:ring-offset-0 focus:ring-2"
            />
            <span className="text-sm text-white">
              I have downloaded and placed all config files in the <code className="text-primary font-semibold">config/</code> directory
            </span>
          </label>
        </div>
      </div>
      
      {allConfigsConfirmed && (
        <>
          <InfoCard number={3} title="Launch" icon={Play}>
            <p className="text-sm text-muted-foreground mb-2">Start the binaries with config files from the <code className="text-xs">config/</code> directory:</p>
            <CodeBlock 
              label="Launch command" 
              code={launchCommand}
            />
            <p className="mt-2 text-xs text-muted-foreground">
              {constructTemplates 
                ? "Start all components in order: JD Server, Pool, JD Client, and Translator."
                : "Start components: Pool and Translator (no JD Server or JD Client needed)."}
            </p>
          </InfoCard>
        </>
      )}

      {completedClicked && (
        <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-green-100 mb-2 flex items-center gap-2">
                <Network className="w-4 h-4" />
                Connect Miners to Translator Endpoint
              </h3>
              <p className="text-sm text-green-200/90 mb-3">
                Point your ASICs at the translator proxy endpoint. The translator listens on port <code className="text-xs font-mono bg-black/20 px-1.5 py-0.5 rounded">34255</code>.
              </p>
              <div className="bg-black/20 rounded p-3">
                <p className="text-xs text-green-200/80 mb-1.5">Connection string:</p>
                <code className="text-sm font-mono text-green-100 block">
                  stratum+tcp://&lt;host-ip&gt;:34255
                </code>
                <p className="text-xs text-green-200/70 mt-2">
                  Replace <code className="text-xs">&lt;host-ip&gt;</code> with your server's IP address or hostname.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

