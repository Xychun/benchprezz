#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1
threads=$2
rpcport=$3
account=$4

mkdir -p $LOG_DIR
nohup parity --chain $AURA_HOME/genesis_aura"_"$minerCount".json" --base-path $DATA_DIR --jsonrpc-port $rpcport --keys-path $KEY_DIR --engine-signer $account --password <(echo -n "${PWD}") > $LOG_DIR/eth_log 2>&1 &
sleep 1
echo miner started

# for peer in `cat $AURA_HOME/peers`; do
#   echo adding peer $peer
#   parity --exec $peer attach ipc:$DATA_DIR/parity.ipc
# done