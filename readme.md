# postbot
This is the chess engine _postbot_ from postnerd written in Typescript/JavaScript.

## Goals
- have a lichess & uci bot for fame
- train my TypeScript skills
- train my unit test (jest) skills
- write clean, readable code (so this will maybe not the fastest bot alive)
- discover more goals

## Roadmap
- [x] ALPHA-01: setup with github / typescript / jest
- [x] ALPHA-01: board representation and move generator
- [x] ALPHA-01: uci / lichess communication with random moves
- [X] ALPHA-01: release a bot called postbotR to play random moves on lichess
- [X] ALPHA-02: board evaluation 1.0
- [X] ALPHA-02: search algorithm 1.0
- [X] ALPHA-02: use workers for search for not blocking engine communication
- [X] ALPHA-02: release a bot called postbot on lichess
- [ ] define a real roadmap

## Changelog
### postbot 0.0.2-alpha – 19.09.2023
- launched postbot on lichess
- basic evaluation and search algorithm
- basic hash table implementation
- search is handled by a worker thread to ensure proper communication between engine and GUI/lichess 
- engine supports game and analyze mode via uci

### postbot 0.0.1-alpha – 06.07.2023
- launched postbotR (little brother of postbot) on lichess
- basic board representation and move generator
- basic uci communication supporting to start from position

## postbot on lichess
Play against the current version on lichess. You can play rated and casual games.

lichess: https://lichess.org/@/postbot

## postbotR on lichess
The little brother of postbot, just playing random moves in casual games. A proof of concept to launch a chess bot on lichess.

lichess: https://lichess.org/@/postbotR