# server - user
USER=ubuntu
# home directory
HOME=/home/$USER
# quorum-raft home directory
RAFT_HOME=/home/$USER/benchprezz/quorum-raft
# file containing chain info and running raft directory
DATA_DIR=$RAFT_HOME/chainInfo
# file containing the node ip addresses
MINERS=$RAFT_HOME/miners
# file containing the node ip addresses
CLIENTS=$RAFT_HOME/clients
# file containing the peer info
PEERS=$RAFT_HOME/peers
# file containing the peer info
STATIC_NODES=$DATA_DIR/static-nodes.json
# file containing the account info
ACCOUNTS=$RAFT_HOME/accounts
# folder that stores the log files (client-side)
LOG_DIR=$RAFT_HOME/logs-quorum-raft
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
PORT_INIT=21001
# port used by quorum nodes
RPCPORT_INIT=22001
# RPCport used by quorum nodes
RAFTPORT_INIT=50401