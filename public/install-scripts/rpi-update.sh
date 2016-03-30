#!/bin/sh

sudo apt-get install rpi-update
sudo rpi-update

sh boot.sh next "sh install-client.sh"

rm $0
sudo reboot
