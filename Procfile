web: node server.js

sudo pm2 install pm2-server-monit
sudo pm2 start ecosystem.config.js --only UserTracking --env production
#sudo pm2 start npm -- start server.js  --name "UserTracking" -i 0 -p 80
sudo pm2 kill
sudo pm2 list
sudo pm2 register
sudo pm2 logs
sudo pm2 flush






forever start server.js
forever stop server.js
