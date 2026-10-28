require('dotenv').config();
const readline = require('readline');
const mongoose = require('mongoose');
const User = require('../models/User');

function ask(question) {
  const prompt = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => prompt.question(question, (answer) => { prompt.close(); resolve(answer.trim()); }));
}

function askPassword() {
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY) return reject(new Error('Run this command in an interactive terminal.'));
    process.stdout.write('Admin password (minimum 8 characters): ');
    let value = '';
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    const finish = (error) => {
      stdin.setRawMode(false);
      stdin.pause();
      stdin.removeListener('data', onData);
      process.stdout.write('\n');
      if (error) reject(error);
      else resolve(value);
    };
    const onData = (chunk) => {
      for (const character of chunk.toString()) {
        if (character === '\u0003') return finish(new Error('Admin creation cancelled.'));
        if (character === '\r' || character === '\n') return finish();
        if (character === '\u0008' || character === '\u007f') value = value.slice(0, -1);
        else if (character >= ' ') value += character;
      }
    };
    stdin.on('data', onData);
  });
}

async function main() {
  if (!process.env.MONGODB_URI || !process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error('Configure MONGODB_URI and a JWT_SECRET of at least 32 characters in server/.env first.');
  }
  const name = await ask('Admin name: ');
  const email = (await ask('Admin email: ')).toLowerCase();
  const password = await askPassword();
  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || password.length > 72) {
    throw new Error('Invalid input. Name must be 2+ characters, email valid, and password 8–72 characters.');
  }
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  if (await User.exists({ email })) throw new Error('An account with this email already exists; no account was changed.');
  const user = await User.create({ name, email, password, role: 'admin' });
  console.log(`Admin account created for ${user.email}.`);
}

main()
  .catch((error) => {
    console.error(`Admin account was not created: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => { if (mongoose.connection.readyState !== 0) await mongoose.disconnect(); });
