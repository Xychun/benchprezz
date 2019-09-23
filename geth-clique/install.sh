### Install
sudo apt-get update
# install dependencies to build the source files
sudo apt-get install build-essential g++
sudo apt-get install libtool
sudo apt-get install autoconf
sudo apt-get install libcurl4-gnutls-dev
sudo apt-get install make
# install geth
sudo apt-get install software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install ethereum
# install restlcient-cpp
git clone https://github.com/mrtazz/restclient-cpp.git
cd restclient-cpp/ && ./autogen.sh && ./configure && sudo make install
cd ..
sudo rm -r restclient-cpp/
# fix smartcard socket bug
sudo apt-get install pcscd
sudo service pcscd start
# make for client driver
cd benchprezz/geth-clique/src/macro/kvstore/
make
cd ~