sudo apt-get update
sudo apt-get upgrade -y

wget https://preprod.raspberry-pool.potoo.io/install-client.sh
chmod +x install-client.sh

sh boot.sh next "sh install-client.sh"

rm $0
sudo reboot
