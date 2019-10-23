#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

rpcport=$2

curl --data '{"jsonrpc":"2.0","method":"parity_enode","params":[],"id":0}' -H "Content-Type: application/json" -X POST localhost:$rpcport 2>/dev/null | grep enode | sed -e 's/{"jsonrpc":"2.0","result":\(.*\),"id":0}/\1/'