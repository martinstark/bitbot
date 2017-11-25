# bitbot

Heavily based on [The Perfect Lil' Bot](https://gist.github.com/eslachance/3349734a98d30011bb202f47342601d3)

A simple bitcoin and ethereum to USD fetching Discord bot.

## Setup

Built to run on **node** with **npm**. Once you have it installed, run `npm install` from the app folder in your terminal/command line.

Create a `config.json` file in the app root folder with the following content:

``{
    "token"  : "your app token here",
    "prefix" : "+"
  }``

To run the bot, type `npm start` or `node app.js` in the terminal/command line.

Once the bot has been invited to your server, you have access to the following chat commands:

```
+help
+ping
+btc
+eth
+all
```