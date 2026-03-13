# Copy second-opinion narrative images from Cursor assets into images/la/
# Run from repo root: .\scripts\copy-second-opinion-images.ps1
# Or from scripts: .\copy-second-opinion-images.ps1 (set $repoRoot below)

$ErrorActionPreference = "Stop"
$repoRoot = if ($PSScriptRoot) { Split-Path $PSScriptRoot -Parent } else { "c:\Users\georgea\call-insider-lp" }
$destDir = Join-Path $repoRoot "images\la"

# Cursor project assets folder (where Cursor saves "saved to workspace" images)
$assetsRoot = Join-Path $env:USERPROFILE ".cursor\projects\c-Users-georgea-call-insider-lp\assets"
$prefix = "c__Users_georgea_AppData_Roaming_Cursor_User_workspaceStorage_80085a6820fd3dd4c312fd6481682607_images_"

$copies = @(
    @{ Src = "tall-mobile-image-stressed-woman-looking-phone-9005aa69-95ef-480d-a32d-f34b2f1fc4e6.png"; Dest = "so-hero-car.png" },
    @{ Src = "tall-mobile-image-injured-woman-stressed-looking-at-bills-c0457180-fb1c-413a-8d88-d56d1652d9e1.png"; Dest = "so-problem-bills.png" },
    @{ Src = "woman-attorney-meeting-emotional-woman-victim-5dac34aa-f121-4450-a6ba-2435bd75a3ed.png"; Dest = "so-authority-meeting.png" },
    @{ Src = "tall-mobile-image-happy-injured-woman-leaving-law-office-f54d3f14-267b-4311-90a9-857aa73aa3d8.png"; Dest = "so-outcome-leaving.png" }
)

if (-not (Test-Path $destDir)) { New-Item -ItemType Directory -Path $destDir -Force | Out-Null }

foreach ($c in $copies) {
    $srcPath = Join-Path $assetsRoot ($prefix + $c.Src)
    $dstPath = Join-Path $destDir $c.Dest
    if (Test-Path $srcPath) {
        Copy-Item -LiteralPath $srcPath -Destination $dstPath -Force
        Write-Host "OK: $($c.Dest)"
    } else {
        Write-Host "SKIP (not found): $($c.Src)"
    }
}

Write-Host "Done. Check images\la\so-*.png"
