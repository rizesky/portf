# PortoOS

A retro OS-themed personal portfolio, presented as a fake desktop with a working terminal. Built with vanilla JavaScript, NES.css, and a CRT aesthetic.

Type `help` to see what's possible.

## Run it

No build step. Open `index.html` in a browser, or serve the directory:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Commands

**Filesystem:** `ls`, `cd`, `pwd`, `cat`, `tree`, `grep`, `find`, `download`
**System:** `whoami`, `date`, `ps`, `uname`, `history`, `man`
**Utilities:** `echo`, `clear`, `help`, `warnings`, `theme`

**Aliases:** `about`, `skills`, `projects`, `contact`, `experience`, `education`, `profile`

**Tips:**
- `TAB` autocompletes commands and paths
- `↑` / `↓` navigate command history (persisted across reloads)
- Click desktop icons for quick actions
- `theme matrix` or `theme amber` for different vibes (persisted)
- `grep <pattern>` to search file contents, `find -name "*.txt"` to find files
- `download about/experience.txt` saves the file to your machine
- Drag the terminal to a screen edge to snap it (Win-style)
- Press a key to skip the boot sequence or the `cat` type-out
- Try `warnings` — but don't test them
- There may or may not be a Konami code easter egg

## Stack

- Vanilla JS / CSS / HTML — no build, no framework
- [NES.css](https://nostalgic-css.github.io/NES.css/) for chrome
- VT323 + Press Start 2P fonts
- Canvas background animation
- CRT scanlines via CSS gradients

## Project layout

```
index.html         desktop, terminal window, taskbar
filesystem.js      virtual filesystem with portfolio content
commands.js        shell command processor
terminal.js        terminal UI: input, history, autocomplete
background.js      animated canvas backdrop
main.js            window/taskbar/icons wiring
*.css              styling
```
