#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

let minerCount=$1
let clientCount=$2

i=0
for client in `cat $CLIENTS`; do
    if [[ $i -lt $clientCount ]]; then
        ssh -i $SSH_KEY -oStrictHostKeyChecking=no $USER@$client sudo killall -KILL driver 
        echo stopped driver on client $client
    fi
    let i=$i+1
done

i=0
for miner in `cat $MINERS`; do
    if [[ $i -lt $minerCount ]]; then
        ssh -i $SSH_KEY -oStrictHostKeyChecking=no $USER@$miner $GETH_HOME/stop.sh
        echo stopped geth on miner $miner
    fi
    let i=$i+1
done