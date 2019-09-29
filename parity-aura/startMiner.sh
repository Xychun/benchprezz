#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1
threads=$2
rpcport=$3
account=$4

mkdir -p $LOG_DIR
nohup parity --chain $AURA_HOME/genesis_aura"_"$minerCount".json" --base-path $DATA_DIR --rpc --rpcaddr 0.0.0.0 --jsonrpc-port $rpcport --rpccorsdomain "*" --jsonrpc-apis 'web3,eth,pubsub,net,parity,parity_pubsub,traces,rpc,secretstore,parity_set,parity_accounts' --keys-path $KEY_DIR --engine-signer $account --password <(echo -n "${PWD}") > $LOG_DIR/eth_log 2>&1 &
echo miner started with validator $account on rpcport $rpcport
