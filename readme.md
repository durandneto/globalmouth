# Install the Fronted
cd app && npm install
# buildding frontend production
gulp deploy:production

# Install the Server
cd server && npm install

# Start Server
cd server && node index.js

# Start Frontend
cd app/dist && python -m SimpleHTTPServer

# Access games
http://0.0.0.0:8000

# Install Protractor
http://angular.github.io/protractor/#/

# Run Tests
cd app && protractor protractor.local.conf.js
