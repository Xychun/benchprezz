# server - user
USER=ubuntu
# home directory
HOME=/home/$USER
# geth-ethash home directory
ETHASH_HOME=/home/$USER/benchprezz/geth-ethash
# file containing the miner ip addresses
MINERS=$ETHASH_HOME/miners
# file containing the client ip addresses
CLIENTS=$ETHASH_HOME/clients
# file containing the peer info
PEERS=$ETHASH_HOME/peers
# file containing the peer info
ACCOUNTS=$ETHASH_HOME/accounts
# file containing chain info and running geth directory
DATA_DIR=$ETHASH_HOME/chainInfo
# folder that stores the csv log files
CSV_DIR=$LOG_DIR/csv
# folder that stores the log files (client-side)
LOG_DIR=$ETHASH_HOME/logs-geth-ethash
# password for account unlock
PWD="password"
# ssh key file
SSH_KEY=$HOME/.ssh/JDev.pem
# folder that contains the benchmark client executable
BENCHMARK_HOME=$HOME/benchprezz/benchmark/
# port used by ethereum nodes
PORT_INIT=30001
# RPCport used by ethereum nodes
RPCPORT_INIT=8001
