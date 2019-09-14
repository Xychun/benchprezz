#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

ip_addr=$1
port=$2

geth --nodiscover --datadir=$DATA_DIR --port $port --rpc --rpcaddr 0.0.0.0 --rpccorsdomain "*" --rpcapi "eth,web3,personal,net,miner,admin,debug" --allow-insecure-unlock --unlock 0 --password <(echo -n "${PWD}") --verbosity 5 js <(echo 'console.log(admin.nodeInfo.enode);') 2>/dev/null | grep enode | sed -e "s/@127.0.0.1/@$ip_addr/" | sed -e "s/?discport=0//"