
exports.uploadController = (req, res, next) => {
    if(req.file) {
        console.log(req.file);
        res.send('File uploaded')
    } else {
        throw new Error(`File Required`);
    }
}