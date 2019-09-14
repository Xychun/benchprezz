#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

let minerCount=$1
let clientCount=$2
let threadCount=$3
let txrate=$4

printf " \n++++++++++++ \nSTOP ALL MINER AND CLIENT NODES \n++++++++++++\n"
./all-stop.sh $minerCount $clientCount
printf " \n++++++++++++ \nINIT GETH ON MINER NODES \n++++++++++++\n"
./all-init.sh $minerCount
printf " \n++++++++++++ \nSTART MINER NODES \n++++++++++++\n"
./all-startMiners.sh $minerCount $clientCount $threadCount $PORT_INIT

#sleep
#stop-all