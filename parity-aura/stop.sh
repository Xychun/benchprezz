#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

sudo killall -KILL parity
rm -rf $DATA_DIR/jsonrpc.ipc
rm -rf $DATA_DIR/chains/Benchprezz/network/nodes.json