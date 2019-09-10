### Install
sudo apt-get update
#git clone https://github.com/Xychun/benchprezz.git
# install dependencies to build the source files
sudo apt-get install build-essential
sudo apt-get install libtool
sudo apt-get install autoconf
sudo apt-get install libcurl4-gnutls-dev
# install geth
sudo apt-get install software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install ethereum
# fix smartcard socket bug
sudo apt-get install pcscd
sudo service pcscd start
# init project
sudo ./init.sh