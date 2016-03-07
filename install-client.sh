#!/bin/sh

displayTitle(){
	echo "\033[33m> \033[1m" $1 "\033[0m"
}

displayError(){
	echo "\033[31m\033[1m" $1 "\033[0m"
}

displayWarning(){
	echo "\033[35m" $1 "\033[0m"
}

displaySuccess(){
	echo "\033[32m" $1 "\033[0m"
}


checkRoot(){
	if [ $USER != 'root' ]; then
		echo "You are not root, please execute this script with sudo."
		exit 1
	fi
}



yesOrNo(){
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



if [[ `yesOrNo "$(displayTitle 'Install Chromium ?')" 'y'` == 'yes' ]]; then
    apt-get install gconf-service libgconf-2-4 libgnome-keyring0 libnspr4 libnss3 xdg-utils
    cd /tmp
    wget http://ports.ubuntu.com/pool/universe/c/chromium-browser/chromium-browser-l10n_48.0.2564.116-0ubuntu1.1229_all.deb
    wget http://ports.ubuntu.com/pool/universe/c/chromium-browser/chromium-browser-dbg_48.0.2564.116-0ubuntu1.1229_armhf.deb
    wget http://ports.ubuntu.com/pool/universe/c/chromium-browser/chromium-codecs-ffmpeg-dbg_48.0.2564.116-0ubuntu1.1229_armhf.deb
    dpkg -i chromium-codecs-ffmpeg-dbg_48.0.2564.116-0ubuntu1.1229_armhf.deb
    dpkg -i chromium-browser-l10n_48.0.2564.116-0ubuntu1.1229_all.deb chromium-browser-dbg_48.0.2564.116-0ubuntu1.1229_armhf.deb
    rm -f chromium-codecs-ffmpeg-dbg_48.0.2564.116-0ubuntu1.1229_armhf.deb chromium-browser-l10n_48.0.2564.116-0ubuntu1.1229_all.deb chromium-browser-dbg_48.0.2564.116-0ubuntu1.1229_armhf.deb
fi;
