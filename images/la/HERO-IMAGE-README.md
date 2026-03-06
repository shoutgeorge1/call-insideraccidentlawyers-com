# Hero image (performance)

The serious-injury-trial-lawyer page expects:

**`/images/la/shawn-hero.webp`** — hero photo (LCP), ~420×420px, **&lt;100KB** WebP.

## How to create it

1. **Source:** `shawn-hero-temp.jpg` in this folder (downloaded from the original syndication URL) or use the original high-res asset.
2. **Resize** to ~420px width (or 420×420 square).
3. **Convert to WebP** at quality ~80–85 until file size is under 100KB.

### Using ImageMagick (if installed)

```bash
magick shawn-hero-temp.jpg -resize 420x420 -quality 82 shawn-hero.webp
```

### Using cwebp (libwebp)

```bash
# Resize first with ImageMagick or similar, then:
cwebp -q 82 -resize 420 420 shawn-hero-temp.jpg -o shawn-hero.webp
```

### Using Node (sharp)

```bash
npx sharp-cli -i shawn-hero-temp.jpg -o shawn-hero.webp resize 420 420 webp quality 82
```

Until `shawn-hero.webp` exists, the page falls back to `/images/la/attorney-trial.png` via the img `onerror` handler.
