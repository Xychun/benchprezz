#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

sudo killall -KILL parity
rm -r $DATA_DIR/cache
rm -r $DATA_DIR/chains
rm -r $DATA_DIR/network
rm -rf $DATA_DIR/jsonrpc.ipc

# rm -rf $DATA_DIR/chains/Benchprezz/network/nodes.json