Server
=====================

## Run
To run the server, install deps:
```
npm i
```
and then run
```
./node_modules/.bin/gulp
```

App will run at http://localhost:3000

### Config
The server is already configured to use a Heroku MongoDB instance.

However you may want to change the `config.json` if you want set up a new DB.


### Lint, Test and Coverage
You can check code via `eslint` by typing:
```
./node_modules/.bin/gulp lint
```

You can run tests with:
```
./node_modules/.bin/gulp test
```

You can run coverage with:
```
./node_modules/.bin/gulp coverage
```

### DB Set Up and Init
**This is needed only if you want a local DB**
You can run the follow to setup a new Mongo DB instance. Open the JS file and 
edit as you need, then run:
```
mongo admin init/mongo-user.js
```
You can use the Python script `init/fill-db.py` to fill db with some data.

After that, you have to update the `config.json` file.

