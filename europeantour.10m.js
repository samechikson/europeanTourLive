#!/usr/bin/env /Users/sechikson/.nvm/versions/node/v8.4.0/bin/node

const Xray = require('x-ray');
var xray = Xray({
  filters: {
    clean: function (value) {
      return value.replace(/\\n/g, '').trim()
    }
  }
});
const baseURL = 'http://www.europeantour.com';
let tournamentURL = '';

const Nightmare = require('nightmare')
const nightmare = Nightmare()

const session = nightmare
  .goto(baseURL)
  .click('#LiveLeaderboardLink a')
  .wait('#leaderboard-table')
  .wait(5000)
  .evaluate(() => document.getElementById('fullPlayers').innerHTML)
  .end()
  .then(data => {
    xray(data, 'tr.lb-tablerow', [{
      position: '.player-pos | clean',
      name: '.lb-player-name | clean',
      todayScore: '.lb-today',
      totalScore: '.lb-topar',
      hole: '.lb-hole'
    }])((err, players) => {
      printLeaderboard(players)
    });
  })
  .catch(error => {
    console.error('Search failed:', error)
  });

function printLeaderboard(leaderboard) {
  console.log('European Tour');
  console.log('---');
  leaderboard = leaderboard.slice(0, 10);
  let prevScore = -1000, pos = 0;
  leaderboard.forEach((player, i) => {
    if (prevScore < parseInt(player.totalScore)) {
      prevScore = parseInt(player.totalScore);
      pos++;
    }
    console.log(`${pos}: ${player.name.padEnd(30)} ${player.hole} ${player.totalScore} | font=Menlo color=black \n`);
  })
  console.log('---');
  console.log('Full Leaderboard')
  
}
