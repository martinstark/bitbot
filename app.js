'use strict';

const Discord = require('discord.js'),
  client = new Discord.Client(),
  config = require('./config.json'),
  fetch = require('node-fetch');

let previousValue = {
    btc: 0,
    eth: 0
  },
  lastValue = {
    btc: 0,
    eth: 0
  };

function fetchCurrencies() {
  Promise.all(
    [
      fetch('https://api.coinmarketcap.com/v1/ticker/ethereum/'),
      fetch('https://api.coinmarketcap.com/v1/ticker/bitcoin/')
    ])
    .then(([eth, btc]) => {
      return Promise.all([eth.json(), btc.json()]);
    })
    .then(([eth, btc]) => {
      const btcInUsd = parseFloat(btc[0].price_usd).toFixed(2),
            ethInUsd = parseFloat(eth[0].price_usd).toFixed(2);

      lastValue.btc = btcInUsd;
      lastValue.eth = ethInUsd;

      if (previousValue.btc === 0) {
        previousValue.btc = btcInUsd;
      }

      if(previousValue.eth === 0) {
        previousValue.eth = ethInUsd;
      }
    })
    .catch(console.log);
}

client.on('ready', () => {
  fetchCurrencies();
  setInterval(fetchCurrencies, 30000);
});

client.on('message', async message => {
  if (message.author.bot) return;

  if (message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command === 'help') {
    message.channel.send(
      '```Commands:\n\n' +
      '+help\n' +
      '+ping\n' +
      '+btc\n' +
      '+eth\n' +
      '+all```');
  }

  if (command === 'ping') {
    const m = await message.channel.send('Ping?');
    m.edit(`Pong! Latency is ${m.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
  }

  if (command === 'btc' || command === 'bit') {
    message.channel.send(`BTC: ${lastValue.btc} (Change: ${(lastValue.btc - previousValue.btc).toFixed(2)}).`);

    if (previousValue.btc !== lastValue.btc) {
      previousValue.btc = lastValue.btc;
    }
  }

  if (command === 'eth') {
    message.channel.send(`ETH: ${lastValue.eth} (Change: ${(lastValue.eth - previousValue.eth).toFixed(2)}).`);

    if (previousValue.eth !== lastValue.eth) {
      previousValue.eth = lastValue.eth;
    }
  }

  if (command === 'all') {
    message.channel.send(`BTC: ${lastValue.btc} (Change: ${(lastValue.btc - previousValue.btc).toFixed(2)}). ETH: ${lastValue.eth} (Change: ${(lastValue.eth - previousValue.eth).toFixed(2)}).`);

    if (previousValue.eth !== lastValue.eth) {
      previousValue.eth = lastValue.eth;
    }

    if (previousValue.btc !== lastValue.btc) {
      previousValue.btc = lastValue.btc;
    }
  }
});

client.login(config.token).catch(console.log);