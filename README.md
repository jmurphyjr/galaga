## Introduction

The Galaga game was developed by Namco LTD. Please see the [Galaga Wikipedia](https://en.wikipedia.org/wiki/Galaga) page
for further details on the game. The Galaga characters used in this implementation of the game were extracted from the images
from the Wikipedia page.

This project is an educational project assigned by [Udacity](https://udacity.com) as part of their Front-End Web Developer
Nanodegree. The project assigned is actually a horizontal/vertical movement game that did not require non-linear motion. I chose
to attempt a recreation of the Galaga game for two reasons.

 1. Galaga was a game I played as a youth at Funland in Rehoboth Beach, Delaware. There are many fond memories of throwing
 shiny quarters into the slot of the Galaga game during summer vacations.
 2. Galaga offered an opportunity to implement non-linear movement.
 
For those that are fans of the Galaga game series, please accept my apologies for the poor implementation, it is after
all a learning project.

### How to Play

There are two ways to play the game.

 1. Visit the demonstration [website](https://galaga.firebaseapp.com).
 2. Clone the repo, and load into your browser the index.html file located in the src directory.
 
#### Movement and Firing

 1. The fighter will move left or right by pressing the arrow keys on a standard keyboard.
 2. To fire missiles, press the spacebar.

The game will continue to play until the browser window is closed.

#### Notes
This implementation of Galaga must be played on a device with a keyboard.
 
### External Libraries Used
The following libraries were used in the development of this game.

 1. [Firebase JavaScript API](https://www.firebase.com/docs/web/api/) - Used for keeping track of the high score.
 2. [Jake Gordon's State Machine](https://github.com/jakesgordon/javascript-state-machine) - Used to track state of the game
 as well as the enemies and player.
 