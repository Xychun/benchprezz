### Install
sudo apt-get update
sudo ldconfig
# install dependencies to build the source files
sudo apt-get install build-essential cmake libudev-dev
sudo apt-get install libtool
sudo apt-get install autoconf
sudo apt-get install libcurl4-gnutls-dev
sudo apt-get install make
# install Node and npm
curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt-get install nodejs
sudo apt-get install npm
cd ~/benchprezz/
npm install
# install parity
bash <(curl https://get.parity.io -L)