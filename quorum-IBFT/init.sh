#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1

mkdir -p $DATA_DIR

bootnode --genkey=nodekey
sudo mv nodekey $DATA_DIR

geth --datadir $DATA_DIR init $IBFT_HOME/genesis_IBFT"_"$minerCount".json"