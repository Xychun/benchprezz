#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh 

minerCount=$1

rm -rf peers

i=0
for miner in `cat $MINERS`; do
  if [[ $i -lt $minerCount ]]; then
    rpcport=`expr $RPCPORT_INIT + $i`
    echo "admin.addPeer(\"`ssh -i $SSH_KEY $USER@$miner $GETH_HOME/getEnode.sh $miner $rpcport 2>/dev/null | grep enode`\")" >> $PEERS
  fi
  let i=$i+1
done