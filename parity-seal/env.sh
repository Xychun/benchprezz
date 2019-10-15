# server - user
USER=ubuntu
# home directory
HOME=/home/$USER
# parity-seal home directory
SEAL_HOME=/home/$USER/benchprezz/parity-seal
# file containing the miner ip addresses
MINERS=$SEAL_HOME/miners
# file containing the client ip addresses
CLIENTS=$SEAL_HOME/clients
# file containing the peer info
PEERS=$SEAL_HOME/peers
# file containing the peer info
ACCOUNTS=$SEAL_HOME/accounts
# folder that stores the log files (client-side)
LOG_DIR=$SEAL_HOME/logs-parity-seal
# file containing chain info and running seal directory
DATA_DIR=$SEAL_HOME/chainInfo
# folde that contains the keystore
KEY_DIR=$DATA_DIR/keystore
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