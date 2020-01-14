#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

test=$1
minerCount=$2
clientCount=$3
txRate=$4
txLimit=$5
wl=$6
startTime=$7
clientId=$8
timeStamp=$9

sudo chronyd -q

accId=$(($clientId - 1))
minerId=$(expr $clientId % $minerCount)
adjTxRate=$(expr $txRate / $clientCount)
adjTxLimit=$(expr $txLimit / $clientCount)

rpcport=`expr $RPCPORT_INIT + $minerId`
readarray accounts < $ACCOUNTS -t
account=${accounts[$accId]}
readarray miners < $MINERS -t
miner="$(echo -e "${miners[$minerId]}" | tr -d '[:space:]')"
endpoint=$miner:$rpcport

mkdir -p $LOG_DIR
mkdir -p $DATA_DIR
mkdir -p $CSV_DIR
cd $BENCHMARK_HOME

if [ $test = "latency" ]; then
    echo "Starting client " $clientId " for endpoint " $endpoint " using account " $account " with configuration:: minerCount: "$minerCount " clientCount: "$clientCount " ajdTxLimit: "$adjTxLimit " workload: "$wl " startTime: "$startTime
    nohup node ./latency.js $endpoint $account $wl $adjTxLimit $startTime $clientId $minerCount $clientCount $test "quorum-IBFT" $timeStamp > $LOG_DIR/$test"_client_"$clientId"_"$wl"_"$minerCount"_miners_"$clientCount"_clients_"$txRate"_txRate_"$txLimit"_txLimit_"$timeStamp 2>&1 &
else
    echo "Starting client " $clientId " for endpoint " $endpoint " using account " $account " with configuration:: minerCount: "$minerCount " clientCount: "$clientCount " ajdTxRate: "$adjTxRate " ajdTxLimit: "$adjTxLimit " workload: "$wl " startTime: "$startTime
    nohup node ./tpsUnsigned.js $endpoint $account $wl $adjTxRate $adjTxLimit $startTime $clientId $minerCount $clientCount $test "quorum-IBFT" $timeStamp > $LOG_DIR/$test"_client_"$clientId"_"$wl"_"$minerCount"_miners_"$clientCount"_clients_"$txRate"_txRate_"$txLimit"_txLimit_"$timeStamp 2>&1 &
fi