const shell = require('shelljs')

class fileShell {

}

class ExecShell {

}

class MainShell {
  constructor() {
    this.fileShell = new fileShell()
    this.execShell = new ExecShell()
  }

  exit() {
    shell.exit(1)
  }
}

module.exports = new MainShell()