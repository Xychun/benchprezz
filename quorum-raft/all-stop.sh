#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1
clientCount=$2

i=0
for client in `cat $CLIENTS`; do
    if [[ $i -lt $clientCount ]]; then
        ssh -i $SSH_KEY -oStrictHostKeyChecking=no $USER@$client sudo killall -s KILL node
        echo stopped node on client $client
    fi
    let i=$i+1
done

i=0
for miner in `cat $MINERS`; do
    if [[ $i -lt $minerCount ]]; then
        ssh -i $SSH_KEY -oStrictHostKeyChecking=no $USER@$miner $RAFT_HOME/stop.sh
        echo stopped geth on node $miner
    fi
    let i=$i+1
done