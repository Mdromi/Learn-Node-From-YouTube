// dependencies
const data = require('../lib/data');

data.create('test', 'newFile4', {name: 'Quet', languase: 'Arabic'}, (err) => {
    console.log(`CREATE DATA:`);
    console.log(`Error was `, err);
});

data.read('test', 'newFile2', (err, data) => {
    console.log(`READ DATA:`);
    console.log(err, data);
})

data.update('test', 'newFile2', {name: 'England', languase: 'English'}, (err) => {
    console.log(`UPDATE DATA:`);
    console.log(`Error was `, err);
});

data.delete('test', 'newFile3', (err) => {
    console.log(`DELETE DATA:`);
    console.log(`Error was `, err);
});

module.exports = data