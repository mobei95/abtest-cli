#! /usr/bin/env node
const { program } = require('commander')
const download = require('download-git-repo')
const clone = require('git-clone')
const { chooseTemplate } = require('./inquiries')
const templateMap = require('./templateMap')

function start() {
  console.log('start')
  program.version(require('./package.json').version)

  program
    .command('create <projectName>')
    .description('创建项目模板')
    .option("-T, --template [template]", "输入使用的模板名字")
    .action(async function(projectName, options) {
      let template = options.template

      if (!template) {
        template = await chooseTemplate()
      }

      const downloadUrl = templateMap.get(template)
      // clone()
      download(downloadUrl, projectName, {clone:true}, error => {
        if (error) {
          console.log('项目创建失败', error)
        } else {
          console.log('创建成功')
        }
      })

      console.log('创建流程', projectName, template)
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