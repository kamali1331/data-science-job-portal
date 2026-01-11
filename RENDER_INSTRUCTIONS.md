# Render.com Deployment Guide

Follow these steps to deploy your Data Science Job Portal.

## Prerequisite
Ensure your code is pushed to GitHub:
```bash
git push -u origin master
```

## Step 1: Create Web Service
1.  Go to [dashboard.render.com](https://dashboard.render.com/).
2.  Click **"New +"** and select **"Web Service"**.
3.  Connect the **`data-science-job-portal`** repository you just created.

## Step 2: Configure Service
Use exactly these settings:

| Setting | Value |
| :--- | :--- |
| **Name** | `data-science-job-portal` (or similar) |
| **Root Directory** | `server` |
| **Region** | Singapore (or nearest to you) |
| **Branch** | `master` |
| **Runtime** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node server.js` |
| **Instance Type** | Free |

## Step 3: Environment Variables (Critical!)
You **MUST** add these for the database to work.
Scroll down to the **"Environment Variables"** section and click **"Add Environment Variable"**.

1.  **Variable 1:**
    *   **Key:** `DATABASE_URL`
    *   **Value:** *(Open your `.env` file on your computer and copy the long url starting with `postgresql://...`)*

2.  **Variable 2:**
    *   **Key:** `PORT`
    *   **Value:** `3000`

## Step 4: Deploy
1.  Click **"Create Web Service"**.
2.  Wait for the logs to show "Deployment successful" or "Server running on...".
3.  Click the URL at the top (e.g., `https://data-science-job-portal.onrender.com`) to visit your site!

## Troubleshooting
*   **"Internal Server Error"?** -> Check the Logs tab. It usually means the `DATABASE_URL` is wrong or missing.
*   **Images missing?** -> Verify that the files are in `assets/` and that the paths in your database match correctly. Note that new uploads will disappear on restart (Free Tier limitation).
