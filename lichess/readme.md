# Running a version of postbot on lichess using Docker

If you want to run a (modified) version of _postbot_ on lichess you can do the following:

1. create an account on lichess
2. [upgrade the accoount](https://lichess.org/api#tag/Bot/operation/botAccountUpgrade) to a bot account
3. [generate an API access token](https://lichess.org/account/oauth/token/create?scopes%5B%5D=bot:play&description=lichess-bot) in your lichess account
4. go to ```/lichess``` folder (see also section about sparse cloning)
5. build docker image ```docker build -t postbot .```
6. set ```BRANCH``` and ```API_TOKEN``` in .env file (use the ```.env.template``` as a starting point, e.g. ```mv .env.template .env``` )
7. run docker container ```docker run --env-file .env postbot```

## .env file

```
BRANCH=<branch>
API_TOKEN=<lichess_api_token>
```

### API_TOKEN
Use the token create in your lichess bot account.

### BRANCH
Specify the git branch that should be used to start the lichess bot.

## Sparse cloning lichess folder
If you have a dedicated machine to run _postbot_ (I use a Raspberry PI 4) than you can only checkout/clone the lichess folder on your machine.

1. ```git clone --filter=blob:none --sparse https://github.com/postnerd/postbot.git``` (or of course the git url of your fork)
2. ```cd postbot``` (or of course your fork name)
3. ```git sparse-checkout add lichess```
4. ```cd lichess```

## Docker container options/handling

### restart container on reboot
If you want that your docker container is getting restarted after for example a reboot, start the container with ```--restart```

```docker run --restart always postbot```

### update restart option on running container

1. ```docker ps``` get the container id
2. ```docker update --restart no <id>``` OR ```docker update --restart always <id>```

### start container in background (detached mode)

```docker run -d postbot```

### stream container logs

1. ```docker ps``` get the container id
2. ```docker logs <id> --follow```

### stop container

1. ```docker ps``` get the container id
2. ```docker stop <id>```

### reset docker config
If you get an error during images builds sometimes this helps:

```rm  ~/.docker/config.json```