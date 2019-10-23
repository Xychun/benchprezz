#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1

~/istanbul-tools/build/bin/istanbul setup --num $minerCount --nodes --quorum --save --verbose

i=0
for miner in `cat $MINERS`; do
  if [[ $i -lt $minerCount ]]; then
    scp -i $SSH_KEY -oStrictHostKeyChecking=no ./static-nodes.json $USER@$miner:$DATA_DIR/
    scp -i $SSH_KEY -oStrictHostKeyChecking=no ./genesis.json $USER@$miner:$IBFT_HOME/genesis_IBFT.json
    scp -i $SSH_KEY -oStrictHostKeyChecking=no ./${i}/nodekey $USER@$miner:$DATA_DIR/
    ssh -i $SSH_KEY -oStrictHostKeyChecking=no $USER@$miner $IBFT_HOME/init.sh $minerCount
  fi
  let i=$i+1
done
