#! /usr/bin/env node
const { program } = require('commander')
const download = require('download-git-repo')
const ora = require('ora')
const chalk = require('chalk')
const templateMap = require('./templateMap')
const shell = require('shelljs')

const App = require('./task/create/app')
const { chooseTemplate } = require('./util/inquiries')

function start() {
  program.version(require('./package.json').version)

  program
    .command('create [appName]')
    .description('创建项目模板')
    // .option('--name [appName]', '输入项目名称')
    .option('--description [appDescription]', '项目描述')
    .option('--sass', '启用sass')
    .option('--less', '启用less')
    .action(function(appName, option) {
      console.log(appName, option)
      const app = new App({
        appName: appName || option.name,
        description: option.description,
        sass: option.sass,
        less: option.less
      })
      console.log('app', app)
    })


  program
    .command('app <projectName>')
    .description('创建项目模板')
    .option("-T, --template [template]", "输入使用的模板名字")

    .action(async function(projectName, options) {
      let template = options.template
      let cssModule = null

      if (!template) {
        const chooseResult = await chooseTemplate()
        template = chooseResult.template
        cssModule = chooseResult.cssModule
        console.log('template', template, cssModule)
      }

      // 下载中的loading
      const spinner = ora({
        text: '模板下载中',
        color: 'yellow',
        spinner: {
          interval: 80,
          frames: ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"]
        }
      })
      spinner.start()

      // 获取到模板地址并开始下载
      const downloadUrl = templateMap.get(template)
      console.log('downloadUrl', downloadUrl, template)
      download(downloadUrl, projectName, {clone:true}, error => {
        if (error) {
          spinner.fail(`项目创建失败： ${projectName}`)
          console.log('失败原因', error)
        } else {
          spinner.succeed(`项目创建成功： ${projectName}`)
          shell.cd(projectName)
          shell.exec(`npm install ${cssModule} -dev`)
          console.log(shell.ls())
        }
      })
    })

  program
    .command('checkAll')
    .description('查看所有模板')
    .action(function() {
    const templateList = [
      'default-template',
      'default-template-ts'
    ]
    templateList.forEach(temp => {
      console.log(temp)
    })
  })
  program.parse(process.argv)
}

start()
