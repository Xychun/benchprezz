#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1
clientCount=$2
txRate=$3
txLimit=$4
wl=$5
clientId=$6

deployTime=10
timestamp=$(date +"%Y-%m-%d_%H-%M-%S")
rpcport=`expr $RPCPORT_INIT + $clientId`
readarray accounts < $ACCOUNTS -t
account=${accounts[$clientId]}
readarray miners < $MINERS -t
miner="$(echo -e "${miners[$clientId]}" | tr -d '[:space:]')"
endpoint=$miner:$rpcport

mkdir -p $LOG_DIR
mkdir -p $DATA_DIR
cd $BENCHMARK_HOME

echo "Starting client " $clientId " for endpoint " $endpoint " with configuration:: minerCount:"$minerCount " clientCount:"$clientCount " txRate:"$txRate " txLimit:"$txLimit " workload:"$wl " deployTime:"$deployTime
nohup node ./run.js $endpoint $account $wl $deployTime $txRate $txLimit > $LOG_DIR/client_$clientId"_"$wl"_"$minerCount"_"miners_$clientCount"_"clients_$txRate"_"txRate_$txLimit"_"txLimit_$timestamp 2>&1 &
