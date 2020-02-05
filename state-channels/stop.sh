#!/bin/bash
cd `dirname ${BASH_SOURCE-$0}`
. env.sh

sudo killall -s KILL node
sudo service rabbitmq-server restart