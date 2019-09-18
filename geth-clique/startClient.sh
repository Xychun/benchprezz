#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

let minerCount=$1
let clientCount=$2
let threadCount=$3
let txrate=$4
let clientId=$5

timestamp=$(date +"%Y-%m-%d_%H-%M-%S")
log_dir=$LOG_DIR/$timestamp"_"$1"_"miners_$2"_"clients_$3"_"threads_$4"_"txrate
mkdir -p $log_dir

i=0
echo "iterating over miners for clientID=$5"
for miner in `cat $MINERS`; do
  cd $DRIVER_HOME
  rpcport=`expr $RPCPORT_INIT + $i`
  echo "Starting driver for endpoint " $miner:$rpcport
  nohup ./driver -db ethereum -threads $threadCount -P workloads/workloada.spec -endpoint $miner:$rpcport -txrate $txrate -wt 60 > $log_dir/client_$clientId"_"$miner 2>&1 &
  let i=i+1
done