
// Imports

const fs = require('fs');

// Variables

const fileName = __dirname + '/players.txt';


function getPlayerName(string, index) {

  return new Promise( async(resolve, reject) => {

    const nameColumn = /cell-player(.*?)<\/td>/gs;
    const name = /(_blank">)(.*)(<\/a>)/s;

    const nameMatches = string.match(nameColumn);

    if (nameMatches !== null) {
      const playerMatch = nameMatches[0].match(name);

      resolve({
        success: playerMatch !== null ? true : false,
        name: playerMatch !== null ? playerMatch[2] : '',
      });

    } else {
      resolve({
        success: false,
      });
    }

  });

}

function getSchool(string, index) {

  return new Promise( async(resolve, reject) => {

    const nameColumn = /cell-school(.*?)<\/td>/gs;
    const name = /(_blank">)(.*)(<\/a>)/s;

    const nameMatches = string.match(nameColumn);

    if (nameMatches !== null) {

      const schoolMatch = nameMatches[0].match(name);

      resolve({
        success: schoolMatch !== null ? true : false,
        name: schoolMatch !== null ? schoolMatch[2] : '',
      });

    } else {
      resolve({
        success: false,
      });
    }

  });

}

// Make Players

function makePlayers(rows) {

  const array = [];
  let length = rows.length;

  return new Promise( (resolve) => {

    rows.forEach( async(row, i) => {

      const playerName = await getPlayerName(row, i);
      const playerSchool = await getSchool(row, i);

      if (playerName.success) {

        const obj = {
          name: playerName.name,
          school: playerSchool.name
        }

        array.push(obj);
        length = length - 1;

      } else {
        length = length - 1;
      }

      if (length === 0) {
        resolve(array);
      }

    });

  });

}


// Get All Rows

function getAllRows(content) {

  const regex = /<tr[\s\S]*?<\/tr>/gi

  return new Promise( (resolve) => {

    const rows = content.match(regex);
    resolve(rows);

  });

}


// Load

async function load() {

  fs.readFile(fileName, 'utf8', async(error, data) => {

    if (error) console.log(error);

    const rows = await getAllRows(data);
    const players = await makePlayers(rows);

    if (players.length > 0) {

      if (!fs.existsSync('dest')){
          fs.mkdirSync('dest');
      }

      fs.writeFile('dest/list.txt',  JSON.stringify(players), (error) => {
        if (error) console.log(error);
      });

    }


  });


}


load();
