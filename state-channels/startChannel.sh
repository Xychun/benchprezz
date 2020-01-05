#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

test=$1
nodeCount=$2
txLimit=$3
clientId=$4
startTime=$5

channelCount=$(($nodeCount * ($nodeCount-1) / 2))

adjTxLimit=$(($txLimit / $channelCount / 2))
timestamp=$(date +"%Y-%m-%d_%H-%M-%S")
readarray accounts < $ACCOUNTS -t
account=${accounts[$clientId]}

mkdir -p $LOG_DIR
mkdir -p $DATA_DIR

sudo chronyd -q
echo "Starting client " $clientId " using account " $account " with configuration:: nodeCount: "$nodeCount " txLimit: "$adjTxLimit " startTime: "$startTime
nohup node ./stateChannels.js $clientId $nodeCount $account $adjTxLimit $startTime > $LOG_DIR/$test"_client_"$clientId"_"$nodeCount"_nodes_"$txLimit"_txLimit_"$timestamp 2>&1 &
