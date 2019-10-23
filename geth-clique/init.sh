#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1

mkdir -p $DATA_DIR

geth --datadir=$DATA_DIR init $GETH_HOME/genesis_clique"_"$minerCount".json"