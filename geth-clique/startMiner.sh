#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

let miners=$1
let threads=$2
let port=$3

mkdir -p $LOG_DIR
geth --datadir=$DATA_DIR init $GETH_HOME/genesis_clique"_"$miners".json"
nohup geth --nodiscover --datadir=$GETH_HOME/chainInfo --port $port --rpc --rpcaddr 0.0.0.0 --rpccorsdomain "*" --rpcapi "eth,web3,personal,net,miner,admin,debug" --allow-insecure-unlock --unlock 0 --password <(echo -n "${PWD}") --verbosity 5 --mine --minerthreads $threads > $LOG_DIR/eth_log 2>&1 &

echo miner started

# sleep 1

# for com in `cat $ETH_HOME/addPeer.txt`; do
#   echo calling $com
#   geth --exec $com attach ipc:$ETH_DATA/geth.ipc
# done