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
cd ~/
# install go & quorum
sudo snap install go --classic
git clone https://github.com/jpmorganchase/quorum.git
cd quorum
make all
sudo cp -r build/bin/ /usr/local/
# install istanbul-tools
cd ~/
git clone https://github.com/jpmorganchase/istanbul-tools.git
cd istanbul-tools
make
# Install finished
sl