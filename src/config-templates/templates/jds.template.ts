// Job Declarator Server (JDS) configuration template

export const JDS_CONFIG_TEMPLATE = `# If set to true, JDS require JDC to reveal the transactions they are going to mine on
full_template_mode_required = true

# SRI Pool config
authority_public_key = "{{AUTHORITY_PUBLIC_KEY}}"
authority_secret_key = "{{AUTHORITY_SECRET_KEY}}"
cert_validity_sec = 3600

# Coinbase outputs are specified as descriptors. A full list of descriptors is available at
#     https://github.com/bitcoin/bips/blob/master/bip-0380.mediawiki#appendix-b-index-of-script-expressions
# Although the \`musig\` descriptor is not yet supported and the legacy \`combo\` descriptor never
# will be. If you have an address, embed it in a descriptor like \`addr(<address here>)\`.
coinbase_reward_script = "addr({{COINBASE_REWARD_SCRIPT}})"

# Enable this option to set a predefined log file path.
# When enabled, logs will always be written to this file.
# The CLI option --log-file (or -f) will override this setting if provided.
# log_file = "./jd-server.log"

# SRI Pool JD config
listen_jd_address = "{{LISTEN_JD_ADDRESS}}"
# RPC config for mempool (it can be also the same TP if correctly configured)
core_rpc_url =  "http://{{CORE_RPC_URL}}"
core_rpc_port = {{CORE_RPC_PORT}} # you have to match this port with the network you are running
core_rpc_user =  "{{CORE_RPC_USER}}"
core_rpc_pass =  "{{CORE_RPC_PASS}}"
# Time interval used for JDS mempool update 
[mempool_update_interval]
unit = "secs"
value = 1`;

