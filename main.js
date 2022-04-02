const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block{
    constructor(timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block Mined : " + this.hash);
    }
}

class BlockChain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block("01/01/2022","Genesis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined ');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount;
                }

                if(trans.toAddress === address){
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }
    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        //newBlock.hash = newBlock.calculateHash();
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

console.log('Mining Block 1.....');
jiffyCoin.addBlock(new Block(1, "13/07/2022", {amount : 60}));
console.log('Mining Block 2.....');
jiffyCoin.addBlock(new Block(1, "10/07/2022", {amount : 75}));

jiffyCoin.createTransaction(new Transaction('address1', 'address2', 890));
jiffyCoin.createTransaction(new Transaction('address2', 'address1', 100));

console.log('\n Starting the miner.');
jiffyCoin.minePendingTransactions('sahils-address');

console.log('\n Balance of sahil is', jiffyCoin.getBalanceOfAddress('sahils-address'));

console.log('\n Starting the miner. Again');
jiffyCoin.minePendingTransactions('sahils-address');
console.log('\n Balance of sahil is', jiffyCoin.getBalanceOfAddress('sahils-address'));