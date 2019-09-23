#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1
clientCount=$2
threadCount=$3
txrate=$4

echo "==== starting all clients ===="
i=0
for client in `cat $CLIENTS`; do
  if [[ $i -lt $clientCount ]]; then
    echo starting client $client  clientNo=$i threads=$threadCount txrate=$txrate
    ssh -i $SSH_KEY -oStrictHostKeyChecking=no $client $AURA_HOME/startClient.sh $minerCount $clientCount $threadCount $txrate $i
  fi
  let i=$i+1
done
echo "==== all clients started ===="