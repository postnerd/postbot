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
- [X] ALPHA-03: deepen search on capture
- [X] ALPHA-03: implement alpha-beta search
- [X] ALPHA-03: sorted move candidates
- [X] ALPHA-04: detection for threefold repetition
- [X] ALPHA-04: have a basic evaluation function
- [X] ALPHA-04: hash tables include en passant information 
- [X] ALPHA-04: eval score caching
- [X] ALPHA-04: sorting capture moves by best captures (MVV-LVA)
- [X] ALPHA-04: killer move implementation
- [ ] define a real roadmap
    - [ ] null move pruning
    - [ ] performance optimizations
    - [ ] detecting 50 move rule
    - [ ] opening book
    - [ ] endgame table
    - [ ] evaluation: piece-square tables for endgames

## Changelog
### postbot 0.0.4-alpha – 01.10.2023
- basic evaluation based on piece-square tables for middle game
- new hash table implementation to reduce hash collisions
- evaluation score caching
- updated move list sorting (MVV-LVA and killer moves)

### postbot 0.0.3-alpha – 27.09.2023
- search optimizations by adding alpha beta pruning and quiesce search
- basic move ordering to evaluate former best moves and capture moves first

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

postbot is running on a Raspberry Pi 4.

## postbotR on lichess
The little brother of postbot, just playing random moves in casual games. A proof of concept to launch a chess bot on lichess.

lichess: https://lichess.org/@/postbotR