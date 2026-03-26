class PortoOSTerminal {
  constructor() {
    this.filesystem = new PortoOSFileSystem();
    this.commandProcessor = new PortoOSCommandProcessor(this.filesystem);
    this.currentLine = '';
    this.history = [];
    this.historyIndex = -1;
    this.isInitialized = false;
    
    this.outputElement = document.getElementById('terminal-output');
    this.inputElement = null; // Will be created dynamically
    
    this.init();
  }

  init() {
    console.log('Terminal initializing...');
    
    // Show boot sequence first
    this.showBootSequence();
    
    this.isInitialized = true;
    
    // Set up click handler for terminal body
    this.setupClickHandler();
  }

  setupClickHandler() {
    const terminalBody = document.querySelector('.terminal-body');
    if (terminalBody) {
      terminalBody.addEventListener('click', () => {
        if (this.inputElement) {
          this.inputElement.focus();
        }
      });
    }
  }

  showBootSequence() {
    const bootMessages = [
      'PortoOS v1.0.0 - My terminal portfolio',
      '===========================',
      'Loading portoOS modules...',
      'Mounting imaginary drives...',
      'Starting pretend services...',
      'Initializing terminal emulator...',
      'System ready!'
    ];

    bootMessages.forEach((message, index) => {
      setTimeout(() => {
        this.addOutput(message);
        if (index === bootMessages.length - 1) {
          this.addOutput('');
          // Show welcome message and prompt after boot sequence
          this.showWelcome();
        }
      }, index * 500);
    });
  }

  showWelcome() {
    this.addOutput('Welcome to PortoOS!');
    this.addOutput('');
    this.addOutput('This is Rizesky\'s Interactive Portfolio Terminal.');
    this.addOutput('Explore my work using terminal commands like \'ls\', \'cd\', \'cat\', and \'tree\'.');
    this.addOutput('Type \'profile\' to see my ASCII art profile!');
    this.addOutput('');
    this.addOutput('💡 TIP: Press TAB for autocompletion of commands and files!');
    this.addOutput('🌳 TIP: Use \'tree\' command to see directory structures in a tree view!');
    this.addOutput('');
    this.addOutput('⚠️  WARNING: This system is protected!');
    this.addOutput('   Illegal actions will result in immediate system lockdown.');
    this.addOutput('   Type \'warnings\' to see what actions are prohibited.');
    this.addOutput('');
    
    // Show help automatically after a short delay
    setTimeout(() => {
      this.showHelp();
    }, 1000);
  }

  showHelp() {
    const helpOutput = this.commandProcessor.handleHelp();
    this.addOutput(helpOutput.output);
    this.addOutput('');
    this.addPrompt();
  }

  addOutput(text, className = '') {
    if (!this.outputElement) return;
    
    const line = document.createElement('div');
    line.className = `terminal-line ${className}`;
    line.textContent = text;
    this.outputElement.appendChild(line);
    this.outputElement.scrollTop = this.outputElement.scrollHeight;
  }

  addPrompt() {
    if (!this.outputElement) return;
    
    // Only create input if it doesn't exist
    if (!this.inputElement) {
      this.createInputField();
    }
    
    const prompt = document.createElement('div');
    prompt.className = 'terminal-prompt';
      prompt.innerHTML = `<span class="user">visitor@portoos</span>:<span class="path">${this.filesystem.pwd()}</span>$ `;
    
    // Move existing input to new prompt
    if (this.inputElement && this.inputElement.parentNode) {
      this.inputElement.parentNode.removeChild(this.inputElement);
    }
    prompt.appendChild(this.inputElement);
    
    this.outputElement.appendChild(prompt);
    this.outputElement.scrollTop = this.outputElement.scrollHeight;
    
    // Focus the input
    setTimeout(() => this.inputElement.focus(), 10);
  }

  createInputField() {
    const input = document.createElement('input');
    input.id = 'terminal-input';
    input.className = 'terminal-input-inline';
    input.type = 'text';
    input.autocomplete = 'off';
    input.spellcheck = false;
    
    this.inputElement = input;
    this.setupInputHandling();
  }

  setupInputHandling() {
    if (!this.inputElement) return;

    this.inputElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.executeCommand();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateHistory(-1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateHistory(1);
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.autocomplete();
      }
    });

    this.inputElement.addEventListener('input', (e) => {
      this.currentLine = e.target.value;
    });
  }

  executeCommand() {
    if (!this.currentLine.trim()) {
      this.addPrompt();
      this.inputElement.value = '';
      return;
    }

    // Add to history
    this.history.unshift(this.currentLine);
    this.historyIndex = -1;

    // Process command
    const result = this.commandProcessor.processCommand(this.currentLine);

    if (result.action === 'clear') {
      this.clearTerminal();
      this.addPrompt();
    } else if (result.action === 'nuke') {
      this.nukeSystem(result.reason);
    } else if (result.error) {
      this.addOutput(result.error, 'error');
      this.addPrompt();
    } else if (result.output) {
      this.addOutput(result.output);
      this.addPrompt();
    } else {
      this.addPrompt();
    }

    // Clear input
    this.inputElement.value = '';
    this.currentLine = '';
    this.outputElement.scrollTop = this.outputElement.scrollHeight;
  }

  navigateHistory(direction) {
    if (this.history.length === 0) return;

    this.historyIndex += direction;
    
    if (this.historyIndex < 0) {
      this.historyIndex = -1;
      this.inputElement.value = '';
      this.currentLine = '';
    } else if (this.historyIndex >= this.history.length) {
      this.historyIndex = this.history.length - 1;
    } else {
      this.inputElement.value = this.history[this.historyIndex];
      this.currentLine = this.history[this.historyIndex];
    }
  }

  autocomplete() {
    if (!this.inputElement) return;
    
    const rawInput = this.inputElement.value || '';
    
    if (this.tryCatAutocomplete(rawInput)) {
      return;
    }
    
    this.handleGeneralAutocomplete(rawInput);
  }
  
  tryCatAutocomplete(rawInput) {
    const input = rawInput.trimStart();
    
    if (!input.toLowerCase().startsWith('cat ')) {
      return false;
    }
    
    const partialPath = input.slice(4).trimStart();
    const completions = this.getPathCompletions(partialPath);
    
    if (completions.length === 0) {
      return true;
    }
    
    if (completions.length === 1) {
      const newValue = `cat ${completions[0]}`;
      this.inputElement.value = newValue;
      this.currentLine = newValue;
    } else {
      const displayMatches = completions.slice(0, 5);
      this.addOutput(`Possible completions: ${displayMatches.join(' ')}${completions.length > 5 ? '...' : ''}`);
    }
    
    return true;
  }
  
  handleGeneralAutocomplete(rawInput) {
    if (!this.inputElement) return;
    
    const commands = ['ls', 'cd', 'cat', 'pwd', 'whoami', 'date', 'ps', 'uname', 'echo', 'clear', 'help', 'warnings', 'tree'];
    const aliases = ['about', 'skills', 'projects', 'contact', 'experience', 'experiences', 'education', '..'];
    const trimmedLeading = rawInput.replace(/^\s+/, '');
    const hasTrailingSpace = rawInput.endsWith(' ');
    
    if (!trimmedLeading) {
      this.showCompletionOptions([...commands, ...aliases]);
      return;
    }
    
    const tokens = trimmedLeading.split(/\s+/);
    const isCommandContext = tokens.length === 1 && !hasTrailingSpace;
    
    if (isCommandContext) {
      const partial = tokens[0];
      const preservedPrefix = rawInput.slice(0, rawInput.length - partial.length);
      this.completeFromOptions([...commands, ...aliases], preservedPrefix, partial);
      return;
    }
    
    const partialPath = hasTrailingSpace ? '' : tokens[tokens.length - 1];
    const baseInput = rawInput.slice(0, rawInput.length - partialPath.length);
    this.completePathContext(baseInput, partialPath);
  }
  
  showCompletionOptions(options) {
    if (!options.length) return;
    const uniqueOptions = [...new Set(options)];
    const displayMatches = uniqueOptions.slice(0, 5);
    this.addOutput(`Possible completions: ${displayMatches.join(' ')}${uniqueOptions.length > 5 ? '...' : ''}`);
  }
  
  completeFromOptions(options, baseInput, partial) {
    const normalizedPartial = partial.toLowerCase();
    let matches;
    
    if (!normalizedPartial) {
      matches = options;
    } else {
      matches = options.filter(option => {
        const lower = option.toLowerCase();
        return lower.startsWith(normalizedPartial) && lower !== normalizedPartial;
      });
    }
    
    const uniqueMatches = [...new Set(matches)];
    
    if (normalizedPartial && uniqueMatches.length === 1) {
      const newValue = `${baseInput}${uniqueMatches[0]}`;
      this.inputElement.value = newValue;
      this.currentLine = newValue;
    } else if (uniqueMatches.length > 0) {
      this.showCompletionOptions(uniqueMatches);
    }
  }
  
  completePathContext(baseInput, partialPath) {
    const completions = this.getPathCompletions(partialPath);
    
    if (completions.length === 1) {
      const newValue = `${baseInput}${completions[0]}`;
      this.inputElement.value = newValue;
      this.currentLine = newValue;
    } else if (completions.length > 1) {
      this.showCompletionOptions(completions);
    }
  }
  
  getPathCompletions(partialPath) {
    const path = partialPath || '';
    const lastSlashIndex = path.lastIndexOf('/');
    let dirPart = '';
    let filePrefix = path;
    
    if (lastSlashIndex === 0) {
      dirPart = '/';
      filePrefix = path.slice(1);
    } else if (lastSlashIndex > 0) {
      dirPart = path.slice(0, lastSlashIndex);
      filePrefix = path.slice(lastSlashIndex + 1);
    }
    
    const listing = dirPart ? this.filesystem.ls(dirPart) : this.filesystem.ls();
    if (listing.error) {
      return [];
    }
    
    const options = listing.files || [];
    const lowerPrefix = filePrefix.toLowerCase();
    
    const matches = options.filter(option => 
      option.toLowerCase().startsWith(lowerPrefix) && option.toLowerCase() !== lowerPrefix
    );
    
    const uniqueMatches = [...new Set(matches)];
    
    return uniqueMatches.map(option => this.buildCompletionPath(dirPart, option));
  }
  
  buildCompletionPath(dirPart, entry) {
    const base = dirPart ? (dirPart === '/' ? '/' : dirPart) : '';
    const separator = base && base !== '/' ? '/' : '';
    const candidate = base ? `${base}${separator}${entry}` : entry;
    const resolvedCandidate = this.resolveCandidatePath(base, entry);
    const node = resolvedCandidate ? this.filesystem.getNode(resolvedCandidate) : null;
    const suffix = node && node.type === 'directory' ? '/' : '';
    return candidate + suffix;
  }
  
  resolveCandidatePath(base, entry) {
    if (!base) {
      return this.filesystem.resolvePath(entry);
    }
    
    const separator = base === '/' ? '' : '/';
    const candidatePath = `${base}${separator}${entry}`;
    return this.filesystem.resolvePath(candidatePath);
  }

  clearTerminal() {
    if (this.outputElement) {
      this.outputElement.innerHTML = '';
    }
  }

  focusInput() {
    if (this.inputElement) {
      this.inputElement.focus();
    }
  }

  nukeSystem(reason) {
    this.clearTerminal();
    
    // Show system admin destruction in terminal
    this.addOutput('🚨 SECURITY BREACH DETECTED 🚨');
    this.addOutput('================================');
    this.addOutput(`Reason: ${reason}`);
    this.addOutput('');
    this.addOutput('System Administrator has been notified.');
    this.addOutput('Initiating emergency lockdown sequence...');
    this.addOutput('');
    
    // Start the system admin destruction sequence
    this.startSystemAdminDestruction();
  }

  startSystemAdminDestruction() {
    const adminCommands = [
      { cmd: 'admin@portoos:~# whoami', output: 'admin', isRoot: false },
      { cmd: 'admin@portoos:~# sudo su -', output: 'root@portoos:~#', isRoot: true },
      { cmd: 'root@portoos:~# systemctl stop terminal.service && ps aux | grep visitor', output: 'Terminal service stopped.\nvisitor    1234  0.1  0.0  12345  6789 pts/0    S+   12:34   0:00 bash', isRoot: true },
      { cmd: 'root@portoos:~# kill -9 1234 && rm -rf /home/visitor', output: 'Process terminated.\nDirectory removed.', isRoot: true },
      { cmd: 'root@portoos:~# rm -rf /var/log/visitor && rm -rf /tmp/visitor*', output: 'Logs purged.\nTemporary files cleared.', isRoot: true },
      { cmd: 'root@portoos:~# userdel -r visitor && systemctl disable terminal.service', output: 'User account deleted.\nTerminal service disabled.', isRoot: true },
      { cmd: 'root@portoos:~# iptables -A INPUT -s 0.0.0.0/0 -j DROP && shutdown -h now', output: 'Firewall rules updated.\nSystem shutting down...', isRoot: true },
      { cmd: 'root@portoos:~# ', output: '', isRoot: true }
    ];

    let commandIndex = 0;
    const typeCommand = () => {
      if (commandIndex >= adminCommands.length) {
        // After all commands, start destructive animation
        setTimeout(() => {
          this.addOutput('');
          this.addOutput('💀 SYSTEM TERMINATED 💀');
          this.addOutput('This terminal session has been permanently locked.');
          this.addOutput('All user data has been purged from the system.');
          this.addOutput('');
          this.addOutput('Access denied. Goodbye.');
          
          // Start destructive animation
          this.startDestructiveAnimation();
          
          // Disable input
          if (this.inputElement) {
            this.inputElement.disabled = true;
            this.inputElement.placeholder = 'TERMINAL LOCKED - ACCESS DENIED';
          }
        }, 1000);
        return;
      }

      const command = adminCommands[commandIndex];
      
      // Show the command being typed (red for root commands)
      if (command.isRoot) {
        this.addOutput(command.cmd, 'root');
      } else {
        this.addOutput(command.cmd);
      }
      
      // Show output after a delay
      setTimeout(() => {
        if (command.output) {
          // Split output by newlines and display each line
          const outputLines = command.output.split('\n');
          outputLines.forEach((line, index) => {
            setTimeout(() => {
              if (command.isRoot) {
                this.addOutput(line, 'root');
              } else {
                this.addOutput(line);
              }
            }, index * 200); // Small delay between output lines
          });
        }
        this.addOutput('');
        commandIndex++;
        setTimeout(typeCommand, 800 + Math.random() * 1200); // Random delay between commands
      }, 500 + Math.random() * 1000);
    };

    // Start typing commands after a short delay
    setTimeout(typeCommand, 1000);
  }

  startDestructiveAnimation() {
    // Create destruction overlay
    const destructionOverlay = document.createElement('div');
    destructionOverlay.id = 'destruction-overlay';
    destructionOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #000;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 2s ease-in;
      font-family: 'Press Start 2P', monospace;
      color: #ff0000;
      text-shadow: 0 0 10px #ff0000;
    `;
    
    // Add destruction text
    const destructionText = document.createElement('div');
    destructionText.style.cssText = `
      font-size: 24px;
      text-align: center;
      margin-bottom: 30px;
    `;
    destructionText.innerHTML = `
      <div>💥 SYSTEM DESTRUCTION 💥</div>
      <div style="font-size: 16px; margin-top: 20px;">TERMINAL DESTROYED</div>
      <div style="font-size: 12px; margin-top: 10px; color: #666;">DESKTOP DESTROYED</div>
    `;
    
    // Add console for destruction sequence
    const consoleOutput = document.createElement('div');
    consoleOutput.id = 'destruction-console';
    consoleOutput.style.cssText = `
      font-size: 12px;
      line-height: 1.4;
      max-width: 800px;
      width: 90%;
      height: 300px;
      overflow-y: auto;
      background: #111;
      padding: 20px;
      border: 1px solid #333;
      border-radius: 4px;
    `;
    
    destructionOverlay.appendChild(destructionText);
    destructionOverlay.appendChild(consoleOutput);
    document.body.appendChild(destructionOverlay);
    
    // Add screen shake effect
    document.body.style.animation = 'shake 0.3s ease-in-out infinite';
    
    // Add shake animation to CSS
    if (!document.getElementById('shake-style')) {
      const shakeStyle = document.createElement('style');
      shakeStyle.id = 'shake-style';
      shakeStyle.textContent = `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-3px); }
          20%, 40%, 60%, 80% { transform: translateX(3px); }
        }
        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `;
      document.head.appendChild(shakeStyle);
    }
    
    // Animate in
    setTimeout(() => {
      destructionOverlay.style.opacity = '1';
    }, 100);
    
    // Start the destruction sequence
    this.startDestructionSequence(consoleOutput);
    
    // Stop shaking after 3 seconds
    setTimeout(() => {
      document.body.style.animation = '';
    }, 3000);
  }

  startDestructionSequence(consoleElement) {
    const messages = [
      '🚨 SYSTEM FAILURE 🚨',
      '==================',
      '',
      'Terminal destroyed...',
      'Desktop corrupted...',
      'System terminated...',
      '',
      '💀 DESTROYED 💀',
      '==============',
      'All systems offline.',
      '',
      'Goodbye.'
    ];

    let messageIndex = 0;
    let charIndex = 0;
    let currentMessage = '';

    const typeNextChar = () => {
      if (messageIndex >= messages.length) {
        // After all messages, fade to pure black
        setTimeout(() => {
          const overlay = document.getElementById('destruction-overlay');
          if (overlay) {
            overlay.style.background = '#000';
            overlay.innerHTML = '';
            overlay.style.opacity = '1';
          }
        }, 500);
        return;
      }

      if (charIndex < messages[messageIndex].length) {
        currentMessage += messages[messageIndex][charIndex];
        consoleElement.innerHTML = currentMessage.replace(/\n/g, '<br>') + '<span style="color: #ff0000; animation: flicker 0.5s infinite;">█</span>';
        charIndex++;
        setTimeout(typeNextChar, 10 + Math.random() * 20); // Super fast typing
      } else {
        currentMessage += '\n';
        consoleElement.innerHTML = currentMessage.replace(/\n/g, '<br>') + '<span style="color: #ff0000; animation: flicker 0.5s infinite;">█</span>';
        messageIndex++;
        charIndex = 0;
        setTimeout(typeNextChar, 20 + Math.random() * 50); // Very short pause between messages
      }
    };

    // Start typing after a short delay
    setTimeout(typeNextChar, 500);
  }
}
