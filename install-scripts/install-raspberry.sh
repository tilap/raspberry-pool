#!/bin/sh

### SERVER CONFIG WILL BE INJECTED HERE ###

display_title() {
	echo "\033[33m> \033[1m" $1 "\033[0m"
}

##
# Configure time zone
##
display_title "Configure time zone"

sudo dpkg-reconfigure tzdata

##
# Expand root file system
##
display_title "Expand root file system"
wget $URL"expand_rootfs.sh"
sudo sh expand_rootfs.sh
rm expand_rootfs.sh

##
# Disable display overscan
##
display_title "Disable display overscan"

sudo sed -i 's/^.*disable_overscan.*$/disable_overscan=1/g' /boot/config.txt

##
# Apply config file
##
display_title "Apply config file"

if [ ! -f config.sh ]; then
  wget $URL"config.sh"
fi
sh config.sh

##
# Enable SSH key auth
##
if [ "$ENABLE_SSH_KEY_AUTH" = true ] ; then
  display_title "Add authorized ssh keys"
  mkdir $HOME/.ssh
  echo -e $SSH_PUBLIC_KEYS | tee $HOME/.ssh/authorized_keys


  display_title "Enable SSH public key auth"
  sudo sed -i 's/^ChallengeResponseAuthentication .*$//g' /etc/ssh/sshd_config
  sudo sed -i 's/^PasswordAuthentication .*$//g' /etc/ssh/sshd_config
  sudo sed -i 's/^UsePAM .*$//g' /etc/ssh/sshd_config
  echo '
# Authorize to login only with ssh key
ChallengeResponseAuthentication no
PasswordAuthentication no
UsePAM no
' | sudo tee --append /etc/ssh/sshd_config
  sudo /etc/init.d/ssh reload
fi


##
# Setup wifi
##
if [ "$ENABLE_WIFI" = true ] ; then
  display_title "Setup wifi"
  echo '
network={
    ssid="'$WIFI_SSID'"
    psk="'$WIFI_PASS'"
}
' | sudo tee --append /etc/wpa_supplicant/wpa_supplicant.conf
fi

##
# Enable auto login
##
display_title "Enable auto login"

##
# Download install scripts
##
display_title "Download install scripts"

wget $URL"autologin.sh"
sudo sh autologin.sh enable

wget $URL"apt.sh"

wget $URL"install-client.sh"

wget $URL"boot.sh"

sh boot.sh enable
sh boot.sh next "sh apt.sh"

rm $0
sudo reboot
