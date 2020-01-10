#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

test=$1
minerCount=$2
clientCount=$3
txRate=$4
txLimit=$5
wl=$6

sudo chronyd -q
timeStamp=$(date +"%Y-%m-%d_%H-%M-%S")
now=$(($(date +%s%N)/1000000))
startTime=$((now + 10000 + clientCount*10000))

echo "==== starting all clients ===="
i=0
for client in `cat $CLIENTS`; do
  if [[ $i -lt $clientCount ]]; then
    clientId=$(expr $i + 1)
    echo starting client $client  clientNo=$clientId
    ssh -i $SSH_KEY -oStrictHostKeyChecking=no $client $RAFT_HOME/startClient.sh $test $minerCount $clientCount $txRate $txLimit $wl $startTime $clientId $timeStamp
  fi
  let i=$i+1
done
echo "==== all clients started ===="