#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1
threadCount=$2

./scrapePeers.sh
readarray accounts < $ACCOUNTS -t

i=0
for miner in `cat $MINERS`; do
  if [[ $i -lt $minerCount ]]; then
    echo sharing peer list with $miner
    scp -i $SSH_KEY -oStrictHostKeyChecking=no $PEERS $USER@$miner:$GETH_HOME/
    echo start mining on $miner
    rpcport=`expr $RPCPORT_INIT + $i`
    account=${accounts[$i]}
    echo with unlocked sealer $account
    ssh -i $SSH_KEY -oStrictHostKeyChecking=no $USER@$miner $GETH_HOME/startMiner.sh $minerCount $threadCount $rpcport ${account}
    echo done $miner
  fi
  let i=$i+1
done