# Image assets

Drop your own photography and screenshots into these folders. The UI falls back to
designed abstract artwork whenever a file is missing, so nothing looks broken while
you collect the real assets.

```
public/images/
├── profile.jpg               → set siteConfig.profileImage = '/images/profile.jpg'
├── projects/                 → optional project cover art / screenshots
├── moments/                  → competition and event photographs
└── certificates/             → certificate scans and previews
```

## Moments

1. Add a photo such as `public/images/moments/algo-arena.jpg`.
2. Open `src/data/moments.ts`.
3. Set `image: '/images/moments/algo-arena.jpg'` and write a meaningful `alt`.
4. Optionally add `date`, `location`, `certificate` and `featured`.

## Certificates

Add scans to `public/images/certificates/`, then set `certificateImage` on the
matching entry in `src/data/achievements.ts`. When a scan is present, the
certificate modal displays it instead of the generated digital record.

Keep photographs compressed (roughly 1600px on the long edge, WebP or JPEG) so the
portfolio stays fast.
