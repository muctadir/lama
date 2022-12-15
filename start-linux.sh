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

clear
echo "================================================================================="
docker-compose --env-file .env -f Docker/docker-compose.yml up --build -d
echo "================================================================================="
echo "Script is complete. Check above for errors."
echo "If you want to shut down, run the stop-linux.sh file."
echo " Goodbye for now!"
echo "================================================================================="