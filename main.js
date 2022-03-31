const SHA256 = require('crypto-js/sha256');
class Block{
    constructor(index, timestamp, data, previousHash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class BlockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        return new Block(0, "01/01/2022","Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(currentBlock.hash != currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash != previousBlock.hash){
                return false;
            }
        }
        return true;
    }
}

//create a blockchain
let jiffyCoin = new BlockChain();

//adding two block apart from genesis block
jiffyCoin.addBlock(new Block(1, "10/07/2022", {amount : 5}));
jiffyCoin.addBlock(new Block(2, "12/08/2022", {amount : 10}));

console.log(JSON.stringify(jiffyCoin, null, 4));

console.log('Is Blockchain Valid?', jiffyCoin.isChainValid());

//tampering with data of a block in jiffyCoin
jiffyCoin.chain[1].data = {amount : 100};

console.log('Is Blockchain Valid?', jiffyCoin.isChainValid());

// tampering the data and recalculating the hash
jiffyCoin.chain[1].data = {amount : 50};
jiffyCoin.chain[1].hash = jiffyCoin.chain[1].calculateHash();

console.log('Is Blockchain Valid?', jiffyCoin.isChainValid());