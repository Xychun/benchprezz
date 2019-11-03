var KVStoreABI = [
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