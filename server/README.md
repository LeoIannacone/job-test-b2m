B2M test server
=====================

## Init
You should add the user the MongoDB, run:
```
bash init/db.sh
```
Edit it if your DB is not local.

## Config
You may want to change the MongoDB connection in the `config/app.json` file.

## Setup
1. Run `npm i` to install dependencies.
1. Run `node start` to start the Hapi Server on port 3000 (default).
