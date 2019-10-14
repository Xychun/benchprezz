#!/bin/bash
#args: number_of_nodes
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

minerCount=$1

mkdir -p $DATA_DIR

geth --datadir=$DATA_DIR init $ETHASH_HOME/genesis_clique"_"$minerCount".json"