require('dotenv').config();
const readline = require('readline');
const mongoose = require('mongoose');
const connectDatabase = require('../config/db');
const User = require('../models/User');

function ask(question) {
  const prompt = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => prompt.question(question, (answer) => {
    prompt.close();
    resolve(answer.trim());
  }));
}

function askPassword() {
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY) return reject(new Error('Run this command in an interactive terminal.'));
    process.stdout.write('New admin password (8–72 characters): ');
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
        if (character === '\u0003') return finish(new Error('Password reset cancelled.'));
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
  const email = (await ask('Admin email: ')).toLowerCase();
  const password = await askPassword();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 8 || password.length > 72) {
    throw new Error('Invalid input. Enter a valid email and a password 8–72 characters long.');
  }

  await connectDatabase();
  const user = await User.findOne({ email });
  if (!user || user.role !== 'admin') {
    throw new Error('No admin account exists for that email; no account was changed.');
  }
  user.password = password;
  await user.save();
  console.log(`Admin password reset successfully for ${user.email}.`);
}

main()
  .catch((error) => {
    console.error(`Admin password was not reset: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => { if (mongoose.connection.readyState !== 0) await mongoose.disconnect(); });
