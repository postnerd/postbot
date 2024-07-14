FROM debian:stable-slim

ENV BRANCH=
ENV API_TOKEN=

RUN apt update && apt install -y wget python3 python3-pip npm
RUN npm install -g bun

RUN git clone https://github.com/lichess-bot-devs/lichess-bot.git
RUN cd lichess-bot && python3 -m pip install --no-cache-dir -r requirements.txt --break-system-packages

RUN cd lichess-bot && git clone https://github.com/postnerd/postbot.git

COPY config.yml /lichess-bot/

CMD if [ -z "$API_TOKEN" ]; then echo 'Environment variable API_TOKENR must be specified. Exiting.'; exit 1; fi \
    && sed -i "s|PLEASE_REPLACE_VIA_ENV|${API_TOKEN}|g" /lichess-bot/config.yml \
    && cd lichess-bot/postbot \
    && git checkout $BRANCH -- \
    && git pull \
    && bun install \
    && chmod +x ./main.ts \
    && echo "Bun.js version: $(bun -v)" \
    && cd .. \
    && python3 lichess-bot.py -v