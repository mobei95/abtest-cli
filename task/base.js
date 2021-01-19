const fs = require('fs')
const mkdirp = require('mkdirp')

class Base {
  constructor() {}

  /**
   * @description 创建文件夹
   * */
  mkdir() {
    mkdirp.sync.apply(mkdirp, arguments)
  }

  /**
   * @description 读文件
   * @param {String} dir
   * @param {String} fileName
   * */
  readFile(dir, fileName) {
    const filePath = path.join(dir, fileName)
    const filStr = fs.readFileSync(filePath, 'utf8')
    return JSON.parse(filStr)
  }

  /**
   * @description 写文件
   * @param {String} dir
   * @param {Object | String} files
   * */
  writeFile(dir, files) {
    Object.keys(files).forEach(name => {
      const filePath = path.join(dir, name)
      fs.writeFileSync(filePath, files[name])
    })
  }
}

module.exports = Base