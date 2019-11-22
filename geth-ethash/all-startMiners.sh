#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1

./scrapePeers.sh
readarray accounts < $ACCOUNTS -t

i=0
for miner in `cat $MINERS`; do
  if [[ $i -lt $minerCount ]]; then
    echo sharing peer list with $miner
    scp -i $SSH_KEY -oStrictHostKeyChecking=no $PEERS $USER@$miner:$ETHASH_HOME/
    echo start mining on $miner
    rpcport=`expr $RPCPORT_INIT + $i`
    account=${accounts[$i]}
    echo with unlocked sealer $account
    ssh -i $SSH_KEY -oStrictHostKeyChecking=no $USER@$miner $ETHASH_HOME/startMiner.sh $minerCount $rpcport ${account}
    echo done $miner
  fi
  let i=$i+1
done