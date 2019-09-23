### Install
sudo apt-get update
# install dependencies to build the source files
sudo apt-get install build-essential cmake libudev-dev
sudo apt-get install make
# install parity
sudo bash <(curl https://get.parity.io -L)
# make for client driver
cd benchprezz/parity-aura/src/macro/kvstore/
make
cd ~