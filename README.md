# 💖 FumbleReviewer

A premium, highly interactive, playful single-page web app built with vanilla HTML, CSS, and JS. Designed to let a date rate their experience (star ratings for performance, jokes, and movies), with a hilarious ending where the "No" button dynamically evades hover/touch inputs, forcing a "Yes" on joke verification. 

Once successfully completed, the scorecard is instantly dispatched to your email address via **Web3Forms** (no server/backend required!).

---

## ✨ Features
- 🌌 **Premium Visual Design**: Dark-mode glassmorphic interface with deep space purple-violet gradients, animated glowing text, and subtle micro-interactions.
- ❤️ **Interactive Particles**: Procedural floating heart background particles.
- ⭐ **Custom Star Ratings**: High-fidelity golden SVG star rating bars for Performance, Jokes, and Movies, featuring dynamic text descriptions.
- 🪖 **The Evasion Mechanic**: Highly optimized algorithm that coordinates screen bounds, cursor positions, and touch inputs to keep the "No" button floating out of reach.
- 📬 **Serverless Email Logging**: Automated dispatch of date scores to your email via the Web3Forms API.
- 🎉 **Canvas Confetti Burst**: Custom, high-performance canvas confetti system triggering on successful completion.

---

## 🛠️ Step 1: Configure Your Email (10 Seconds)

To protect your email address from spam bots and keep the site entirely static/free, we use **Web3Forms**. Follow these quick steps to connect your email:

1. **Get an Access Key**: Go to [https://web3forms.com/](https://web3forms.com/) and enter your email address (`sedillozandro720@gmail.com`).
2. **Retrieve the Key**: Check your inbox. You will receive an instant email containing a long string of letters and numbers (your Access Key).
3. **Configure the Project**: Open [config.js](file:///d:/Samdy/FumbleReviewer/config.js) in your text editor.
4. **Paste the Key**: Replace `"YOUR_WEB3FORMS_ACCESS_KEY_HERE"` with the key you copied. It should look like this:
   ```javascript
   WEB3FORMS_ACCESS_KEY: "12345678-abcd-1234-abcd-123456789abc",
   ```
5. **Save the File**: Save `config.js`. Your email setup is fully complete!

---

## 🚀 Step 2: Deploy to the Web (100% Free)

You can share this page with your date by publishing it to the web. Here are the three best free ways to do it:

### Option A: GitHub Pages (Recommended for standard git users)
1. Create a new repository on your GitHub account (e.g., `fumble-reviewer`).
2. Push this folder's contents (`index.html`, `style.css`, `app.js`, `config.js`) to the repository.
3. In your GitHub repository, go to **Settings** > **Pages** (under the Code and automation section).
4. Under **Build and deployment**, set **Source** to `Deploy from a branch`, choose `main` or `master` branch, `/ (root)` folder, and click **Save**.
5. Within 1-2 minutes, GitHub will give you a live URL (e.g., `https://yourusername.github.io/fumble-reviewer`).

### Option B: Netlify Drag & Drop (Fastest - No Git required!)
1. Go to [https://app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag and drop the **entire** `FumbleReviewer` folder directly onto the screen.
3. Netlify will deploy it instantly and provide you with a shareable live URL (e.g., `https://romantic-glitter-12345.netlify.app`). You can customize the URL subdomain in the Site Settings for free!

### Option C: Vercel Deployment (Fastest with Vercel CLI / Dashboard)
1. Go to [https://vercel.com/](https://vercel.com/) and create a free account.
2. Install the Vercel CLI (`npm install -g vercel`) and run `vercel` in this folder, or connect your GitHub repository to their online dashboard.
3. Your site will build and deploy instantly with a fast, professional `.vercel.app` URL.

---

## 💻 Running & Testing Locally

To check the visual and dynamic behaviors on your local machine:
- Simply double-click [index.html](file:///d:/Samdy/FumbleReviewer/index.html) to open it in your browser.
- Open your browser's Developer Tools (F12) and toggle "Device Toolbar" (Ctrl+Shift+M) to test the responsive mobile layout and touch evasion mechanics.
- If you haven't pasted your Access Key yet, the app runs in **Demo Mode**, showing you a visual representation of how the submission works!

Enjoy reviewing! 😉
