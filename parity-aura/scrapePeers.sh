#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh 

rm -rf peers

i=0
for miner in `cat $MINERS`; do
    rpcport=`expr $RPCPORT_INIT + $i`
    echo `ssh -i $SSH_KEY $USER@$miner $AURA_HOME/getEnode.sh $miner $rpcport 2>/dev/null | grep enode` >> $PEERS
  let i=$i+1
done