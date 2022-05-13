#!/bin/bash
clear
if [ "$EUID" -ne 0 ]
  then echo "Please run with privilege"
  exit
fi

echo "What operating system are you running?"
echo "1) Windows"
echo "2) Linux"
read -p 'Boot option: ' os
if [[ $os != 2 ]]
then 
    echo "You gave an invalid option for the OS (either not 1/2 or Windows)."
    echo "Try again by reopening the file. Goodbye for now!"
    exit
fi
echo "================================================================================="
echo "Booting LAMA. Please select one of the options:"
echo "1) Production [Fully Dockerized]"
echo "2) Suited for frontend development [Flask, MySQL & phpMyAdmin Dockerized]"
echo "3) Suited for backend development [Angular, MySQL & phpMyAdmin Dockerized]"
echo "================================================================================="

read -p 'Boot option: ' option

if [ $option == 1 ] 
then
    clear
    echo "1) Production [Fully Dockerized]"
    echo "================================================================================="
    docker-compose -f Docker/docker-compose.yml up --build -d
    docker exec lama-flask flask db-opt init
    docker exec lama-flask flask db-opt fill
    echo "================================================================================="
    echo "Script is complete. Check above for errors."
    echo "If you want to shut down, run the stop-linux.sh file."
    echo " Goodbye for now!"
    echo "================================================================================="
    exit
elif [[ $option == 2 ]]
then
    clear
    echo "2) Suited for frontend development [Flask, MySQL & phpMyAdmin Dockerized]"
    echo "=================================================================================" && sleep 2
    docker-compose -f Docker/docker-compose-frontend-dev.yml up --build -d 
    docker exec lama-flask flask db-opt init
    docker exec lama-flask flask db-opt fill
    echo "================================================================================="
    echo "To finish set up, enter the following commands (this cannot be automated...)"
    echo "cd frontend"
    echo "ng serve"
    echo "================================================================================="
    echo "Script is complete. Check above for errors."
    echo "If you want to shut down, you will need to: "
    echo "1) stop Angular (CTRL+C in the console which runs Angular)"
    echo "2) Stop the docker container(s) by running the stop-linux.sh file."    
    echo "Goodbye for now!"
    echo "================================================================================="
elif [ $option == 3 ] 
then
    clear 
    echo "3) Suited for backend development [Angular, MySQL & phpMyAdmin Dockerized]"
    echo "================================================================================="
    docker-compose -f Docker/docker-compose-backend-dev.yml up --build -d 
    echo "================================================================================="
    echo "To finish set up, enter the following commands (this cannot be automated...)"
    echo "!! Make sure that the migration file is deleted !!"
    echo "cd backend"
    echo "python -m venv venv"
    echo "source venv/bin/activate"
    echo "sudo pip install -r requirements.txt"
    echo "flask db-opt init"
    echo "flask db-opt fill"
    echo "flask run"
    echo "================================================================================="
    echo "Script is complete. Check above for errors."
    echo "If you want to shut down, you will need to:"
    echo "1) Stop the Flask deployment by entering deactivate in the cmd which runs Flask."
    echo "2) Stop the docker container(s) by running the stop-linux.sh file."
    echo " Goodbye for now!"
    echo "================================================================================="
else 
    echo "$option is an invalid input. Try again by runngin this script."
    exit
fi
