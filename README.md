Gamers Live Updater
=====

Gamers live updater that uses sockets

Running the Application
---------------------
#### Project Setup
- Download Project

```sh
    git clone https://github.com/anyTV/comments-plugin.git
```

OR

```sh
    git clone git@github.com:anyTV/comments-plugin.git
```

#### Point gamers.tm -> 127.0.0.1

Add this entry in you hosts file
```
    127.0.0.1     dev.gamers.tm
```

#### Install packages

- Run these commands :

```sh
    npm i -g forever
    npm i -g nodemon
    npm i -g npm-check-updates
    npm install -g bower
    npm-check-updates -u
    bower install
    npm install
```

#### Update Files

- Check package.json for changes (may change depending on npm-check-updates -u)
- Update config/config.js (change for your own environment)


#### Run the app

```sh
    sudo nodemon server
```
- check http://dev.gamers.tm:9999

you should see
```js
{"reason":"Unknown command","result":"error"}
```
