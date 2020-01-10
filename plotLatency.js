const csv = require('csv-parser');
const fs = require('fs');
const chartJS = require("chart.js");

const myArgs = process.argv.slice(2);
const type = myArgs[0];
const test = myArgs[1];
const wl = myArgs[2];
const minerCount = Number(myArgs[3]);
const clientCount = Number(myArgs[4]);
const startTps = Number(myArgs[5]);
const increment = Number(myArgs[6]);
const rounds = Number(myArgs[7]);
const avgOf = Number(myArgs[8]);

console.log("================= RUNNING PLOT WITH FOLLOWING CONFIGURATION =================");
console.log("type \t\t", type);
console.log("test \t\t", test);
console.log("wl \t\t", wl);
console.log("minerCount \t\t", minerCount);
console.log("clientCount \t\t", clientCount);
console.log("startTps \t\t", startTps);
console.log("increment \t\t", increment);
console.log("rounds \t\t", rounds);
console.log("avgOf \t\t", avgOf);
console.log("========================================================");

var path = "./logs-" + type + "/csv/";
var data = [];
var result = [];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function readData() {
    await fs.readdir(path, function (err, items) {
        items.forEach((file) => {
            fs.createReadStream(path + file)
                .pipe(csv())
                .on('data', (row) => {
                    data.push(row);
                })
        })
    });
    await sleep(2000);
}

function getFilteredData(data, test, wl, minerCount, clientCount, txRate, txLimit) {
    var data = data.filter(obj => { if (obj["Test"] == test && obj["Workload"] == wl && obj["Miner#"] == minerCount && obj["Client#"] == clientCount && obj["Transaction Rate"] == txRate && obj["Transaction Limit"] == txLimit) { return obj } });
    console.log("========================================================");
    var expected = minerCount * avgOf;
    console.log("Expected", minerCount * avgOf, "results");
    console.log("Found", data.length, "results");
    if (expected > data.length) {
        console.log("test, wl, minerCount, clientCount, txRate, txLimit", test, wl, minerCount, clientCount, txRate, txLimit);
        throw "This test requires at least " + avgOf + "entries per miner (" + expected + ") to be averaged into a graph.";
    } else {
        data = data.slice(0, avgOf);
        return data;
    }
}

async function plotDiagram() {
    console.log("Creating the diagram.....");
    console.log("result", result);

    console.log("========================================================");
    console.log('The PNG file was written successfully: ../../results/' + "plotFile")
}

async function main() {
    await readData();
    for (let i = 0; i < rounds; i++) {
        var startLimit = startTps;
        console.log("test, wl, minerCount, clientCount, startTps", test, wl, minerCount, clientCount, 0, startLimit);
        arr = getFilteredData(data, test, wl, minerCount, clientCount, startTps);
        result.push(arr);
    }
    await sleep(2000);
    await plotDiagram();
}

main();



// if (type == "state-channels") {
//     totalTxRate = 0;
//     totalTxLimit = startTps + i * increment;
// } else {
//     totalTxRate = startTps + i * increment;
//     totalTxLimit = 0;
// }