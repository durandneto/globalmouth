# install the app
cd app && npm install
# buildding frontend production
gulp deploy:production

# install the server
cd server && npm install

# start server
cd server && node index.js

# start app
cd app/dist && python -m SimpleHTTPServer

# access games
http://0.0.0.0:8000