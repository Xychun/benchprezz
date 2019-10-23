#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1
rpcport=$2

for peer in `cat $AURA_HOME/peers`; do
  if [[ $i -lt $minerCount ]]; then
    echo adding peer $peer
    curl --data '{"jsonrpc":"2.0","method":"parity_addReservedPeer","params":['$peer'],"id":0}' -H "Content-Type: application/json" -X POST localhost:$rpcport
  fi
    let i=$i+1
done