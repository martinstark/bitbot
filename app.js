'use strict';

const Discord = require('discord.js'),
  client = new Discord.Client(),
  config = require('./config.json'),
  fetch = require('node-fetch');

let previousValue = {
    btc: 0,
    eth: 0,
    xtb: 0,
    xte: 0
  },
  lastValue = {
    btc: 0,
    eth: 0,
    xtb: 0,
    xte: 0
  },
  cache = {
    btc: {},
    eth: {}
  };

function fetchXBT() {
  fetch('https://xbtprovider.com/api/rates?currency=eur')
    .then(res => res.json())
    .then(json => {
      lastValue.xtb = json.data.bt1FairSEK;
      lastValue.xte = json.data.eth1FairSEK;

      if (previousValue.xtb === 0) {
        previousValue.xtb = json.data.bt1FairSEK;
      }

      if (previousValue.xte === 0) {
        previousValue.xte = json.data.eth1FairSEK;
      }
    })
    .catch(console.log);
}

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

      cache.btc = btc[0];
      cache.eth = eth[0];

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
  fetchXBT();
  setInterval(fetchXBT, 600000);
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
      '+xtb\n' +
      '+xte\n' +
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

  if (command === 'xtb') {
    message.channel.send(`XBT: ${lastValue.xtb} (Change: ${(lastValue.xtb - previousValue.xtb).toFixed(2)}).`);

    if (previousValue.xtb !== lastValue.xtb) {
      previousValue.xtb = lastValue.xtb;
    }
  }

  if (command === 'xte') {
    message.channel.send(`XBT: ${lastValue.xte} (Change: ${(lastValue.xte - previousValue.xte).toFixed(2)}).`);

    if (previousValue.xte !== lastValue.xte) {
      previousValue.xte = lastValue.xte;
    }
  }

  if (command === 'all') {
    message.channel.send(` \`CryptoBot3000\`
    \`\`\`BTC: ${lastValue.btc}    (Since Last: ${(lastValue.btc - previousValue.btc).toFixed(2)}usd | ${(((lastValue.btc / previousValue.btc) - 1) * 100).toFixed(2)}% | 1h: ${cache.btc.percent_change_1h}% | 24h: ${cache.btc.percent_change_24h}% | 7d: ${cache.btc.percent_change_7d}%) 
XBT: ${lastValue.xtb}      (Since Last: ${(lastValue.xtb - previousValue.xtb).toFixed(2)}sek | ${(((lastValue.xtb / previousValue.xtb) - 1) * 100).toFixed(2)}%)

ETH: ${lastValue.eth}      (Since Last: ${(lastValue.eth - previousValue.eth).toFixed(2)}usd | ${(((lastValue.eth / previousValue.eth) - 1) * 100).toFixed(2)}% | 1h: ${cache.eth.percent_change_1h}% | 24h: ${cache.eth.percent_change_24h}% | 7d: ${cache.eth.percent_change_7d}%)
XBT: ${lastValue.xte}       (Since Last: ${(lastValue.xte - previousValue.xte).toFixed(2)}sek | ${(((lastValue.xte / previousValue.xte) - 1) * 100).toFixed(2)}%)
\`\`\`
    `);

    if (previousValue.eth !== lastValue.eth) {
      previousValue.eth = lastValue.eth;
    }

    if (previousValue.btc !== lastValue.btc) {
      previousValue.btc = lastValue.btc;
    }

    if (previousValue.xtb !== lastValue.xtb) {
      previousValue.xtb = lastValue.xtb;
    }

    if (previousValue.xte !== lastValue.xte) {
      previousValue.xte = lastValue.xte;
    }
  }
});

client.login(config.token).catch(console.log);