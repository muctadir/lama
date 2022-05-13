Clear-Host

Write-Output "What operating system are you running?"
Write-Output "1) Windows"
Write-Output "2) Linux"
$os = read-host 'Boot option: '

if ($os -eq 1) {
    Write-Output "Shutting down LAMA."
    docker compose -f Docker/docker-compose.yml down -v
    Write-Output "Done. Goodbye!"
    exit
} else {
    Write-Output "You gave an invalid option for the OS (either not 1/2 or Linux)."
    Write-Output "Try again by reopening the file. Goodbye for now!"
    exit
}