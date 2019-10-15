#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1
threads=$2
rpcport=$3
account=$4

mkdir -p $LOG_DIR
mkdir -p $DATA_DIR

nohup parity --no-ws --chain $SEAL_HOME/genesis_seal"_"$minerCount".json" --base-path $DATA_DIR --jsonrpc-interface all --jsonrpc-port $rpcport --jsonrpc-apis 'web3,eth,pubsub,net,parity,parity_pubsub,traces,rpc,secretstore,parity_set,parity_accounts' --keys-path $KEY_DIR --engine-signer $account --password <(echo -n "${PWD}") --unlock $account > $LOG_DIR/eth_log 2>&1 &
echo miner started with validator $account on rpcport $rpcport
