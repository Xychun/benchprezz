#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

let minerCount=$1
let clientCount=$2
let threadCount=$3
let txrate=$4

echo "==== starting all clients ===="
i=0
for client in `cat $CLIENTS`; do
  if [[ $i -lt $clientCount ]]; then
    echo starting client $client  clientNo=$i threads=$threadCount txrate=$txrate
    ssh -i $SSH_KEY -oStrictHostKeyChecking=no $client $GETH_HOME/startClient.sh $minerCount $clientCount $threadCount $txrate $i
  fi
  let i=$i+1
done
echo "==== all clients started ===="