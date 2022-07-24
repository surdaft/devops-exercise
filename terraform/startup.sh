# provision the server with some basic stuff
apt-get update
apt-get upgrade -y
apt-get install nginx 

systemctl enable nginx

# grab the latest compiled version of the webpage from gitlab
URL="https://gitlab.com/surdaft/devops-exercise/-/jobs/artifacts/master/raw/compiled.tar.gz?job=docker-build"

cd /var/www
curl -o compiled.tar.gz -L "$URL"

# I should add error handling for failure to downloading here,
#   I would provide a checksum file with the compiled.tar.gz artifact 
#   and then do a checksum against the tar file

tar -zxvf compiled.tar.gz

# swap out the old files
mv html html.old
mv compiled html