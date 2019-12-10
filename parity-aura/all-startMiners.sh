#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1

readarray accounts < $ACCOUNTS -t
a=$( IFS=$'\n'; echo "${accounts[*]}" )
accs=$(echo $a | sed s/\ /\,/g)

i=0
for miner in `cat $MINERS`; do
  if [[ $i -lt $minerCount ]]; then
    echo start mining on $miner
    rpcport=`expr $RPCPORT_INIT + $i`
    account=${accounts[$i]}
    echo with validator $account
    ssh -i $SSH_KEY -oStrictHostKeyChecking=no $USER@$miner $AURA_HOME/startMiner.sh $minerCount $rpcport ${accs} ${account}
  fi
  let i=$i+1
done

echo '++ scraping peers for peer list ++'
sleep 20
./scrapePeers.sh
echo '++ scraping successful ++'
i=0
for miner in `cat $MINERS`; do
  if [[ $i -lt $minerCount ]]; then
    echo sharing peer list with $miner
    scp -i $SSH_KEY -oStrictHostKeyChecking=no $PEERS $USER@$miner:$AURA_HOME/
    rpcport=`expr $RPCPORT_INIT + $i`
    ssh -i $SSH_KEY -oStrictHostKeyChecking=no $USER@$miner $AURA_HOME/connectMiner.sh $minerCount $rpcport
    echo done $miner
  fi
  let i=$i+1
done
