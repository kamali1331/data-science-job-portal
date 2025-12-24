# Run the site with VS Code Live Server

Quick steps to serve and live-reload this project using the VS Code extension Live Server.

- **Install Live Server**
  - Open Visual Studio Code, press `Ctrl+Shift+X`, search `Live Server` (author: Ritwick Dey) and install.
  - Or, from a terminal (if `code` is on your PATH):

```powershell
code --install-extension ritwickdey.LiveServer
```

- **Open the project**
  - In VS Code choose `File > Open Folder...` and open this project folder (the folder that contains `index.html`).

- **Start Live Server**
  - Click `Go Live` in VS Code's status bar, or right-click `index.html` and choose `Open with Live Server`.
  - The site will open at `http://127.0.0.1:5500` or `http://localhost:5500` by default.

- **Stop Live Server**
  - Click the `Port: 5500` indicator in the status bar again, or use the same menu that started it.

- **Change the port or host**
  - Add or edit `.vscode/settings.json` (this repo includes a recommended file) and set `liveServer.settings.port` or other keys.

- **Troubleshooting**
  - Make sure you opened the project folder (not just a single file). Live Server requires workspace context to serve correctly.
  - If the browser doesn't auto-open, open `http://127.0.0.1:5500` manually.
  - If the extension isn't working, try reinstalling it or restarting VS Code. If `code` isn't on your PATH, install it from the Command Palette: `Shell Command: Install 'code' command in PATH`.

If you'd like, I can run the `code --install-extension` command here, or apply other workspace settings for you.
