# Second-opinion page images

The `/second-opinion` page expects these files in this folder:

| File | Description |
|------|-------------|
| `so-hero-car.png` | Hero: injured woman in car looking at phone |
| `so-problem-bills.png` | Problem section: woman stressed with bills/insurance at home |
| `so-authority-meeting.png` | Authority section: attorney meeting emotional client |
| `so-outcome-leaving.png` | Outcome section: woman leaving law firm relieved |

**To copy from Cursor workspace assets** (if you have the images there), run from repo root:

```powershell
.\scripts\copy-second-opinion-images.ps1
```

Until these files exist, the page uses fallbacks (e.g. `hero-bg.jpg` for hero and outcome, and placeholder images for problem/authority).
