#!/bin/bash
implementation=$1
startTps=$2
increment=$3
rounds=$4

HOME=/home/ubuntu/benchprezz
wl=StandardContract

if [ $implementation = "geth-parity" ]
then
    # set to {1..2} to run KVStore aswell
    for k in {1..1}
    do
        # if [ "$k" -eq 2 ]
        # then
        #     wl=KVStore
        # fi

        # GETH_CLIQUE
        # for i in {1..5}
        # do
        #     $HOME/geth-clique/benchmark.sh latency 1 1 100 $wl
        # done

        for j in {0..4}
        do
            maxi=$((rounds - 1))
            for i in $(seq 0 $maxi);
            do
                tps=$(($startTps + $i * $increment))
                limit=$(($tps * 100))
                clients=$((2**$j))
                $HOME/geth-clique/benchmark.sh tps $clients 16 $tps $limit $wl
            done
        done
        $HOME/geth-clique/all-receiveLogs.sh


        # PARITY_AURA
        # for i in {1..5}
        # do
        #     $HOME/parity-aura/benchmark.sh latency 1 1 100 $wl
        # done

        for j in {0..4}
        do
            maxi=$((rounds - 1))
            for i in $(seq 0 $maxi);
            do
                tps=$(($startTps + $i * $increment))
                limit=$(($tps * 100))
                clients=$((2**$j))
                $HOME/parity-aura/benchmark.sh tps $clients 16 $tps $limit $wl
            done
        done
        $HOME/parity-aura/all-receiveLogs.sh
    done
fi


if [ $implementation = "quorum" ]
then
    # set to {1..2} to run KVStore aswell
    for k in {1..5}
    do
        # if [ "$k" -eq 2 ]
        # then
        #     wl=KVStore
        # fi

        # QUORUM_RAFTgit 
        # for i in {1..5}
        # do
        #     $HOME/quorum-raft/benchmark.sh latency 1 1 100 $wl
        # done

        for j in {0..0}
        do
            maxi=$((rounds - 1))
            for i in $(seq 0 $maxi);
            do
                tps=$(($startTps + $i * $increment))
                limit=$(($tps * 100))
                clients=$((2**$j))
                $HOME/quorum-raft/benchmark.sh tps $clients 16 $tps $limit $wl
            done
        done
        $HOME/quorum-raft/all-receiveLogs.sh
    done
fi
