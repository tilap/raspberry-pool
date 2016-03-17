#!/bin/sh

sudo apt-get install rpi-update
sudo rpi-update

echo "sh apt.sh" > installer.sh

rm $0
sudo reboot
