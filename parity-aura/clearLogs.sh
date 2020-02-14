#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

sudo rm -r $LOG_DIR