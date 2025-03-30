**Acute Coronary Syndrome: Escape Room Game**


**Overview**

This is an interactive escape room game designed to educate players about Acute Coronary Syndrome (ACS). Players will solve puzzles related to ACS medications, treatment, and clinical decision-making, simulating real-life scenarios faced in the management of STEMI patients. The game includes multiple puzzles that unlock as players progress, encouraging them to apply their knowledge of pharmacology in an engaging and educational manner.

**Game Flow**

Intro Scene: The game starts with an introductory screen featuring the title of the game and instructions on how to play.

Main Puzzle Scene: Players interact with various elements like the crash cart inventory to place correct medications based on clinical guidelines.

End Scene: Once all puzzles are completed, the game transitions to the end scene, congratulating the player for completing the escape room.

**Features**

Interactive Puzzles: Players solve puzzles related to ACS treatment, such as selecting the correct medications for a crash cart.

Multiple Choice: Options like "Start" and "Don't Start" buttons allow players to make clinical decisions.

Dynamic Feedback: After each selection, the game provides feedback, including success or failure messages.

Ending Sequence: Upon successfully completing all puzzles, the game shows an end screen celebrating the player's accomplishment.

**Project Structure**

/assets
  /fonts
  /images
  /sounds
/js
  game.js               - Main game logic and scenes
  IntroScene.js         - Game introduction scene
  MainScene.js          - Main game scene with puzzles
  EndScene.js           - Game end scene
  utils.js              - Utility functions (e.g., for showing messages)
/libs
  Phaser library files
index.html             - The HTML file that initializes the game
README.md              - Project documentation (this file)


**Technologies Used**


Phaser 3: A fast, robust game framework for creating HTML5 games.

JavaScript (ES6+): The game's core logic and interactions are implemented using JavaScript.

HTML5: The basic structure of the game, linking scripts and assets together.

**Getting Started**


Follow these steps to set up and play the game:

Clone the repository:

git clone https://github.com/yourusername/acs-escape-room.git

**Dependencies**

You don't need any additional dependencies to run this project. Simply ensure you have a web server running to serve the HTML and assets.

**Run the Game**

Open index.html in a web browser or use a local server to test it out. For example, you can use Visual Studio Code with the Live Server extension, or run a simple server using Python:

python3 -m http.server


**Interact with the Game**

The game will present you with scenarios involving ACS management. Make the correct choices by interacting with the various puzzles to find all the medications to refill the crash cart with.


**Future Enhancements**

Additional Puzzles: More complex puzzles related to other aspects of ACS management, such as diagnostic tests or procedures.


**Contributing**

Feel free to fork this repository, make improvements, and create pull requests! Contributions are welcome to help enhance the game further.