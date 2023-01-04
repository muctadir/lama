Clear-Host

Write-Output "What operating system are you running?"
Write-Output "1) Windows"
Write-Output "2) Linux"
$os = read-host 'Boot option: '
if ($os -ne 1) {
    Write-Output "You gave an invalid option for the OS (either not 1/2 or Linux)."
    Write-Output "Try again by reopening the file. Goodbye for now!"
    exit
}

Clear-Host
docker compose --env-file .env -f Docker/docker-compose.yml up --build -d
Write-Output "================================================================================="
Write-Output "Script is complete. Check above for errors."
Write-Output "If you want to shut down, run the stop-win.ps1 file."
Write-Output " Goodbye for now!"
Write-Output "================================================================================="