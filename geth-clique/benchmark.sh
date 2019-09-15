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
./all-startMiners.sh $minerCount $threadCount
printf " \n++++++++++++ \nSTART CLIENT NODES \n++++++++++++\n"
./all-startClients.sh $minerCount $clientCount $threadCount $txrate

count=0
total=30
pstr="[=======================================================================]"
while [ $count -lt $total ]; do
  sleep 10 # this is work
  count=$(( $count + 1 ))
  pd=$(( $count * 73 / $total ))
  printf "\r%3d.%1d%% %.${pd}s" $(( $count * 100 / $total )) $(( ($count * 1000 / $total) % 10 )) $pstr
done

./all-stop.sh
$minerCount $clientCount

printf " \n++++++++++++ \nEXPERIMENT DONE \n++++++++++++\n"