## Raspberry

Clone the repo

```
git clone https://github.com/christophehurpeau/raspberry-pool.git
```

Create data/raspberries.json

```
{"room1":{"name":"TV room 1","networks":{"mac":{"type":"ethernet"}},"url":""}}}
```

### For dev

Install dependencies

```
cd web
npm install
cd ..
cd server
npm install
```

Watch web and run webserver

```
npm run watch
```

### Installation for production

Create src/config/local.yml
```
common:
    webSocketPort: 3001
server:
    port: 3000
    tcpSocketPort: 3002

```

Create supervisor config file

```
[program:node-raspberry-pool]
command=node --harmony /home/raspberry-pool/prod/current/
environment=NODE_ENV="production"
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/home/raspberry-pool/prod/logs/web.log
user=evaneos

[group:raspberry-pool]
programs=node-raspberry-pool
```

Install dependencies and build

```
cd web
npm install
./node_modules/.bin/jspm install
make build
```

Start the servers

```
sudo supervisorctl reread && sudo supervisorctl reload
```
