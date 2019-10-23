#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

mkdir -p $DATA_DIR

bootnode --genkey=nodekey
sudo mv nodekey $DATA_DIR

geth --datadir $DATA_DIR init $RAFT_HOME/genesis_raft.json