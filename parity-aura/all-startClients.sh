#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1
clientCount=$2
txRate=$3
txLimit=$4
wl=$5

sudo chronyd -q
now=$(($(date +%s%N)/1000000))
startTime=$((now + 10000 + clientCount*9000))

echo "==== starting all clients ===="
i=0
for client in `cat $CLIENTS`; do
  if [[ $i -lt $clientCount ]]; then
    clientId=$(expr $i + 1)
    echo starting client $client  clientNo=$clientId
    ssh -i $SSH_KEY -oStrictHostKeyChecking=no $client $AURA_HOME/startClient.sh $minerCount $clientCount $txRate $txLimit $wl $startTime $clientId
  fi
  let i=$i+1
done
echo "==== all clients started ===="