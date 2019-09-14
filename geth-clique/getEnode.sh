#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

ip_addr=$1
port=$2

#geth --datadir=$ETH_DATA --nodiscover -verbosity 5 --rpc --rpcaddr 0.0.0.0 --rpcport $2 --rpccorsdomain "*" --gasprice 0 --networkid 9119 --unlock 0 --allow-insecure-unlock --password <(echo -n "${PWD}") js <(echo 'console.log(admin.nodeInfo.enode);') 2>/dev/null | grep enode | sed -e "s/@127.0.0.1:30303/@$ip_addr:$port/"
geth --nodiscover --datadir=$DATA_DIR --port $port --rpc --rpcaddr 0.0.0.0 --rpccorsdomain "*" --rpcapi "eth,web3,personal,net,miner,admin,debug" --networkid 1337 --allow-insecure-unlock --unlock 0 --password <(echo -n "${PWD}") js <(echo 'console.log(admin.nodeInfo.enode);') 2>/dev/null | grep enode | sed -e "s/@127.0.0.1/@$ip_addr/" | sed -e "s/?discport=0//"