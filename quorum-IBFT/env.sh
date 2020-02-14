# server - user
USER=ubuntu
# home directory
HOME=/home/$USER
# quorum-IBFT home directory
IBFT_HOME=/home/$USER/benchprezz/quorum-IBFT
# file containing chain info and running IBFT directory
DATA_DIR=$IBFT_HOME/chainInfo
# file containing the node ip addresses
MINERS=$IBFT_HOME/miners
# file containing the node ip addresses
CLIENTS=$IBFT_HOME/clients
# file containing the peer info
PEERS=$IBFT_HOME/peers
# file containing the peer info
STATIC_NODES=$DATA_DIR/static-nodes.json
# file containing the account info
ACCOUNTS=$IBFT_HOME/accounts
# folder that stores the log files (client-side)
LOG_DIR=$IBFT_HOME/logs-quorum-IBFT
# folder that stores the csv log files
CSV_DIR=$LOG_DIR/csv
# folder that contains the keystore
KEY_DIR=$DATA_DIR/keystore
# password for account unlock
PWD="password"
# ssh key file
SSH_KEY=$HOME/.ssh/JDev.pem
# folder that contains the benchmark client executable
BENCHMARK_HOME=$HOME/benchprezz/benchmark/
# port used by quorum nodes
PORT_INIT=20001
# port used by quorum nodes
RPCPORT_INIT=30001