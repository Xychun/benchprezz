#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

let miners=$1
let clients=$2
let threads=$3
let txrate=$4

printf " \n++++++++++++ \nSTOP ALL MINERS AND CLIENTS \n++++++++++++\n"
./all-stop.sh
printf " \n++++++++++++ \nSTART MINERS \n++++++++++++\n"
./all-startMiners.sh $miners $clients $threads $PORT_INIT

#sleep
#stop-all