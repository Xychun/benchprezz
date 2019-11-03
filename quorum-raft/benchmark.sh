#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1
clientCount=$2
txRate=$3
adjTxRate=$(expr $txRate / $clientCount)
txLimit=$4
adjTxLimit=$(expr $txLimit / $clientCount)
wl=$5

threadCount="1"

printf " \n++++++++++++++++++++++++++++++++++++++++++++++++ \n\tRUNNING BENCHMARK WITH FOLLOWING CONFIGURATION \n++++++++++++++++++++++++++++++++++++++++++++++++\n"
printf "Miner: "$minerCount"\n"
printf "Clients: "$clientCount"\n"
printf "Sending TPS: "$txRate"\n"
printf "Total TXs: "$txLimit"\n"
printf "Workload: "$wl"\n"
printf " \n++++++++++++++++++++++++++++++++++++++++++++++++ \n\t\tSTOP NODES \n++++++++++++++++++++++++++++++++++++++++++++++++\n"
./all-stop.sh $minerCount $clientCount
printf " \n++++++++++++++++++++++++++++++++++++++++++++++++ \n\t\tINIT RAFT ON NODES \n++++++++++++++++++++++++++++++++++++++++++++++++\n"
./all-init.sh $minerCount
printf " \n++++++++++++++++++++++++++++++++++++++++++++++++ \n\t\tSTART NODES \n++++++++++++++++++++++++++++++++++++++++++++++++\n"
./all-startMiners.sh $minerCount
printf " \n++++++++++++++++++++++++++++++++++++++++++++++++ \n\t\tSTART CLIENT NODES \n++++++++++++++++++++++++++++++++++++++++++++++++\n"
./all-startClients.sh $minerCount $clientCount $adjTxRate $adjTxLimit $wl

count=0
total=300
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