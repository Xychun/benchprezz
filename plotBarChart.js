const csv = require('csv-parser');
const fs = require('fs');
const Chart = require('node-chartjs');
const chart = new Chart(1000, 1000)
// const chartJS = require("chart.js");


const myArgs = process.argv.slice(2);
const test = myArgs[0];
const avgOf = Number(myArgs[1]);

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
 * @dev Merges all tests into 1 object each based on the "Date" key, averaging the duration and latency, summing up the TPS of each client's throughput.
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

function getTxLimits(data) {
    var txLimits = [];
    data.forEach((obj) => {
        var value = obj["Transaction Limit"]
        if (!txLimits.includes(value)) {
            txLimits.push(value)
        }
    })
    txLimits.sort();
    return txLimits;
}


function findMinLatency(data) {
    var obj = data.find(function (obj) { return obj["Average Latency"] == Math.min.apply(Math, data.map(function (obj) { return obj["Average Latency"]; })); })
    return obj;
}

function findMaxTPS(data) {
    var obj = data.find(function (obj) { return obj["Average TPS"] == Math.max.apply(Math, data.map(function (obj) { return obj["Average TPS"]; })); })
    return obj;
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

// function getSpecificTestData(data, date) {
//     return data.filter(obj => { return obj["Date"] == date });
// }

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

    var data = {
        labels: ['Geth-clique', 'Parity-aura', 'Quorum-raft', 'State-channels'],
        datasets: [{
            barPercentage: 0.5,
            barThickness: 6,
            maxBarThickness: 8,
            minBarLength: 2,
            data: resultData,
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    };
    var options = {
        plugins: {
            beforeDraw: function (chartInstance) {
                var ctx = chartInstance.chart.ctx;
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
            },
            afterDraw: function (chartInstance) {
                var ctx = chartInstance.chart.ctx;

                ctx.font = "14px Georgia";
                ctx.fillStyle = "black";
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                chartInstance.data.datasets.forEach(function (dataset) {
                    for (var i = 0; i < dataset.data.length; i++) {
                        var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
                        ctx.fillText(dataset.data[i], model.x, model.y - 2);
                    }
                });
            }
        },
        legend: { display: false },
        showTooltips: true,
        title: {
            fontSize: 26,
            fontStyle: 'bold',
            display: true,
            text: 'Peak Performance - TPS',
            fontColor: '#000000',
            padding: 40
        },
        scales: {
            xAxes: [{
                ticks: {
                    fontStyle: 'bold',
                    fontSize: 14
                },
                scaleLabel: {
                    display: true,
                    labelString: 'Implementation',
                    fontSize: 16,
                    fontStyle: 'bold',
                    fontColor: '#000000',
                }
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    fontStyle: 'bold',
                    fontSize: 14
                },
                scaleLabel: {
                    display: true,
                    labelString: 'tx/s',
                    fontSize: 16,
                    fontStyle: 'bold',
                    fontColor: '#000000',
                },
            }]
        }
    };

    if (test == "tps") {
        options.title.text = "Peak Performance - Troughput";
        options.scales.yAxes[0].scaleLabel.labelString = "tx/s";
    } else {
        options.title.text = "Peak Performance - Latency";
        options.scales.yAxes[0].scaleLabel.labelString = "ms";
    }


    const barConfig = {
        type: 'bar',
        data: data,
        options: options
    }

    var plotFile = "./results/" + test + ".png";
    chart.makeChart(barConfig)
        .then(res => {
            chart.drawChart();

            chart.toFile(plotFile)
                .then(_ => {
                    // file is written
                })
        })

    console.log("========================================================");
    console.log('The PNG file was written successfully:', plotFile)
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
            console.log(impl + " minLatencyObj", minLatencyObj);
            resultData.push(minLatencyObj["Average Latency"]);
        } else if (test == "tps") {
            maxTPSObj = await findMaxTPS(advancedData, txLimits);
            console.log(impl + " maxTPSObj", maxTPSObj);
            resultData.push(maxTPSObj["Average TPS"]);
        }
    }
    await plotDiagram();
}

main();