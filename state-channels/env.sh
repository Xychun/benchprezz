# server - user
USER=ubuntu
# home directory
HOME=/home/$USER
# state-channels home directory
SC_HOME=/home/$USER/benchprezz/state-channels
# file containing the client ip addresses
CLIENTS=$SC_HOME/nodes
# file containing the peer info
ACCOUNTS=$SC_HOME/accounts
# folder that stores the log files (client-side)
LOG_DIR=$SC_HOME/logs-state-channels
# file containing chain info and running sc directory
DATA_DIR=$SC_HOME/chainInfo
# folde that contains the keystore
KEY_DIR=$DATA_DIR/keystore
# password for account unlock
PWD="password"
# ssh key file
SSH_KEY=$HOME/.ssh/JDev.pem
# folder that contains the benchmark client executable
BENCHMARK_HOME=$HOME/benchprezz/benchmark/