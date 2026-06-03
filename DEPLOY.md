# Deploy contract: metis-homeland-map

## Live site
https://bayarddevries.github.io/metis-homeland-map/

## How it deploys
- Branch: `master`
- CI: GitHub Actions auto-deploys to GitHub Pages on push.
- Host: GitHub Pages

## Local preview
```bash
python3 scripts/serve.py
# or
python3 -m http.server 8000
```

## Verification
After deploy:
- desktop: `index.html` full map loads, layers toggle
- mobile: bottom-sheet panels render, max-height 65vh

## Rollback
```bash
git revert HEAD
git push origin master
```

## Issue traceability
All deploy-related cleanup is tracked in #2 and #3. Any map feature work should reference #1 or #7 when it touches data, layers, or popups.
