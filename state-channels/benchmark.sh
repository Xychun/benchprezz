#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

test=$1
nodeCount=$2
txLimit=$3

if [ $test = "latency" ]; then
  nodeCount=2
  txLimit=100
fi

channelCount=$(($nodeCount * ($nodeCount-1) / 2))

if [ $(( $txLimit % $channelCount )) -ne 0 ]; then
 printf "++++++++++++++++++++++++++++++++++++++++++++++++ \nPlease pass a txLimit != $txLimit, which is divisible by the given channelCount $channelCount\n++++++++++++++++++++++++++++++++++++++++++++++++\n"
 exit 64
fi
if [ $(( $txLimit % 2 )) -ne 0 ]; then
 printf "++++++++++++++++++++++++++++++++++++++++++++++++ \nPlease pass a txLimit != $txLimit, which is divisible by 2\n++++++++++++++++++++++++++++++++++++++++++++++++\n"
 exit 64
fi

printf " \n++++++++++++++++++++++++++++++++++++++++++++++++ \n\tRUNNING BENCHMARK WITH FOLLOWING CONFIGURATION \n++++++++++++++++++++++++++++++++++++++++++++++++\n"
printf "Testing: "$test"\n"
printf "Nodes: "$nodeCount"\n"
printf "Channel-Connections: "$channelCount"\n"
printf "Total TXs: "$txLimit"\n"
printf " \n++++++++++++++++++++++++++++++++++++++++++++++++ \n\t\tSTOP ALL MINER AND CLIENT NODES \n++++++++++++++++++++++++++++++++++++++++++++++++\n"
./all-stop.sh
printf " \n++++++++++++++++++++++++++++++++++++++++++++++++ \n\t\tSTART NODES \n++++++++++++++++++++++++++++++++++++++++++++++++\n"
./all-startChannels.sh $test $nodeCount $txLimit

if [ $test = "tps" ]; then
  total=$(expr 180)
else
  total=$(expr 60)
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