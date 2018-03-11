const Xray = require('x-ray');
var xray = Xray({
  filters: {
    clean: function (value) {
      return value.replace(/\\n/g, '').trim()
    }
  }
});
const baseURL = 'http://www.europeantour.com';

const Nightmare = require('nightmare')
const nightmare = Nightmare()

nightmare
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
      totalScore: '.lb-topar'
    }])((err, players) => {
      printLeaderboard(players)
    });
  })
  .catch(error => {
    console.error('Search failed:', error)
  })

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
    console.log(`${pos}: ${player.name}    ${player.totalScore} \n`);
  })
  
}
