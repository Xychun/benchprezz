#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

MINER=$1
CLIENTS=$2
THREADS=$3
PORT=$4

geth --datadir=$DATA_DIR init $HOME/genesis_clique"_"$1".json"
#geth account import --datadir=$DATA_DIR --password <(echo -n "${PWD}") $CLIENTS;
geth --nodiscover --datadir=$HOME/chainInfo --port $PORT --rpc --rpcaddr 0.0.0.0 --rpccorsdomain "*" --rpcapi "eth,web3,personal,net,miner,admin,debug" --allow-insecure-unlock --unlock 0 --password <(echo -n "${PWD}") --verbosity 5 --mine --minerthreads $THREADS > $LOG_DIR/eth_log 2>&1 &

echo miner started

# sleep 1

# for com in `cat $ETH_HOME/addPeer.txt`; do
#   echo calling $com
#   geth --exec $com attach ipc:$ETH_DATA/geth.ipc
# done