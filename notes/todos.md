# Bugs

## Bugs
- [X] en passant should be reflected by hash generation
- [X] restructure hash tables to use low/high pairs of 32-bit integers to reduce hash collision
- [X] move ordering might be wrong (see discord conversation with Jonas)
- [X] isCheck not working with en passant
- [X] support for lichess movetime feature in the beginning
- [X] doesn't prevent checkmate in one - https://lichess.org/k0GCplgy/white#66 – 6k1/1p4bp/6p1/4p3/2b5/2N3B1/PP4PP/5rKR w - - 7 34
- [X] search depth 9999 - 1rb1kb1r/1pN2ppp/p2p4/4p1B1/4P3/1P6/1PP2PPP/1R3RK1 b - - 3 38
- [X] 0 eval in depth 7? - 1rb1k2r/1p3ppp/8/1p2B3/3Pp3/1B2P3/RP3PPP/4K2R b k - 0 20
- [X] missed stalemate thread - 8/8/1R6/3k4/4pn2/5n2/5P2/7K w - - 6 85

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
- [X] BETA-0.1: evaluation: piece-square tables for endgames
- [X] BETA-0.1: complete implementation of all chess rules (50 move rule, stalemate etc.)
- [X] BETA-0.1: implementation of transposition tables
- [X] BETA-0.1: optimizing time management to not lose on time when we have an increment
- [ ] define a real roadmap
    - [ ] null move pruning
    - [X] performance optimizations
    - [ ] move ordering optimizations
    - [ ] opening book
    - [ ] endgame table
    - [ ] king safety