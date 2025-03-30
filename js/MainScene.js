import * as Utils from "./utils.js";


export class MainScene extends Phaser.Scene{

constructor() {
    super({ key: "MainScene" });
}

preload() {
    this.load.image('background', 'assets/images/edroom.png'); // Load background
    this.load.image('o2tank', 'assets/images/o2tank_idle.png');  // Load o2 tank
    this.load.image('o2tank_hover', 'assets/images/o2tank_hover.png');  // Load o2 tank hover effect
    this.load.image('aspirin', 'assets/images/aspirin_idle.png');  // Load aspirin bottle
    this.load.image('aspirin_hover', 'assets/images/aspirin_hover.png');  // Load aspirin bottle hover effect
    this.load.image('clothes', 'assets/images/clothes_pile_idle1.png');  // Load clothes pile
    this.load.image('clothes_hover', 'assets/images/clothes_pile_hover1.png');  // Load clothes pile hover effect
    this.load.image('tackle', 'assets/images/closedtackle_idle.png');  // Load tackle box tank
    this.load.image("tackle_hover", 'assets/images/closedtackle_hover.png')  // Load tackle box hover effect
    this.load.image("tackleOpen", 'assets/images/opentackle.png')  // Load tackle box hover effect
    this.load.image("clockBlank", "assets/images/wall_clock_blank_idle.png") // Load in clock images
    this.load.image("clockBlankHover", "assets/images/wall_clock_blank_hover.png") // Load in clock images
    this.load.image("clockNumbers", "assets/images/wall_clock_flash_idle.png") // Load in clock images
    this.load.image("clockNumbersHover", "assets/images/wall_clock_flash_hover.png") // Load in clock images
    this.load.image("clockComplete", "assets/images/wall_clock_complete.png") // Load in clock images
    this.load.image("cartDoor", "assets/images/cc_idle.png") // Load crash cart door image
    this.load.image("cartDoorHover", "assets/images/cc_hover.png") // Load crash cart door image


    this.load.image("medication", "assets/images/pillbottle.png"); // Load the award medication image
    this.load.image("vial", "assets/images/vial_highlight.png"); // Load the award vial image
    this.load.image("paperclues", "assets/images/paper_hint.png") // Load the paper hints image


} 

create() {
    this.add.image(400, 300, 'background').setDisplaySize(800, 600);  // Add background centered
    const o2tank = this.add.image(270, 500, 'o2tank').setScale(0.15).setInteractive(); // Add in O2 tank with clickable action
    const aspirin = this.add.image(400, 270, "aspirin").setScale(0.06).setInteractive(); // Add in aspirin bottle with clickable action
    aspirin.angle = 90; // rotate aspirin to sit correctly 
    const clothes = this.add.image(80, 530, "clothes").setScale(0.5).setInteractive(); // Add in clothes pile with clickable action
    const tackleBox = this.add.image(500, 440, "tackle").setScale(0.25).setInteractive();  // Add in tacklebox with clickable action - once solved turns to static image
    const cartDoor = this.add.image(720, 347, "cartDoor").setScale(0.21, 0.14).setInteractive({ useHandCursor:true }); // Add in crash cart drawer overlay
    const clock = this.add.sprite(480, 180, "clockBlank").setScale(0.3).setInteractive(); // Add in clock
    // set hovering variable to false to keep on idle until hovering
    let isHovering = false;
    // set flash interval that function can be loaded into
    let flashInterval;

    let inventory = []
    let topDrawerAnswers = ["Aspirin", "Metoprolol", "Nitroglycerin"]
    let middleDrawerAnswers = ["Heparin", "Enoxaparin", "Fondaparinux", "Bivalrudin", "Clopidogrel", "Ticagrelor", "Prasugrel"]

    //Puzzle Flags
    let haveCCHint = false;
    let drawerOneNotSolved = true;
    let drawerTwoNotSolved = true;
    let drawerThreeNotSolved = true;
    let cartDoorOneOpen = false;
    let cartDoorTwoOpen = false;
    let cartDoorThreeOpen = false
    let topDrawerComplete = false;
    let middleDrawerComplete = false;
    let bottomDrawerComplete = false;

// Clock functions
function startFlashingClock(clock) {
    let isBlank = true; // Track texture state

    flashInterval = setInterval(() => {
        if (isHovering) {
            clock.setTexture(isBlank ? "clockBlankHover" : "clockNumbersHover");
        } else {
            clock.setTexture(isBlank ? "clockBlank" : "clockNumbers");
        }
        isBlank = !isBlank;
    }, 500);
}



// 02tank
    o2tank.on('pointerover', function () {
        this.setTexture('o2tank_hover');  // Change to hover image
    });

    // Restore original image when pointer leaves
    o2tank.on('pointerout', function () {
        this.setTexture('o2tank');  // Change back to original
    });

    // Click interaction
    o2tank.on('pointerdown', function () {
        let scene = this.scene;
        // console.log("O2 Tank clicked! Event triggered."); // Debugging log
    
        // Disable interactivity while going through text sequence
        o2tank.disableInteractive();
    
        // First message
        Utils.showFlavorText(scene, "The oxygen tank got left on the floor! Let's put this up.", function () {
            // console.log("First message clicked."); // Debugging log
    
            // Second message
            Utils.showFlavorText(scene, "We need to reset the goal oxygen level, let's get that entered.", function () {
               // console.log("Second message clicked."); // Debugging log
    
                // Re-enable interactivity
                o2tank.setInteractive();
                // console.log("O2 Tank re-enabled."); // Debugging log
    
                // Create input box for user answer
                Utils.createInputBox(scene, "Enter SpO2 threshold in % for oxygen administration:", function (userAnswer) {
                   // console.log("Input submitted:", userAnswer); // Debugging log
                    if (userAnswer !== null) {
                        if (parseInt(userAnswer) === 90) {
                          //  console.log("Correct answer!"); // Debugging log
                            Utils.answerResponse(scene, "Correct! Oxygen is given when SpO2 is below 90%.", function () {
                                // Third message (about nitroglycerin)
                                Utils.showFlavorText(scene, "Got that put back away. Weird, somebody left the nitroglycerin in the oxygen storage. Let's grab that!", function () {
                                 //   console.log("Showing reward."); // Debugging log
                                    Utils.showReward(scene, "Nitroglycerin", "medication");
                                    inventory.push("Nitroglycerin");
                                    o2tank.destroy();
                                });
                            });
                        } else {
                          //  console.log("Incorrect answer."); // Debugging log
                            Utils.answerResponse(scene, "Incorrect! Try again.");
                        }
                    }
                });
            });
        });
    });

// Aspirin
    aspirin.on('pointerover', function () {
        this.setTexture('aspirin_hover');  // Change to hover image
    });

    // Restore original image when pointer leaves
    aspirin.on('pointerout', function () {
        this.setTexture('aspirin');  // Change back to original
    });

    // Click interaction
    aspirin.on('pointerdown', function () {
        let scene = this.scene;
    
        // Disable interactivity while going through text sequence
        aspirin.disableInteractive();
    
        // First message
        Utils.showFlavorText(scene, "Somebody left the aspirin bottle up here! Lets get it refilled",  () => {

            Utils.createInputBox(scene, "How many 81mg aspirin tablets need to be in the bottle for a full loading dose?", function (userAnswer){
                if (userAnswer !== null) {
                    if (parseInt(userAnswer) === 4) {
                        Utils.answerResponse(scene, "Thats right! We need four total 81 mg aspirin tablets in order to give the 162-325mg loading dose", () => {
                            Utils.showFlavorText(scene, "Got the bottle refilled, lets keep this to load in the cart.", () => {
                                Utils.showReward(scene, "Aspirin", "medication");
                                inventory.push("Aspirin");
                                aspirin.destroy();
                            });
                        });
                    } else {
                        Utils.answerResponse(scene, "I don't think so, try again.")
                    }
                }
            });
        });
    });
// Clothes

    clothes.on('pointerover', function () {
        this.setTexture('clothes_hover');  // Change to hover image
    });

    // Restore original image when pointer leaves
    clothes.on('pointerout', function () {
        this.setTexture('clothes');  // Change back to original
    });

    // Click interaction
    clothes.on('pointerdown', function () {
        let scene = this.scene;
    
        clothes.disableInteractive();
    
        // First message
        Utils.showFlavorText(scene, "We always make a huge mess in these rooms! Let's get these clothes put up", () => {
            Utils.showFlavorText(scene, "Oh no, the metoprolol bottle got rolled up in these clothes, do we need to rush it to the cath lab for the patient?", () => {
                Utils.createInputBox(scene, "Beta blockers should be started in the first how many hours for ACS patients?", function (userAnswer) {
                    if (userAnswer !== null) {
                        if (parseInt(userAnswer) === 24) { 
                            Utils.answerResponse(scene, "That's right, we want to start a beta blocker in the first 24 hours of an ACS event.", () => {
                                Utils.showFlavorText(scene, "They can get their metoprolol when they are done in the cath lab, we will keep this one to load into the cart", () => {
                                    Utils.showReward(scene, "Metoprolol", "medication");
                                    inventory.push("Metoprolol");
                                    clothes.destroy();
                                });
                            });
                        } else {
                            Utils.answerResponse(scene, "Incorrect! Try again.");
                        }
                    }
                });
            });
        });
    });

// TackleBox    
    tackleBox.on("pointerover", function () {
        this.setTexture("tackle_hover");
    });

    tackleBox.on("pointerout", function (){
        this.setTexture("tackle");
    });

    tackleBox.on("pointerdown", function (){
        let scene = this.scene;

        tackleBox.disableInteractive();

        Utils.showFlavorText(scene, "Heres the ACS tacklebox, lets get this open", () => {

            Utils.createInputBox(scene, "The box says in case of ___ do not use heparin and enoxaparin. It looks like it has a dial with space for three letters.", function (userAnswer) {
                if (userAnswer !== null) {
                    if (userAnswer === "hit") {
                        Utils.answerResponse(scene, "Looks like that opened the box! We definitely don't want to use heparin or enoxaparin if the patient has a history of heparin induced thrombocytopenia.", () => {
                            Utils.showFlavorText(scene, "Well now we have the vial of heparin and the vial of enoxaparin. Plus it looks like this is where we kept the clues for the crash cart!", () => {
                                Utils.showReward(scene, "Heparin", "vial", () => {
                                    Utils.showReward(scene, "Enoxaparin", "vial", () => {
                                        Utils.showReward(scene, "Crash Cart Clues", "paperclues");
                                        inventory.push("Heparin");
                                        inventory.push("Enoxaparin");
                                        haveCCHint = true;
                                    });
                                });
                                tackleBox.setTexture("tackleOpen");
                            });
                        });
                    } else { Utils.answerResponse(scene, "No, thats not right, lets try again.") }
                }
            
            });
        })
    })

// Clock

    clock.setTexture("clockBlank");
    startFlashingClock(clock);

    clock.on("pointerover", function () {
        isHovering = true;
    });

    clock.on("pointerout", function () {
        isHovering = false;
    })

    clock.on("pointerdown", function () {
        let scene = this.scene;

        clock.disableInteractive();

        Utils.showFlavorText(scene, "Looks like we need to reset the EKG clock. We need to set it as a countdown timer for our goal EKG time.", () => {
            Utils.createInputBox(scene, "How many minutes is the goal time for a patient with chest pain to get an EKG?", function (userAnswer) {
                if (userAnswer !== null) {
                    if (userAnswer === 10) {
                        Utils.answerResponse(scene, "Perfect, our goal EKG time is less than 10 minutes.", () => {
                            Utils.showFlavorText(scene, "How did the bottle of clopidogrel get all the way up here?", () => {
                                Utils.showReward(scene, "Clopidogrel", "medication");
                                inventory.push("Clopidogrel");
                                // Stop flashing before updating texture
                                clearInterval(flashInterval);
                                clock.setTexture("clockComplete");
                            });
                        });
                    } else { Utils.answerResponse(scene, "No, thats not correct. Try again.") }
                }
            });
        });
    });

// Crash Cart door

    // Change image on hover
    cartDoor.on("pointerover", function () {
    this.setTexture("cartDoorHover");
    });

    // Restore original image when pointer leaves
    cartDoor.on("pointerout", function () {
    this.setTexture("cartDoor");
    });


    cartDoor.on("pointerdown", function() {
        let scene = this.scene;
        cartDoor.disableInteractive();  // Disable interaction initially
    
        if (haveCCHint) {
            showDrawerOptions(scene);
        } else {
            Utils.showFlavorText(scene, "You need a hint before accessing the drawers!");
            cartDoor.setInteractive(); // Re-enable interaction if not ready
        }
    });
    
    function showDrawerOptions(scene) {
        // Get game width & height dynamically
        let { width, height } = scene.sys.game.canvas;
    
        // Create a full-screen overlay
        let overlay = scene.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.5)
            .setOrigin(0.5)
            .setInteractive()
            .setDepth(1000);  // Ensure it covers everything
    
        // Block all clicks behind the overlay

    
        // Group to hold all elements
        let drawerGroup = scene.add.group();
    
        function createOption(y, text, callback) {
            let bg = scene.add.rectangle(width / 2, y, 300, 40, 0x000000, 0.7).setOrigin(0.5);
            let optionText = scene.add.text(width / 2, y, text, { font: "24px Arial", fill: "#ffffff" })
                .setOrigin(0.5)
                .setInteractive()
                .setDepth(1001);  // Ensure menu items are above overlay
    
            // Add hover effects
            optionText.on("pointerover", () => optionText.setStyle({ fill: "#ffff00" }));
            optionText.on("pointerout", () => optionText.setStyle({ fill: "#ffffff" }));
    
            // Click functionality
            optionText.on("pointerdown", () => {
                drawerGroup.clear(true, true);  // Remove all menu elements
                overlay.destroy();  // Remove the overlay
                callback();  // Execute the drawer puzzle logic
            });
    
            drawerGroup.addMultiple([bg, optionText]);
        }
    
        // Create the three clickable drawer options
        createOption(200, "Workup Drawer", () => {
            if (!topDrawerComplete){
            if (cartDoorOneOpen) {
                if (drawerOneNotSolved) {
                    Utils.createWUCrashCartPuzzle(scene, () => {
                        Utils.showFlavorText(scene, "Nice job, that discharge paperwork is all filled out now!", () => {
                            Utils.showReward(scene, "Bivalrudin", "vial", () => {
                                Utils.showReward(scene, "Fondaparinux", "vial", () => {
                                    Utils.showFlavorText(scene, "Now we can access the workup drawer of the crash cart!");
                                    drawerOneNotSolved = false;
                                    inventory.push("Fondaparinux");
                                    inventory.push("Bivalrudin");
                                    cartDoor.setTexture("cartDoor");
                                    cartDoor.setInteractive();
                                });
                            });
                        });
                    });
                } else {
                    Utils.fillInTheCart(scene, inventory, topDrawerAnswers, () => {
                        topDrawerComplete = true;
                        checkGameCompletion(scene); // Check if the game is complete
                    });
                    cartDoor.setInteractive();
                    cartDoor.setTexture("cartDoor");
                }
            } else {
                Utils.createInputBox(scene, "The hint to open the top drawer is - What is the Mneomic to remember medications during workup of ACS? Its five letters.", function (userAnswer) {
                    if (userAnswer !== null) {
                        if (userAnswer === "monab" || userAnswer === "mona-b" || userAnswer === "mona b") {
                            Utils.answerResponse(scene, "That opened the top drawer!", () => {
                                cartDoorOneOpen = true;
                                cartDoor.setTexture("cartDoor");
                                cartDoor.setInteractive();
                            });
                        } else {
                            Utils.answerResponse(scene, "No, thats not right, lets try again.");
                        }
                    }
                });
            }
        } else { Utils.showFlavorText(scene, "This drawer is already complete!")
            cartDoor.setTexture("cartDoor");
            cartDoor.setInteractive();
         }
        });

        createOption(250, "Treatment Drawer", () => {
            if (!middleDrawerComplete){
            if (cartDoorTwoOpen) {
            if (drawerTwoNotSolved) {
                Utils.showFlavorText(scene, "Somebody left some discharge instructions for Ticagrelor in here. It looks like they are incomplete! Lets finish them.", () => {
                    Utils.createInputBox(scene, "Patients should be on less than ____ mg aspirin while taking ticagrelor.", function (userAnswer) {
                        if (userAnswer !== null) {
                            if (userAnswer === 100) {
                                Utils.answerResponse(scene, "Correct! You shouldn't take more than 100mg of aspirin daily while taking ticagrelor. Let's grab that bottle.", () => {
                                    Utils.showReward(scene, "Ticagrelor", "medication");
                                    inventory.push("Ticagrelor");
                                    cartDoor.setTexture("cartDoor");
                                    cartDoor.setInteractive();
                                })
                            }
                        }
                    })
                });
                drawerTwoNotSolved = false;
                cartDoor.setTexture("cartDoor");
                cartDoor.setInteractive();
            } else {
                Utils.fillInTheCart(scene, inventory, middleDrawerAnswers);
                middleDrawerComplete = true;
                checkGameCompletion(scene); // Check if the game is complete
                cartDoor.setTexture("cartDoor");
                cartDoor.setInteractive();
            }
        } else { Utils.createInputBox(scene, "The hint to open the middle drawer is - Number of months to continue DAPT if no bleeding risk", function (userAnswer) {
            if (userAnswer !== null) {
                if (userAnswer === 12) {
                    Utils.answerResponse(scene, "That opened the middle drawer!", () => {
                        cartDoorTwoOpen = true;
                        cartDoor.setTexture("cartDoor");
                        cartDoor.setInteractive();
                    });
                } else {
                    Utils.answerResponse(scene, "No, thats not right, lets try again.");
                }
            }
        });}
    } else { 
            Utils.showFlavorText(scene, "This drawer is already complete!")
            cartDoor.setTexture("cartDoor");
            cartDoor.setInteractive();
    }
        });
    
        createOption(300, "Fibrinolytic Drawer", () => {
            if (!bottomDrawerComplete) {
            if (cartDoorThreeOpen) {
                if (drawerThreeNotSolved) {
                Utils.showFlavorText(scene, "Theres two bottles in here, one looks like its ezetimibe. We don't need that in the cart!", () => {
                    createFibrinolyticDrawerPuzzle(scene, () => {
                        Utils.showFlavorText(scene, "That's right! We should use ezetimibe when patients already take a statin but still have high LDL.", () => {
                            Utils.showFlavorText(scene, "Looks like the other bottle was prasugrel. Let's take it.", () => {
                                Utils.showReward(scene, "Prasugrel", "medication", () => {
                                    Utils.showFlavorText(scene, "We have a cath lab, so all the fibrinolytics are already refilled. This drawer is complete!");
                                    inventory.push("Prasugrel");
                                    bottomDrawerComplete = true;
                                    checkGameCompletion(scene); // Check if the game is complete
                                });
                        });
                    });
                    drawerThreeNotSolved = false;
                    cartDoor.setTexture("cartDoor");
                    cartDoor.setInteractive();
                });
            });
            } else {
                Utils.showFlavorText(scene, "This drawer is already complete!");
                cartDoor.setTexture("cartDoor");
                cartDoor.setInteractive();
            }
        } else {Utils.createInputBox(scene, "The hint to open the bottom drawer is - How many minutes away from a cath lab do you need to be to consider using fibrinolytics?", function (userAnswer) {
            if (userAnswer !== null) {
                if (userAnswer === 120) {
                    Utils.answerResponse(scene, "That opened the bottom drawer!", () => {
                        cartDoorThreeOpen = true;
                        cartDoor.setTexture("cartDoor");
                        cartDoor.setInteractive();
                    });
                } else {
                    Utils.answerResponse(scene, "No, thats not right, lets try again.");
                }
            }
        });}
    } else {
        Utils.showFlavorText(scene, "This drawer is already complete!")
        cartDoor.setTexture("cartDoor");
        cartDoor.setInteractive();
    }
        });
    
        // Add overlay last so it covers everything behind the menu
        drawerGroup.add(overlay);
    }
    
    function createFibrinolyticDrawerPuzzle(scene, callback) {
        // Create a semi-transparent background to block interactions with other elements
        let background = scene.add.rectangle(400, 300, 800, 800, 0x000000, 0.8).setOrigin(0.5);
        background.setInteractive().on("pointerdown", () => {}); // Prevent background clicks
    
        // Display the question
        let questionText = scene.add.text(400, 100, "Theres two bottles in here for some reason, one of them is ezetimibe. That shouldn't be in here. When should we use ezetimibe?", {
            font: "20px Arial",
            fill: "#ffffff",
            align: "center",
            wordWrap: { width: 450 }
        }).setOrigin(0.5);
    
        // Define answer options
        const options = [
            { text: "If their LDL is already below 55 mg/dl", isCorrect: false },
            { text: "If they are already on a high intensity statin and still have a high LDL level", isCorrect: true }, // Correct answer
            { text: "All patients at discharge from the hospital after an ACS event", isCorrect: false },
            { text: "Ezetimibe is never used for ACS patients as it is contraindicated", isCorrect: false }
        ];
    
        let yPos = 200;
        let selectedOption = null; // Track selected answer
    
        options.forEach((option) => {
            let optionText = scene.add.text(400, yPos, option.text, {
                font: "18px Arial",
                fill: "#ffffff",
                backgroundColor: "#333",
                padding: { x: 5, y: 5 },
                align: "left"
            }).setOrigin(0.5).setInteractive();
    
            // Handle selection
            optionText.on("pointerdown", () => {
                // Reset all options' background colors
                scene.children.list.forEach(child => {
                    if (options.some(opt => opt.text === child.text)) {
                        child.setBackgroundColor("#333");
                    }
                });
    
                // Highlight selected option
                optionText.setBackgroundColor("#555");
                selectedOption = option;
            });
    
            yPos += 40; // Adjust vertical position for next option
        });
    
        // Submit button
        let submitButton = scene.add.text(400, yPos + 20, "Submit", {
            font: "18px Arial",
            fill: "#ffffff",
            backgroundColor: "#0000ff",
            padding: { x: 5, y: 5 }
        }).setOrigin(0.5).setInteractive();
    
        submitButton.on("pointerdown", () => {
            console.log("Submit button clicked");
        
            if (!selectedOption) {
                console.log("No option selected!");
                showMCFeedback(scene, "Please select an option before submitting.");
                return;
            }
        
            if (selectedOption.isCorrect) {
                console.log("Correct answer selected!");
        
                showMCFeedback(scene, "Correct! You got it!", () => {
                    console.log("Flavor text callback triggered.");
        
                    // Remove puzzle elements
                    background.destroy();
                    questionText.destroy();
                    submitButton.destroy();
                    scene.children.list
                        .filter(child => options.some(opt => opt.text === child.text))
                        .forEach(child => child.destroy());
                    drawerThreeNotSolved = false;
                    callback();
        
                    // Grant rewards
                    
                });
            } else {
                console.log("Incorrect answer selected!");
                showMCFeedback(scene, "Incorrect! Try again.");
            }
        });
        
    }
    
    function showMCFeedback(scene, message, callback = null) {
        let feedbackText = scene.add.text(400, 500, message, {
            font: "20px Arial",
            fill: "#ffffff",
            backgroundColor: "#000000",
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);
    
        // Ensure it's on top
        feedbackText.setDepth(10);
    
        // Automatically remove after 2 seconds and call callback if provided
        scene.time.delayedCall(1000, () => {
            feedbackText.destroy();
            if (callback) callback();
        });
    }
    
    function checkGameCompletion(scene) {
        if (topDrawerComplete && middleDrawerComplete && bottomDrawerComplete) {
            scene.scene.start("EndScene"); // Transition to EndScene
        }
    }

    //this.input.on('pointerdown', (pointer) => {
        //console.log(`X: ${pointer.x}, Y: ${pointer.y}`);
   // });

//bottom limit for items    
}


}