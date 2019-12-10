#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1
rpcport=$2
accounts=$3
account=$4

threads=1

mkdir -p $LOG_DIR
mkdir -p $DATA_DIR

nohup geth --nodiscover --syncmode full --datadir=$DATA_DIR --rpc --rpcaddr 0.0.0.0 --rpcport $rpcport --rpccorsdomain "*" --rpcapi "personal,db,eth,net,web3,txpool,miner" --networkid 1337 --allow-insecure-unlock --unlock $accounts --password <(echo -n "${PWD}") --verbosity 5 --mine --miner.etherbase $account --minerthreads $threads --miner.gastarget 80000000 > $LOG_DIR/eth_log 2>&1 &
sleep 1
echo miner started

for peer in `cat $ETHASH_HOME/peers`; do
  if [[ $i -lt $minerCount ]]; then
    echo adding peer $peer
    geth --exec $peer attach ipc:$DATA_DIR/geth.ipc
  fi
    let i=$i+1
done