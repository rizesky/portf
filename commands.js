class PortoOSCommandProcessor {
  constructor(filesystem) {
    this.filesystem = filesystem;
          this.aliases = {
            '..': 'cd ..',
            'about': 'cat about/summary.txt',
            'skills': 'cat about/skills.txt',
            'projects': 'tree projects/',
            'contact': 'cat contact/email.txt',
            'experience': 'cat about/experience.txt',
            'experiences': 'cat about/experience.txt',
            'education': 'cat about/education.txt',
            'profile': 'cat profile.txt'
          };
  }

  processCommand(input) {
    const [command, ...args] = input.split(' ');

    // Check for aliases first
    if (this.aliases[command]) {
      const aliasedCommand = this.aliases[command];
      const [aliasCmd, ...aliasArgs] = aliasedCommand.split(' ');
      return this.executeSystemCommand(aliasCmd, [...aliasArgs, ...args]);
    }

    return this.executeSystemCommand(command, args);
  }

  executeSystemCommand(command, args) {
    switch (command) {
      case 'ls':
        return this.handleLs(args);
      case 'cd':
        return this.handleCd(args);
      case 'cat':
        return this.handleCat(args);
      case 'pwd':
        return this.handlePwd();
      case 'whoami':
        return { output: 'visitor' };
      case 'date':
        return { output: new Date().toLocaleString() };
      case 'ps':
        return { output: `  PID TTY          TIME CMD
    1 ?        00:00:00 init
    2 ?        00:00:00 [kthreadd]` };
      case 'history':
        return { output: 'Command history not implemented yet' };
      case 'clear':
        return { action: 'clear' };
      case 'help':
        return this.handleHelp();
      case 'uname':
        return { output: 'PortoOS 1.0.0 x86_64 GNU/Linux' };
      case 'echo':
        return { output: args.join(' ') };
      case 'warnings':
        return this.handleWarnings();
      case 'tree':
        return this.handleTree(args);
      default:
        return { error: `Command not found: '${command}'. Type 'help' for available commands.` };
    }
  }

  handleLs(args) {
    const result = this.filesystem.ls(args[0]);
    if (result.error) {
      return { error: result.error };
    }
    return { output: result.files.join('  ') };
  }

  handleCd(args) {
    if (!args[0]) {
      return { output: '', path: this.filesystem.currentPath };
    }
    const result = this.filesystem.cd(args[0]);
    if (result.error) {
      return { error: result.error };
    }
    return { output: '', path: result.path };
  }

  handleCat(args) {
    if (!args[0]) {
      return { error: 'cat: missing file operand' };
    }
    const result = this.filesystem.cat(args[0]);
    if (result.error) {
      return { error: result.error };
    }
    return { output: result.content };
  }

  handlePwd() {
    return { output: this.filesystem.pwd() };
  }

  handleHelp() {
    return {
      output: `PortoOS v1.0.0 - My terminal portfolio
Available commands:

File System:
  ls [dir]           List directory contents
  cd [dir]           Change directory  
  pwd                Print working directory
  cat <file>         Display file contents
  tree [dir]         Show directory tree structure

System:
  whoami             Show current user
  date               Show current date/time
  ps                 Show running processes
  uname              Show system information

Utilities:
  echo <text>        Display text
  clear              Clear terminal screen
  help               Show this help
  warnings           Show prohibited actions

Tips:
  TAB               Autocomplete commands and files
  ↑/↓ arrows       Navigate command history

Aliases:
  about              cat about/summary.txt
  skills             cat about/skills.txt
  projects           tree projects/
  contact            cat contact/email.txt
  experience         cat about/experience.txt
  experiences        cat about/experience.txt
  education          cat about/education.txt
  profile            cat profile.txt

Type any command to get started!`
    };
  }

  handleWarnings() {
    return {
      output: `⚠️  PROHIBITED ACTIONS - SYSTEM PROTECTION ⚠️
===============================================

🚫 ILLEGAL ACTIONS (Will trigger system lockdown):
  • Attempting to navigate outside /home/visitor directory
  • Trying to close the terminal window
  • Clicking the red close button (X)
  • Clicking the close button in taskbar
  • Any unauthorized system access

💥 CONSEQUENCES:
  • Immediate system destruction animation
  • Screen goes black forever
  • Terminal becomes permanently locked
  • No recovery possible

✅ SAFE ACTIONS:
  • All file system commands within /home/visitor
  • Minimizing terminal (yellow button)
  • Maximizing terminal (green button)
  • All other available commands

Stay within bounds to avoid the void! 🕳️`
    };
  }

  handleTree(args) {
    const path = args[0] || '/home/visitor';
    const result = this.filesystem.tree(path);
    if (result.error) {
      return { error: result.error };
    }
    return { output: result.tree };
  }
}
