#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1

./scrapePeers.sh $minerCount
readarray accounts < $ACCOUNTS -t

i=0
for miner in `cat $MINERS`; do
  if [[ $i -lt $minerCount ]]; then
    echo sharing peer list with $miner
    scp -i $SSH_KEY -oStrictHostKeyChecking=no $PEERS $USER@$miner:$IBFT_HOME/
    # scp -i $SSH_KEY -oStrictHostKeyChecking=no $STATIC_NODES $USER@$miner:$DATA_DIR/
    echo start mining on $miner
    port=`expr $PORT_INIT + $i`
    rpcport=`expr $RPCPORT_INIT + $i`
    account=${accounts[$i]}
    ssh -i $SSH_KEY -oStrictHostKeyChecking=no $USER@$miner $IBFT_HOME/startMiner.sh $minerCount $port $rpcport ${account}
    echo done $miner
  fi
  let i=$i+1
done
