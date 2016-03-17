#!/bin/sh

SERVER_HOSTNAME=""
SERVER_PORT=""

NODEJS_VERSION="5.8.0"

displayTitle(){
	echo "\033[33m> \033[1m" $1 "\033[0m"
}

yesOrNo() {
	local message
	local default
	if [ "$2" = "y" ]; then message="$1 [Y/n]"; default='yes';
	elif [ "$2" = "n" ]; then message="$1 [y/N]"; default='no';
	else message="$1 [y/n]"; default=false;
	fi

	local yesNoAnswer=''
	while [ -n $yesNoAnswer ]; do
		read -p "$message " yesNoAnswer
		case $yesNoAnswer in
			[yY]|[yY][eE][sS])
				echo 'yes'
				exit
			;;
			[nN]|[nN][oO])
				echo 'no'
				exit
			;;
			'')
				if $default; then
					echo "$default"
					exit
				fi
			;;
		esac
	done
}

# config

DISPLAY=$(
ps -u $(id -u) -o pid= | \
    while read pid; do
        cat /proc/$pid/environ 2>/dev/null | tr '\0' '\n' | grep '^DISPLAY=:'
    done | grep -o ':[0-9]*' | sort -u
)
​
armVersion=$(cat /proc/cpuinfo | grep -om 1 'v[0-9]\+l')


##
# Disable blank screen
##
displayTitle 'Disable blank screen'

sudo sed -i 's/^BLANK_TIME=.*$/BLANK_TIME=0/g' /etc/kbd/config
sudo sed -i 's/^POWERDOWN_TIME=.*$/POWERDOWN_TIME=0/g' /etc/kbd/config
sudo /etc/init.d/kbd restart


##
# Install dependencies
##
displayTitle 'Install dependencies'

# uget: kweb - download manager
# tint2: kweb - task bar
# xterm: kweb - full screen video without GUI
# unclutter: hide the mouse cursor
# xdotool: emulate keyboard key
# supervisor: keep node client alive
# scrot: screenshot tool
apt-get install -y uget tint2 xterm unclutter xdotool supervisor xinit openbox
​

##
# Install kweb
##
displayTitle 'Install kweb'

if [ "$armVersion" -eq "v7l" ]; then
    kwebVersion='1.6.9'
else
    kwebVersion='1.6.8'
fi

wget "http://steinerdatenbank.de/software/kweb-$kwebVersion.tar.gz"
tar xzvf "kweb-$kwebVersion.tar.gz"
cd "kweb-$kwebVersion"
./debinstall

# youtube-dl for video support
ginstall-ytdl


##
# Install Chromium
##
if [ "$armVersion" -eq "v7l" ]; then
    displayTitle 'Install Chromium'

    apt-get install gconf-service libgconf-2-4 libgnome-keyring0 libnspr4 libnss3 xdg-utils
    cd /tmp
    wget http://ports.ubuntu.com/pool/universe/c/chromium-browser/chromium-browser-l10n_48.0.2564.116-0ubuntu1.1229_all.deb
    wget http://ports.ubuntu.com/pool/universe/c/chromium-browser/chromium-browser-dbg_48.0.2564.116-0ubuntu1.1229_armhf.deb
    wget http://ports.ubuntu.com/pool/universe/c/chromium-browser/chromium-codecs-ffmpeg-dbg_48.0.2564.116-0ubuntu1.1229_armhf.deb
    dpkg -i chromium-codecs-ffmpeg-dbg_48.0.2564.116-0ubuntu1.1229_armhf.deb
    dpkg -i chromium-browser-l10n_48.0.2564.116-0ubuntu1.1229_all.deb chromium-browser-dbg_48.0.2564.116-0ubuntu1.1229_armhf.deb
    rm -f chromium-codecs-ffmpeg-dbg_48.0.2564.116-0ubuntu1.1229_armhf.deb chromium-browser-l10n_48.0.2564.116-0ubuntu1.1229_all.deb chromium-browser-dbg_48.0.2564.116-0ubuntu1.1229_armhf.deb
fi;


##
# Configure supervisor
##
displayTitle 'Configure supervisord'

echo '
[program:openbox]
command=xinit /usr/bin/openbox-session
autorestart=true
redirect_stderr=true
stdout_logfile='$HOME'/logs/openbox.log
user=pi
' | tee /etc/supervisor/conf.d/openbox.conf
​

##
# Allow any user to start X
##
displayTitle 'Allow any user to start X'

sed -i 's/^allowed_users=.*$/allowed_users=anybody/g' /etc/X11/Xwrapper.config


##
# Install Nodejs
##
displayTitle "Install Nodejs"

nodeDirectory="node-v$NODEJS_VERSION-linux-arm$armVersion"
wget "https://nodejs.org/download/release/v$NODEJS_VERSION/$nodeDirectory.tar.gz"
tar xzvf "$nodeDirectory.tar.gz"
cd $nodeDirectory
sudo cp -R * /usr/local/
sudo npm install -g npm

cd $HOME
rm "$nodeDirectory.tar.gz"
rm -rf $nodeDirectory


##
# Setup raspberry node client
##
displayTitle "Setup raspberry node client"

cd $HOME
sudo apt-get install -y git
git clone https://github.com/christophehurpeau/raspberry-client.git

mkdir $HOME/logs

echo "# Setup supervisor for node client"
echo '
[program:node-raspberry-client]
command=node --es_staging '$HOME'/raspberry-client --port='$SERVER_PORT' --host='$SERVER_HOSTNAME' 
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile='$HOME'/logs/client.log
user=pi
' | sudo tee /etc/supervisor/conf.d/node-client.conf

cd raspberry-client
npm install --production
sudo supervisorctl reread && sudo supervisorctl reload || echo


##
# Install libcec
##
displayTitle "Install libcec"

apt-get install -y cmake liblockdev1-dev libudev-dev libxrandr-dev python-dev swig
​
cd
git clone https://github.com/Pulse-Eight/platform.git
mkdir platform/build
cd platform/build
cmake ..
make
make install
​
cd
git clone https://github.com/Pulse-Eight/libcec.git
mkdir libcec/build
cd libcec/build
cmake -DRPI_INCLUDE_DIR=/opt/vc/include -DRPI_LIB_DIR=/opt/vc/lib ..
make -j4
make install
ldconfig
​
cd
rm -rf libcec platform


##
# Remove install scripts
##
displayTitle "Remove install scripts"

sh autologin.sh disable
rm autologin.sh

rm installer.sh

sed -i 's/^sh installer.sh$//g' .profile

rm $0
sudo reboot
