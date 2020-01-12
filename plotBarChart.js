const csv = require('csv-parser');
const fs = require('fs');
const chartJS = require("chart.js");

const myArgs = process.argv.slice(2);
const test = myArgs[0];
const avgOf = Number(myArgs[2]);

console.log("================= RUNNING PEAK PERFORMANCE PLOT WITH FOLLOWING CONFIG =================");
console.log("test \t\t", test);
console.log("avgOf \t\t", avgOf);
console.log("========================================================");

Array.prototype.max = function () {
    return Math.max.apply(null, this);
};

Array.prototype.min = function () {
    return Math.min.apply(null, this);
};

const implementations = 4;

var resultData = [];

/**
 * @dev Merges all tests into 1 object based on the "Date" key, averaging the duration and latency, summing up the TPS of each client's throughput.
 * @param {*} data The csv data set as json array.
 */
function getAdvancedTestData(data) {
    var uniqueDates = [];
    var result = [];

    data.forEach(obj => {
        if (!uniqueDates.includes(obj["Date"])) {
            uniqueDates.push(obj["Date"]);
        }
    });

    for (let i = 0; i < uniqueDates.length; i++) {
        dataArr = data.filter(obj => { return obj["Date"] == uniqueDates[i] });
        result.push(getMergedObj(dataArr, ['Test', 'Workload', 'Miner#', 'Transaction Rate', 'Transaction Limit', 'Date'], ['Average TPS'], ['Total duration', 'Average Latency']));
    }
    return result;
}

function getMergedObj(data, keysKeep, keysSum, keysAverage) {
    return getMergedTestData(data, keysKeep, keysSum, keysAverage)[0];
}

function getMergedTestData(data, keysKeep, keysSum, keysAverage) {
    var groups = {},
        result = [];
    data.forEach(obj => {
        var key = keysKeep.map(k => obj[k]).join('|');
        if (!groups[key]) {
            groups[key] = { count: 0, payload: {} };
            keysAverage.forEach(k => groups[key][k] = 0);
            keysSum.forEach(k => groups[key][k] = 0);
            keysKeep.forEach(k => groups[key].payload[k] = obj[k]);
            result.push(groups[key].payload);
        }
        groups[key].count++;
        keysAverage.forEach(k => {
            groups[key][k] += parseFloat(obj[k]);
            groups[key].payload[k] = parseFloat((groups[key][k] / groups[key].count).toFixed(2));
        });
        keysSum.forEach(k => {
            groups[key][k] += parseFloat(obj[k]);
            groups[key].payload[k] = parseFloat((groups[key][k]).toFixed(2));
        });
    })
    return result;
}

function getSpecificTestData(data, date) {
    return data.filter(obj => { return obj["Date"] == date });
}

// function getAverages(array, keysGroups, keysAverage) {
//     var groups = {},
//         result = [];
//     array.forEach(obj => {
//         var key = keysGroups.map(k => obj[k]).join('|'); // new string by concatenating all of the elements devided by | symbol
//         if (!groups[key]) {
//             groups[key] = { count: 0, payload: {} };
//             keysAverage.forEach(k => groups[key][k] = 0);
//             keysGroups.forEach(k => groups[key].payload[k] = obj[k]);
//             result.push(groups[key].payload);
//         }
//         groups[key].count++;
//         keysAverage.forEach(k => {
//             groups[key][k] += parseFloat(obj[k]);
//             groups[key].payload[k] = (groups[key][k] / groups[key].count).toFixed(2);
//         });
//     })
//     return result;
// }

// function averageData(data) {
//     averagedData = getAverages(data, ['Test', 'Workload', 'Miner#', 'Transaction Rate', 'Transaction Limit'], ['Average TPS', 'Average Latency'])
// }

function getTxLimits(data) {
    var txLimits = [];
    data.forEach((obj) => {
        var value = obj["Transaction Limit"]
        if (!txLimits.includes(value)) {
            txLimits.push(value)
        }
    })
    txLimits.sort();
    if (test == "tps") {
        txLimits.splice(txLimits.indexOf('100'), 1);
    }
    return txLimits;
}


function findMinLatency(data) {
    var obj = data.find(function (obj) { return obj["Average Latency"] == Math.min.apply(Math, data.map(function (obj) { return obj["Average Latency"]; })); })
    return obj;

    // var minValue = Infinity;
    // txLimits.forEach((element) => {
    //     potentials = data.filter(obj => { return obj["Transaction Limit"] == element });
    //     console.log("potentials", potentials);
    //     values = potentials.map(potential => potential["Average Latency"]);
    //     if (values.min() < minValue) {
    //         minValue = values.min();
    //     }
    // });
    // return minValue;
}

function findMaxTPS(data) {
    var obj = data.find(function (obj) { return obj["Average TPS"] == Math.max.apply(Math, data.map(function (obj) { return obj["Average TPS"]; })); })
    return obj;

    // var maxValue = 0;
    // txLimits.forEach((element) => {
    //     potentials = data.filter(obj => { return obj["Transaction Limit"] == element });
    //     console.log("potentials", potentials);
    //     values = potentials.map(potential => potential["Average TPS"]);
    //     if (values.max() > maxValue) {
    //         maxValue = values.max();
    //     }
    // });
    // return maxValue;
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

// function getFilteredData(data, test, wl, minerCount, clientCount, txRate, txLimit) {
//     var data = data.filter(obj => { if (obj["Test"] == test && obj["Workload"] == wl && obj["Miner#"] == minerCount && obj["Client#"] == clientCount && obj["Transaction Rate"] == txRate && obj["Transaction Limit"] == txLimit) { return obj } });
//     console.log("========================================================");
//     var expected = minerCount * avgOf;
//     console.log("Expected", minerCount * avgOf, "results");
//     console.log("Found", data.length, "results");
//     if (expected > data.length) {
//         console.log("test, wl, minerCount, clientCount, txRate, txLimit", test, wl, minerCount, clientCount, txRate, txLimit);
//         throw "This test requires at least " + avgOf + "entries per miner (" + expected + ") to be averaged into a graph.";
//     } else {
//         data = data.slice(0, avgOf);
//         return data;
//     }
// }

async function plotDiagram() {
    console.log("Creating the diagram.....");
    console.log("resultData", resultData);

    // var myBarChart = new Chart(ctx, {
    //     type: 'bar',
    //     data: {
    //         labels: ['Geth-clique', 'Parity-aura', 'Quorum-raft', 'State-channels'],
    //         datasets: [{
    //             barPercentage: 0.5,
    //             barThickness: 6,
    //             maxBarThickness: 8,
    //             minBarLength: 2,
    //             data: resultData
    //         }]
    //     },
    //     options: options
    // });

    // base64Chart = myBarChart.toBase64Image();
    // console.log("base64Chart", base64Chart);


    console.log("========================================================");
    console.log('The PNG file was written successfully: ../../results/' + "plotFile")
}

async function main() {
    for (let i = 0; i < implementations; i++) {
        var data = [];
        var txLimits = [];
        var advancedData = [];
        var minLatencyObj = Infinity;
        var maxTPSObj = 0;

        switch (i) {
            case 0:
                var path = "./logs-geth-clique/csv/";
                var impl = "geth-clique"
                break;
            case 1:
                var path = "./logs-parity-aura/csv/";
                var impl = "parity-aura"
                break;
            case 2:
                var path = "./logs-quorum-raft/csv/";
                var impl = "quorum-raft"
                break;
            case 3:
                var path = "./logs-state-channels/csv/";
                var impl = "state-channels"
                break;
            default:
            // code block
        }
        data = await readData(path);
        txLimits = await getTxLimits(data);
        advancedData = await getAdvancedTestData(data);

        if (test == "latency") {
            minLatencyObj = await findMinLatency(advancedData, txLimits);
            resultData.push(minLatencyObj["Average Latency"]);
            console.log(impl + " minLatencyObj", minLatencyObj);
        } else if (test == "tps") {
            maxTPSObj = await findMaxTPS(advancedData, txLimits);
            resultData.push(minLatencyObj["Average TPS"]);
            console.log(impl + " maxTPSObj", maxTPSObj);
        }
    }
    await plotDiagram();
}

main();