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
    }
  ]

  const answers = await inquirer.prompt(prompList)
  const { template } = answers
  console.log('你选择的模板是', template)
  return template
}

module.exports = {
  chooseTemplate
}