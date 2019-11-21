### Install
sudo apt-get update
# install dependencies to build the source files
sudo apt-get install -y build-essential g++
sudo apt-get install -y libtool
sudo apt-get install -y autoconf
sudo apt-get install -y libcurl4-gnutls-dev
sudo apt-get install -y make
sudo apt-get install sl
# install Node and npm
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo apt-get install -y npm
cd ~/benchprezz/
npm install
# fix smartcard socket bug
sudo apt-get install -y pcscd
sudo service pcscd start
# install geth
sudo apt-get install -y software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install -y ethereum
# sync system time
sudo apt install chrony -y
sudo chronyd -q
# Install finished
sl