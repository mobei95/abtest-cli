#! /usr/bin/env node
const { program } = require('commander')
const download = require('download-git-repo')
const ora = require('ora')
const chalk = require('chalk')
const templateMap = require('./templateMap')
const { chooseTemplate } = require('./inquiries')

function start() {
  console.log('start')
  program.version(require('./package.json').version)

  program
    .command('create <projectName>')
    .alias('c')
    .description('创建项目模板')
    .option("-T, --template [template]", "输入使用的模板名字")
    .action(async function(projectName, options) {
      let template = options.template

      if (!template) {
        template = await chooseTemplate()
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
      download(downloadUrl, projectName, {clone:true}, error => {
        if (error) {
          spinner.fail(`项目创建失败： ${projectName}`)
          console.log('失败原因', error)
        } else {
          spinner.succeed(`项目创建成功： ${projectName}`)
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