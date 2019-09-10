#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

MINERS=$1
THREADS=$2

#rm -rf $PEERS
#./scrapeEnodes.sh
sleep 3

i=0
for miner in `cat $MINSERS`; do
  echo sharing peer list with $miner
  scp -i $SSH_KEY -oStrictHostKeyChecking=no $PEERS $USER@$miner:$GETH_HOME/
  echo start mining on $miner
  port=`expr $PORT_INIT + $i`
  #rpcport=`expr $RPCPORT_INIT + $i`
  ssh -i $SSH_KEY -oStrictHostKeyChecking=no $USER@$miner $GETH_HOME/startMiner.sh $MINERS $THREADS $port
  echo done $miner
  let i=$i+1
done