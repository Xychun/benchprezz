#!/bin/bash

HOME=/home/ubuntu/benchprezz
wl=StandardContract

for k in {1..5}
do
    # printf " \n================================================\n"
    # printf " \n============== IMPLEMENTATION: GETH ============\n"
    # printf " \n==============            MAX: 1200 ============\n"
    # printf " \n================================================\n"
    # for j in {0..4} #0..4
    # do
    #     for i in $(seq 1 30); # 1 30
    #     do
    #         tps=$((80 * $i))
    #         limit=$(($tps * 100))
    #         miners=$((2**$j))
    #         $HOME/geth-clique/benchmark.sh tps $miners 16 $tps $limit $wl
    #     done
    # done
    # $HOME/geth-clique/all-receiveLogs.sh


    # printf " \n================================================\n"
    # printf " \n============= IMPLEMENTATION: PARITY ===========\n"
    # printf " \n==============            MAX: 1120 ============\n"
    # printf " \n================================================\n"
    # for j in {0..4} # 0..4
    # do
    #     for i in $(seq 1 30); # 1 30
    #     do
    #         tps=$((80 * $i))
    #         limit=$(($tps * 100))
    #         miners=$((2**$j))
    #         $HOME/parity-aura/benchmark.sh tps $miners 16 $tps $limit $wl
    #     done
    # done
    # $HOME/parity-aura/all-receiveLogs.sh

    # printf " \n================================================\n"
    # printf " \n============= IMPLEMENTATION: QUORUM ===========\n"
    # printf " \n==============            MAX: 2000 ============\n"
    # printf " \n================================================\n"
    # for j in {0..4} # 0..4
    # do
    #     for i in $(seq 1 30); # 1 30
    #     do
    #         tps=$((80 * $i))
    #         limit=$(($tps * 100))
    #         miners=$((2**$j))
    #         $HOME/quorum-raft/benchmark.sh tps $miners 16 $tps $limit $wl
    #     done
    # done
    # $HOME/quorum-raft/all-receiveLogs.sh

    printf " \n================================================\n"
    printf " \n=============== IMPLEMENTATION: SC =============\n"
    printf " \n================================================\n"
    for j in {1..5} # 1..5
    do
        for i in $(seq 1 60); # 1 60
        do
            limit=$((16800*$i)) # 3360 kgv
            nodes=$((2**$j))
            $HOME/state-channels/benchmark.sh tps $nodes $limit
        done
    done
    $HOME/state-channels/all-receiveLogs.sh
done