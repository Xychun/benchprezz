#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1
clientCount=$2
txRate=$3
txLimit=$4
wl=$5
startTime=$6
clientId=$7

sudo chronyd -q

minerId=$(expr $clientId % $minerCount)
adjTxRate=$(expr $txRate / $clientCount)
adjTxLimit=$(expr $txLimit / $clientCount)
# adjTxRate=$(echo "scale=2; $txRate/$clientCount" | bc)
# adjTxLimit=$(echo "scale=2; $txLimit/$clientCount" | bc)

timestamp=$(date +"%Y-%m-%d_%H-%M-%S")
rpcport=`expr $RPCPORT_INIT + $minerId`
readarray accounts < $ACCOUNTS -t
account=${accounts[$minerId]}
readarray miners < $MINERS -t
miner="$(echo -e "${miners[$minerId]}" | tr -d '[:space:]')"
endpoint=$miner:$rpcport

mkdir -p $LOG_DIR
mkdir -p $DATA_DIR
cd $BENCHMARK_HOME

echo "Starting client " $clientId " for endpoint " $endpoint " with configuration:: minerCount:"$minerCount " clientCount:"$clientCount " txRate:"$adjTxRate " txLimit:"$adjTxLimit " workload:"$wl " startTime:"$startTime
nohup node ./tps.js $endpoint $account $wl $adjTxRate $adjTxLimit $startTime > $LOG_DIR/client_$clientId"_"$wl"_"$minerCount"_"miners_$clientCount"_"clients_$txRate"_"txRate_$txLimit"_"txLimit_$timestamp 2>&1 &