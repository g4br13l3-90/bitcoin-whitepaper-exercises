"use strict";

const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const KEYS_DIR = path.join(__dirname, "keys");
const PUB_KEY_TEXT = fs.readFileSync(path.join(KEYS_DIR, "pub.pgp.key"), "utf8");

// The Power of a Smile
// by Tupac Shakur
const poem = [
    "The power of a gun can kill",
    "and the power of fire can burn",
    "the power of wind can chill",
    "and the power of a mind can learn",
    "the power of anger can rage",
    "inside until it tears u apart",
    "but the power of a smile",
    "especially yours can heal a frozen heart",
];

const maxBlockSize = 4;
const blockFee = 5;
const difficulty = 16;

const Blockchain = {
    blocks: [],
};

// Genesis block
Blockchain.blocks.push({
    index: 0,
    hash: "000000",
    data: "",
    timestamp: Date.now(),
});

let transactionPool = [];

addPoem();
processPool();
countMyEarnings();


// **********************************

function addPoem() {
    for (let line of poem) {
		transactionPool.push(createTransaction(line))
    }
}

function processPool() {
	transactionPool = transactionPool.sort((txA, txB) => {
		if(txA.fee > txB.fee) {
			return 1
		}
		if(txA.fee < txB.fee) {
			return -1
		}
		return 0
	})

	const blockFeeStruct = {
		blockFee,
		account: PUB_KEY_TEXT,
	}
	const blockData = {
		blockFee: blockFeeStruct,
		txs: []
	}

	while (transactionPool.length > 0) {
		const tx = transactionPool.pop()
		if (blockData.txs.length < maxBlockSize) {
			blockData.txs.push(tx)
			if(transactionPool.length === 0) {
				Blockchain.blocks.push(createBlock(blockData))
			}
		} else {
			Blockchain.blocks.push(createBlock(blockData))
			blockData.txs = [tx]
		}
	}
	console.log(Blockchain.blocks)
}

function countMyEarnings() {
	let totalEarnings = 0
	for (let i = 1; i < Blockchain.blocks.length; i++) {
		const currentBlock = Blockchain.blocks[i]
		totalEarnings += currentBlock.data.blockFee.blockFee
		currentBlock.data.txs.forEach(tx => {
			totalEarnings += tx.fee
		})
	}
    console.log(`TotalEarnings: ${totalEarnings}`)
	return totalEarnings
}

function createBlock(data) {
    const bl = {
        index: Blockchain.blocks.length,
        prevHash: Blockchain.blocks[Blockchain.blocks.length - 1].hash,
        data,
        timestamp: Date.now(),
    };
    bl.hash = blockHash(bl);
    return bl;
}

function blockHash(bl) {
    while (true) {
        bl.nonce = Math.trunc(Math.random() * 1E7);
        let hash = crypto.createHash("sha256").update(
            `${bl.index};${bl.prevHash};${JSON.stringify(bl.data)};${bl.timestamp};${bl.nonce}`
        ).digest("hex");

        if (hashIsLowEnough(hash)) {
            return hash;
        }
    }
}

function hashIsLowEnough(hash) {
    const neededChars = Math.ceil(difficulty / 4);
    const threshold = Number(`0b${"".padStart(neededChars * 4, "1111".padStart(4 + difficulty, "0"))}`);
    const prefix = Number(`0x${hash.substring(0, neededChars)}`);
    return prefix <= threshold;
}

function getRandomNumber(min = 1, max = 10) {
    return Math.floor(Math.random() * (max - min)) + min
}

function transactionHash(tr) {
	return crypto.createHash("sha256").update(
		`${JSON.stringify(tr.data)}`
	).digest("hex");
}

function createTransaction(data) {
    const tr = {
        data,
        fee: getRandomNumber()
    };
    tr.hash = transactionHash(tr);
    return tr;
}


