### Install
sudo apt-get update
sudo ldconfig
# install dependencies to build the source files
sudo apt-get install -y build-essential cmake libudev-dev
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
# install parity
bash <(curl https://get.parity.io -L)
# sync system time
sudo apt install chrony -y
sudo chronyd -q
# Install finished
sl