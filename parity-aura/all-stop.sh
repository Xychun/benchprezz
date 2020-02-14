#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

for client in `cat $CLIENTS`; do
    ssh -i $SSH_KEY -oStrictHostKeyChecking=no $USER@$client sudo killall -s KILL node
    echo stopped node on client $client
done

for miner in `cat $MINERS`; do
    ssh -i $SSH_KEY -oStrictHostKeyChecking=no $USER@$miner $AURA_HOME/stop.sh
    echo stopped parity on miner $miner
done