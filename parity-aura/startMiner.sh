#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1
rpcport=$2
accounts=$3
account=$4

mkdir -p $LOG_DIR
mkdir -p $DATA_DIR

nohup parity --no-discovery --no-ws --chain $AURA_HOME/genesis_aura"_"$minerCount".json" --base-path $DATA_DIR --jsonrpc-interface all --jsonrpc-port $rpcport --jsonrpc-apis 'web3,eth,pubsub,net,parity,parity_pubsub,traces,rpc,secretstore,parity_set,parity_accounts' --keys-path $KEY_DIR --unlock $accounts --password <(echo -n "${PWD}") --fast-unlock --engine-signer $account --gas-floor-target 250000000 --jsonrpc-server-threads 20 --jsonrpc-threads=0  --tx-queue-per-sender 8192 > $LOG_DIR/eth_log 2>&1 &
echo miner started with validator $account on rpcport $rpcport
