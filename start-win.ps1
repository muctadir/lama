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
Write-Output "================================================================================="
Write-Output "Booting LAMA. Please select one of the options:"
Write-Output "1) Production [Fully Dockerized]"
Write-Output "2) Suited for frontend development [Flask, MySQL & phpMyAdmin Dockerized]"
Write-Output "3) Suited for backend development [Angular, MySQL & phpMyAdmin Dockerized]"
Write-Output "================================================================================="

$option = read-host 'Boot option: ' 

if ($option -eq 1)
{
    Clear-Host
    Write-Output "1) Production [Fully Dockerized]"
    Write-Output "================================================================================="
    docker compose --env-file backend/.env -f Docker/docker-compose.yml up --build -d
    Write-Output "================================================================================="
    Write-Output "Script is complete. Check above for errors."
    Write-Output "If you want to shut down, run the stop-win.ps1 file."
    Write-Output " Goodbye for now!"
    Write-Output "================================================================================="
    exit
}
elseif ( $option -eq 2 )
{
    Clear-Host
    Write-Output "2) Suited for frontend development [Flask, MySQL & phpMyAdmin Dockerized]"
    Write-Output "================================================================================="
    docker compose --env-file backend/.env -f Docker/docker-compose-frontend-dev.yml up --build -d
    Write-Output "================================================================================="
    Write-Output "To finish set up, enter the following commands (this cannot be automated...)"
    Write-Output "cd frontend"
    Write-Output "ng serve"
    Write-Output "================================================================================="
    Write-Output "Script is complete. Check above for errors."
    Write-Output "If you want to shut down, you will need to: "
    Write-Output "1) stop Angular (CTRL+C in the console which runs Angular)"
    Write-Output "2) Stop the docker container(s) by running the stop-win.ps1 file."    
    Write-Output "Goodbye for now!"
    Write-Output "================================================================================="
}
elseif ( $option -eq 3 )
{
    Clear-Host 
    Write-Output "3) Suited for backend development [Angular, MySQL & phpMyAdmin Dockerized]"
    Write-Output "================================================================================="
    docker compose --env-file backend/.env -f Docker/docker-compose-backend-dev.yml up --build -d
    Write-Output "================================================================================="
    Write-Output "To finish set up, enter the following commands (this cannot be automated...)"
    Write-Output "cd backend"
    Write-Output "py -m venv venv"
    Write-Output ".\venv\Scripts\activate"
    Write-Output "pip install -r .\requirements.txt"
    Write-Output "flask run"
    Write-Output "================================================================================="
    Write-Output "Script is complete. Check above for errors."
    Write-Output "If you want to shut down, you will need to:"
    Write-Output "1) Stop the Flask deployment by entering deactivate in the cmd which runs Flask."
    Write-Output "2) Stop the docker container(s) by running the stop-win.ps1 file."
    Write-Output " Goodbye for now!"
    Write-Output "================================================================================="
    exit
}
else 
{
    Write-Output "$option is an invalid input. Try again by runngin this script."
    exit
}
