"use strict";

const crypto = require("crypto");
const assert = require("assert");

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

Blockchain.blockHash = function (block) {
    const {index, prevHash, data, timestamp} = block
    return crypto
        .createHash("sha256")
        .update(Buffer.from([index, prevHash, data, timestamp]))
        .digest("hex");
}

Blockchain.createBlock = function (data) {
    const lastIndex = this.blocks.length - 1
    const block = {
        index: lastIndex + 1,
        prevHash: this.blocks[lastIndex].hash,
        data,
        timestamp: Date.now(),
    }
    block.hash = Blockchain.blockHash(block)
    this.blocks.push(block)
    // Blockchain.blocks.push(block)
    return block
}

for (let line of poem) {
    Blockchain.createBlock(line)
}

// For testing of verifyChain method
// Blockchain.blocks.push({
// 	index: Blockchain.blocks.length - 1,
// 	prevHash: "0x456645646531313521654561321654651651161564564",
// 	hash: "0x23164654654123189785435132489498465416132132165494465",
// 	data: "",
// 	timestamp: Date.now(),
// })

console.log(Blockchain.blocks)
assert(Blockchain.blocks.length === poem.length + 1)

// console.log(`Blockchain is valid: ${verifyChain(Blockchain)}`);

// **********************************

function verifyBlock(block) {
    const {index, hash, data, prevHash} = block
    if (index < 0 ||
        data == null ||
        (index === 0 && hash !== '000000') ||
        (index > 0 && prevHash == null)
    ) {
        return false
    }

    if (index > 0) {
        const calculatedHash = Blockchain.blockHash(block)
        if (hash !== calculatedHash) {
            return false
        }
		if (index > 1) {
			const previousBlock = Blockchain.blocks[index - 1]
			const previousBlockHash = Blockchain.blockHash(previousBlock)
			if (previousBlockHash !== prevHash) {
				return false
			}
		}
    }
    return true
}

function verifyChain() {
    for (let block of Blockchain.blocks) {
        const isBlockValid = verifyBlock(block)
        if (!isBlockValid) {
            return false
        }
    }
	return true
}

const isValid = verifyChain()
console.log(`Is valid chain ? ${isValid}`)
