var KVStoreABI = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "name": "store",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "key",
                "type": "string"
            }
        ],
        "name": "get",
        "outputs": [
            {
                "name": "",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "key",
                "type": "string"
            },
            {
                "name": "value",
                "type": "string"
            }
        ],
        "name": "set",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

var StandardContractABI = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "",
                "type": "address"
            }
        ],
        "name": "addressToStateVector_",
        "outputs": [
            {
                "name": "latitude",
                "type": "int32"
            },
            {
                "name": "longitude",
                "type": "int32"
            },
            {
                "name": "direction",
                "type": "uint16"
            },
            {
                "name": "speed",
                "type": "uint16"
            },
            {
                "name": "acceleration",
                "type": "int8"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "_latitude",
                "type": "int32"
            },
            {
                "name": "_longitude",
                "type": "int32"
            },
            {
                "name": "_direction",
                "type": "uint16"
            },
            {
                "name": "_speed",
                "type": "uint16"
            },
            {
                "name": "_acceleration",
                "type": "int8"
            }
        ],
        "name": "updateState",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

exports.KVStore = KVStoreABI;
exports.StandardContract = StandardContractABI;