#!/bin/bash
clear
if [ "$EUID" -ne 0 ]
  then echo "Please run with privilege"
  exit
fi

echo "Stopping LAMA."
docker-compose -f Docker/docker-compose.yml down
echo "Script is complete. Goodbye!"
exit