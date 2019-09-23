#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1
clientCount=$2
threadCount=$3
txrate=$4

printf " \n++++++++++++++++++++++++++++++++++++++++++++++++ \n\t\tSTOP ALL MINER AND CLIENT NODES \n++++++++++++++++++++++++++++++++++++++++++++++++\n"
./all-stop.sh $minerCount $clientCount
printf " \n++++++++++++++++++++++++++++++++++++++++++++++++ \n\t\tSTART MINER NODES \n++++++++++++++++++++++++++++++++++++++++++++++++\n"
./all-startMiners.sh $minerCount $threadCount
printf " \n++++++++++++++++++++++++++++++++++++++++++++++++ \n\t\tSTART CLIENT NODES \n++++++++++++++++++++++++++++++++++++++++++++++++\n"
./all-startClients.sh $minerCount $clientCount $threadCount $txrate

count=0
total=12
pstr="[=======================================================================]"
while [ $count -lt $total ]; do
  sleep 10 # this is work
  count=$(( $count + 1 ))
  pd=$(( $count * 73 / $total ))
  printf "\r%3d.%1d%% %.${pd}s" $(( $count * 100 / $total )) $(( ($count * 1000 / $total) % 10 )) $pstr
done
echo ""

./all-stop.sh $minerCount $clientCount
printf " \n++++++++++++++++++++++++++++++++++++++++++++++++ \n\t\tEXPERIMENT DONE \n++++++++++++++++++++++++++++++++++++++++++++++++\n"