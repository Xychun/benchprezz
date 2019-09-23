#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

sudo killall -KILL parity
rm -r $DATA_DIR/parity
rm -rf $DATA_DIR/parity.ipc
rm -rf $DATA_DIR/history