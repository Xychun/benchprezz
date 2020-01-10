const csv = require('csv-parser');
const fs = require('fs');
const chartJS = require("chart.js");

const myArgs = process.argv.slice(2);
const test = myArgs[0];
const wl = myArgs[1];
const avgOf = Number(myArgs[2]);

console.log("================= RUNNING PEAK PERFORMANCE PLOT WITH FOLLOWING CONFIG =================");
console.log("test \t\t", test);
console.log("wl \t\t", wl);
console.log("avgOf \t\t", avgOf);
console.log("========================================================");

Array.prototype.max = function () {
    return Math.max.apply(null, this);
};

Array.prototype.min = function () {
    return Math.min.apply(null, this);
};

const implementations = 4;

var averagedData = [];
var txLimits = [];
var min = Infinity;
var max = 0;
var resultData = [];

function getAverages(array, keysGroups, keysAverage) {
    var groups = {},
        result = [];
    array.forEach(o => {
        var key = keysGroups.map(k => o[k]).join('|');
        if (!groups[key]) {
            groups[key] = { count: 0, payload: {} };
            keysAverage.forEach(k => groups[key][k] = 0);
            keysGroups.forEach(k => groups[key].payload[k] = o[k]);
            result.push(groups[key].payload);
        }
        groups[key].count++;
        keysAverage.forEach(k => {
            groups[key][k] += parseFloat(o[k]);
            groups[key].payload[k] = (groups[key][k] / groups[key].count).toFixed(2);
        });
    })
    return result;
}

function averageData(data) {
    averagedData = getAverages(data, ['Test', 'Workload', 'Miner#', 'Transaction Rate', 'Transaction Limit'], ['Average TPS', 'Average Latency'])
}

function setTxLimits(data) {
    data.forEach((obj) => {
        var value = obj["Transaction Limit"]
        if (!txLimits.includes(value)) {
            txLimits.push(value)
        }
    })
    txLimits.sort();
    txLimits.splice(txLimits.indexOf('100'), 1);
}

function setMin(data) {
    var minValue = Infinity;
    txLimits.forEach((element) => {
        potentials = data.filter(obj => { return obj["Transaction Limit"] == element });
        values = potentials.map(potential => potential["Average Latency"]);
        if (values.min() < minValue) {
            minValue = values.min();
        }
    });
    console.log("minValue", minValue);
    min = minValue;
}

function setMax(data) {
    var maxValue = 0;
    txLimits.forEach((element) => {
        potentials = data.filter(obj => { return obj["Transaction Limit"] == element });
        values = potentials.map(potential => potential["Average TPS"]);
        if (values.max() > maxValue) {
            maxValue = values.max();
        }
    });
    console.log("maxValue", maxValue);
    max = maxValue;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function readData(path) {
    var data = [];
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
    return data;
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
    for (let i = 3; i < implementations; i++) {
        switch (i) {
            case 0:
                var path = "./logs-geth-clique/csv/";
                break;
            case 1:
                var path = "./logs-parity-aura/csv/";
                break;
            case 2:
                var path = "./logs-quorum-raft/csv/";
                break;
            case 3:
                var path = "./logs-state-channels/csv/";
                break;
            default:
            // code block
        }
    }
    data = await readData(path);
    await setTxLimits(data);

    await averageData(data);

    if (test == "latency") {
        await setMin(averagedData);
        console.log("min", min);
    } else if (test == "tps") {
        await setMax(averagedData);
        console.log("max", max);
    }
    // await plotDiagram();
}

main();