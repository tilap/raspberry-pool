#!/bin/sh

sh boot.sh disable

sudo apt-get update
sudo apt-get upgrade -y

sudo apt-get install -y tmux

sh boot.sh enable
sh boot.sh next "sh install-client.sh"

rm $0
sudo reboot
