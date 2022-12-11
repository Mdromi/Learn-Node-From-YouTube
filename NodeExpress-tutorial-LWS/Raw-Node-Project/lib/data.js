
// dependencies
const fs = require('fs');
const path = require('path');

const lib = {};

// base derectory of the data folder
lib.basedir = path.join(__dirname, '/../.data/')

// write data file 
lib.create = (dir, file, data, callback) => {

    // if dir is empty then create a new dir
    if (!fs.existsSync(lib.basedir)) {
        fs.mkdirSync(lib.basedir);
        fs.mkdirSync(lib.basedir+dir);
    };
    if (!fs.existsSync(lib.basedir+dir)) fs.mkdirSync(lib.basedir+dir);
  
    // open file for writing
    fs.open(lib.basedir+dir+'/'+file+'.json', 'wx', (err, fileDescriptor) => {
        if(!err && fileDescriptor) {
            // convert data to string
            const stringData = JSON.stringify(data)

            // write data to file and thaen close it 
            fs.writeFile(fileDescriptor, stringData, (err2) => {
                if(!err2){
                    fs.close(fileDescriptor, (err3) => {
                        if(!err3) {
                            callback(false)
                        } else {
                            callback('Error closing the new file!')
                        }
                    })
                } else {
                    callback('Error writing to new file!');
                }
            })
        } else {
            callback('Could not create new file, it may  already exists!', err)
        }
    })
}

// read data from file
lib.read = (dir, file, callback) => {
    fs.readFile(lib.basedir+dir+'/'+file+'.json', 'utf-8', (err, data) => {
        callback(err, data);
    })
}

lib.update = (dir, file, data, callback) => {
    // file open for writing
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if(!err && fileDescriptor) {
            // convert the data t string
            const stringData = JSON.stringify(data)

            // truncate the file
            fs.ftruncate(fileDescriptor, (err2) => {
                if(!err2) {
                    // write to the file and close it
                    fs.writeFile(fileDescriptor, stringData, (err3) => {
                        if(!err3) {
                            // close the file
                            fs.close(fileDescriptor, (err4) => {
                                if(!err4) {
                                    callback(false)
                                } else {
                                    callback(`Error closing file!`);
                                }
                            })
                        } else {
                            callback('Error writing the file')
                        }
                    })
                } else {
                    callback(`Error truncate file!`)
                }
            })
        } else {
            console.log(`Error updating.file may not exit`);
        }
    })
}

// delete existing file
lib.delete = (dir, file, callback) => {
    // unlink file
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        if(!err) {
            callback(false)
        } else {
            callback(`Error Delating file`)
        }
    })
}

// list all the items in a directory
lib.list = (dir, callback) => {
    fs.readdir(`${lib.basedir + dir}/`, (err, fileNames) => {
        if (!err && fileNames && fileNames.length > 0) {
            const trimmedFileNames = [];
            fileNames.forEach((fileName) => {
                trimmedFileNames.push(fileName.replace('.json', ''));
            });
            callback(false, trimmedFileNames);
        } else {
            callback('Error reading directory!');
        }
    });
};

module.exports = lib