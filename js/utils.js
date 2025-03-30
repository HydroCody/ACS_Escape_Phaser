// Create question input box with response field and submit button
export function createInputBox(scene, questionText, callback) {
    // Disable interactivity for all objects in the scene
    scene.input.enabled = false;

    // Create background box
    let inputBox = scene.add.rectangle(400, 300, 400, 100, 0x000000, 0.8).setOrigin(0.5);

    // Create wrapped question text
    let question = scene.add.text(400, 300, "", {
        font: "18px Arial",
        fill: "#ffffff",
        align: "center",
        wordWrap: { width: 380, useAdvancedWrap: true }
    }).setOrigin(0.5);
    question.setText(questionText);

    // Create input field
    let inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.style.position = "absolute";
    inputElement.style.left = "50%";
    inputElement.style.top = "40%";
    inputElement.style.transform = "translate(-50%, -50%)";
    inputElement.style.fontSize = "18px";
    document.body.appendChild(inputElement);
    inputElement.focus();

    // Create submit button
    let submitButton = document.createElement("button");
    submitButton.innerText = "Submit";
    submitButton.style.position = "absolute";
    submitButton.style.left = "50%";
    submitButton.style.top = "calc(40% + 40px)";  // Below the input box
    submitButton.style.transform = "translate(-50%, -50%)";
    submitButton.style.fontSize = "16px";
    document.body.appendChild(submitButton);

    function submitAnswer() {
        let userAnswer = inputElement.value.trim(); // Get input

        if (userAnswer === "") {
            alert("Please enter a value.");
            return;
        }

        // Determine if it is an integer or a string and pass back appropriate oen
        let parsedAnswer = parseInt(userAnswer);
        if (isNaN(parsedAnswer)){
            callback(userAnswer.toLowerCase());
        } else {
            callback(parsedAnswer);
        }

        // Cleanup UI
        document.body.removeChild(inputElement);
        document.body.removeChild(submitButton);
        inputBox.destroy();
        question.destroy();

        // Re-enable scene interactivity
        scene.input.enabled = true;
    }

    // Listen for Enter key
    inputElement.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
            submitAnswer();
        }
    });

    // Listen for button click
    submitButton.addEventListener("click", submitAnswer);
}


// Creates an overlay to show a response on screen
export function answerResponse(scene, responseText, callback) {
    // Disable interactivity for all objects in the scene
    scene.input.enabled = false;

    // Create background box
    let inputBox = scene.add.rectangle(400, 300, 400, 100, 0x000000, 0.8).setOrigin(0.5);

    // Create wrapped text box
    let response = scene.add.text(400, 300, "", {
        font: "18px Arial",
        fill: "#ffffff",
        align: "center",
        wordWrap: { width: 380, useAdvancedWrap: true }
    }).setOrigin(0.5);
    response.setText(responseText);

    // Create a zone to capture clicks (covering the entire scene or just the box)
    let clickZone = scene.add.zone(0, 0, scene.scale.width, scene.scale.height).setOrigin(0);
    clickZone.setInteractive();

    clickZone.once('pointerdown', () => {
        inputBox.destroy();
        response.destroy();
        clickZone.destroy();
        scene.input.enabled = true;
        if (callback) { // Call the callback if it exists
            callback();
        }
    });
}


// Shows the collection of an item - does not add item to inventory
export function showReward(scene, medicationName, image, callback) {
    // Background box

    // Create an interactive full-screen overlay to block other clicks
    let overlay = scene.add.rectangle(
        scene.cameras.main.centerX, 
        scene.cameras.main.centerY, 
        scene.cameras.main.width, 
        scene.cameras.main.height, 
        0x000000, 0 // Invisible overlay
    ).setOrigin(0.5).setDepth(999);
    overlay.setInteractive();  // Captures all clicks to prevent background interaction

    let rewardBox = scene.add.rectangle(400, 100, 400, 100, 0x000000, 0.8).setOrigin(0.5);

    // Display message
    let rewardText = scene.add.text(400, 100, `You found ${medicationName}!`, {
        font: "22px Arial",
        fill: "#ffffff",
        align: "center",
        wordWrap: { width: 380, useAdvancedWrap: true }
    }).setOrigin(0.5);

    // Display medication image
    let medicationImage = scene.add.image(400, 400, image).setScale(0.5);

    // Click to dismiss
    scene.input.once('pointerdown', function () {
        rewardBox.destroy();
        rewardText.destroy();
        medicationImage.destroy();
        overlay.destroy();
        if (callback) callback();  // If a callback is provided, call it after dismissing
    });
}


// Creates a text box on window for flavor text to use when dealing with items
export function showFlavorText(scene, message, callback) {
    if (!scene || !message) return;

    // Create an interactive full-screen overlay to block other clicks
    let overlay = scene.add.rectangle(
        scene.cameras.main.centerX, 
        scene.cameras.main.centerY, 
        scene.cameras.main.width, 
        scene.cameras.main.height, 
        0x000000, 0 // Invisible overlay
    ).setOrigin(0.5).setDepth(999);
    overlay.setInteractive();  // Captures all clicks to prevent background interaction

    // Create a background for the flavor text
    let bg = scene.add.rectangle(scene.cameras.main.centerX, 575, 620, 50, 0x000000, 0.9)
        .setOrigin(0.5)
        .setDepth(1000);  // High depth value to ensure it's on top
    
    let textBox = scene.add.text(scene.cameras.main.centerX, 575, message, {
        font: "18px Arial",
        fill: "#ffffff",
        wordWrap: { width: 600, useAdvancedWrap: true },
        align: "center"
    }).setOrigin(0.5).setDepth(1001);  // Higher depth for the text

    // Click anywhere to proceed
    overlay.once('pointerdown', function () {
        bg.destroy();
        textBox.destroy();
        overlay.destroy();  // Remove overlay, allowing normal interaction

        if (callback) callback();  // Continue game logic
    });
}

// Create discharge medication puzzle

export function createWUCrashCartPuzzle(scene, callback) {
    // Store all puzzle elements for easy cleanup
    const puzzleElements = [];

    // Create background overlay
    const background = scene.add.rectangle(400, 300, 800, 700, 0x000000, 0.8)
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: false });
    puzzleElements.push(background);

    // Create header instructions
    const headerText = scene.add.text(400, 80, "Which medications need to be started at discharge for an ACS patient?", { 
        font: "20px Arial", 
        fill: "#ffffff", 
        align: "center",
        wordWrap: { width: 750 }
    }).setOrigin(0.5);
    puzzleElements.push(headerText);

    // List of medications and correct responses
    const medications = {
        "Aspirin": true,
        "Beta-Blocker": true,
        "Heparin": false,
        "Apixaban": false,
        "Statin": true
    };

    let choices = {};
    let yPos = 140;  // Increased from 150 to create more space after the header
    const buttons = [];

    // Create buttons for each medication
    Object.keys(medications).forEach((med) => {
        // Medication name
        const medText = scene.add.text(200, yPos, med, { 
            font: "18px Arial", 
            fill: "#ffffff" 
        });
        puzzleElements.push(medText);

        // "Start" button
        const startButton = scene.add.text(350, yPos, "Start", {
            font: "16px Arial",
            fill: "#ffffff",  // Ensure visibility on all backgrounds
            backgroundColor: "#333",
            padding: { x: 5, y: 5 }
        }).setInteractive();
        
        startButton.on("pointerdown", () => {
            choices[med] = true;
            startButton.setBackgroundColor("#00ff00").setFill("#000000"); // Green with black text
            dontStartButton.setBackgroundColor("#333").setFill("#ffffff"); // Reset Don't Start
        });
        puzzleElements.push(startButton);
        buttons.push(startButton);

        // "Don't Start" button
        const dontStartButton = scene.add.text(420, yPos, "Don't Start", {
            font: "16px Arial",
            fill: "#ffffff",  // Ensure visibility on all backgrounds
            backgroundColor: "#333",
            padding: { x: 5, y: 5 }
        }).setInteractive();
        
        dontStartButton.on("pointerdown", () => {
            choices[med] = false;
            dontStartButton.setBackgroundColor("#ff0000").setFill("#000000"); // Red with black text
            startButton.setBackgroundColor("#333").setFill("#ffffff"); // Reset Start
        });
        puzzleElements.push(dontStartButton);
        buttons.push(dontStartButton);

        yPos += 60;  // Increased spacing between each row
    });

    // Submit button
    const submitButton = scene.add.text(350, yPos + 20, "Submit", {
        font: "18px Arial",
        fill: "#ffffff",
        backgroundColor: "#0000ff",
        padding: { x: 5, y: 5 }
    }).setInteractive();
    puzzleElements.push(submitButton);

    submitButton.on("pointerdown", () => {
        // Disable all buttons while processing
        buttons.forEach(button => button.disableInteractive());
        submitButton.disableInteractive();

        // Check answers
        const isCorrect = Object.keys(medications).every(
            med => choices[med] === medications[med]
        );

        if (isCorrect) {
            // Correct answer - show success message
            showSuccessMessage(scene, () => {
                // Clean up puzzle elements
                puzzleElements.forEach(element => element.destroy());
                // Proceed to callback
                callback();
            });
        } else {
            // Incorrect answer - show try again message
            showTryAgainMessage(scene, () => {
                // Re-enable buttons for another attempt
                buttons.forEach(button => button.setInteractive());
                submitButton.setInteractive();
            });
        }
    });
}


function showTryAgainMessage(scene, onClose) {
    // Create message background
    const messageBg = scene.add.rectangle(400, 300, 300, 150, 0x222222, 0.9)
        .setOrigin(0.5)
        .setStrokeStyle(2, 0xff0000);
    
    // Create message text
    const messageText = scene.add.text(400, 270, "Incorrect choices!\nPlease try again.", {
        font: "18px Arial",
        fill: "#ffffff",
        align: "center"
    }).setOrigin(0.5);

    // Create OK button
    const okButton = scene.add.text(400, 330, "OK", {
        font: "18px Arial",
        fill: "#ffffff",
        backgroundColor: "#444444",
        padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive();

    // Button hover effects
    okButton.on('pointerover', () => okButton.setBackgroundColor('#555555'));
    okButton.on('pointerout', () => okButton.setBackgroundColor('#444444'));

    // Button click handler
    okButton.on('pointerdown', () => {
        messageBg.destroy();
        messageText.destroy();
        okButton.destroy();
        if (onClose) onClose();
    });

    // Bring message to front
    scene.children.bringToTop(messageBg);
    scene.children.bringToTop(messageText);
    scene.children.bringToTop(okButton);
}

function showSuccessMessage(scene, onClose) {
    // Create message background (green for success)
    const messageBg = scene.add.rectangle(400, 300, 300, 150, 0x222222, 0.9)
        .setOrigin(0.5)
        .setStrokeStyle(2, 0x00ff00);  // Green border for success
    
    // Create success message text
    const messageText = scene.add.text(400, 270, "You Solved the Puzzle!", {
        font: "18px Arial",
        fill: "#00ff00",  // Green text for success
        align: "center"
    }).setOrigin(0.5);

    // Create OK button
    const okButton = scene.add.text(400, 330, "OK", {
        font: "18px Arial",
        fill: "#ffffff",
        backgroundColor: "#444444",
        padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive();

    // Button hover effects
    okButton.on('pointerover', () => okButton.setBackgroundColor('#555555'));
    okButton.on('pointerout', () => okButton.setBackgroundColor('#444444'));

    // Button click handler
    okButton.on('pointerdown', () => {
        messageBg.destroy();
        messageText.destroy();
        okButton.destroy();
        if (onClose) onClose();
    });

    // Bring message to front
    scene.children.bringToTop(messageBg);
    scene.children.bringToTop(messageText);
    scene.children.bringToTop(okButton);
}

export function fillInTheCart(scene, inventory, answers, callback) {
    // Background overlay to block interactions
    let overlay = scene.add.rectangle(scene.cameras.main.centerX, scene.cameras.main.centerY, 800, 600, 0x000000, 0.7)
        .setOrigin(0.5)
        .setDepth(1000)
        .setInteractive();

    // **Instruction Heading**
    let instructions = scene.add.text(scene.cameras.main.centerX, 50, 
        "Select the correct items from your inventory to place in the crash cart drawer.", 
        { font: "22px Arial", fill: "#ffffff", align: "center", wordWrap: { width: 750 } })
        .setOrigin(0.5)
        .setDepth(1001);

    // **Titles for Drawer and Inventory**
    let drawerTitle = scene.add.text(600, 100, "Crash Cart Drawer", { font: "24px Arial", fill: "#ffffff" })
        .setOrigin(0.5).setDepth(1001);
    let inventoryTitle = scene.add.text(200, 100, "Inventory", { font: "24px Arial", fill: "#ffffff" })
        .setOrigin(0.5).setDepth(1001);

    // **Exit Button**
    let exitButton = scene.add.text(700, 450, "Back", { 
        font: "28px Arial", 
        fill: "#ff0000", 
        backgroundColor: "#333333",
        padding: { x: 10, y: 5 }
    })
    .setOrigin(0.5)
    .setDepth(1002)
    .setInteractive({ useHandCursor: true });

    exitButton.on("pointerover", () => exitButton.setStyle({ fill: "#ffff00" }));
    exitButton.on("pointerout", () => exitButton.setStyle({ fill: "#ff0000" }));
    exitButton.on("pointerdown", () => closePuzzle());

    let drawer = []; // Stores items placed in the cart
    let drawerTextItems = [];
    let inventoryTextItems = [];

    function updateDrawerDisplay() {
        drawerTextItems.forEach(item => item.destroy());
        drawerTextItems = [];

        drawer.forEach((item, index) => {
            let text = scene.add.text(600, 150 + index * 30, item, { font: "20px Arial", fill: "#00ff00" })
                .setOrigin(0.5)
                .setDepth(1001);
            drawerTextItems.push(text);
        });
    }

    function updateInventoryDisplay() {
        inventoryTextItems.forEach(item => item.destroy());
        inventoryTextItems = [];

        inventory.forEach((item, index) => {
            let text = scene.add.text(200, 150 + index * 30, item, { font: "20px Arial", fill: "#ffffff" })
                .setOrigin(0.5)
                .setDepth(1001)
                .setInteractive({ useHandCursor: true });

            // Hover effects
            text.on("pointerover", () => text.setStyle({ fill: "#ffff00" }));
            text.on("pointerout", () => text.setStyle({ fill: "#ffffff" }));

            // Click to add to drawer
            text.on("pointerdown", () => {
                if (answers.includes(item)) {
                    drawer.push(item);
                    inventory.splice(inventory.indexOf(item), 1); // Remove from inventory
            
                    // Show "Item added" first, then check if the drawer is completed
                    showGenericMessage(scene, `${item} added to the drawer.`, () => {
                        
                        updateDrawerDisplay();
                        updateInventoryDisplay();
            
                        // After closing "Item added" message, check if all correct items are in the drawer
                        if (drawer.length === answers.length && drawer.every(ans => answers.includes(ans))) {
                            showGenericMessage(scene, "Drawer completed!", () => {
                                closePuzzle();
                                callback(); // Proceed after completion
                            });
                        }
                    });
            
                } else {
                    showGenericMessage(scene, `${item} doesn't belong in this drawer.`);
                }
            });

            inventoryTextItems.push(text);
        });
    }

    function closePuzzle() {
        overlay.destroy();
        instructions.destroy();
        drawerTitle.destroy();
        inventoryTitle.destroy();
        exitButton.destroy();
        drawerTextItems.forEach(item => item.destroy());
        inventoryTextItems.forEach(item => item.destroy());
        scene.input.enabled = true; // Re-enable interactions
    }

    updateDrawerDisplay();
    updateInventoryDisplay();
}


function showGenericMessage(scene, message, onClose) {
    const messageDepth = 9999; // Ensure it's always on top

    // Create message background
    const messageBg = scene.add.rectangle(400, 300, 300, 150, 0x222222, 0.9)
        .setOrigin(0.5)
        .setStrokeStyle(2, 0xff0000)
        .setDepth(messageDepth)
        .setInteractive(); // Block clicks from going through

    // Create message text
    const messageText = scene.add.text(400, 270, message, {
        font: "18px Arial",
        fill: "#ffffff",
        align: "center",
        wordWrap: { width: 280 }
    }).setOrigin(0.5).setDepth(messageDepth + 1);

    // Create OK button
    const okButton = scene.add.text(400, 330, "OK", {
        font: "18px Arial",
        fill: "#ffffff",
        backgroundColor: "#444444",
        padding: { x: 10, y: 5 }
    }).setOrigin(0.5).setInteractive().setDepth(messageDepth + 1);

    // Button hover effects
    okButton.on('pointerover', () => okButton.setBackgroundColor('#555555'));
    okButton.on('pointerout', () => okButton.setBackgroundColor('#444444'));

    // Button click handler
    okButton.on('pointerdown', () => {
        messageBg.destroy();
        messageText.destroy();
        okButton.destroy();
        if (onClose) onClose();
    });

    // **Bring everything to the top**
    scene.children.bringToTop(messageBg);
    scene.children.bringToTop(messageText);
    scene.children.bringToTop(okButton);
}