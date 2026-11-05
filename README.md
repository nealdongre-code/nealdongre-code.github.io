# Coding portfolio website — Neal Dongre

A no-build, no-dependency portfolio site designed for GitHub Pages. Published portfolio: https://nealdongre-code.github.io/

GitHub Pages publishes the `main` branch from `/ (root)` in `nealdongre-code/nealdongre-code.github.io`.

## Preview it

Open `index.html` in any modern browser. No setup, account, or development tools needed.

## Edit the content (only one file)

Open `content.js` in a text editor or in GitHub's web editor.

- Change the `about` text.
- Add a project by copying the example at the bottom of `projects`.
- Set a project's `visible: false` to hide it **from this portfolio only**. Its GitHub repository or deployed demo remains public unless separately restricted.
- Add a LinkedIn URL or public email address if desired; blank links are hidden.
- Save and refresh your browser to preview.

All layout and visual styling live in `index.html` and `styles.css`. Most content changes should require editing **only `content.js`**.

## Publishing: recommended review-first workflow

1. In GitHub, create a **new private repository**, e.g. `portfolio-site`.
2. Upload the files in this folder, including `.nojekyll`. This saves an editable draft without publishing the website.
3. Review the text, descriptions, and links. Test the local preview.
4. When you are ready to publish, decide on a Pages-compatible public repository. GitHub Pages on the Free plan supports public repositories; a private repository's source may need to become public, depending on your plan.
5. For a simple static deployment, in the repository go to **Settings → Pages → Build and deployment**, choose **Deploy from a branch**, and choose `main` and `/(root)`; save. The site is ordinarily served at `https://nealdongre-code.github.io/portfolio-site/` if you retain that repository name.
6. Subsequent commits to `main` will update the live site automatically. For tighter release control, work on a `draft` branch and merge into `main` only when ready.

### Unpublish / republish

- To **unpublish** the entire website, use the **Unpublish site** control in **Settings → Pages**. This disables the Pages deployment; it does not delete source files or necessarily change a public repository's visibility.
- To **republish**, follow the current GitHub Pages deployment options to publish a new deployment. Depending on the GitHub Pages publishing source, a new commit or rerunning a Pages workflow may be needed.
- Unpublishing a portfolio does **not** unpublish the separate Litigation Hold Manager demonstration, nor does it make any GitHub repository private.
- Before public launch, verify that you want the README, repository source, and any contact information to be public.

## Project links

The Litigation Hold Manager code repository is verified. The public demo URL is present in that repository's README, but its current live availability was not independently verified when this package was prepared. Test it before publishing this portfolio.

## Technical notes

Static HTML/CSS/JS; no external fonts, dependencies, tracking, analytics, network APIs, credentials, or build step. Links open in a new tab. JavaScript renders project titles/descriptions as text, not HTML. Supports mobile and desktop layouts, keyboard focus, and reduced motion preference.
