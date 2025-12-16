# Static Profile Photo Setup

## ✅ Upload System Disabled

The dynamic media upload system has been disabled to ensure compatibility with Vercel deployment (which has read-only filesystems).

## 📸 How to Update Your Profile Photo

**Location:** `frontend/public/profile.jpg`

1. Replace the `profile.jpg` file in `frontend/public/` with your actual photo
2. **Recommended specs:**
   - Format: JPG, PNG, or SVG
   - Size: Square (recommended 400x400px or larger)
   - File size: < 500KB for faster loading

3. The image will automatically appear on:
   - About page header
   - Any other locations that reference `/profile.jpg`

## 🖼️ Additional Static Images

You can add more static images to `frontend/public/img/` folder:
- Social media logos (already set up)
- Project screenshots
- Any other assets

## 📝 Notes

- Static files in `/public` folder are served directly by Vite/Vercel
- No backend upload API needed
- Works perfectly on Vercel and other static hosting platforms
- Changes require redeployment to take effect in production

## 🔄 If You Need Dynamic Uploads Later

If you need to re-enable dynamic uploads in the future, you'll need to:
1. Integrate cloud storage (Cloudinary, AWS S3, or Vercel Blob)
2. Update the upload API to use cloud storage instead of local filesystem
3. Re-add the Media section to Admin Dashboard

For now, static files are the simplest and most reliable solution!
