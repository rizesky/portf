class PortoOSApp {
  constructor() {
    this.terminalElement = document.getElementById('terminal-window');
    this.isTerminalMinimized = false;
    this.isMaximized = false;
    this.terminal = null;
    this.background = null;
    
    this.init();
  }

  init() {
    console.log('PortoOS App initializing...');

    // Restore persisted theme
    try {
      const savedTheme = localStorage.getItem('portoos.theme');
      if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
    } catch {}
    
    // Initialize background animation
    this.background = new BackgroundAnimation();
    
    // Initialize terminal
    this.terminal = new PortoOSTerminal();
    window.terminalInstance = this.terminal;
    
    // Set up window dragging
    this.setupWindowDragging();
    
    // Set up taskbar functionality
    this.setupTaskbar();
    
    // Set up clock
    this.setupClock();

    // Wire desktop icons
    this.setupDesktopIcons();

    // Wire mobile keybar
    this.setupMobileKeybar();

    // Konami code easter egg
    this.setupKonamiCode();
    
    console.log('PortoOS App initialized!');
  }

  setupWindowDragging() {
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialX = 0;
    let initialY = 0;

    const header = this.terminalElement.querySelector('.terminal-header');
    if (!header) return;

    header.addEventListener('mousedown', (e) => {
      // Don't start dragging if clicking on buttons
      if (e.target.closest('.terminal-buttons')) {
        return;
      }
      
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialX = this.terminalElement.offsetLeft;
      initialY = this.terminalElement.offsetTop;
      
      document.body.style.cursor = 'move';
      this.terminalElement.style.transform = 'none';
      e.preventDefault();
    });
    
    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        e.preventDefault();
        
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        let newX = initialX + deltaX;
        let newY = initialY + deltaY;
        
        // Keep window within viewport bounds
        const maxX = window.innerWidth - this.terminalElement.offsetWidth;
        const maxY = window.innerHeight - this.terminalElement.offsetHeight - 36; // taskbar height
        
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        this.terminalElement.style.left = newX + 'px';
        this.terminalElement.style.top = newY + 'px';
      }
    });
    
    document.addEventListener('mouseup', (e) => {
      if (isDragging) {
        document.body.style.cursor = 'default';
        this.maybeSnap(e.clientX, e.clientY);
      }
      isDragging = false;
    });

    // Double-click header to maximize/restore
    header.addEventListener('dblclick', () => {
      this.toggleMaximize();
    });
  }

  maybeSnap(x, y) {
    const w = window.innerWidth;
    const h = window.innerHeight - 36; // taskbar
    const edge = 20;
    const el = this.terminalElement;
    if (!el) return;

    const apply = (left, top, width, height) => {
      el.style.left = left;
      el.style.top = top;
      el.style.width = width;
      el.style.height = height;
      this.isMaximized = false;
    };

    if (y <= edge) {
      // top → maximize
      apply('0', '0', '100vw', `calc(100vh - 36px)`);
      this.isMaximized = true;
    } else if (x <= edge) {
      apply('0', '0', '50vw', `calc(100vh - 36px)`);
    } else if (x >= w - edge) {
      apply('50vw', '0', '50vw', `calc(100vh - 36px)`);
    }
  }

  toggleMaximize() {
    if (this.isMaximized) {
      // Restore
      this.terminalElement.style.width = '95vw';
      this.terminalElement.style.height = '80vh';
      this.terminalElement.style.top = '10vh';
      this.terminalElement.style.left = '2.5vw';
      this.isMaximized = false;
    } else {
      // Maximize
      this.terminalElement.style.width = '100vw';
      this.terminalElement.style.height = 'calc(100vh - 36px)';
      this.terminalElement.style.top = '0';
      this.terminalElement.style.left = '0';
      this.isMaximized = true;
    }
  }

  setupTaskbar() {
    const terminalBtn = document.getElementById('terminal-taskbar-btn');
    const minimizeBtn = document.getElementById('minimize-btn');
    const maximizeBtn = document.getElementById('maximize-btn');
    const closeBtn = document.getElementById('close-btn');
    const closeTaskbarBtn = document.getElementById('close-terminal-btn');
    
    if (terminalBtn) {
      terminalBtn.addEventListener('click', () => this.toggleTerminal());
    }
    
    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', () => this.toggleTerminal());
    }
    
    if (maximizeBtn) {
      maximizeBtn.addEventListener('click', () => this.toggleMaximize());
    }
    
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeTerminal());
    }
    
    if (closeTaskbarBtn) {
      closeTaskbarBtn.addEventListener('click', () => this.closeTerminal());
    }
  }

  setupDesktopIcons() {
    const actions = {
      profile: 'profile',
      terminal: null, // just focus
      projects: 'tree projects/',
      resume: 'cat about/experience.txt'
    };
    document.querySelectorAll('.desktop-icons .icon').forEach(icon => {
      icon.addEventListener('click', () => {
        const action = icon.dataset.action;
        if (this.isTerminalMinimized) this.toggleTerminal();
        const cmd = actions[action];
        if (cmd && this.terminal && this.terminal.runCommand) {
          this.terminal.runCommand(cmd);
        } else if (this.terminal && this.terminal.focusInput) {
          this.terminal.focusInput();
        }
      });
    });
  }

  setupMobileKeybar() {
    const bar = document.getElementById('mobile-keybar');
    if (!bar) return;
    bar.addEventListener('click', (e) => {
      const btn = e.target.closest('button');
      if (!btn) return;
      e.preventDefault();
      const input = this.terminal && this.terminal.inputElement;
      if (!input) return;
      input.focus();

      if (btn.dataset.insert) {
        const start = input.selectionStart ?? input.value.length;
        const end = input.selectionEnd ?? input.value.length;
        input.value = input.value.slice(0, start) + btn.dataset.insert + input.value.slice(end);
        const pos = start + btn.dataset.insert.length;
        input.setSelectionRange(pos, pos);
        this.terminal.currentLine = input.value;
        return;
      }

      const key = btn.dataset.key;
      if (!key) return;
      const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
      input.dispatchEvent(event);
    });
    // Prevent the keybar from stealing focus from the input on touch
    bar.addEventListener('mousedown', (e) => e.preventDefault());
    bar.addEventListener('touchstart', (e) => {
      // allow click but keep input focused
      const input = this.terminal && this.terminal.inputElement;
      if (input) setTimeout(() => input.focus(), 0);
    }, { passive: true });
  }

  setupKonamiCode() {
    const sequence = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let pos = 0;
    document.addEventListener('keydown', (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === sequence[pos]) {
        pos++;
        if (pos === sequence.length) {
          pos = 0;
          this.triggerKonami();
        }
      } else {
        pos = key === sequence[0] ? 1 : 0;
      }
    });
  }

  triggerKonami() {
    if (!this.terminal) return;
    const themes = ['purple', 'matrix', 'amber'];
    const current = document.documentElement.getAttribute('data-theme') || 'purple';
    const next = themes[(themes.indexOf(current) + 1) % themes.length];
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('portoos.theme', next); } catch {}

    this.terminal.addOutput('');
    this.terminal.addOutput('★ KONAMI CODE ACTIVATED ★');
    this.terminal.addOutput(`+30 lives. Theme cycled to '${next}'.`);
    this.terminal.addOutput('');

    // Brief screen flash
    const flash = document.createElement('div');
    flash.style.cssText = 'position:fixed;inset:0;background:var(--fg-primary);opacity:0.6;z-index:9998;pointer-events:none;transition:opacity 0.6s ease-out;';
    document.body.appendChild(flash);
    requestAnimationFrame(() => { flash.style.opacity = '0'; });
    setTimeout(() => flash.remove(), 700);
  }

  setupClock() {
    const timeElement = document.getElementById('taskbar-time');
    if (!timeElement) return;

    const updateClock = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      
      timeElement.textContent = `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    updateClock();
    setInterval(updateClock, 1000);
  }

  toggleTerminal() {
    if (!this.terminalElement) return;
    
    this.isTerminalMinimized = !this.isTerminalMinimized;
    const terminalBtn = document.getElementById('terminal-taskbar-btn');
    
    if (this.isTerminalMinimized) {
      this.terminalElement.style.display = 'none';
      if (terminalBtn) {
        terminalBtn.classList.remove('active');
      }
    } else {
      this.terminalElement.style.display = 'block';
      if (terminalBtn) {
        terminalBtn.classList.add('active');
      }
    }
  }

  closeTerminal() {
    // Closing terminal is illegal
    // Make sure terminal is visible before nuking
    if (this.isTerminalMinimized) {
      this.toggleTerminal(); // Show terminal first
      // Add small delay to ensure terminal is fully visible
      setTimeout(() => {
        this.nukeForIllegalAction('Attempting to close terminal');
      }, 100);
    } else {
      this.nukeForIllegalAction('Attempting to close terminal');
    }
  }

  nukeForIllegalAction(reason) {
    // Access the terminal instance and nuke it
    if (window.terminalInstance && window.terminalInstance.nukeSystem) {
      window.terminalInstance.nukeSystem(reason);
    }
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PortoOSApp();
});
