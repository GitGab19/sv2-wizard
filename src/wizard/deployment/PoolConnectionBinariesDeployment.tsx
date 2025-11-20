// Pool Connection Binaries deployment component
// Deploys: JDC (optional) + Translator Proxy to connect to existing pools

import { useState } from "react";
import { Download, Play, FileDown, Network, CheckCircle2 } from "lucide-react";
import { Button } from "../../components/ui/button";
import { CodeBlock, InfoCard } from '../ui';
import { 
  buildJdClientConfig,
  buildTranslatorConfig
} from '../../config-templates';
import type { ConfigTemplateData } from '../../config-templates';
import { downloadFile } from '../utils';

export const PoolConnectionBinariesDeployment = ({ data }: { data?: any }) => {
  const needsSocketPath = !!data?.bitcoinSocketPath;
  const socketPath = data?.bitcoinSocketPath || "/path/to/node.sock";
  const downloadUrl = "https://github.com/stratum-mining/sv2-apps/releases/tag/v0.1.0";
  const network = (data?.selectedNetwork || "mainnet") as 'mainnet' | 'testnet4' | 'signet';
  
  const [jdcConfigConfirmed, setJdcConfigConfirmed] = useState(false);
  const [translatorConfigConfirmed, setTranslatorConfigConfirmed] = useState(false);
  const [completedClicked, setCompletedClicked] = useState(false);
  
  const allConfigsConfirmed = needsSocketPath 
    ? jdcConfigConfirmed && translatorConfigConfirmed 
    : translatorConfigConfirmed;
  
  // Prepare config data
  const configData: ConfigTemplateData = {
    network,
    socketPath: needsSocketPath ? socketPath : undefined,
    userIdentity: data?.userIdentity,
    jdcSignature: data?.jdcSignature,
    coinbaseRewardAddress: data?.coinbaseRewardScript,
    clientSharesPerMinute: data?.clientSharesPerMinute,
    feeThreshold: data?.clientFeeThreshold,
    minInterval: data?.clientMinInterval,
    shareBatchSize: data?.clientShareBatchSize,
    aggregateChannels: data?.aggregateChannels,
    minIndividualMinerHashrate: data?.minIndividualMinerHashrate,
    selectedPool: data?.selectedPool
  };
  
  // Generate config files using builders
  let jdcConfigContent = "";
  let translatorConfigContent = "";
  
  if (needsSocketPath) {
    // JDC config (custom templates)
    jdcConfigContent = buildJdClientConfig(configData);
    
    // Translator config (connects to JDC)
    translatorConfigContent = buildTranslatorConfig(configData, { useJdc: true });
  } else {
    // Translator config only (pool templates)
    translatorConfigContent = buildTranslatorConfig(configData, { useJdc: false });
  }
  
  // Function to download all configs as a zip file with config/ folder structure
  const downloadAllConfigs = async () => {
    try {
      // Dynamically import JSZip
      const JSZipModule = await import('jszip');
      const JSZip = JSZipModule.default;
      const zip = new JSZip();
      const configFolder = zip.folder('config');
      
      if (configFolder) {
        if (needsSocketPath) {
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
      if (needsSocketPath) {
        downloadFile(jdcConfigContent, 'jd-client-config.toml');
        setTimeout(() => downloadFile(translatorConfigContent, 'translator-config.toml'), 100);
      } else {
        downloadFile(translatorConfigContent, 'translator-config.toml');
      }
    }
  };
  
  // Build launch command
  const launchCommand = needsSocketPath
    ? "cd miner-apps\n./jd_client_sv2 -c ../config/jd-client-config.toml &\n./translator_sv2 -c ../config/translator-config.toml"
    : "cd miner-apps\n./translator_sv2 -c ../config/translator-config.toml";
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
         <InfoCard number={1} title="Download binaries" icon={Download}>
           <p className="text-sm text-muted-foreground mb-3">
             Download <code className="text-xs">miner-apps-{"{architecture}"}.tar.gz</code> for your OS/architecture.
           </p>
           <Button variant="secondary" size="sm" className="w-full text-xs mb-3" asChild>
             <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
               Visit Releases Page
             </a>
           </Button>
           <p className="text-xs text-muted-foreground">
             Extract the archive. It contains <code className="text-[10px]">{needsSocketPath ? "jd_client_sv2 and translator_sv2" : "translator_sv2"}</code> and <code className="text-[10px]">config-examples/</code>.
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
            {needsSocketPath && <li><code className="text-[10px]">config/jd-client-config.toml</code></li>}
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
                if (needsSocketPath) {
                  setJdcConfigConfirmed(checked);
                }
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
          <div className="w-full">
            <InfoCard number={3} title="Launch" icon={Play}>
              <p className="text-sm text-muted-foreground mb-2">Start the binaries with config files from the <code className="text-xs">config/</code> directory:</p>
              <CodeBlock 
                label="Launch command" 
                code={launchCommand}
              />
              <p className="mt-2 text-xs text-muted-foreground">
                {needsSocketPath 
                  ? "jd_client_sv2 creates templates with your Bitcoin Core node. translator_sv2 connects miners to jd_client_sv2."
                  : "translator_sv2 connects to the pool's templates."}
              </p>
            </InfoCard>
          </div>
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

