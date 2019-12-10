#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1

echo '++ scraping peers for peer list ++'
./scrapePeers.sh $minerCount
echo '++ scraping successful ++'

readarray accounts < $ACCOUNTS -t
a=$( IFS=$'\n'; echo "${accounts[*]}" )
accs=$(echo $a | sed s/\ /\,/g)

i=0
for miner in `cat $MINERS`; do
  if [[ $i -lt $minerCount ]]; then
    echo sharing peer list with $miner
    scp -i $SSH_KEY -oStrictHostKeyChecking=no $STATIC_NODES $USER@$miner:$DATA_DIR/
    echo start mining on $miner
    port=`expr $PORT_INIT + $i`
    rpcport=`expr $RPCPORT_INIT + $i`
    raftport=`expr $RAFTPORT_INIT + $i`
    account=${accounts[$i]}
    ssh -i $SSH_KEY -oStrictHostKeyChecking=no $USER@$miner $RAFT_HOME/startMiner.sh $minerCount $i $port $rpcport $raftport ${accs} ${account}
    echo done $miner
  fi
  let i=$i+1
done
