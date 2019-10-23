#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh 

rm -rf peers

i=0
for miner in `cat $MINERS`; do
    port=`expr $PORT_INIT + $i`
    echo "admin.addPeer(\"enode://`ssh -i $SSH_KEY $USER@$miner $IBFT_HOME/getEnode.sh 2>/dev/null`@$miner:$port\")" >> $PEERS
  let i=$i+1
done