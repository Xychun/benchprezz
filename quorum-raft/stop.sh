#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

sudo killall -KILL geth
sudo rm -r $DATA_DIR/geth
sudo rm -r $DATA_DIR/quorum-raft-state
sudo rm -r $DATA_DIR/raft-snap
sudo rm -r $DATA_DIR/raft-wal
sudo rm -rf $DATA_DIR/geth.ipc