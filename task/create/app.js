'use strict';

const fs = require('fs')
const os = require('os')
const path = require('path')
const inquirer = require('inquirer')
const download = require('download-git-repo')
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

  /**
   * @description 项目根目录地址
   * @return {String}
   * */
  destinationRoot() {
    const cwd = process.cwd()
    return path.resolve(cwd, this.conf.appName || '.')
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
  write(answers) {
    this.conf = Object.assign({
      appName: null,
      description: '',
      sass: false,
      less: false
    }, answers)
    const {appName, template} = answers
    const tempPath = this.getTempPath(template)
    this.downloadTempDir(tempPath, appName, this.writeConfig)
  }

  /**
   * @description 获取模板地址
   * @param {String} tempName
   * */
  getTempPath(tempName) {
    const temp = Array.from(templateMap.keys()).find(item => item.value === tempName)
    return templateMap.get(temp)
  }

  /**
   * @description 下载模板到临时文件夹
   * @param {String} tempPath
   * @param {String} appName
   * @param {Function} cb
   * */
  downloadTempDir(tempPath, appName, cb) {
    download(tempPath, appName, {clone:true}, err => {
      if (err) {
        console.log('模板下载失败', err)
      } else {
        cb.apply(this)
      }
    })
  }

  /**
   * @description 写入项目配置
   * */
  writeConfig() {
    const conf = this.conf
    this.configPackage()
  }

  /**
   * @description 配置package.json
   * */
  configPackage() {
    const {appName, description} = this.conf
    const pkg = this.readFile(this.destinationRoot(), 'package.json')
    this.writeFile(this.destinationRoot(), {
      'package.json': JSON.stringify(Object.assign(pkg, {
        name: appName,
        description: description || '',
        version: '0.1.0'
      }), null, 2)
    })
  }

  create() {
    this.talk()
  }
}


module.exports = App