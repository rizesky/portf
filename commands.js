class PortoOSCommandProcessor {
  constructor(filesystem) {
    this.filesystem = filesystem;
    this.terminal = null; // wired by terminal after construction
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
        return this.handleHistory();
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
      case 'man':
        return this.handleMan(args);
      case 'theme':
        return this.handleTheme(args);
      case 'grep':
        return this.handleGrep(args);
      case 'find':
        return this.handleFind(args);
      case 'download':
      case 'wget':
        return this.handleDownload(args);
      case 'sudo':
        return { error: 'visitor is not in the sudoers file. This incident will be reported.' };
      case 'vim':
      case 'vi':
      case 'nano':
      case 'emacs':
        return { error: `${command}: read-only filesystem. (Also: how would you even exit?)` };
      case 'rm':
        return { error: "rm: nice try. Type 'warnings' to see what happens to people who try things." };
      case 'exit':
      case 'logout':
        return { error: "There is no escape. Type 'help' instead." };
      case 'make':
        if (args.join(' ').toLowerCase().includes('sandwich')) {
          return { output: 'What? Make it yourself.' };
        }
        return { error: 'make: *** No targets specified and no makefile found. Stop.' };
      default:
        return { error: this.unknownCommandMessage(command) };
    }
  }

  knownCommands() {
    return ['ls','cd','cat','pwd','whoami','date','ps','history','clear','help','uname','echo','warnings','tree','man','theme','grep','find','download','wget',
            ...Object.keys(this.aliases)];
  }

  handleDownload(args) {
    if (!args[0]) return { error: 'download: usage: download <file>' };
    const result = this.filesystem.cat(args[0]);
    if (result.error) return { error: `download: ${result.error}` };
    const filename = args[0].split('/').pop() || 'file.txt';
    try {
      const blob = new Blob([result.content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return { output: `Downloaded ${filename} (${result.content.length} bytes).` };
    } catch (e) {
      return { error: `download: failed: ${e.message}` };
    }
  }

  walkFs(startPath) {
    const start = this.filesystem.getNode(startPath);
    if (!start || start.type !== 'directory') return [];
    const out = [];
    const recurse = (node, path) => {
      out.push({ path, node });
      if (node.type === 'directory' && node.children) {
        for (const [name, child] of Object.entries(node.children)) {
          const childPath = path === '/' ? `/${name}` : `${path}/${name}`;
          recurse(child, childPath);
        }
      }
    };
    recurse(start, startPath);
    return out;
  }

  handleGrep(args) {
    if (args.length < 1) return { error: 'grep: usage: grep <pattern> [path]' };
    const pattern = args[0];
    const startPath = args[1]
      ? this.filesystem.resolvePath(args[1])
      : this.filesystem.currentPath;
    let regex;
    try { regex = new RegExp(pattern, 'i'); }
    catch { return { error: `grep: invalid pattern: ${pattern}` }; }

    const entries = this.walkFs(startPath);
    const lines = [];
    for (const { path, node } of entries) {
      if (node.type !== 'file' || !node.content) continue;
      const fileLines = node.content.split('\n');
      fileLines.forEach((line, i) => {
        if (regex.test(line)) {
          lines.push(`${path}:${i + 1}: ${line.trim()}`);
        }
      });
    }
    return lines.length
      ? { output: lines.join('\n') }
      : { output: `(no matches for '${pattern}')` };
  }

  handleFind(args) {
    const startPath = args[0]
      ? this.filesystem.resolvePath(args[0])
      : this.filesystem.currentPath;
    const nameIdx = args.indexOf('-name');
    const nameArg = nameIdx >= 0 ? args[nameIdx + 1] : null;

    const entries = this.walkFs(startPath);
    let results = entries.map(e => e.path);

    if (nameArg) {
      const pattern = nameArg.replace(/\./g, '\\.').replace(/\*/g, '.*').replace(/\?/g, '.');
      const regex = new RegExp(`^${pattern}$`, 'i');
      results = results.filter(p => regex.test(p.split('/').pop()));
    }

    return results.length
      ? { output: results.join('\n') }
      : { output: '(no matches)' };
  }

  handleTheme(args) {
    const themes = ['purple', 'matrix', 'amber'];
    if (!args[0]) {
      const current = document.documentElement.getAttribute('data-theme') || 'purple';
      return { output: `Current theme: ${current}\nAvailable: ${themes.join(', ')}\nUsage: theme <name>` };
    }
    const name = args[0].toLowerCase();
    if (!themes.includes(name)) {
      return { error: `Unknown theme '${name}'. Available: ${themes.join(', ')}` };
    }
    document.documentElement.setAttribute('data-theme', name);
    try { localStorage.setItem('portoos.theme', name); } catch {}
    return { output: `Theme set to '${name}'.` };
  }

  unknownCommandMessage(command) {
    const suggestion = this.closestCommand(command);
    const hint = suggestion ? ` Did you mean '${suggestion}'?` : '';
    return `Command not found: '${command}'.${hint} Type 'help' for available commands.`;
  }

  closestCommand(input) {
    if (!input) return null;
    const candidates = this.knownCommands();
    let best = null;
    let bestScore = Infinity;
    for (const c of candidates) {
      const d = this.levenshtein(input.toLowerCase(), c.toLowerCase());
      if (d < bestScore) { bestScore = d; best = c; }
    }
    return bestScore <= Math.max(2, Math.floor(input.length / 3)) ? best : null;
  }

  levenshtein(a, b) {
    const m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }
    return dp[m][n];
  }

  handleHistory() {
    if (!this.terminal || !this.terminal.history || this.terminal.history.length === 0) {
      return { output: '(no history)' };
    }
    const lines = [...this.terminal.history].reverse()
      .map((cmd, i) => `${String(i + 1).padStart(4, ' ')}  ${cmd}`)
      .join('\n');
    return { output: lines };
  }

  handleMan(args) {
    if (!args[0]) return { error: 'man: missing command name' };
    const pages = {
      ls: 'ls [dir] — list files in directory.',
      cd: 'cd [dir] — change directory. Use .. to go up.',
      cat: 'cat <file> — print file contents. Tab-completes.',
      pwd: 'pwd — print working directory.',
      tree: 'tree [dir] — show directory tree.',
      history: 'history — show previous commands this session.',
      help: 'help — list available commands.',
      warnings: 'warnings — show prohibited actions (do not test them).',
      echo: 'echo <text> — print text.',
      clear: 'clear — clear the screen.',
      whoami: 'whoami — print effective user.',
      date: 'date — current date and time.',
      uname: 'uname — system identification.',
      ps: 'ps — list (fake) running processes.',
      man: 'man <command> — show manual page for command.',
      theme: 'theme [name] — switch color theme. Available: purple, matrix, amber. Persists across reloads.',
      grep: 'grep <pattern> [path] — recursively search file contents (case-insensitive regex).',
      find: 'find [path] -name <glob> — find files matching a name pattern. Supports * and ?.',
      download: 'download <file> — download a file from the virtual FS to your machine. Alias: wget.',
      wget: 'wget <file> — alias for download.'
    };
    const page = pages[args[0]];
    return page ? { output: page } : { error: `No manual entry for ${args[0]}` };
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
    // Skip the type-out for ASCII art (looks bad mid-render).
    const isArt = /[█▓▒░╔╗╚╝═║]/.test(result.content);
    return { output: result.content, typed: !isArt };
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
  grep <pat> [path]  Search file contents
  find [path] -name <glob>   Find files by name
  download <file>    Download file to your machine

System:
  whoami             Show current user
  date               Show current date/time
  ps                 Show running processes
  uname              Show system information
  history            Show command history
  man <cmd>          Show manual page

Utilities:
  echo <text>        Display text
  clear              Clear terminal screen
  help               Show this help
  warnings           Show prohibited actions
  theme [name]       Switch theme (purple|matrix|amber)

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
