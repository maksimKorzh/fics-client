# FICS Chess Client
A client to play chess on (F)ree (I)nternet (C)ess (S)erver

# How it looks?
![IMAGE ALT TEXT HERE](https://raw.githubusercontent.com/maksimKorzh/fics-client/main/img/fics.png)

# How it works?
You just have a telnet console forwarded to an ElectronJS web interface,
all the actions, e.g. playing games or chatting is done purely
via telnet commands, type "help" for more details. Board is synced
to style 12 output of a board in the console. Whenever you make a move
on board it is sent via telnet, but it only
works during the game, otherwise you'll get an error.

# Example workflow
    guest                      // Login as guest
    [Enter]                    // Confirm asigned guest name
    
    finger user_name           // See user info and rating
    seek 10 0                  // Seek for a blitz game 10 min 0 inc

    draw                       // Offer a draw
    resign                     // Resign the game
    who                        // List online players
    games                      // List games currently played
    observe 1                  // Watch game 1
    unobserve 1                // Stop watching game 1
    refresh                    // Resync board if something goes wrong

# How to install & run it
    git clone https://github.com/maksimKorzh/fics-client
    cd fics-client
    npm install
    npm start