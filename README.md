anyTV Node Boilerplate
====================

[![Build Status](https://travis-ci.org/anyTV/anytv-node-boilerplate.svg?branch=master)](https://travis-ci.org/anyTV/anytv-node-boilerplate)

Running the Application
---------------------

1. Download Zip
2. Extract to your project's folder
3. Import database/schema.sql and database/seed.sql

<!-- language:console -->
	mysql -uroot < database/schema.sql
	mysql -uroot < database/seed.sql

4. Run this commands :

<!-- language:console -->
    sudo npm i -g forever
    sudo npm i -g nodemon
    sudo npm i -g npm-check-updates
	sudo npm start

5. check http://localhost
6. Update package.json repository link
7. Update config/config.js
8. Don't forget tp.


Coding conventions
---------------------

  [Here](https://github.com/anyTV/JS-conventions)

