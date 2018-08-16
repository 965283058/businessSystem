const fs = require('fs')
const path = require('path')
const exec = require('child_process').exec
const baseDir = process.cwd()

module.exports.saveFile = async(filePath, rs)=> {
    let fullPath = path.join(baseDir, 'upload', filePath)
    return new Promise((rev, rej)=> {
        let writeStream = rs.pipe(fs.createWriteStream(fullPath))
        writeStream.on("close", () => {
            rev(path.join('upload', filePath))
        });
        writeStream.on("error", err => {
            rej(err)
        });
    })
}


exports.moveFile = async(oldPath, newPath)=> {
    if (newPath.indexOf("/") > 0) {
        let dirPath = newPath.substring(0, newPath.lastIndexOf("/"))
        try {
            await mkDir(path.join(baseDir, "upload", dirPath))
        } catch (e) {
            return Promise.reject(e)
        }
    }

    return new Promise((rev, rej)=> {
        newPath = path.join('upload', newPath)
        fs.rename(oldPath, newPath, function (err, data) {
            if (err) {
                rej(err)
            } else {
                rev(newPath)
            }
        })
    })
}


exports.delFile = (filePath)=> {
    return new Promise((rev, rej)=> {
        filePath = path.join(baseDir, filePath)
        fs.access(filePath, function (err, result) {
            if (err) {
                rev(1)
            } else {
                fs.unlink(filePath, function (err) {
                    if (err) {
                        rej(err)
                    } else {
                        rev(1)
                    }
                })
            }
        })

    })
}


const mkDir = async(path)=> {
    return new Promise((rev, rej)=> {
        fs.stat(path, function (err, stats) {
            if (err) {
                fs.mkdir(path, function (mkErr) {
                    if (mkErr) {
                        rej(mkErr)
                    } else {
                        rev()
                    }
                })
            } else if (stats.isDirectory()) {
                rev()
            } else {
                fs.mkdir(path, function (mkErr) {
                    if (mkErr) {
                        rej(mkErr)
                    } else {
                        rev()
                    }
                })
            }
        })
    })
}