#!/bin/bash
sudo su root

# provision the server with some basic stuff
apt-get update >> /tmp/startup.log 2>&1
apt-get upgrade -y >> /tmp/startup.log 2>&1
apt-get install -y nginx >> /tmp/startup.log 2>&1

# optimally I would update, ensure pip and then run an ansible playbook that is installed from a
# bespoke apt repo - bash will do for now.

systemctl enable nginx >> /tmp/startup.log 2>&1

# grab the latest compiled version of the webpage from gitlab
URL="https://gitlab.com/surdaft/devops-exercise/-/jobs/artifacts/master/raw/compiled.tar.gz?job=docker-build"

cd /var/www
curl -o compiled.tar.gz -L "$URL" >> /tmp/startup.log 2>&1

# I should add error handling for failure to downloading here,
#   I would provide a checksum file with the compiled.tar.gz artifact 
#   and then do a checksum against the tar file

# delete old artifacts
rm -rf compiled

tar -zxvf compiled.tar.gz >> /tmp/startup.log 2>&1

# swap out the old files
mv html html.old
mv compiled html