#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

for client in `cat $CLIENTS`; do
    ssh -i $SSH_KEY -oStrictHostKeyChecking=no $USER@$client $SC_HOME/stop.sh
    echo stopped node and reset RabbitMQ on client $client
done
