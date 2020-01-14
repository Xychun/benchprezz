#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

test=$1
nodeCount=$2
txLimit=$3

sudo chronyd -q
timeStamp=`date +%F_%H-%M-%S`
now=$(($(date +%s%N)/1000000))
startTime=$((now + 10000 + $nodeCount*11000))

echo "==== starting all clients ===="
i=0
for client in `cat $CLIENTS`; do
  if [[ $i -lt $nodeCount ]]; then
    echo starting client $client clientNo=$i
    ssh -i $SSH_KEY -oStrictHostKeyChecking=no $client $SC_HOME/startChannel.sh $test $nodeCount $txLimit $i $startTime $timeStamp
  fi
  let i=$i+1
done
echo "==== all clients started ===="