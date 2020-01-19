const SHA256 = require('crypto-js/sha256');

var currentDate = new Date();
var timestamp = currentDate.toString();

class Block {
    /**
     * 区块对象默认构造函数
     * @param {区块索引} index 
     * @param {时间戳} timestamp 
     * @param {区块交易数据} data 
     * @param {之前区块哈希} previousHash 
     */
    constructor(index, timestamp, data, previousHash) {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        // 计算挖矿的哈希值，存疑。
        // 看字面意思是随机数
        this.nonce = 0;
    }

    /**
     * 计算区块哈希
     * @return 返回区块哈希值
     */
    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + this.data + this.nonce).toString();
    }

    /**
     * 挖矿 
     * @param {挖矿难度系数} difficulty
     */
    mineBlock(difficulty) {
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined: " + this.hash);
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesis()];
        this.difficulty = 4;
    }

    /**
     * 创世区块
     */
    createGenesis() {
        return new Block(0, timestamp, "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }

    checkValid() {
        for(let i = 1; i < this.chain.length; i++) {

            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash != currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash != previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

let testChain = new BlockChain()

console.log("Mining block...")
testChain.addBlock(new Block(1, timestamp, "This is block 1"))

console.log("Mining block...")
testChain.addBlock(new Block(2, timestamp, "This is block 2"))

console.log(JSON.stringify(testChain, null, 4))

console.log("Is blockchain valid? " + testChain.checkValid().toString())