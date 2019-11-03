#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1
clientCount=$2
txRate=$3
txLimit=$4
wl=$5

echo "==== starting all clients ===="
i=0
for client in `cat $CLIENTS`; do
  if [[ $i -lt $clientCount ]]; then
    echo starting client $client  clientNo=$i txRate=$txRate txLimit=$txLimit
    ssh -i $SSH_KEY -oStrictHostKeyChecking=no $client $AURA_HOME/startClient.sh $minerCount $clientCount $txRate $txLimit $wl $i
  fi
  let i=$i+1
done
echo "==== all clients started ===="