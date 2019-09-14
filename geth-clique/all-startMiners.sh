#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

let miners=$1
let threads=$2

#./scrapePeers.sh
sleep 5

i=0
for miner in `cat $MINERS`; do
  echo sharing peer list with $miner
  scp -i $SSH_KEY -oStrictHostKeyChecking=no $PEERS $USER@$miner:$GETH_HOME/
  echo start mining on $miner
  port=`expr $PORT_INIT + $i`
  #rpcport=`expr $RPCPORT_INIT + $i`
  ssh -i $SSH_KEY -oStrictHostKeyChecking=no $USER@$miner $GETH_HOME/startMiner.sh $miners $threads $port
  echo done $miner
  let i=$i+1
done