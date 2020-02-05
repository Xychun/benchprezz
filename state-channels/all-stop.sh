#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

nodeCount=$1

i=0
for client in `cat $CLIENTS`; do
    if [[ $i -lt $nodeCount ]]; then
        ssh -i $SSH_KEY -oStrictHostKeyChecking=no $USER@$client $SC_HOME/stop.sh
        echo stopped node and reset RabbitMQ on client $client
    fi
    let i=$i+1
done
