const fs = require('fs')
const mkdirp = require('mkdirp')

class Base {
  constructor() {}

  /**
   * description 创建文件夹
   * */
  mkdir() {
    mkdirp.sync.apply(mkdirp, arguments)
  }
}

module.exports = Base