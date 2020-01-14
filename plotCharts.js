const csv = require('csv-parser');
const fs = require('fs');
const Chart = require('node-chartjs');
const chart = new Chart(1000, 1000)

const myArgs = process.argv.slice(2);
const avgOf = Number(myArgs[0]);

console.log("=======================================================================================");
console.log("================= RUNNING PEAK PERFORMANCE PLOT WITH FOLLOWING CONFIG =================");
console.log("=======================================================================================");
console.log("avgOf \t\t", avgOf);
console.log("========================================================");

Array.prototype.max = function () {
    return Math.max.apply(null, this);
};

Array.prototype.min = function () {
    return Math.min.apply(null, this);
};

const implementations = ["state-channels"];

/**
 * @dev Merges all tests into 1 object each based on the "Date" key, averaging the duration and latency, summing up the TPS of each client's throughput.
 * @param {*} data The csv data set as json array.
 * @returns Data array object, where each object is one full test.
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
        result.push(getMergedObj(dataArr, ['Test', 'Workload', 'Miner#', 'Client#', 'Transaction Rate', 'Transaction Limit', 'Date'], ['Average TPS'], ['Total duration', 'Average Latency']));
    }
    return result;
}

function getMergedObj(data, keysKeep, keysSum, keysAverage) {
    return getMergedTestData(data, keysKeep, keysSum, keysAverage)[0];
}

// function averages avgOf results
function getAveragedTestData(data, keysGroups, keysAverage) {
    var groups = {},
        result = [];
    data.forEach(obj => {
        var key = keysGroups.map(k => obj[k]).join('|'); // new string by concatenating all of the elements devided by | symbol
        if (!groups[key]) {
            groups[key] = { count: 0, payload: {} };
            keysAverage.forEach(k => groups[key][k] = 0);
            keysGroups.forEach(k => groups[key].payload[k] = obj[k]); // adds all the constants to json already
            result.push(groups[key].payload);
        }
        groups[key].count++;
        if (groups[key].count <= avgOf) {
            keysAverage.forEach(k => {
                groups[key][k] += parseFloat(obj[k]);
                groups[key].payload[k] = (groups[key][k] / groups[key].count).toFixed(2);
            });
        }
    })

    for (var k in groups) {
        if (groups[k].count < avgOf) {
            console.log("The following test setup is missing test data:");
            console.log("Workload:", groups[k].payload['Workload'], "Miner#:", groups[k].payload['Miner#'], "Client#:", groups[k].payload['Client#'], "Transaction Rate:", groups[k].payload['Transaction Rate'], "Transaction Limit:", groups[k].payload['Transaction Limit']);
            console.log("Only got", groups[k].count, 'of', avgOf, "\n");
        }
    }

    return result;
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
    fs.readdir(path, function (err, items) {
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

async function plotBarDiagram(resultData, resultLog, test, fileName) {
    console.log("Creating the diagram.....");

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

    console.log("========================================================");
    var plotFile = "./results/" + fileName + ".png";
    chart.makeChart(barConfig)
        .then(res => {
            chart.drawChart();

            chart.toFile(plotFile)
                .then(_ => {
                    console.log('The PNG file was written successfully:', plotFile)
                    console.log("========================================================\n");
                })
        })

    var logFile = "./results/" + fileName + ".txt";
    fs.writeFile(logFile, resultLog, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log('The TXT file was written successfully:', logFile);
    });
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

async function diagram1() {
    var resultData = [];
    var logData = "";

    await asyncForEach(implementations, async (impl) => {
        var maxTPSObj = 0;
        var path = "./logs-" + impl + "/csv/";

        var data = await readData(path);
        var advancedData = getAdvancedTestData(data);
        var averagedData = getAveragedTestData(advancedData, ['Workload', 'Miner#', 'Client#', 'Transaction Rate', 'Transaction Limit'], ['Total duration', 'Average Latency', 'Average TPS']);

        maxTPSObj = await findMaxTPS(averagedData);
        console.log(impl + " maxTPSObj", maxTPSObj);
        logData = logData + impl + "\nmaxTPSObj: " + JSON.stringify(maxTPSObj);
        resultData.push(maxTPSObj["Average TPS"]);
    })

    console.log("resultData", resultData);
    logData = logData + "\nresultData: " + resultData.toString() + "\n";
    await plotBarDiagram(resultData, logData, "tps", "diagram1-PeakTPS");
}

async function diagram2() {
    var resultData = [];
    var logData = "";

    await asyncForEach(implementations, async (impl) => {
        var minLatencyObj = Infinity;
        var path = "./logs-" + impl + "/csv/";

        data = await readData(path);
        advancedData = await getAdvancedTestData(data);
        averagedData = await getAveragedTestData(advancedData, ['Workload', 'Miner#', 'Client#', 'Transaction Rate', 'Transaction Limit'], ['Total duration', 'Average Latency', 'Average TPS']);

        minLatencyObj = await findMinLatency(averagedData);
        console.log(impl + " minLatencyObj", minLatencyObj);
        logData = logData + impl + "\nminLatencyObj: " + JSON.stringify(minLatencyObj);
        resultData.push(minLatencyObj["Average Latency"]);
    })

    console.log("resultData", resultData);
    logData = logData + "\nresultData: " + resultData.toString() + "\n";
    await plotBarDiagram(resultData, logData, "latency", "diagram2-PeakLat");
}

async function diagram3() {
    var resultData = [];
    var logData = "";

    for (let i = 3; i < implementations; i++) {
        var data = [];
        var advancedData = [];
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
        advancedData = await getAdvancedTestData(data);
        averagedData = await getAveragedTestData(advancedData, ['Workload', 'Miner#', 'Client#', 'Transaction Rate', 'Transaction Limit'], ['Total duration', 'Average Latency', 'Average TPS']);

        maxTPSObj = await findMaxTPS(averagedData);
        console.log(impl + " maxTPSObj", maxTPSObj);
        logData = logData + impl + "\nmaxTPSObj: " + JSON.stringify(maxTPSObj);
        resultData.push(maxTPSObj["Average TPS"]);
    }
    console.log("resultData", resultData);
    logData = logData + "\nresultData: " + resultData.toString() + "\n";
    await plotBarDiagram(resultData, logData, "tps", "diagram1-PeakTPS");
}

async function diagram3() {
    var resultData = [];
    var logData = "";

    for (let i = 3; i < implementations; i++) {
        var data = [];
        var advancedData = [];
        var minLatencyObj = Infinity;

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
        advancedData = await getAdvancedTestData(data);
        averagedData = await getAveragedTestData(advancedData, ['Workload', 'Miner#', 'Client#', 'Transaction Rate', 'Transaction Limit'], ['Total duration', 'Average Latency', 'Average TPS']);

        minLatencyObj = await findMinLatency(averagedData);
        console.log(impl + " minLatencyObj", minLatencyObj);
        logData = logData + impl + "\nminLatencyObj: " + JSON.stringify(minLatencyObj);
        resultData.push(minLatencyObj["Average Latency"]);
    }
    console.log("resultData", resultData);
    logData = logData + "\nresultData: " + resultData.toString() + "\n";
    await plotBarDiagram(resultData, logData, "latency", "diagram2-PeakLat");
}

async function main() {
    await diagram1();
    await diagram2();
    // await diagram3();
}

main();



// function getFilteredData(data, keyArray, valueArray) {
//     return data.filter(obj => {
//         var result = true;
//         keyArray.forEach((key, index) => {
//             if (obj[key] != valueArray[index]) {
//                 result = false;
//             }
//         })
//         return result;
//     });
// }

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

// function getTxLimits(data) {
//     var txLimits = [];
//     data.forEach((obj) => {
//         var value = obj["Transaction Limit"]
//         if (!txLimits.includes(value)) {
//             txLimits.push(value)
//         }
//     })
//     txLimits.sort();
//     return txLimits;
// }

// function getSpecificTestData(data, date) {
//     return data.filter(obj => { return obj["Date"] == date });
// }