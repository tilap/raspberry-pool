#!/bin/sh

displayTitle(){
	echo "\033[33m> \033[1m" $1 "\033[0m"
}

checkRoot(){
	if [ $USER != 'root' ]; then
		echo "You are not root, please execute this script with sudo."
		exit 1
	fi
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



# install

displayTitle 'Install xinit and openbox'
apt-get install -y xinit openbox

displayTitle 'Install dependencies'

# uget: kweb - download manager
# tint2: kweb - task bar
# xterm: kweb - full screen video without GUI
# unclutter: kweb - hide the mouse cursor
# xdotool: kweb - emulate keyboard key
# supervisor: keep node client alive
# scrot: screenshot tool
apt-get install -y uget tint2 xterm unclutter xdotool supervisor
​
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

