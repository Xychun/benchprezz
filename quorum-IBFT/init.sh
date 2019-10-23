#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

mkdir -p $DATA_DIR
geth --datadir $DATA_DIR init $IBFT_HOME/genesis_IBFT.json