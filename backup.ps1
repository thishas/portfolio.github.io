# Auto-versioning backup script
$projectDir = 'C:\Users\thish\CascadeProjects\VCard-Resume'
$backupRoot = 'C:\Users\thish\CascadeProjects\Backups'

# Create backups directory if missing
New-Item -Path $backupRoot -ItemType Directory -Force | Out-Null

# Get latest version
$versions = @(Get-ChildItem $backupRoot -Filter 'VCard-Resume_v*' -ErrorAction SilentlyContinue | 
    ForEach-Object { [int]($_.Name -replace 'VCard-Resume_v','') } | Sort-Object)
$nextVer = if ($versions.Count -gt 0) { $versions[-1] + 1 } else { 1 }

# Create backup
$backupPath = "${backupRoot}\VCard-Resume_v${nextVer}"
Copy-Item $projectDir $backupPath -Recurse -Force

Write-Host "Success: Backup created at ${backupPath}"
