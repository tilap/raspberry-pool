#/bin/sh

check_root() {
	if [ $USER != 'root' ]; then
		echo "You are not root, please execute this script with sudo."
		exit 1
	fi
}

get_init_sys() {
  if command -v systemctl > /dev/null && systemctl | grep -q '\-\.mount'; then
    SYSTEMD=1
  elif [ -f /etc/init.d/cron ] && [ ! -h /etc/init.d/cron ]; then
    SYSTEMD=0
  else
    echo "Unrecognised init system"
    return 1
  fi
}

autologin_enable() {
    if [ $SYSTEMD -eq 1 ]; then
        systemctl set-default multi-user.target
        ln -fs /etc/systemd/system/autologin@.service /etc/systemd/system/getty.target.wants/getty@tty1.service
    else
        [ -e /etc/init.d/lightdm ] && update-rc.d lightdm disable 2
        sed /etc/inittab -i -e "s/1:2345:respawn:\/sbin\/getty --noclear 38400 tty1/1:2345:respawn:\/bin\/login -f pi tty1 <\/dev\/tty1 >\/dev\/tty1 2>&1/"
    fi
}

autologin_disable() {
    if [ $SYSTEMD -eq 1 ]; then
        systemctl set-default multi-user.target
        ln -fs /lib/systemd/system/getty@.service /etc/systemd/system/getty.target.wants/getty@tty1.service
    else
        [ -e /etc/init.d/lightdm ] && update-rc.d lightdm disable 2
        sed /etc/inittab -i -e "s/1:2345:respawn:\/bin\/login -f pi tty1 <\/dev\/tty1 >\/dev\/tty1 2>&1/1:2345:respawn:\/sbin\/getty --noclear 38400 tty1/"
    fi
}

check_root

if [ -z $1 ]; then
    echo "Usage: $0 enable|disable"
    exit 1
fi

get_init_sys

case "$1" in
  enable)
    autologin_enable
    ;;

  disable)
    autologin_disable
    ;;

  *)
    echo "Arg: "$1" is unknown"
    exit 1
    ;;
esac
