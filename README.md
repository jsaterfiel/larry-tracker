# Larry-Tracker

## Dev Commands
Starting everything from project root directory

Start everything
```
docker-compose up -d
```

Shutting everything down
```
docker-compose down
```

Rebuilding everything (you won't typically need this for dev unless you change the node packages)
```
docker-compose build
```

Rebuild api
```
docker-compose up -d --build api
```

Force full build (for testing the docker images will build correctly)
```
docker-compose build --no-cache --force-rm
```

## Prod Commands
You won't need to run this for development.  Only needed to locally run the same setup as production.

Start everything
```
docker-compose -f docker-compose.prod.yml up -d --build
```

Shutting everything down
```
docker-compose -f docker-compose.prod.yml down
```

Building for production (for testing images)
```
docker-compose -f docker-compose.prod.yml build --no-cache --force-rm
```

## Working With the Database

### Using the client cli
Get the instance running
```
docker run -it --rm --network larry-tracker_default --link larry-tracker_ch-server-1_1:ch-server-1 yandex/clickhouse-client --host ch-server-1
```

You can also connect to the db through the HTTP interface [https://clickhouse.yandex/docs/en/interfaces/http/]

### Loading Table Schema
Mac/linux
```
cat db/scripts/schema.sql | docker run -i --rm --network larry-tracker_default --link larry-tracker_ch-server-1_1:ch-server-1 yandex/clickhouse-client -m --host ch-server-1 --database default --multiquery
```
Windows
```
???
```
### Loading Sample1 Test Data
Mac/linux
```
cat db/scripts/sample1.sql | docker run -i --rm --network larry-tracker_default --link larry-tracker_ch-server-1_1:ch-server-1 yandex/clickhouse-client -m --host ch-server-1 --database default --multiquery
```
Windows
```
???
```

## API
The api for the site is located in the **api** folder
The server runs by default on port 8181.
This can be changed via the environment parameter **API_PORT**

The db url defaults to the service name **ch_server-1**
This can also be changed via the environment parameter **API_DB_URL**

### API Unit Tests
The API Unit tests are written with supertest and mocha.  To run them you can use a mocha test runner plugin in **VS Code** **Mocha Sidebar** or from the command line in the project root directory
Windows
```
node_modules\mocha\bin\mocha --recursive "api\src\*.test.js"
```
Mac/Linux
```
./node_modules/mocha/bin/mocha --recursive "./api/src/*.test.js"
```

### API Documentation
The code is fully commented for all the inputs/outputs but looking to use swagger for ease of usage.