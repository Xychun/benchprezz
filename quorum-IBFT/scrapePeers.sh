#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh 

minerCount=$1

rm -rf peers

i=0
for miner in `cat $MINERS`; do
  if [[ $i -lt $minerCount ]]; then
    rpcport=`expr $RPCPORT_INIT + $i`
    echo "admin.addPeer(\"enode://`ssh -i $SSH_KEY $USER@$miner $IBFT_HOME/getEnode.sh 2>/dev/null`@$miner:$port\")" >> $PEERS
  fi
  let i=$i+1
done