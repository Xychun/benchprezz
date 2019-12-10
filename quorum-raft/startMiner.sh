#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1
minerId=$2
port=$3
rpcport=$4
raftport=$5
accounts=$6
account=$7

mkdir -p $LOG_DIR
mkdir -p $DATA_DIR

PRIVATE_CONFIG=ignore nohup geth --datadir $DATA_DIR --nodiscover --raft --raftport $raftport --rpc --rpcaddr 0.0.0.0 --rpcport $rpcport --rpcapi "admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,raft" --emitcheckpoints --port $port --networkid 1337 --unlock $accounts --password <(echo -n "${PWD}") --verbosity 5 >> $LOG_DIR/eth_log 2>&1 &
sleep 1
echo miner started

# raftCount=$(( $minerId + 1 ))
# if [[ $minerId -eq "0" ]]; then
#     PRIVATE_CONFIG=ignore nohup geth --datadir $DATA_DIR --nodiscover --raft --raftport $raftport --rpc --rpcaddr 0.0.0.0 --rpcport $rpcport --rpcapi "admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,raft" --emitcheckpoints --port $port --networkid 1337 --verbosity 5 >> $LOG_DIR/eth_log 2>&1 &
#     for peer in `cat $PEERS`; do
#     if [[ $i -lt $minerCount ]]; then
#         echo adding peer $peer
#         geth --exec $peer attach ipc:$DATA_DIR/geth.ipc
#     fi
#         let i=$i+1
#     done
# else
#     PRIVATE_CONFIG=ignore nohup geth --datadir $DATA_DIR --nodiscover --raft --raftport $raftport --raftjoinexisting $raftCount --rpc --rpcaddr 0.0.0.0 --rpcport $rpcport --rpcapi "admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,raft" --emitcheckpoints --port $port --networkid 1337 --verbosity 5 >> $LOG_DIR/eth_log 2>&1 &
# fi
# sleep 1
# echo miner started

