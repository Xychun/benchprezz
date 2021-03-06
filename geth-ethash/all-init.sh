#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1

i=0
for miner in `cat $MINERS`; do
  if [[ $i -lt $minerCount ]]; then
    ssh -i $SSH_KEY -oStrictHostKeyChecking=no $USER@$miner $ETHASH_HOME/init.sh $minerCount
  fi
  let i=$i+1
done
