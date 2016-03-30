#!/bin/sh

sh boot.sh disable

sudo apt-get update
sudo apt-get upgrade -y

wget https://preprod.raspberry-pool.potoo.io/install-client.sh
chmod +x install-client.sh

sh boot.sh enable
sh boot.sh next "sh rpi-update.sh"

rm $0
sudo reboot
