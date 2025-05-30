const fs = require("fs");
const crypto = require("crypto");
const Blockchain = require("./blockchain");

const blockchain = new Blockchain();
const validTokensFile = "valid_tokens.json";

function hashUsername(username) {
  const salt = "some_secret_salt";
  return crypto.createHash("sha256").update(username + salt).digest("hex");
}

function addUserToChain(username) {
  const hash = hashUsername(username);
  blockchain.addBlock({ username, hash });
  blockchain.saveToFile();

  let validTokens = { valid_tokens: [] };
  if (fs.existsSync(validTokensFile)) {
    validTokens = JSON.parse(fs.readFileSync(validTokensFile));
  }

  if (!validTokens.valid_tokens.includes(hash)) {
    validTokens.valid_tokens.push(hash);
    fs.writeFileSync(validTokensFile, JSON.stringify(validTokens, null, 2));
  }

  console.log(`✅ Added user '${username}' to blockchain with hash:\n${hash}`);
}

const username = process.argv[2];
if (!username) {
  console.error("❌ Please provide a username. Example: node generator.js testuser");
  process.exit(1);
}

addUserToChain(username);
