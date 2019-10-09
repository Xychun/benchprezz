#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1
clientCount=$2
txrate=$3
txLimit=$4
let clientId=$5

let deployTime=10

timestamp=$(date +"%Y-%m-%d_%H-%M-%S")
log_dir=$LOG_DIR/$timestamp"_"$1"_"miners_$2"_"clients_$3"_"threads_$4"_"txrate
mkdir -p $log_dir

cd $BENCHMARK_HOME
rpcport=`expr $RPCPORT_INIT + $clientId`
echo "Starting clientID" $5 " for endpoint " $miner:$rpcport
nohup node ./run.js $miner:$rpcport "KVStore" $deployTime $txrate $txLimit  > $log_dir/client_$clientId"_"$miner 2>&1 &
