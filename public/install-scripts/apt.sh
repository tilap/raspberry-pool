sudo apt-get update
sudo apt-get upgrade -y

wget https://preprod.raspberry-pool.potoo.io/install-client.sh
chmod +x install-client.sh

echo "./install-client.sh" > installer.sh

rm $0
reboot
