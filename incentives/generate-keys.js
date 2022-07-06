"use strict";

const path = require("path");
const fs = require("fs");
const openpgp = require("openpgp");

const KEYS_DIR = path.join(__dirname,"keys");

const options = {
	userIDs: [{name: "Bitcoin Whitepaper", email: "bitcoin@whitepaper.tld"}],
	rsaBits: 4096,
	passphrase: "",
};

openpgp.generateKey(options).then(function onGenerated(key) {
	try { fs.mkdirSync(KEYS_DIR); } catch (err) {}

	fs.writeFileSync(path.join(KEYS_DIR,"priv.pgp.key"),key.privateKey,"utf8");
	fs.writeFileSync(path.join(KEYS_DIR,"pub.pgp.key"),key.publicKey,"utf8");

	console.log("Keypair generated.");
});
