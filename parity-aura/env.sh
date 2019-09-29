# server - user
USER=ubuntu
# home directory
HOME=/home/$USER
# parity-aura home directory
AURA_HOME=/home/$USER/benchprezz/parity-aura
# file containing the miner ip addresses
MINERS=$AURA_HOME/miners
# file containing the client ip addresses
CLIENTS=$AURA_HOME/clients
# file containing the peer info
PEERS=$AURA_HOME/peers
# file containing the peer info
ACCOUNTS=$AURA_HOME/accounts
# folder that stores the log files (client-side)
LOG_DIR=$AURA_HOME/logs-parity-aura
# file containing chain info and running aura directory
DATA_DIR=$AURA_HOME/chainInfo
# folde that contains the keystore
KEY_DIR=$DATA_DIR/keystore
# password for account unlock
PWD="password"
# ssh key file
SSH_KEY=$HOME/.ssh/JDev.pem
# folder that contains the benchmark (client) executable (make sure that you have build the client)
DRIVER_HOME=$HOME/benchprezz/src/macro/kvstore
# port used by ethereum nodes
PORT_INIT=30001
# RPCport used by ethereum nodes
RPCPORT_INIT=8001