// JD Client (JDC) configuration template

export const JD_CLIENT_CONFIG_TEMPLATE = `# SRI JDC config

listening_address = "127.0.0.1:34265"

# Version support
max_supported_version = 2
min_supported_version = 2

# Auth keys for open encrypted connection downstream
authority_public_key = "{{AUTHORITY_PUBLIC_KEY}}"
authority_secret_key = "{{AUTHORITY_SECRET_KEY}}"
cert_validity_sec = 3600

# User identity/username for pool connection
user_identity = "{{USER_IDENTITY}}"

# How many shares we expect to receive in a minute (determines difficulty targets)
shares_per_minute = {{SHARES_PER_MINUTE}}

# How many shares do we want to acknowledge in a batch
share_batch_size = {{SHARE_BATCH_SIZE}}

# JDC supports two modes:
# "FULLTEMPLATE"  - full template mining
# "COINBASEONLY" - coinbase-only mining
mode = "FULLTEMPLATE"

# string to be added into the Coinbase scriptSig
jdc_signature = "{{JDC_SIGNATURE}}"

# Solo Mining config
# Coinbase output used to build the coinbase tx in case of Solo Mining (as last-resort solution of the pools fallback system)
coinbase_reward_script = "addr({{COINBASE_REWARD_SCRIPT}})"

# Bitcoin Core IPC config
[template_provider_type.BitcoinCoreIpc]
unix_socket_path = "{{UNIX_SOCKET_PATH}}"
fee_threshold = {{FEE_THRESHOLD}}
min_interval = {{MIN_INTERVAL}}

# List of upstreams (JDS) used as backup endpoints
[[upstreams]]
authority_pubkey = "{{AUTHORITY_PUBLIC_KEY}}"
pool_address = "75.119.150.111"
pool_port = "34254"
jds_address = "75.119.150.111"
jds_port = "34264"`;

