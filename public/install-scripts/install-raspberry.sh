#!/bin/sh

URL=http://192.168.1.122:3100/install-scripts/

display_title() {
	echo "\033[33m> \033[1m" $1 "\033[0m"
}

display_title "Configure time zone"
sudo dpkg-reconfigure tzdata

display_title "Expand root file system"
wget $URL"expand_rootfs.sh"
sudo sh expand_rootfs.sh
rm expand_rootfs.sh

display_title "Enable auto login"
wget $URL"autologin.sh"
sudo sh autologin.sh enable

display_title "Prepare rpi-update after reboot"
wget $URL"rpi-update.sh"

wget $URL"apt.sh"

wget $URL"install-client.sh"

echo "sh installer.sh" >> .profile
echo "sh rpi-update.sh" > installer.sh

rm $0
sudo reboot
