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

const implementations = ["Geth-clique", "Parity-aura", "Quorum-raft", "State-channels"];
const colors = { 'Geth-clique': "#5083f2", 'Parity-aura': "#41cc48", 'Quorum-raft': "#ffea2b", 'State-channels': "#c20000" };

/**
 * @dev Merges $avgOf tests into 1 object each based on the "Date" key, averaging the duration and latency, summing up the TPS of each client's throughput.
 * @param {*} data The csv data set as json array.
 * @returns Data array object, where each object is one full test.
 */
function getAdvancedTestData(data) {
    var uniqueDates = [];
    var mergedData = [];

    data.forEach(obj => {
        if (!uniqueDates.includes(obj["Date"])) {
            uniqueDates.push(obj["Date"]);
        }
    });

    for (let i = 0; i < uniqueDates.length; i++) {
        dataArr = data.filter(obj => { return obj["Date"] == uniqueDates[i] });
        mergedData.push(getMergedObj(dataArr, ['Test', 'Workload', 'Miner#', 'Client#', 'Transaction Rate', 'Transaction Limit', 'Date'], ['Average TPS'], ['Total duration', 'Average Latency']));
    }

    var keysGroup = ['Miner#', 'Client#', 'Transaction Rate', 'Transaction Limit'];
    var groups = {},
        result = [];
    mergedData.forEach(obj => {
        var key = keysGroup.map(k => obj[k]).join('|'); // new string by concatenating all of the elements devided by | symbol
        if (!groups[key]) {
            groups[key] = { count: 0 };
        }
        groups[key].count++;
        if (groups[key].count <= avgOf) {
            result.push(obj);
        }
    })

    for (var key in groups) {
        if (groups[key].count < avgOf) {
            console.log("The following test setup is missing test data:");
            console.log("'Miner#', 'Client#', 'Transaction Rate', 'Transaction Limit':");
            console.log(key);
            console.log("Only got", groups[key].count, 'of', avgOf, "\n");
        }
    }

    return result;
}

function getMergedObj(data, keysKeep, keysSum, keysAverage) {
    return getAveragedTestData(data, keysKeep, keysSum, keysAverage)[0];
}

function getAveragedTestData(data, keysKeep, keysSum, keysAverage) {
    var groups = {},
        result = [];
    data.forEach(obj => {
        var key = keysKeep.map(k => obj[k]).join('|'); // new string by concatenating all of the elements devided by | symbol
        if (!groups[key]) {
            groups[key] = { count: 0, payload: {} };
            keysAverage.forEach(k => groups[key][k] = 0);
            keysSum.forEach(k => groups[key][k] = 0);
            keysKeep.forEach(k => groups[key].payload[k] = obj[k]); // adds all the constants to json already
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

function getFilteredData(data, keyArray, valueArray) {
    return data.filter(obj => {
        var result = true;
        keyArray.forEach((key, index) => {
            if (obj[key] != valueArray[index]) {
                result = false;
            }
        })
        return result;
    });
}

function compareValues(key) {
    return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            return 0;
        }

        const varA = (typeof a[key] === 'string')
            ? a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string')
            ? b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return comparison;
    };
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

async function plotBarDiagram(resultData, resultLog, title, yLabel, fileName) {
    console.log("Creating the", fileName, "diagram.....");

    var data = {
        labels: implementations,
        datasets: [{
            barPercentage: 0.5,
            barThickness: 6,
            maxBarThickness: 8,
            minBarLength: 2,
            data: resultData,
            backgroundColor: [
                'rgba(80, 131, 242, 0.2)',
                'rgba(65, 204, 72, 0.2)',
                'rgba(255, 234, 43, 0.2)',
                'rgba(194, 0, 0, 0.2)'
            ],
            borderColor: [
                'rgba(80, 131, 242, 1)',
                'rgba(65, 204, 72, 1)',
                'rgba(255, 234, 43, 1)',
                'rgba(194, 0, 0, 1)'
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

                ctx.font = "14px Luminari";
                ctx.fillStyle = "black";
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                chartInstance.data.datasets.forEach(function (dataset) {
                    for (var i = 0; i < dataset.data.length; i++) {
                        var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
                        ctx.fillText(numToPrettyNum(dataset.data[i]), model.x, model.y - 2);
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

    options.title.text = title;
    options.scales.yAxes[0].scaleLabel.labelString = yLabel;

    const plotConfig = {
        type: 'bar',
        data: data,
        options: options
    }

    console.log("========================================================");
    var plotFile = "./results/" + fileName + ".png";
    chart.makeChart(plotConfig)
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
    await sleep(500);
}

async function plotLineDiagram(resultData, resultLog, title, xLabel, yLabel, labelingStart, fileName) {
    console.log("Creating the", fileName, "diagram.....");

    var options = {
        plugins: {
            beforeDraw: function (chartInstance) {
                var ctx = chartInstance.chart.ctx;
                ctx.fillStyle = "white";
                ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
            },
            afterDraw: function (chartInstance) {
                var ctx = chartInstance.chart.ctx;

                ctx.font = "14px Luminari";
                ctx.fillStyle = "black";
                ctx.textAlign = 'center';
                ctx.textBaseline = 'bottom';

                chartInstance.data.datasets.forEach(function (dataset) {
                    for (var i = 0; i < dataset.data.length; i++) {
                        var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
                        if (labelingStart == 100) {
                            if ((i % 6 == 0 && i != 0) || i == dataset.data.length - 1) {
                                ctx.fillText(numToPrettyNum(dataset.data[i].y), model.x - 12, model.y - 2);
                            }
                        } else if (labelingStart == 300) {
                            if ((i % 3 == 0) || i == dataset.data.length - 1) {
                                ctx.fillText(numToPrettyNum(dataset.data[i].y), model.x - 12, model.y - 2);
                            }
                        } else {
                            ctx.fillText(numToPrettyNum(dataset.data[i].y), model.x - 12, model.y - 2);
                        }
                    }
                });
            }
        },
        legend: {
            display: true,
            labels: {
                fontSize: 14,
                fontStyle: 'bold',
                fontColor: '#000000'
            }
        },
        showTooltips: true,
        title: {
            fontSize: 26,
            fontStyle: 'bold',
            display: true,
            text: '',
            fontColor: '#000000',
            padding: 40
        },
        scales: {
            xAxes: [{
                display: true,
                ticks: {
                    fontStyle: 'bold',
                    fontSize: 14
                },
                scaleLabel: {
                    display: true,
                    labelString: '',
                    fontSize: 16,
                    fontStyle: 'bold',
                    fontColor: '#000000',
                }
            }],
            yAxes: [{
                display: true,
                ticks: {
                    beginAtZero: true,
                    fontStyle: 'bold',
                    fontSize: 14
                },
                scaleLabel: {
                    display: true,
                    labelString: '',
                    fontSize: 16,
                    fontStyle: 'bold',
                    fontColor: '#000000',
                },
            }]
        }
    };

    options.title.text = title;
    options.scales.xAxes[0].scaleLabel.labelString = xLabel;
    options.scales.yAxes[0].scaleLabel.labelString = yLabel;

    const plotConfig = {
        type: 'scatter',
        data: resultData,
        options: options
    }

    console.log("========================================================");
    var plotFile = "./results/" + fileName + ".png";
    chart.makeChart(plotConfig)
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
    await sleep(500);
}

function numToPrettyNum(num) {
    var result = roundNumber(num);
    if (result >= 1000) {
        result = Number(result).toLocaleString();
    }
    return result
}

function roundNumber(num) {
    if (num <= 100) {
        return num
    } else {
        return parseInt(num);
    }
}

async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

async function diagram1() {
    var title = "Peak Performance - Throughput";
    var yLabel = "#tx/s";
    var fileName = "diagram1-PeakTPS";

    var resultData = [];
    var resultLog = "";

    await asyncForEach(implementations, async (impl) => {
        console.log("\nImplementation:", impl);
        var maxTPSObj = 0;
        var path = "./logs-" + impl + "/csv/";

        var data = await readData(path);
        var advancedData = getAdvancedTestData(data);
        var averagedData = getAveragedTestData(advancedData, ['Workload', 'Miner#', 'Client#', 'Transaction Rate', 'Transaction Limit'], [], ['Total duration', 'Average Latency', 'Average TPS']);

        maxTPSObj = await findMaxTPS(averagedData);
        console.log(impl + " maxTPSObj", maxTPSObj);
        resultLog = resultLog + impl + "\nmaxTPSObj: " + JSON.stringify(maxTPSObj) + "\n\n";
        resultData.push(maxTPSObj["Average TPS"]);
    })

    console.log("resultData", resultData);
    resultLog = resultLog + "resultData:\n" + JSON.stringify(resultData, null, 4);
    await plotBarDiagram(resultData, resultLog, title, yLabel, fileName);
}

async function diagram2() {
    var title = "Peak Performance - Latency";
    var yLabel = "ms";
    var fileName = "diagram2-PeakLat";

    var resultData = [];
    var resultLog = "";

    await asyncForEach(implementations, async (impl) => {
        console.log("\nImplementation:", impl);
        var minLatencyObj = Infinity;
        var path = "./logs-" + impl + "/csv/";

        data = await readData(path);
        advancedData = await getAdvancedTestData(data);
        averagedData = await getAveragedTestData(advancedData, ['Workload', 'Miner#', 'Client#', 'Transaction Rate', 'Transaction Limit'], [], ['Total duration', 'Average Latency', 'Average TPS']);

        minLatencyObj = await findMinLatency(averagedData);
        console.log(impl + " minLatencyObj", minLatencyObj);
        resultLog = resultLog + impl + "\nminLatencyObj: " + JSON.stringify(minLatencyObj) + "\n\n";
        resultData.push(minLatencyObj["Average Latency"]);
    })

    console.log("resultData", resultData);
    resultLog = resultLog + "resultData:\n" + JSON.stringify(resultData, null, 4);
    await plotBarDiagram(resultData, resultLog, title, yLabel, fileName);
}

async function diagram3() {
    var title = "Throughput at Peak Latency";
    var yLabel = "#tx/s";
    var fileName = "diagram4-TPS-at-PeakLAT";

    var resultData = [];
    var resultLog = "";

    await asyncForEach(implementations, async (impl) => {
        console.log("\nImplementation:", impl);
        var minLatencyObj = Infinity;
        var path = "./logs-" + impl + "/csv/";

        data = await readData(path);
        advancedData = await getAdvancedTestData(data);
        averagedData = await getAveragedTestData(advancedData, ['Workload', 'Miner#', 'Client#', 'Transaction Rate', 'Transaction Limit'], [], ['Total duration', 'Average Latency', 'Average TPS']);

        minLatencyObj = await findMinLatency(averagedData);
        console.log(impl + " minLatencyObj", minLatencyObj);
        resultLog = resultLog + impl + "\nminLatencyObj: " + JSON.stringify(minLatencyObj) + "\n\n";
        resultData.push(minLatencyObj["Average TPS"]);
    })

    console.log("resultData", resultData);
    resultLog = resultLog + "resultData:\n" + JSON.stringify(resultData, null, 4);
    await plotBarDiagram(resultData, resultLog, title, yLabel, fileName);
}

async function diagram4() {
    var title = "Latency at Peak Throughput";
    var yLabel = "ms";
    var fileName = "diagram3-Lat-at-PeakTPS";

    var resultData = [];
    var resultLog = "";

    await asyncForEach(implementations, async (impl) => {
        console.log("\nImplementation:", impl);
        var maxTPSObj = 0;
        var path = "./logs-" + impl + "/csv/";

        var data = await readData(path);
        var advancedData = getAdvancedTestData(data);
        var averagedData = getAveragedTestData(advancedData, ['Workload', 'Miner#', 'Client#', 'Transaction Rate', 'Transaction Limit'], [], ['Total duration', 'Average Latency', 'Average TPS']);

        maxTPSObj = await findMaxTPS(averagedData);
        console.log(impl + " maxTPSObj", maxTPSObj);
        resultLog = resultLog + impl + "\nmaxTPSObj: " + JSON.stringify(maxTPSObj) + "\n\n";
        resultData.push(maxTPSObj["Average Latency"]);
    })

    console.log("resultData", resultData);
    resultLog = resultLog + "resultData:\n" + JSON.stringify(resultData, null, 4);
    await plotBarDiagram(resultData, resultLog, title, yLabel, fileName);
}

async function diagram5() {
    var title = "Peak Throughput at varying network size";
    var xLabel = "#nodes";
    var yLabel = "#tx/s";
    var fileName = "diagram5-PeakTPS-at-nodeCount";

    var resultData = {};
    var datasets = [];
    var resultLog = "";

    await asyncForEach(implementations, async (impl) => {
        console.log("\nImplementation:", impl);
        resultLog = resultLog + impl + "\n";

        var resultObj = {};
        resultObj['fill'] = false;
        resultObj['label'] = impl;
        resultObj['lineTension'] = 0;
        resultObj['borderColor'] = colors[impl];
        resultObj['pointBackgroundColor'] = colors[impl];

        var data = [];
        var path = "./logs-" + impl + "/csv/";
        var testData = await readData(path);
        var advancedData = getAdvancedTestData(testData);

        for (let i = 0; i <= 4; i++) {
            var nodes = 2 ** i;
            var maxTPSObj = 0;
            var filteredData = getFilteredData(advancedData, ['Workload', 'Miner#'], ['StandardContract', nodes]);
            var averagedData = getAveragedTestData(filteredData, ['Workload', 'Miner#', 'Client#', 'Transaction Rate', 'Transaction Limit'], [], ['Total duration', 'Average Latency', 'Average TPS']);
            maxTPSObj = await findMaxTPS(averagedData);
            if (maxTPSObj) {
                data.push({ 'x': nodes, 'y': parseFloat(maxTPSObj["Average TPS"]) });
                console.log(`{x: ${nodes}, y: ${maxTPSObj["Average TPS"]}}`);
                resultLog = resultLog + `{x: ${nodes}, y: ${maxTPSObj["Average TPS"]}}` + "\n";
            }
        }
        resultObj['data'] = data;
        datasets.push(resultObj);
        resultLog = resultLog + "\n";
    })

    resultData['datasets'] = datasets;
    console.log("\nresultData", resultData, "\n");
    resultLog = resultLog + "resultData:\n" + JSON.stringify(resultData, null, 4);
    await plotLineDiagram(resultData, resultLog, title, xLabel, yLabel, 0, fileName);
}

async function diagram6() {
    var title = "Peak Latency at varying network size";
    var xLabel = "#nodes";
    var yLabel = "ms";
    var fileName = "diagram6-PeakLatency-at-nodeCount";

    var resultData = {};
    var datasets = [];
    var resultLog = "";

    await asyncForEach(implementations, async (impl) => {
        console.log("\nImplementation:", impl);
        resultLog = resultLog + impl + "\n";

        var resultObj = {};
        resultObj['fill'] = false;
        resultObj['label'] = impl;
        resultObj['lineTension'] = 0;
        resultObj['borderColor'] = colors[impl];
        resultObj['pointBackgroundColor'] = colors[impl];

        var data = [];
        var path = "./logs-" + impl + "/csv/";
        var testData = await readData(path);
        var advancedData = getAdvancedTestData(testData);

        for (let i = 0; i <= 4; i++) {
            var nodes = 2 ** i;
            var minLatencyObj = Infinity;
            var filteredData = getFilteredData(advancedData, ['Workload', 'Miner#'], ['StandardContract', nodes]);
            var averagedData = getAveragedTestData(filteredData, ['Workload', 'Miner#', 'Client#', 'Transaction Rate', 'Transaction Limit'], [], ['Total duration', 'Average Latency', 'Average TPS']);
            minLatencyObj = await findMinLatency(averagedData);
            if (minLatencyObj) {
                data.push({ 'x': nodes, 'y': parseFloat(minLatencyObj["Average Latency"]) });
                console.log(`{x: ${nodes}, y: ${minLatencyObj["Average Latency"]}}`);
                resultLog = resultLog + `{x: ${nodes}, y: ${minLatencyObj["Average Latency"]}}` + "\n";
            }
        }
        resultObj['data'] = data;
        datasets.push(resultObj);
        resultLog = resultLog + "\n";
    })

    resultData['datasets'] = datasets;
    console.log("\nresultData", resultData, "\n");
    resultLog = resultLog + "resultData:\n" + JSON.stringify(resultData, null, 4);
    await plotLineDiagram(resultData, resultLog, title, xLabel, yLabel, 0, fileName);
}

async function diagram7() {
    var title = "Average Throughput at varying Requests per second";
    var xLabel = "#requests/s";
    var yLabel = "#tx/s";
    var fileName = "diagram7-AvgTPS-at-req-s";

    var resultData = {};
    var datasets = [];
    var resultLog = "";

    await asyncForEach(implementations.slice(0, 3), async (impl) => {
        console.log("\nImplementation:", impl);
        resultLog = resultLog + impl + "\n";

        var resultObj = {};
        resultObj['fill'] = false;
        resultObj['label'] = impl;
        resultObj['lineTension'] = 0;
        resultObj['borderColor'] = colors[impl];
        resultObj['pointBackgroundColor'] = colors[impl];

        var data = [];
        var path = "./logs-" + impl + "/csv/";
        var testData = await readData(path);
        var advancedData = getAdvancedTestData(testData);
        var averagedData = getAveragedTestData(advancedData, ['Transaction Rate', 'Transaction Limit'], [], ['Total duration', 'Average Latency', 'Average TPS']);

        averagedData.forEach(obj => {
            data.push({ 'x': parseFloat(obj['Transaction Rate']), 'y': parseFloat(obj['Average TPS']) });
            console.log(`{ 'x': ${obj['Transaction Rate']}, 'y': ${obj['Average TPS']} }`);
            resultLog = resultLog + `{ 'x': ${obj['Transaction Rate']}, 'y': ${obj['Average TPS']} }` + "\n";
        })

        data.sort(compareValues('x'));
        resultObj['data'] = data;
        datasets.push(resultObj);
        resultLog = resultLog + "\n";
    })

    resultData['datasets'] = datasets;
    console.log("\nresultData", resultData, "\n");
    resultLog = resultLog + "resultData:\n" + JSON.stringify(resultData, null, 4);
    await plotLineDiagram(resultData, resultLog, title, xLabel, yLabel, 100, fileName);
}

async function diagram8() {
    var title = "Average Latency at varying Requests per second";
    var xLabel = "#requests/s";
    var yLabel = "ms";
    var fileName = "diagram8-AvgLAT-at-req-s";

    var resultData = {};
    var datasets = [];
    var resultLog = "";

    await asyncForEach(implementations.slice(0, 3), async (impl) => {
        console.log("\nImplementation:", impl);
        resultLog = resultLog + impl + "\n";

        var resultObj = {};
        resultObj['fill'] = false;
        resultObj['label'] = impl;
        resultObj['lineTension'] = 0;
        resultObj['borderColor'] = colors[impl];
        resultObj['pointBackgroundColor'] = colors[impl];

        var data = [];
        var path = "./logs-" + impl + "/csv/";
        var testData = await readData(path);
        var advancedData = getAdvancedTestData(testData);
        var averagedData = getAveragedTestData(advancedData, ['Transaction Rate', 'Transaction Limit'], [], ['Total duration', 'Average Latency', 'Average TPS']);

        averagedData.forEach(obj => {
            data.push({ 'x': parseFloat(obj['Transaction Rate']), 'y': parseFloat(obj['Average Latency']) });
            console.log(`{ 'x': ${obj['Transaction Rate']}, 'y': ${obj['Average Latency']} }`);
            resultLog = resultLog + `{ 'x': ${obj['Transaction Rate']}, 'y': ${obj['Average Latency']} }` + "\n";
        })

        data.sort(compareValues('x'));
        resultObj['data'] = data;
        datasets.push(resultObj);
        resultLog = resultLog + "\n";
    })

    resultData['datasets'] = datasets;
    console.log("\nresultData", resultData, "\n");
    resultLog = resultLog + "resultData:\n" + JSON.stringify(resultData, null, 4);
    await plotLineDiagram(resultData, resultLog, title, xLabel, yLabel, 100, fileName);
}

async function diagram9() {
    var title = "Average Throughput at varying Transaction Limit";
    var xLabel = "txLimit";
    var yLabel = "#tx/s";
    var fileName = "diagram9-AvgTPS-at-txLimit";

    var resultData = {};
    var datasets = [];
    var resultLog = "";

    await asyncForEach(implementations.slice(3, 4), async (impl) => {
        console.log("\nImplementation:", impl);
        resultLog = resultLog + impl + "\n";

        var resultObj = {};
        resultObj['fill'] = false;
        resultObj['label'] = impl;
        resultObj['lineTension'] = 0;
        resultObj['borderColor'] = colors[impl];
        resultObj['pointBackgroundColor'] = colors[impl];

        var data = [];
        var path = "./logs-" + impl + "/csv/";
        var testData = await readData(path);
        var advancedData = getAdvancedTestData(testData);
        var averagedData = getAveragedTestData(advancedData, ['Transaction Rate', 'Transaction Limit'], [], ['Total duration', 'Average Latency', 'Average TPS']);
        averagedData.forEach(obj => {
            data.push({ 'x': parseFloat(obj['Transaction Limit']), 'y': parseFloat(obj['Average TPS']) });
        })

        data.sort(compareValues('x'));
        console.log(data);
        resultObj['data'] = data;
        datasets.push(resultObj);
        resultLog = resultLog + "\n";
    })

    resultData['datasets'] = datasets;
    console.log("\nresultData", resultData, "\n");
    resultLog = resultLog + "resultData:\n" + JSON.stringify(resultData, null, 4);
    await plotLineDiagram(resultData, resultLog, title, xLabel, yLabel, 300, fileName);
}

async function diagram10() {
    var title = "Average Latency at varying Transaction Limit";
    var xLabel = "txLimit";
    var yLabel = "#tx/s";
    var fileName = "diagram10-AvgLAT-at-txLimit";

    var resultData = {};
    var datasets = [];
    var resultLog = "";

    await asyncForEach(implementations.slice(3, 4), async (impl) => {
        console.log("\nImplementation:", impl);
        resultLog = resultLog + impl + "\n";

        var resultObj = {};
        resultObj['fill'] = false;
        resultObj['label'] = impl;
        resultObj['lineTension'] = 0;
        resultObj['borderColor'] = colors[impl];
        resultObj['pointBackgroundColor'] = colors[impl];

        var data = [];
        var path = "./logs-" + impl + "/csv/";
        var testData = await readData(path);
        var advancedData = getAdvancedTestData(testData);
        var averagedData = getAveragedTestData(advancedData, ['Transaction Rate', 'Transaction Limit'], [], ['Total duration', 'Average Latency', 'Average TPS']);
        averagedData.forEach(obj => {
            data.push({ 'x': parseFloat(obj['Transaction Limit']), 'y': parseFloat(obj['Average Latency']) });
        })

        data.sort(compareValues('x'));
        console.log(data);
        resultObj['data'] = data;
        datasets.push(resultObj);
        resultLog = resultLog + "\n";
    })

    resultData['datasets'] = datasets;
    console.log("\nresultData", resultData, "\n");
    resultLog = resultLog + "resultData:\n" + JSON.stringify(resultData, null, 4);
    await plotLineDiagram(resultData, resultLog, title, xLabel, yLabel, 300, fileName);
}

async function main() {
    // await diagram1();
    // await diagram2();
    // await diagram3();
    // await diagram4();
    // await diagram5();
    // await diagram6();
    // await diagram7();
    // await diagram8();
    await diagram9();
    await diagram10();
}

main();