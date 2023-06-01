# LOG API Server

# LOG API SERVER
This repository contains code for serving `apache` and `nginx` logs.

## Features
- HTTP Only Cookie Auth
- Role Based Access Control
- Logstash as data processing pipeline for seeding apache and nginx logs to mongodb in proper format. 
- Logstash folder contains logstash config for seeding apache and nginx logs in respective collection.
- Used Mongo DB aggregation pipeline for serving data as required for visualization in frontend.

## Prerequisite

- Logstash
- Setup mongodb and add mongo uri in uri field inside mongo in output section of `logstash.conf` file.
- Add the same uri in mongo uri field by creating `.env` file.
- You may check `.env.example` file for the reference on what needs to be added in `.env` file and in what format.
- `pnpm` as package manager or delete `pnpm-lock.yaml` file and use the suitable package manager.

## Seed data into mongodb

```bash

logstash -f path_to_logstash.conf

```

Logstash needs to be installed and may require sudo permission.

## Backend REST API Setup

```bash

pnpm i

pnpm start:dev

```

The default port is `3001`. Head to `localhost:3001`. Good to go!

`Note: create user endpoint is not protected for test purpose.`
It should be decorated by AccessGuards and Role guards in production as follows:

```ts
  @Role([UserRole.ADMIN])
  @UseGuards(AccessAuthGuard, RoleGuard)
  @ApiBody({ type: CreateUserDto })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
```

