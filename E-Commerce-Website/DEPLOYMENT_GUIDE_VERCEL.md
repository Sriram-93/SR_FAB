# 🚀 Vercel Deployment Guide (Terminal)

This manual provides step-by-step instructions to host your **SR FAB** frontend on Vercel using the terminal.

---

## 1. Prerequisites
Ensure you have the Vercel CLI installed. If not, run:
```bash
npm install -g vercel
```

---

## 2. Prepare the Frontend
Navigate to your frontend directory:
```bash
cd frontend
```

### Configure API Proxy
I have created a `vercel.json` file in the `frontend` directory. You **MUST** update the backend URL in this file before deploying:

1. Open `frontend/vercel.json`.
2. Replace `https://your-backend-api.com` with your actual hosted backend URL (e.g., from Render, Railway, or AWS).

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://YOUR_BACKEND_URL/api/$1"
    }
  ]
}
```

---

## 3. Login to Vercel
Run the login command and follow the browser instructions:
```bash
vercel login
```

---

## 4. Deploy to Vercel
From the `frontend` directory, run:
```bash
vercel
```

### CLI Prompts:
- **Set up and deploy?** [Y/n] `y`
- **Which scope?** (Select your account)
- **Link to existing project?** [y/N] `n`
- **What's your project's name?** `sr-fab-frontend`
- **In which directory is your code located?** `./` (Press Enter)
- **Want to modify original settings?** [y/N] `n` (Vercel will auto-detect Vite/React)

---

## 5. Production Deployment
Once the preview looks good, deploy to production:
```bash
vercel --prod
```

---

## 6. Important Notes
- **Backend Hosting**: Since your backend is Spring Boot, it cannot be hosted on Vercel. We recommend [Render](https://render.com/) or [Railway](https://railway.app/) for a free/low-cost easy setup.
- **Environment Variables**: If you use any `.env` variables in Vite (prefixed with `VITE_`), you can add them during the `vercel` command or in the Vercel Dashboard under **Settings > Environment Variables**.

---

### Troubleshooting
If the page refreshes and shows a 404, ensure the `vercel.json` includes the SPA rewrite (already included in the file I created):
```json
{
  "source": "/(.*)",
  "destination": "/index.html"
}
```
