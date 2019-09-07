#!/bin/bash
#arg nnodes
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

for client in `cat $CLIENTS`; do
    ssh -i $SSH_KEY -oStrictHostKeyChecking=no $USER@$client sudo killall -KILL driver 
    echo stopped driver on client $client
done

for miner in `cat $MINERS`; do
    ssh -i $SSH_KEY -oStrictHostKeyChecking=no $USER@$miner $GETH_HOME/stop.sh
    echo stopped geth on miner $miner
done