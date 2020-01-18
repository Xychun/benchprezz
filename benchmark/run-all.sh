#!/bin/bash
implementation=$1
startTps=$2
increment=$3
rounds=$4

HOME=/home/ubuntu/benchprezz
wl=StandardContract

if [ $implementation = "geth" ]
then
    for k in {1..2}
    do
        # # tps
        for j in {0..4}
        do
            maxi=$((rounds - 1))
            for i in $(seq 0 $maxi);
            do
                tps=$(($startTps + $i * $increment))
                limit=$(($tps * 100))
                miners=$((2**$j))
                $HOME/geth-clique/benchmark.sh tps $miners 16 $tps $limit $wl
            done
        done

        # tps
        # for i in $(seq 4 11); # 2^4 = 16; 2^11 = 2048
        # do
        #     tps=$((2**$i))
        #     limit=$(($tps * 100))
        #     $HOME/geth-clique/benchmark.sh tps 16 16 $tps $limit $wl
        # done
    done
    
    $HOME/geth-clique/all-receiveLogs.sh
fi

if [ $implementation = "parity" ]
then
    for k in {1..2}
    do
        # tps
        for j in {0..4}
        do
            maxi=$((rounds - 1))
            for i in $(seq 0 $maxi);
            do
                tps=$(($startTps + $i * $increment))
                limit=$(($tps * 100))
                miners=$((2**$j))
                $HOME/parity-aura/benchmark.sh tps $miners 16 $tps $limit $wl
            done
        done

        # tps
        # for i in $(seq 4 11); # 2^4 = 16; 2^11 = 2048
        # do
        #     tps=$((2**$i))
        #     limit=$(($tps * 100))
        #     $HOME/parity-aura/benchmark.sh tps 16 16 $tps $limit $wl
        # done
    done
    
    $HOME/parity-aura/all-receiveLogs.sh
fi

if [ $implementation = "quorum" ]
then
    for k in {1..2}
    do
        # tps
        for j in {0..4}
        do
            maxi=$((rounds - 1))
            for i in $(seq 0 $maxi);
            do
                tps=$(($startTps + $i * $increment))
                limit=$(($tps * 100))
                miners=$((2**$j))
                $HOME/quorum-raft/benchmark.sh tps $miners 16 $tps $limit $wl
            done
        done

        # tps
        # for i in $(seq 4 11); # 2^4 = 16; 2^11 = 2048
        # do
        #     tps=$((2**$i))
        #     limit=$(($tps * 100))
        #     $HOME/quorum-raft/benchmark.sh tps 16 16 $tps $limit $wl
        # done
    done

    $HOME/quorum-raft/all-receiveLogs.sh
fi

if [ $implementation = "sc" ]
then
    startLimit=$startTps
    for k in {1..5}
    do
        # tps
        # for j in {1..5}
        # do
        #     maxi=$((rounds - 1))
        #     for i in $(seq 0 $maxi);
        #     do
        #         limit=$(($startLimit + $i * $increment)) # 3360 kgv
        #         nodes=$((2**$j))
        #         $HOME/state-channels/benchmark.sh tps $nodes $limit
        #     done
        # done

        # tps
        for j in {1..5}
        do
            for i in $(seq 1 20);
            do
                nodes=16
                limit=$(($i * 12000))
                $HOME/state-channels/benchmark.sh tps $nodes $limit
            done
        done
    done

    $HOME/state-channels/all-receiveLogs.sh
fi