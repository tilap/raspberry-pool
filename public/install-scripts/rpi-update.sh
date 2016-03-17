#!/bin/sh

sudo apt-get install rpi-update
sudo rpi-update

echo "./apt.sh" > installer.sh

rm $0
reboot
