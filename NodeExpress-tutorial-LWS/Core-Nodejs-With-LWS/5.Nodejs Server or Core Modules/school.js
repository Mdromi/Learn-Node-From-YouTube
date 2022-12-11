const EventEmitter  = require('events')

class School extends EventEmitter {
    startPeriod() {
        console.log(`Class Started`);

        setTimeout(() => {
            this.emit('bellRing', {
              peroid: 'first',
              text: 'peroid ended'  
            })
        }, 2000)
    }
}

module.exports = School