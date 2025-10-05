class FakeOSApp {
  constructor() {
    this.terminalElement = document.getElementById('terminal-window');
    this.isTerminalMinimized = false;
    this.isMaximized = false;
    this.terminal = null;
    this.background = null;
    
    this.init();
  }

  init() {
    console.log('FakeOS App initializing...');
    
    // Initialize background animation
    this.background = new BackgroundAnimation();
    
    // Initialize terminal
    this.terminal = new FakeOSTerminal();
    window.terminalInstance = this.terminal;
    
    // Set up window dragging
    this.setupWindowDragging();
    
    // Set up taskbar functionality
    this.setupTaskbar();
    
    // Set up clock
    this.setupClock();
    
    console.log('FakeOS App initialized!');
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
        const maxY = window.innerHeight - this.terminalElement.offsetHeight - 40; // 40 for taskbar
        
        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
        
        this.terminalElement.style.left = newX + 'px';
        this.terminalElement.style.top = newY + 'px';
      }
    });
    
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        document.body.style.cursor = 'default';
      }
      isDragging = false;
    });

    // Double-click header to maximize/restore
    header.addEventListener('dblclick', () => {
      this.toggleMaximize();
    });
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
      this.terminalElement.style.height = 'calc(100vh - 40px)';
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
  new FakeOSApp();
});
