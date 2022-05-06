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
echo "=========================================================================="
echo "Booting LAMA. Please select one of the options:"
echo "1) Production [Fully Dockerized]"
echo "2) Suited for frontend development [Flask, MySQL & phpMyAdmin Dockerized]"
echo "3) Suited for backend development [Angular, MySQL & phpMyAdmin Dockerized]"
echo "=========================================================================="

read -p 'Boot option: ' option

if [ $option == 1 ] 
then
    clear
    echo "1) Production [Fully Dockerized]"
    echo "=========================================================================="
    if [[ $os == 1 ]]
    then 
        docker compose -f Docker/docker-compose.yml up --build -d
    elif [[ $os == 2 ]]
    then
        docker-compose -f Docker/docker-compose.yml up --build -d
    else 
        echo "Invalid OS selection. Goodbye!"
        exit
    fi   
    echo "=========================================================================="
    echo "Script is complete. Check above for errors. Goodbye!"
    echo "=========================================================================="
    exit
elif [[ $option == 2 ]]
then
    clear
    echo "2) Suited for frontend development [Flask, MySQL & phpMyAdmin Dockerized]"
    echo "This script will not exit as exiting would stop the Angular deployment."
    echo "==========================================================================" && sleep 2
    if [[ $os == 1 ]]
    then
        docker compose -f Docker/docker-compose-frontend-dev.yml up --build -d && (cd frontend && ng serve)
    elif [[ $os == 2 ]]
    then
        docker-compose -f Docker/docker-compose-frontend-dev.yml up --build -d && (cd frontend && ng serve)
    else 
        echo "Invalid OS selection. Goodbye!"
        exit
    fi
elif [ $option == 3 ] 
then
    clear 
    echo "3) Suited for backend development [Angular, MySQL & phpMyAdmin Dockerized]"
    echo "=========================================================================="
    if [ $os == 1 ]
    then
        docker compose -f Docker/docker-compose-backend-dev.yml up --build -d && cd backend &&  python -m venv venv 
        echo "To finish set up, enter the following commands (this cannot be automated...)"
        echo "cd backend"
        echo "source venv/bin/activate"
        echo "sudo pip install -r requirements.txt"
        echo "flask run"
        echo "=========================================================================="
        echo "Script is complete. Check above for errors. Goodbye!"
        echo "=========================================================================="
        exit
        exit
    elif [ $os == 2 ]
    then
        docker-compose -f Docker/docker-compose-backend-dev.yml up --build -d && cd backend &&  python -m venv venv 
        echo "To finish set up, enter the following commands (this cannot be automated...)"
        echo "cd backend"
        echo "source venv/bin/activate"
        echo "sudo pip install -r requirements.txt"
        echo "flask run"
        echo "=========================================================================="
        echo "Script is complete. Check above for errors. Goodbye!"
        echo "=========================================================================="
        exit
    fi
else 
    echo "$option is an invalid input. Try again by runngin this script."
    exit
fi
