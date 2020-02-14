### Install
sudo apt-get update
sudo ldconfig
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
cd ~/benchprezz/
npm install
cd ~/
# install RabbitMQ
sudo apt-get install rabbitmq-server -y					    # Install the RabbitMQ server
sudo rabbitmqctl add_user admin admin 				   	    # Add a new user 'admin' with password 'admin'
sudo rabbitmqctl set_user_tags admin administrator		    # The user 'admin' is in the administrator group now
sudo rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"  # Grant the user all privileges for the vhost '/'
sudo service rabbitmq-server restart						# Restart he RabbitMQ server
# sync system time
sudo apt install chrony -y
sudo chronyd -q
# Install finished
sl