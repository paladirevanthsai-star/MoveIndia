# 🌐 How to Keep Move India Running 24/7 on Any Mobile & Laptop

There are two ways to run Move India without relying on Antigravity background tasks:

---

## 🚀 Option 1: Free 24/7 Cloud Hosting (Always Online, Even When Laptop is Off)

To have a permanent URL like **`https://move-india.onrender.com`** that works **24 hours a day, 7 days a week on any mobile phone or laptop worldwide**, host it on **Render.com** (100% Free):

### Step-by-Step (Takes 3 Minutes):

1. **Push your project to GitHub**:
   - Create a free GitHub repository (e.g. `move-india`).
   - Run these commands in your project terminal:
     ```powershell
     git init
     git add .
     git commit -m "Move India - SIH Urban AI Sensing Platform"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/move-india.git
     git push -u origin main
     ```

2. **Deploy on Render (Free)**:
   - Go to [render.com](https://render.com) and sign up for a free account.
   - Click **"New +" ➔ "Web Service"**.
   - Select your `move-india` GitHub repository.
   - Render will automatically detect the settings from `render.yaml`:
     - **Build Command**: `cd client && npm install && npm run build && cd ../server && npm install`
     - **Start Command**: `cd server && node index.js`
     - **Instance Type**: `Free`
   - Click **"Deploy Web Service"**.

3. **Your Permanent 24/7 Link**:
   - In 2 minutes, Render will give you a permanent public HTTPS URL, for example:
     **`https://move-india.onrender.com`**
   - This link will **never expire**, requires **no password**, and works on any phone, tablet, or laptop worldwide 24/7!

---

## 💻 Option 2: 1-Click Offline Desktop Launcher (Without Antigravity)

If you want to run the project on your laptop for testing or presentations without opening Antigravity or writing commands in the terminal:

1. Open your project folder: `c:\Users\hp 745 g6\Documents\move india`.
2. Double-click the file named:
   ### 👉 **`start_move_india.bat`**
3. It will:
   - Automatically start the unified server in the background.
   - Automatically open your default browser to `http://localhost:5000`.
   - Show you the local Wi-Fi URL (`http://192.168.29.84:5000`) for mobile devices.
   - When you are done, simply press any key in the window to stop the server!
