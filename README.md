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

## Working with DB
TODO

## Working with Architecture and Development Plan
In progress
