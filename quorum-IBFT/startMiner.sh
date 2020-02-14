#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1
port=$2
rpcport=$3
accounts=$3
account=$4

mkdir -p $LOG_DIR
mkdir -p $DATA_DIR
sudo rm $LOG_DIR/eth_log

sudo cp -r build/bin/ /usr/local

PRIVATE_CONFIG=ignore nohup geth --datadir $DATA_DIR --nodiscover --istanbul.blockperiod 1 --syncmode full --mine --minerthreads 1 --verbosity 5 --networkid 1337 --rpc --rpcaddr 0.0.0.0 --rpcport $rpcport --rpcapi "admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum,istanbul" --unlock $accounts --password <(echo -n "${PWD}") --emitcheckpoints --port $port >> $LOG_DIR/eth_log 2>&1 &
sleep 5
echo miner started

for peer in `cat $IBFT_HOME/peers`; do
  if [[ $i -lt $minerCount ]]; then
    echo adding peer $peer
    geth --exec ${peer} attach ipc:$DATA_DIR/geth.ipc
  fi
    let i=$i+1
done