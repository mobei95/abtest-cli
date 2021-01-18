'use strict';

const fs = require('fs')
const inquirer = require('inquirer')
const Base = require('../base')
const templateMap = require('../../templateMap')

class App extends Base {
  constructor(options) {
    super()
    this.conf = Object.assign({
      appName: null,
      description: '',
      sass: false,
      less: false
    }, options)
  }

  async talk() {
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
    } else if (fs.existsSync(conf.appName)) {
      promptList.push({
        type: 'input',
        name: 'appName',
        message: '项目已存在，换在名字吧~',
        validate: function(input) {
          if (!input) {
            return '不能为空哦，会让人家很为难的~';
          }
          if (fs.existsSync(input)) {
            return '还是有同名项目哦，换个名字吧~';
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

    let tmpChoices = Array.from(templateMap.keys()).map(template => {
      let {name, value} = template
      return {name, value}
    })

    // 项目模板
    promptList.push({
      type: 'list',
      name: 'template',
      message: '选择模板',
      choices: tmpChoices
    })
    const answers = await inquirer.prompt(promptList)
    console.log('answers', answers)
    this.write(answers)
  }

  /**
   * 创建文件夹
   * */
  write(options) {
    this.mkdir(options.appName)
  }

  create() {
    console.log('create')
    this.talk()
  }
}


module.exports = App