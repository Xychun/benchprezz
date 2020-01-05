#!/usr/bin/env node
const fs = require("fs");
const amqp = require('amqplib');
const Web3Utils = require('web3-utils');
const Web3Abi = require('web3-eth-abi');
const Web3Accounts = require('web3-eth-accounts');
const Accounts = new Web3Accounts();

const myArgs = process.argv.slice(2);
const clientId = myArgs[0];
const clientCount = myArgs[1];
const fromAddress = myArgs[2];
const txLimit = Number(myArgs[3]);
const startTime = Number(myArgs[4]);

const endpoints = fs.readFileSync("./nodes", 'utf-8').split("\n");

let sendAmount = txLimit + 4;
let delay = startTime - Date.now();
let startingTime = 0;
let finishingTime = 0;
let totalDuration = 0;

var txs0 = []; //(clientId, time): add when received
var txs1 = []; //(clientId, time): add when mined
for (let i = 0; i < clientCount; i++) {
    txs0.push([]);
    txs1.push([]);
}

keyFileName = fs.readdirSync("./chainInfo/keystore/").filter(fileName => fileName.endsWith(fromAddress.toLowerCase().substring(2)))[0];
encrypted_key = fs.readFileSync("./chainInfo/keystore/" + keyFileName, 'utf-8');
fromAccount = Accounts.decrypt(encrypted_key, 'password');
var privateKey = fromAccount.privateKey;

let _channelId = 0;
let _status = 3; // enum Status { IDLE, CONNECTING, CONNECTED, RELEASED }
let _nonce = 0;
let _latitude = 0; // in DD(Decimal Degrees) - xx.xxxxx between 90 and -90
let _longitude = 0; // in DD(Decimal Degrees) - xx.xxxxx between 180 and -180
let _direction = 90; // in degrees
let _speed = 100; // in km/h
let _acceleration = 2; // in m/s^2

let hash = Web3Abi.encodeParameters(
    [
        "uint256",
        "address",
        "uint8",
        "uint256",
        "int32",
        "int32",
        "uint16",
        "uint16",
        "int8"
    ],
    [
        _channelId,
        fromAddress,
        _status,
        _nonce,
        _latitude,
        _longitude,
        _direction,
        _speed,
        _acceleration
    ]
);

let hashKeccak = Web3Utils.keccak256(hash);
let sig = Accounts.sign(
    hashKeccak,
    privateKey
);

stateObj = { channelId: _channelId, signature: sig.signature, status: _status, nonce: _nonce, latitude: _latitude, longitude: _longitude, direction: _direction, speed: _speed, acceleration: _acceleration }
var bufferObj = Buffer.from(JSON.stringify(stateObj));

const USER_NAME = "admin";
const USER_PASSWORD = "admin";

var producerQueues = [];
for (let i = 0; i < clientCount; i++) {
    const element = i;
    if (element != clientId) {
        producerQueues[i] = "Queue_" + element;
    }
}

var myChannel;

async function loop() {
    const conn = await amqp.connect(`amqp://${USER_NAME}:${USER_PASSWORD}@${endpoints[clientId]}`);
    myChannel = await conn.createChannel(conn);
    producerQueues.forEach((producerQueueName) => {
        myChannel.assertQueue(producerQueueName, {
            durable: false
        });
    })

    for (let i = 0; i < clientCount; i++) {
        if (i != clientId) {
            const element = endpoints[i];
            const conn = await amqp.connect(`amqp://${USER_NAME}:${USER_PASSWORD}@${element}`);
            channel = await conn.createChannel(conn);
            consumerQueueName = "Queue_" + clientId;
            channel.assertQueue(consumerQueueName, {
                durable: false
            });
            channel.consume(consumerQueueName, function (msg) {
                if (clientId == msg.properties.correlationId) {
                    // console.log('Received:', msg.properties.correlationId, "#" + msg.properties.messageId, "from", msg.properties.replyTo);
                    txs1[i].push(getNanoSecTime());
                }
                messageId = msg.properties.messageId - 1;
                if (messageId > 0) {
                    if (messageId == txLimit) {
                        if (startingTime == 0 && clientId == msg.properties.correlationId) {
                            startingTime = Date.now();
                            console.log("Sending TXS started at ", startingTime, "...");
                        }
                    }
                    myChannel.sendToQueue(msg.properties.replyTo,
                        bufferObj, {
                        correlationId: msg.properties.correlationId,
                        messageId: messageId.toString(),
                        replyTo: "Queue_" + clientId
                    });
                    if (clientId == msg.properties.correlationId) {
                        txs0[i].push(getNanoSecTime());
                    }
                }
                if (messageId == 0) {
                    if (clientId == msg.properties.correlationId) {
                        finishingTime = Date.now();
                        console.log("...", "Sending TXS finished at", finishingTime);
                    }
                    evaluate();
                }
            }, {
                noAck: true
            });
        }
    }

    await sleep(delay);
    console.log("producerQueues", producerQueues);
    producerQueues.forEach((producerQueueName, index) => {
        sendMessage(myChannel, producerQueueName, index);
    })
}

function sendMessage(channel, producerQueue, index) {
    channel.sendToQueue(producerQueue,
        bufferObj, {
        correlationId: clientId,
        messageId: sendAmount.toString(),
        replyTo: "Queue_" + clientId
    });
    txs0[index].push(getNanoSecTime());
}

var evaluateCounter = 0;
async function evaluate() {
    evaluateCounter++;
    if (evaluateCounter == clientCount - 1) {
        // txs0.splice(clientId, 1);
        // txs1.splice(clientId, 1);
        txs0.forEach((element) => { element.shift(); element.shift(); });
        txs1.forEach((element) => { element.shift(); element.shift(); });

        var overallLatency = 0;
        for (let i = 0; i < txs0.length; i++) {
            if (i != clientId) {
                const element0 = txs0[i];
                const element1 = txs1[i];
                console.log("client " + i + ": element0.length", element0.length, "element1.length", element1.length);
                while (element1.length < txLimit / 2 || element0.length != element1.length) {
                    await sleep(1000);
                }

                let totalLatency = 0;
                console.log("\nAnalyzing the data....", element0.length * 2 + "txs for client " + i + " tracked.");
                for (let i = 0; i < element0.length; i++) {
                    totalLatency += element1[i] - element0[i];
                    console.log("Latency", i, element1[i] - element0[i]);
                }
                overallLatency += Math.round(((totalLatency / element0.length / 2) / 1e6) * 100) / 100;
            }
        }
        console.log("========================================================");
        totalDuration = finishingTime - startingTime;
        console.log("DURATION:", totalDuration + "ms");
        console.log("\nAVG. TPS:", (txLimit / (totalDuration / 1000)));
        console.log("\nAVG. TX LATENCY:", Math.round((overallLatency / txs0.length) * 100) / 100);
        console.log("========================================================");
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getNanoSecTime() {
    var hrTime = process.hrtime();
    return hrTime[0] * 1000000000 + hrTime[1];
}

loop();