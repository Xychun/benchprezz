#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

sudo killall -KILL geth
rm -r $DATA_DIR/geth
rm -r $DATA_DIR/quorum-raft-state
rm -r $DATA_DIR/raft-snap
rm -r $DATA_DIR/raft-wal
rm -rf $DATA_DIR/geth.ipc