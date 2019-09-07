#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

# init folder structure
sudo mkdir -p $DATA_DIR
sudo mkdir -p $LOG_DIR