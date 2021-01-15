const inquirer = require('inquirer') // 定义选项

async function chooseTemplate() {
  const prompList = [
    {
      type: "list",
      name: 'template',
      message: '选择一个工程化模板',
      choices: [
        {
          name: 'default-template（默认模板）',
          value: 'default-template'
        },
        {
          name: 'mock-server（本地数据模拟模板）',
          value: 'mock-server'
        }
      ]
    },
    {
      type: "list",
      name: 'cssModule',
      message: '选择css模块化',
      choices: [
        {
          name: 'sass/scss',
          value: 'sass'
        },
        {
          name: 'less',
          value: 'less'
        }
      ]
    }
  ]

  const answers = await inquirer.prompt(prompList)
  const { template, cssModule } = answers
  console.log('你选择的模板是', template, answers)
  return {template, cssModule}
}

module.exports = {
  chooseTemplate
}