#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1
clientCount=$2
txrate=$3
txLimit=$4
wl=$5

echo "==== starting all clients ===="
i=0
for client in `cat $CLIENTS`; do
  if [[ $i -lt $clientCount ]]; then
    clientId=$(expr $i + 1)
    echo starting client $client  clientNo=$clientId
    ssh -i $SSH_KEY -oStrictHostKeyChecking=no $client $SEAL_HOME/startClient.sh $minerCount $clientCount $txrate $txLimit $wl clientNo=$clientId
  fi
  let i=$i+1
done
echo "==== all clients started ===="