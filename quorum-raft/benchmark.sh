#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

test=$1
minerCount=$2
clientCount=$3
txRate=$4
txLimit=$5
wl=$6

if [ $test = "latency" ]; then
  wl=$txLimit
  txLimit=$txRate
fi

if [ $(( $txRate % $clientCount )) -ne 0 ]; then
 printf "++++++++++++++++++++++++++++++++++++++++++++++++ \nPlease pass a txRate != $txRate, which is divisible by the given client count ${clientCount}\n++++++++++++++++++++++++++++++++++++++++++++++++\n"
 exit 64
fi

printf " \n++++++++++++++++++++++++++++++++++++++++++++++++ \n\tRUNNING BENCHMARK WITH FOLLOWING CONFIGURATION \n++++++++++++++++++++++++++++++++++++++++++++++++\n"
printf "Testing: "$test"\n"
printf "Miners: "$minerCount"\n"
printf "Clients: "$clientCount"\n"
if [ $test = "tps" ]; then
  printf "Sending TPS: "$txRate"\n"
fi
printf "Total TXs: "$txLimit"\n"
printf "Workload: "$wl"\n"
printf " \n++++++++++++++++++++++++++++++++++++++++++++++++ \n\t\tSTOP NODES \n++++++++++++++++++++++++++++++++++++++++++++++++\n"
./all-stop.sh
printf " \n++++++++++++++++++++++++++++++++++++++++++++++++ \n\t\tINIT RAFT ON NODES \n++++++++++++++++++++++++++++++++++++++++++++++++\n"
./all-init.sh $minerCount
printf " \n++++++++++++++++++++++++++++++++++++++++++++++++ \n\t\tSTART MINER NODES \n++++++++++++++++++++++++++++++++++++++++++++++++\n"
./all-startMiners.sh $minerCount
printf " \n++++++++++++++++++++++++++++++++++++++++++++++++ \n\t\tSTART CLIENT NODES \n++++++++++++++++++++++++++++++++++++++++++++++++\n"
./all-startClients.sh $test $minerCount $clientCount $txRate $txLimit $wl

if [ $test = "tps" ]; then
  total=$(expr 300)
else
  total=$(expr 500)
fi
count=0
pstr="[=======================================================================]"
while [ $count -lt $total ]; do
  sleep 1
  count=$(( $count + 1 ))
  pd=$(( $count * 73 / $total ))
  printf "\r%3d.%1d%% %.${pd}s" $(( $count * 100 / $total )) $(( ($count * 1000 / $total) % 10 )) $pstr
done
echo ""

./all-stop.sh
printf " \n++++++++++++++++++++++++++++++++++++++++++++++++ \n\t\tEXPERIMENT DONE \n++++++++++++++++++++++++++++++++++++++++++++++++\n"