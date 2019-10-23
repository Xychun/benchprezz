#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

bootnode --nodekey=$DATA_DIR/nodekey --writeaddress 2>/dev/null