#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1
clientCount=$2
txrate=$3
txLimit=$4
wl=$5

printf " \n++++++++++++++++++++++++++++++++++++++++++++++++ \n\tRUNNING BENCHMARK WITH FOLLOWING CONFIGURATION \n++++++++++++++++++++++++++++++++++++++++++++++++\n"
printf "Miner: "$minerCount"\n"
printf "Clients: "$clientCount"\n"
printf "Sending TPS: "$txrate"\n"
printf "Total TXs: "$txLimit"\n"
printf "Workload: "$wl"\n"
printf " \n++++++++++++++++++++++++++++++++++++++++++++++++ \n\t\tSTOP NODES \n++++++++++++++++++++++++++++++++++++++++++++++++\n"
./all-stop.sh $minerCount $clientCount
printf " \n++++++++++++++++++++++++++++++++++++++++++++++++ \n\t\tINIT IBFT ON NODES \n++++++++++++++++++++++++++++++++++++++++++++++++\n"
./all-init.sh $minerCount
printf " \n++++++++++++++++++++++++++++++++++++++++++++++++ \n\t\tSTART NODES \n++++++++++++++++++++++++++++++++++++++++++++++++\n"
./all-startMiners.sh $minerCount
printf "Booting...\n"
count=0
total=60
pstr="[=======================================================================]"
while [ $count -lt $total ]; do
  sleep 1
  count=$(( $count + 1 ))
  pd=$(( $count * 73 / $total ))
  printf "\r%3d.%1d%% %.${pd}s" $(( $count * 100 / $total )) $(( ($count * 1000 / $total) % 10 )) $pstr
done
printf " \n++++++++++++++++++++++++++++++++++++++++++++++++ \n\t\tSTART CLIENT NODES \n++++++++++++++++++++++++++++++++++++++++++++++++\n"
./all-startClients.sh $minerCount $clientCount $txrate $txLimit $wl

count=0
total=$(expr 60 + $txLimit / $txrate)
pstr="[=======================================================================]"
while [ $count -lt $total ]; do
  sleep 1
  count=$(( $count + 1 ))
  pd=$(( $count * 73 / $total ))
  printf "\r%3d.%1d%% %.${pd}s" $(( $count * 100 / $total )) $(( ($count * 1000 / $total) % 10 )) $pstr
done
echo ""

./all-stop.sh $minerCount $clientCount
printf " \n++++++++++++++++++++++++++++++++++++++++++++++++ \n\t\tEXPERIMENT DONE \n++++++++++++++++++++++++++++++++++++++++++++++++\n"