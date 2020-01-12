#!/bin/bash
implementation=$1
startTps=$2
increment=$3
rounds=$4

HOME=/home/ubuntu/benchprezz
wl=StandardContract

if [ $implementation = "geth" ]
then
    # set to {1..2} to run KVStore aswell
    for k in {1..1}
    do
        # if [ "$k" -eq 2 ]
        # then
        #     wl=KVStore
        # fi

        # GETH_CLIQUE
        # latency
        # for i in {0..4}
        # do
        #     $HOME/geth-clique/benchmark.sh latency 1 1 100 100 $wl
        # done

        # tps
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
    done
    
    $HOME/geth-clique/all-receiveLogs.sh
fi

if [ $implementation = "parity" ]
then
    # set to {1..2} to run KVStore aswell
    for k in {1..1}
    do
        # if [ "$k" -eq 2 ]
        # then
        #     wl=KVStore
        # fi

        # PARITY_AURA
        # latency
        # for i in {0..4}
        # do
        #     $HOME/parity-aura/benchmark.sh latency 1 1 100 100 $wl
        # done

        # tps
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
    done
    
    $HOME/parity-aura/all-receiveLogs.sh
fi

if [ $implementation = "quorum" ]
then
    # set to {1..2} to run KVStore aswell
    for k in {1..1}
    do
        # if [ "$k" -eq 2 ]
        # then
        #     wl=KVStore
        # fi

        # QUORUM_RAFT
        # latency
        # for i in {0..4}
        # do
        #     $HOME/quorum-raft/benchmark.sh latency 1 1 100 100 $wl
        # done

        # tps
        for j in {0..4}
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
    done

    $HOME/quorum-raft/all-receiveLogs.sh
fi

if [ $implementation = "sc" ]
then
    startLimit=$startTps
    # set to {1..2} to run KVStore aswell
    for k in {1..1}
    do
        # if [ "$k" -eq 2 ]
        # then
        #     wl=KVStore
        # fi

        # STATE_CHANNELS
        # latency
        # for i in {0..4}
        # do
        #     $HOME/state-channels/benchmark.sh latency
        # done

        # tps
        for j in {1..5}
        do
            maxi=$((rounds - 1))
            for i in $(seq 0 $maxi);
            do
                limit=$(($startLimit + $i * 5000))
                clients=$((2**$j))
                channelCount=$(($clients * ($clients-1) / 2))
                $HOME/state-channels/benchmark.sh tps $clients $limit
            done
        done
    done

    $HOME/state-channels/all-receiveLogs.sh
fi