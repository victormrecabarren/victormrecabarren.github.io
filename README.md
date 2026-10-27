# Personal pages

A launcher for personal apps, experiments, and school projects.

Live: https://victormrecabarren.github.io/

## Layout

- `/`: personal app launcher
- `/marvel/`: original Marvel school project, with its assets and project notes
- `/tools/<name>/`: reserved convention for new small apps
- Existing project sites remain in their own repositories: melee-ironman, paper-ui, mdleaguedata, My-Spotify-React, myPortfolio.

## Add a tool

Create `tools/<name>/index.html` with relative asset URLs and add a link to the launcher. Keep each tool self-contained. Browser-only tools need no build system. Never put secret keys or private personal data in published files.

## Publish

GitHub Pages publishes the root of `master`. Changes pushed to that branch deploy automatically. `.nojekyll` keeps the static files served directly.

## Portfolio

Keep the professional portfolio in its own repository. Configure provider.vip on that portfolio project when its replacement is ready; leave this root site on github.io so personal apps retain their addresses.
