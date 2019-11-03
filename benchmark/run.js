var ABIs = require('./ABIs');
var myArgs = process.argv.slice(2);

var endpoint = myArgs[0];
var fromAddress = myArgs[1];
var contractType = myArgs[2];
var deployTime = myArgs[3];
var txRate = myArgs[4];
var txLimit = myArgs[5];

var KVStoreABI = ABIs.KVStore;
var StandardContractABI = ABIs.StandardContract;
var txs0 = [] //Tuple<Hash, time> add when received
var txs1 = [] //Tuple<Hash, time> add when mined
let txCount = 0;
let start = 0;
let finish = 0;

var Web3 = require('web3');
var web3 = new Web3("http://" + endpoint);
if (!web3) {
    console.log("Issue connecting to web3 provider at " + endpoint);
} else {
    console.log("Connected web3 provider at " + endpoint);
}

switch (contractType) {
    case "KVStore":
        var byteCode = "0x608060405234801561001057600080fd5b50610553806100206000396000f3fe60806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063693ec85e14610051578063e942b51614610192575b600080fd5b34801561005d57600080fd5b506101176004803603602081101561007457600080fd5b810190808035906020019064010000000081111561009157600080fd5b8201836020820111156100a357600080fd5b803590602001918460018302840111640100000000831117156100c557600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506102f1565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561015757808201518184015260208101905061013c565b50505050905090810190601f1680156101845780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561019e57600080fd5b506102ef600480360360408110156101b557600080fd5b81019080803590602001906401000000008111156101d257600080fd5b8201836020820111156101e457600080fd5b8035906020019184600183028401116401000000008311171561020657600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192908035906020019064010000000081111561026957600080fd5b82018360208201111561027b57600080fd5b8035906020019184600183028401116401000000008311171561029d57600080fd5b91908080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f8201169050808301925050505050505091929192905050506103fe565b005b60606000826040518082805190602001908083835b60208310151561032b5780518252602082019150602081019050602083039250610306565b6001836020036101000a03801982511681845116808217855250505050505090500191505090815260200160405180910390208054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156103f25780601f106103c7576101008083540402835291602001916103f2565b820191906000526020600020905b8154815290600101906020018083116103d557829003601f168201915b50505050509050919050565b806000836040518082805190602001908083835b6020831015156104375780518252602082019150602081019050602083039250610412565b6001836020036101000a0380198251168184511680821785525050505050509050019150509081526020016040518091039020908051906020019061047d929190610482565b505050565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106104c357805160ff19168380011785556104f1565b828001600101855582156104f1579182015b828111156104f05782518255916020019190600101906104d5565b5b5090506104fe9190610502565b5090565b61052491905b80821115610520576000816000905550600101610508565b5090565b9056fea165627a7a72305820ba58adbf1d5401e6b126d87a87067c03ac2d18e0a5dbce882a06a0ce448cbf4f0029";
        break;
    case "StandardContract":
        var byteCode = "0x608060405234801561001057600080fd5b50610271806100206000396000f3fe608060405260043610610041576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff168063e6efb19014610046575b600080fd5b34801561005257600080fd5b506100b8600480360360a081101561006957600080fd5b81019080803560030b9060200190929190803560030b9060200190929190803561ffff169060200190929190803561ffff169060200190929190803560000b90602001909291905050506100ba565b005b6100c2610205565b60a0604051908101604052808760030b81526020018660030b81526020018561ffff1681526020018461ffff1681526020018360000b8152509050806000803373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008201518160000160006101000a81548163ffffffff021916908360030b63ffffffff16021790555060208201518160000160046101000a81548163ffffffff021916908360030b63ffffffff16021790555060408201518160000160086101000a81548161ffff021916908361ffff160217905550606082015181600001600a6101000a81548161ffff021916908361ffff160217905550608082015181600001600c6101000a81548160ff021916908360000b60ff160217905550905050505050505050565b60a060405190810160405280600060030b8152602001600060030b8152602001600061ffff168152602001600061ffff1681526020016000800b8152509056fea165627a7a7230582037781b794e4d501eb2c02c73d017df96012bdf5b913ad005a7844d5f3f514cc10029";
        break;
    default:
        console.log("\nERROR: Contract Type not specified!!!!\n");
}

console.log("Deploying smart contract from " + fromAddress);
web3.eth.sendTransaction({ "from": fromAddress, "data": byteCode, "gas": 1000000 })
    .once('transactionHash', function (hash) { console.log("TX HASH:\n", hash) })
    .once('receipt', function (receipt) { console.log("RECEIPT:\n", receipt) })
    .on('confirmation', function (confNumber, receipt) { /*DO NOTHING*/ })
    .on('error', function (error) { console.log("ERROR\n:", error) })
    .then(function (receipt) {
        // will be fired once the receipt is mined
        console.log("Contract at:", receipt.contractAddress)
        contractAddress = receipt.contractAddress;
    });

function sendTransaction() {
    if (start == 0) {
        start = Date.now();
    }
    tx.send({ "from": fromAddress, "gas": 4000000 })
        .once('transactionHash', function (hash) {
            // console.log("TX RECEIVED:", hash)
            txs0.push({ txHash: hash, time: Date.now() });
        })
        .on('error', function (error) {
            // console.log("ERROR\n:", error)
        })
        .then(function (receipt) {
            // console.log("TX MINED:", receipt.transactionHash)
            txs1.push({ txHash: receipt.transactionHash, time: Date.now() });
            if (txs1.length == txLimit) {
                finish = Date.now();
            }
        });
}

async function evaluate() {
    while (txs1.length < txLimit) {
        await sleep(1000);
    }

    let totalLatency = 0;
    console.log("\nAnalyzing the data....", txs0.length + "txs tracked.\n");
    for (let i = 0; i < txs0.length; i++) {
        totalLatency += txs1[i].time - txs0[i].time;
    }

    if (txCount != txLimit) {
        console.log("\n\n", "SOMETHING WENT REALLY WRONG!", "\n\n");
    }
    console.log("\nDURATION:", finish - start, "\n");
    console.log("\nAVG. TPS:", txCount / ((finish - start) / 1000), "\n");
    console.log("\nAVG. LATENCY:", totalLatency / txs0.length, "\n");
}

function setIntervalX(callback, delay, repetitions) {
    var intervalID = setInterval(function () {

        callback();

        // console.log(txCount + 1 + " of " + repetitions);
        if (++txCount == repetitions) {
            console.log("\nALL TXS SENT - Waiting for mining process to finish!\n");
            clearInterval(intervalID);
        }
    }, delay);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function loop() {
    await sleep(deployTime * 1000);

    switch (contractType) {
        case "KVStore":
            contract = new web3.eth.Contract(KVStoreABI);
            contract.options.address = contractAddress;
            tx = contract.methods.set("hello", "world");
            break;
        case "StandardContract":
            contract = new web3.eth.Contract(StandardContractABI);
            contract.options.address = contractAddress;
            tx = contract.methods.updateState(0, 0, 90, 100, 2);
            break;
        default:
            console.log("\nERROR: Contract Type not specified!!!!\n");
    }

    console.log("\nSending ", txLimit + "txs...\n");
    setIntervalX(function () {
        sendTransaction();
    }, 1000 / txRate, txLimit);
    setTimeout(function () {
        evaluate();
    }, (1000 / txRate) * txLimit);
}

loop();
