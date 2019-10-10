# server - user
USER=ubuntu
# home directory
HOME=/home/$USER
# geth-clique home directory
GETH_HOME=/home/$USER/benchprezz/geth-clique
# file containing the miner ip addresses
MINERS=$GETH_HOME/miners
# file containing the client ip addresses
CLIENTS=$GETH_HOME/clients
# file containing the peer info
PEERS=$GETH_HOME/peers
# file containing the peer info
ACCOUNTS=$GETH_HOME/accounts
# file containing chain info and running geth directory
DATA_DIR=$GETH_HOME/chainInfo
# folder that stores the log files (client-side)
LOG_DIR=$GETH_HOME/logs-geth-clique
# password for account unlock
PWD="password"
# ssh key file
SSH_KEY=$HOME/.ssh/JDev.pem
# folder that contains the benchmark client executable
BENCHMARK_HOME=$HOME/benchprezz/benchmark/
# folder that contains the benchmark (client) executable (make sure that you have build the client)
DRIVER_HOME=$HOME/benchprezz/src/macro/kvstore
# port used by ethereum nodes
PORT_INIT=30001
# RPCport used by ethereum nodes
RPCPORT_INIT=8001
