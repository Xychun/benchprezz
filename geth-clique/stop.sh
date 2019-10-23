#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

sudo killall -KILL geth
rm -r $DATA_DIR/geth
rm -rf $DATA_DIR/geth.ipc
rm -rf $DATA_DIR/history