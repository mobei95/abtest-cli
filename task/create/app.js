'use strict';

const fs = require('fs')
const inquirer = require('inquirer')

class App {
  constructor(options) {
    this.conf = Object.assign({
      appName: null,
      description: '',
      sass: false,
      less: false
    }, options)
  }

  talk() {
    let promptList = []
    const conf = this.conf
    // 项目名称验证
    if (typeof conf.appName !== 'string') {
      promptList.push({
        type: 'input',
        name: 'appName',
        message: '请输入项目名称~',
        validate: function(input) {
          if (!input) {
            return '不能为空哦，会让人家很为难的~';
          }
          if (fs.existsSync(input)) {
            return '项目已经存在哦，换个名字吧~';
          }
          return true;
        }
      })
    }

    // css预处理器选择
    if (!conf.sass && !conf.less) {
      promptList.push({
        type: 'list',
        name: 'cssPretreatment',
        message: '选择CSS预处理器~',
        choices: [{
          name: 'Sass/Compass',
          value: 'sass'
        }, {
          name: 'Less',
          value: 'less'
        }, {
          name: '不需要',
          value: 'none'
        }]
      })
    }
  }

  create() {

  }
}


module.exports = App