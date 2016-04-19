# Install the app
cd app && npm install
# buildding frontend production
gulp deploy:production

# Install the server
cd server && npm install

# Start server
cd server && node index.js

# Start app
cd app/dist && python -m SimpleHTTPServer

# Access games
http://0.0.0.0:8000

# Install Protractor
http://angular.github.io/protractor/#/

# Run tests
cd app && protractor protractor.local.conf.js
