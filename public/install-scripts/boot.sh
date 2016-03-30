#!/bin/sh

BOOT_SCRIPT="installer.sh"

case $1 in
    # The BOOT_SCRIPT is executed just after boot
    enable)
        echo "sh $BOOT_SCRIPT" >> .profile
    ;;

    # The BOOT_SCRIPT isn't execute anymore
    disable)
        rm $BOOT_SCRIPT
        sed -i 's/^sh '$BOOT_SCRIPT'.*$//g' .profile
    ;;

    # Rewrite the BOOT_SCRIPT
    next)
        echo $2 > installer.sh
    ;;
        
    *)
        echo "Usage: $0 (enable|disable|next command)"
        exit 1
    ;;

esac

exit 0
