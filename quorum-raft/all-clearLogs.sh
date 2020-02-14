#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

echo "==== clearing client logs ===="
i=0
for client in `cat $CLIENTS`; do
    echo clearing client logs $client
    ssh -i $SSH_KEY -oStrictHostKeyChecking=no $client $RAFT_HOME/clearLogs.sh
done
echo "==== all clients cleared ===="