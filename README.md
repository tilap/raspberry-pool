## Raspberry

Clone the repo

```
git clone https://github.com/christophehurpeau/raspberry-pool.git
```

Create data/raspberries.json

```
{}
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
    webSocket:
        secure: true
        port: 3001
server:
    port: 3000
    tcpSocket:
        port: 3002

```

Copy your ssl certificate in `config/cert/server.key` and `config/cert/server.crt` for the webSocket.

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
