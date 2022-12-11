const School = require('./school')

const school = new School()

school.on('bellRing', ({peroiod, text}) => {
    console.log(`We need to run because ${peroiod, text} `);
})

school.startPeriod()