// Translator Proxy configuration template

export const TRANSLATOR_CONFIG_TEMPLATE = `# Local Mining Device Downstream Connection
downstream_address = "0.0.0.0"
downstream_port = 34255

# Version support
max_supported_version = 2
min_supported_version = 2

# Extranonce2 size for downstream connections
downstream_extranonce2_size = 4

# User identity/username for pool connection
user_identity = "{{USER_IDENTITY}}"

# Aggregate channels: if true, all miners share one upstream channel; if false, each miner gets its own channel
aggregate_channels = {{AGGREGATE_CHANNELS}}

# Difficulty params
[downstream_difficulty_config]
min_individual_miner_hashrate = {{MIN_INDIVIDUAL_MINER_HASHRATE}}
shares_per_minute = {{SHARES_PER_MINUTE}}
# disable variable difficulty adjustment when using with JDC (JDC handles vardiff)
enable_vardiff = {{ENABLE_VARDIFF}}

[[upstreams]]
address = "{{UPSTREAM_ADDRESS}}"
port = {{UPSTREAM_PORT}}
authority_pubkey = "{{AUTHORITY_PUBLIC_KEY}}"`;

