#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh 

mkdir -p $LOG_DIR

for client in `cat $CLIENTS`; do
    scp -r -i ~/.ssh/JDev.pem $USER@$client:$LOG_DIR ./
done