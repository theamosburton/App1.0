const {BIP32Factory} = require('bip32')
const ecc = require('tiny-secp256k1')
const bip32 = BIP32Factory(ecc)
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')

function createWallet() {
    const network = bitcoin.networks.testnet;
    const mnemonic = bip39.generateMnemonic();
    const path = "m/49'/1'/0'/0";
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const root = bip32.fromSeed(seed, network)
    const account = root.derivePath(path);
    let key = account.derive(0).derive(0)
    
    let btcAddress = bitcoin.payments.p2pkh({
      pubkey: key.publicKey,
      network: network,
    }).address
    return { address: btcAddress, key: account.toWIF(), phrase: mnemonic };
}


let walletCred = createWallet();
console.log("Address: "+walletCred.address)
console.log("Phrase: "+walletCred.phrase)
console.log("Key: "+walletCred.key)
async function getBalance(address) {
    try {
        const response = await axios.get(`https://blockchain.info/q/addressbalance/${address}`);
        const balance = response.data / 100000000; // Convert from satoshis to BTC
        console.log(`Balance for ${address}: ${balance} BTC`);
    } catch (error) {
        console.error('Error fetching balance:', error);
    }
}


async function sendBitcoin(senderAddress, recipientAddress, amountToSend, privateKeyWIF) {
    try {
        const response = await axios.get(`https://blockchain.info/unspent?active=${senderAddress}`);
        const { unspent_outputs: unspentOutputs } = response.data;

        const psbt = new bitcoin.Psbt();
        let totalInput = 0;

        unspentOutputs.forEach((unspent) => {
            psbt.addInput({
                hash: unspent.tx_hash_big_endian,
                index: unspent.tx_output_n,
                nonWitnessUtxo: Buffer.from(unspent.script, 'hex'),
            });
            totalInput += unspent.value;
        });

        const fee = 10000; // 10,000 satoshis (0.0001 BTC)
        const amountToSendSatoshis = Math.floor(amountToSend * 100000000);

        psbt.addOutput({
            address: recipientAddress,
            value: amountToSendSatoshis,
        });

        const change = totalInput - amountToSendSatoshis - fee;
        if (change > 0) {
            psbt.addOutput({
                address: senderAddress,
                value: change,
            });
        }

        psbt.signAllInputs(bitcoin.ECPair.fromWIF(privateKeyWIF));
        psbt.finalizeAllInputs();

        const tx = psbt.extractTransaction().toHex();
        const broadcastResponse = await axios.post('https://blockchain.info/pushtx', `tx=${tx}`);

        console.log('Transaction broadcasted:', broadcastResponse.data);
    } catch (error) {
        console.error('Error sending Bitcoin:', error);
    }
}
