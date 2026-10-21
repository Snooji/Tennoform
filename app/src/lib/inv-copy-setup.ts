/**
 * Chrome and Edge won't let a website link a file inside %AppData% ("contains system files"), and that's where WFHelper
 * saves inventory.json. These PowerShell lines (pasted once by the player) keep a copy in Documents\Tennoform, which
 * the browser does allow, so linking stays automatic:
 *  - they write a small script, keep-inventory-copied.ps1, next to the copy (plain text, so anyone can read it);
 *  - a shortcut in the Windows Startup folder runs it hidden at every sign-in, and it starts once straight away;
 *  - every minute it copies WFHelper's file over if WFHelper has saved a newer one (via a temp file, so Tennoform never
 *    reads half a file);
 *  - it stops by itself within a minute of the shortcut being deleted, which is all INV_COPY_REMOVE does.
 * No admin rights, no scheduled task, nothing sent anywhere.
 */
export const INV_COPY_DIR = "Documents\\Tennoform\\inventory.json"

export const INV_COPY_SETUP = String.raw`$dir = Join-Path ([Environment]::GetFolderPath('MyDocuments')) 'Tennoform'
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$ps1 = Join-Path $dir 'keep-inventory-copied.ps1'
Set-Content -Path $ps1 -Encoding UTF8 -Value @'
# Tennoform: keeps a copy of WFHelper's inventory.json in Documents\Tennoform, where your browser can read it.
# To stop: delete "Tennoform inventory copy" from your Startup folder (Win+R, shell:startup).
$src = Join-Path $env:APPDATA 'WFHelper\api-helper\inventory.json'
$dst = Join-Path (Join-Path ([Environment]::GetFolderPath('MyDocuments')) 'Tennoform') 'inventory.json'
$lnk = Join-Path ([Environment]::GetFolderPath('Startup')) 'Tennoform inventory copy.lnk'
while (Test-Path $lnk) {
  if ((Test-Path $src) -and (-not (Test-Path $dst) -or (Get-Item $src).LastWriteTimeUtc -gt (Get-Item $dst).LastWriteTimeUtc)) {
    try { Copy-Item $src "$dst.tmp" -Force; Move-Item "$dst.tmp" $dst -Force } catch {}
  }
  Start-Sleep -Seconds 60
}
'@
$run = "-NoProfile -WindowStyle Hidden -ExecutionPolicy Bypass -File ""$ps1"""
$sc = (New-Object -ComObject WScript.Shell).CreateShortcut((Join-Path ([Environment]::GetFolderPath('Startup')) 'Tennoform inventory copy.lnk'))
$sc.TargetPath = 'powershell.exe'; $sc.Arguments = $run; $sc.WindowStyle = 7; $sc.Save()
Start-Process powershell.exe -ArgumentList $run -WindowStyle Hidden
Write-Host "Done. In Tennoform, tap Link inventory.json and pick $dir\inventory.json"`

export const INV_COPY_REMOVE = String.raw`Remove-Item (Join-Path ([Environment]::GetFolderPath('Startup')) 'Tennoform inventory copy.lnk')`
