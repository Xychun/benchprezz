#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh 

minerCount=$1

rm -rf $STATIC_NODES

echo "[" >> $STATIC_NODES
i=0
for miner in `cat $MINERS`; do
  if [[ $i -lt $minerCount ]]; then
      port=`expr $PORT_INIT + $i`
      raftport=`expr $RAFTPORT_INIT + $i`
      if [[ $i -eq $(( $minerCount + -1 )) ]]; then
        echo "\"enode://`ssh -i $SSH_KEY $USER@$miner $IBFT_HOME/getEnode.sh 2>/dev/null`@$miner:$port?discport=0&raftport=$raftport\"" >> $STATIC_NODES
      else
        echo "\"enode://`ssh -i $SSH_KEY $USER@$miner $IBFT_HOME/getEnode.sh 2>/dev/null`@$miner:$port?discport=0&raftport=$raftport\"," >> $STATIC_NODES
      fi
  fi
  let i=$i+1
done
echo "]" >> $STATIC_NODES
