#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

MINERS=$1
CLIENTS=$2
THREADS=$3
TXRATE=$4

printf " \n++++++++++++ \nSTOP ALL MINERS AND HOSTS \n++++++++++++\n"
./all-stop.sh
printf " \n++++++++++++ \nSTART MINERS \n++++++++++++\n"
./all-startMiners.sh $1 $2 $3 $PORT_INIT


#sleep
#stop-all