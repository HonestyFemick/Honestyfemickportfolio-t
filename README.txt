# Michael Portfolio — Recode (AI Video Creation update)

## Files
- `index.html` — page structure and portfolio content
- `Portfolio.css` — responsive visual styling
- `Portfolio.js` — mobile navigation and image/video lightbox

## Add your existing media
Keep these files in the same folder as `index.html`:
- `MyPic.jpg`
- `project1.png`, `project2.jpeg`, `project3.png`, `project4.png`, `project5.png`
- `project6.jpg`, `project7.jpg`, `project8.png`
- `project11.jpg`, `project12.jpg`, `project13.jpg`, `project14.jpg`, `project15.jpg`
- `project16.jpg`, `project17.jpg`, `project18.jpg`, `project19.jpeg`
- `Atioko_Oluwafemi_Michael_CV.pdf`

Create a `videos` folder and put these files inside it:
- `video1.mp4`, `video2.mp4`, `video3.mp4`
- Optional thumbnails: `video1-poster.jpg`, `video2-poster.jpg`, `video3-poster.jpg`

If your actual filenames differ, update the matching `src` and `data-src` values in `index.html`.
The video poster files are optional, but adding them gives each video card a polished thumbnail. Keep video files in a separate folder so they stay organised.

## Publish with GitHub Pages
1. Upload `index.html`, `Portfolio.css`, `Portfolio.js`, your images, CV, and the `videos` folder to your repository.
2. In the repository, open **Settings → Pages**.
3. Choose the branch you publish from and the root (`/`) folder, then save.
4. Open the published URL and check that filenames match exactly, including capitalisation.

Note: GitHub Pages is best for lightweight portfolio sites. Large video files may hit repository limits or load slowly; for large clips, consider hosting the videos externally and updating each video's `data-src` to its hosted video URL.
