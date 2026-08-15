<p align="center">
  <img src="assets/rise-poster.jpg" alt="RISE - Research & Innovation Society for Emerging Intelligence, Sanjivani University" width="100%">
</p>

# RISE Inauguration System

Built by **RISE — Research & Innovation Society for Emerging Intelligence**, Sanjivani University.

Repo: [github.com/prasadthorat25uid-arch/RISE_Inauguration_System-](https://github.com/prasadthorat25uid-arch/RISE_Inauguration_System-)

A real-time, curtain-reveal presentation system for inauguration ceremonies. A mobile controller drives a projector/display screen over Firebase, so an operator can open the curtain, switch posters, and trigger celebration effects from their phone.

---

## Technical Documentation
1. Understanding the Complete Project

The RISE Inauguration System is a real-time web application consisting of two separate user interfaces that communicate through Firebase Realtime Database.

The first interface is the Display Screen, which runs on a laptop, projector, smart board, or any large-screen device. It is responsible for showing the digital curtain, poster images, participant names, poster numbers, and visual celebration effects.

The second interface is the Mobile Controller, which runs on a smartphone. It acts as a remote control for the display screen. The operator can open or close the curtain, move between posters, select a particular poster, and trigger celebration effects.

The most important concept is that the mobile controller does not directly communicate with the laptop. Instead, both devices independently connect to the same Firebase Realtime Database.

The architecture is:

┌─────────────────────────────────────┐
│         📱 MOBILE PHONE             │
│                                     │
│         controller.html             │
│                                     │
│  User presses: "Open Curtain"       │
└──────────────────┬──────────────────┘
                   │
                   │ 1. Generate command
                   ▼
┌─────────────────────────────────────┐
│         firebase-bridge.js          │
│                                     │
│ Converts the old Socket.IO-style    │
│ command into a Firebase database    │
│ operation.                          │
└──────────────────┬──────────────────┘
                   │
                   │ 2. Write command
                   ▼
┌─────────────────────────────────────┐
│      🔥 FIREBASE REALTIME DB        │
│                                     │
│ Stores and synchronizes command     │
│ data between connected devices.     │
└──────────────────┬──────────────────┘
                   │
                   │ 3. Real-time update
                   ▼
┌─────────────────────────────────────┐
│      Laptop's firebase-bridge.js    │
│                                     │
│ Detects the new command and creates │
│ an "open-curtain" event.            │
└──────────────────┬──────────────────┘
                   │
                   │ 4. Trigger event
                   ▼
┌─────────────────────────────────────┐
│         🖥️ display.html             │
│                                     │
│ Receives "open-curtain" and starts  │
│ the curtain animation.              │
└─────────────────────────────────────┘

The important point is that GitHub Pages only hosts the project files. It does not transmit real-time commands itself. Firebase performs the synchronization.

2. How All Project Files Are Connected

Your project consists of multiple files, but they are not independent. Each file has a specific responsibility.

RISE_Inauguration_System/
│
├── index.html
│       │
│       ├────────────► controller.html
│       │
│       └────────────► display.html
│
├── controller.html
│       │
│       ├── loads Firebase SDK
│       ├── loads firebase-config.js
│       └── loads firebase-bridge.js
│
├── display.html
│       │
│       ├── loads Firebase SDK
│       ├── loads firebase-config.js
│       ├── loads firebase-bridge.js
│       └── loads poster images
│
├── firebase-config.js
│       │
│       └── Provides Firebase project credentials
│
├── firebase-bridge.js
│       │
│       ├── Creates io()
│       ├── Sends commands to Firebase
│       ├── Receives commands from Firebase
│       └── Maintains synchronized state
│
├── Leaflet.jpeg
├── Leaflet 2.jpg
├── Leaflet 3.png
├── ...
├── Leaflet 20.jpg
│
└── README.md

A simple way to understand the responsibilities is:

File	Responsibility
index.html	Entry page that provides links to the controller and display
controller.html	Mobile remote-control interface
display.html	Main visual presentation screen
firebase-config.js	Contains Firebase project configuration
firebase-bridge.js	Communication engine connecting controller, Firebase, and display
Image files	Posters or leaflets shown on the display
README.md	GitHub repository documentation
3. index.html — The Entry Point

The index.html file is the first page loaded when someone visits your GitHub Pages URL.

For your project, the main website address is:

https://prasadthorat25uid-arch.github.io/RISE_Inauguration_System-/

GitHub Pages automatically looks for a file named:

index.html

Therefore:

User opens GitHub Pages URL
             │
             ▼
      GitHub finds index.html
             │
             ▼
      Browser displays home page
             │
       ┌─────┴─────┐
       ▼           ▼
Open Display   Open Controller

The purpose of index.html is not to control Firebase or execute the curtain animation. Its main responsibility is navigation.

The user can choose:

Open Display
     ↓
display.html

or:

Open Controller
     ↓
controller.html

This separation is important because the two interfaces have completely different responsibilities.

4. controller.html — Complete Internal Working

The controller.html file acts as the remote control of the system.

When the controller page opens, several operations happen before the user can successfully send a command.

The internal loading sequence is:

Mobile browser opens controller.html
                    │
                    ▼
          HTML interface is created
                    │
                    ▼
          CSS styling is applied
                    │
                    ▼
       Firebase App SDK is downloaded
                    │
                    ▼
    Firebase Database SDK is downloaded
                    │
                    ▼
        firebase-config.js is loaded
                    │
                    ▼
        firebase-bridge.js is loaded
                    │
                    ▼
              io() is created
                    │
                    ▼
          const socket = io()
                    │
                    ▼
       Firebase connection is checked
                    │
          ┌─────────┴─────────┐
          ▼                   ▼
     Connected            Not Connected
          │                   │
          ▼                   ▼
    🟢 Connected         Connecting...

This explains why you previously saw:

Connecting...

The page itself was loading correctly, but the JavaScript communication layer was crashing before io() could be created.

The Console showed:

Uncaught SyntaxError:
Unexpected identifier 'placeholder'

followed by:

Uncaught ReferenceError:
io is not defined

These two errors were connected.

The first error occurred in firebase-bridge.js. Because the browser couldn't execute that file, this line never ran:

window.io = io;

Then controller.html attempted:

const socket = io();

But io did not exist, producing the second error.

So the dependency chain is:

firebase-bridge.js has syntax error
              │
              ▼
        io() not created
              │
              ▼
controller.html calls missing io()
              │
              ▼
       Controller fails
              │
              ▼
     Stays on Connecting...

This is an example of a cascading JavaScript failure, where one initial syntax error causes subsequent errors in dependent files.

5. What Happens When the Open Curtain Button Is Pressed?

Suppose the user presses:

🎭 OPEN CURTAIN

The button's click handler sends:

socket.emit("open-curtain");

At first glance, this looks like standard Socket.IO syntax. However, your final GitHub Pages version does not actually use a Node.js Socket.IO server.

Instead, firebase-bridge.js creates a custom object that behaves similarly to a Socket.IO socket.

The exact conceptual execution is:

User touches Open Curtain button
                │
                ▼
Browser detects click event
                │
                ▼
socket.emit("open-curtain") executes
                │
                ▼
Custom emit() function inside
firebase-bridge.js receives:
                
event = "open-curtain"
payload = undefined
                │
                ▼
Bridge recognizes the event type
                │
                ▼
Creates Firebase state update:
                
curtainState = "open"
                │
                ▼
Writes new state to Firebase
                │
                ▼
Also writes a unique command object
                │
                ▼
Display device detects command
                │
                ▼
Display fires local:
                
"open-curtain"
                │
                ▼
Curtain animation starts

The critical design feature here is that the existing controller code can continue using:

socket.emit(...)

without requiring a complete rewrite.

The bridge translates that familiar interface into Firebase operations.

6. firebase-config.js — What It Actually Does

This file doesn't contain the actual communication logic. It simply tells the Firebase SDK which Firebase project to connect to.

The structure is:

window.FIREBASE_CONFIG = {
    apiKey: "...",
    authDomain: "...",
    databaseURL: "...",
    projectId: "...",
    storageBucket: "...",
    messagingSenderId: "...",
    appId: "..."
};

Each property has a specific purpose.

apiKey

Identifies the Firebase project when using Firebase services from the browser.

authDomain

Defines the Firebase authentication domain associated with the project.

Example:

smart-curtain-4c0d7.firebaseapp.com
databaseURL

This is especially important for your project because you use Firebase Realtime Database.

Example:

https://smart-curtain-4c0d7-default-rtdb.firebaseio.com

Without a correct database URL, the controller cannot communicate with the database.

projectId

Uniquely identifies the Firebase project.

storageBucket

Used for Firebase Storage services. Your current poster images are stored directly in the GitHub repository, so this isn't the main mechanism used for poster delivery.

messagingSenderId

An identifier associated with Firebase messaging infrastructure.

appId

Uniquely identifies the registered web application within the Firebase project.

7. Why window.FIREBASE_CONFIG Was Necessary

This was an important issue during your project development.

At one stage, your configuration used:

const firebaseConfig = {

But your bridge expected:

const cfg = window.FIREBASE_CONFIG || {};

Therefore, the bridge was explicitly looking for:

window.FIREBASE_CONFIG

The correct dependency is:

firebase-config.js
        │
        │ Creates
        ▼
window.FIREBASE_CONFIG
        │
        │ Read by
        ▼
firebase-bridge.js
        │
        │ Passed to
        ▼
firebase.initializeApp(cfg)
        │
        ▼
Firebase Connection

If the expected global configuration object isn't available, Firebase initialization fails.

8. firebase-bridge.js — The Core Communication Engine

This is the central communication layer of your system.

Its main responsibilities are:

Read Firebase configuration.
Initialize Firebase.
Connect to Realtime Database.
Generate a unique client ID.
Create references to command and state locations.
Create an io() compatibility function.
Provide socket.on().
Provide socket.emit().
Detect Firebase connection status.
Listen for commands.
Ignore duplicate commands.
Prevent a device from unnecessarily processing its own commands.

The bridge uses two important Firebase database references:

const commandRef = db.ref("smartCurtain/command");
const stateRef = db.ref("smartCurtain/state");

Conceptually, Firebase stores information like this:

smartCurtain
│
├── command
│   ├── id
│   ├── event
│   ├── payload
│   ├── sender
│   └── timestamp
│
└── state
    ├── curtainState
    └── currentImageIndex

The difference between command and state is important.

A command represents an action:

"Open the curtain now."

State represents the current condition:

"The curtain is currently open."

This distinction is valuable because if a display reloads, it can recover the current state rather than relying only on a historical command.

9. How the Unique Client ID Works

Each browser instance creates a unique ID:

const clientId =
    "client_" +
    Math.random().toString(36).slice(2) +
    "_" +
    Date.now();

An example could be:

client_x7k9a2_1783790000000

This allows the system to know which browser sent a command.

Suppose:

Mobile Controller:
client_mobile_123

Laptop Display:
client_display_456

When the mobile sends a command:

sender = client_mobile_123

The bridge can avoid processing that command unnecessarily on the same sender device.

The logic is:

if (cmd.sender === clientId) {
    return;
}

So:

Command arrives
      │
      ▼
Was it sent by me?
   ┌──┴──┐
  YES    NO
   │      │
Ignore   Process
10. How socket.emit() Works Internally

When the controller calls:

socket.emit("open-curtain");

the bridge receives:

event   = "open-curtain"
payload = undefined

It then checks the event:

if (event === "open-curtain") {
    updates.curtainState = "open";
}

For closing:

if (event === "close-curtain") {
    updates.curtainState = "closed";
}

For showing a specific poster:

if (event === "show-image") {
    updates.currentImageIndex = Number(payload);
}

After identifying the event, it updates Firebase:

stateRef.update(updates);

Then it writes a command object containing:

Unique command ID
Event name
Payload
Sender ID
Server timestamp

This creates a complete message that another connected device can process.

11. Complete Firebase Command Object

A command can conceptually look like:

{
    "id": "client_abc_1783790000000_xyz",
    "event": "open-curtain",
    "payload": null,
    "sender": "client_abc_1783790000000",
    "timestamp": 1783790000000
}

For a celebration effect:

{
    "id": "client_abc_1783790000100_xyz",
    "event": "celebrate",
    "payload": "fireworks",
    "sender": "client_abc_1783790000000",
    "timestamp": 1783790000100
}

The display reads:

event = celebrate
payload = fireworks

and executes the correct visual effect.

12. How the Display Receives Commands

The display-side bridge continuously listens to:

commandRef.on("value", ...)

Whenever the command changes:

Firebase command changes
          │
          ▼
Listener activates
          │
          ▼
Read command object
          │
          ▼
Is command valid?
          │
          ▼
Is it a duplicate?
          │
          ▼
Was it sent by this same device?
          │
          ▼
Fire corresponding local event

Eventually:

fire(cmd.event, cmd.payload);

If the command contains:

event = "open-curtain"

then conceptually:

fire("open-curtain", null);

The registered handler inside the display runs and opens the curtain.

13. display.html — How the Visual Screen Works

The display is the visual output layer.

It combines:

Poster image container
Participant/poster name
Left curtain
Right curtain
Curtain folds
Valance
Decorative stage elements
Poster counter
Celebration layers
JavaScript event handlers

The conceptual structure is:

DISPLAY SCREEN
│
├── Background
│
├── Poster Container
│   ├── Current Image
│   └── Name <p> element
│
├── Curtain Layer
│   ├── Left Curtain
│   ├── Right Curtain
│   └── Top Valance
│
├── Celebration Layer
│   ├── Confetti
│   ├── Gold Shower
│   ├── Fireworks
│   └── Streamers
│
└── Firebase Communication Layer

The layering is important. The poster is behind the curtain, while the curtain appears above it.

Conceptually:

Z-INDEX 30 → Celebration effects
Z-INDEX 20 → Curtains
Z-INDEX 10 → Poster
Z-INDEX  0 → Background
14. How the Curtain Animation Actually Works

The curtain doesn't physically move. The browser changes the CSS transform property.

Initially:

LEFT CURTAIN  → Covers left half
RIGHT CURTAIN → Covers right half

When opening:

LEFT CURTAIN  ← moves outside screen

               POSTER

RIGHT CURTAIN → moves outside screen

CSS can conceptually perform this with:

.left-curtain.open {
    transform: translateX(-100%);
}

.right-curtain.open {
    transform: translateX(100%);
}

The transition property controls smoothness:

transition: transform 2s ease-in-out;

Therefore, the browser interpolates between the starting and final positions over two seconds.

15. How the 20+ Poster System Works

Instead of creating a separate HTML page for every poster, the application maintains a JavaScript collection.

Conceptually:

const posters = [
    {
        image: "Leaflet.jpeg",
        name: "Poster 1"
    },
    {
        image: "Leaflet 2.jpg",
        name: "Poster 2"
    },
    {
        image: "Leaflet 3.png",
        name: "Poster 3"
    }
];

The display needs only:

<img id="posterImage">

<p id="posterName"></p>

JavaScript dynamically changes both.

Current Index = 0
        │
        ▼
posters[0]
        │
        ├── image → Leaflet.jpeg
        │
        └── name  → Poster 1
        │
        ▼
Update <img>
Update <p>

This architecture is scalable. Adding poster 21 requires adding another object to the array rather than creating another HTML page.

16. Complete Next Poster Flow

When the operator presses Next:

┌────────────────────────────┐
│ Mobile user presses NEXT   │
└─────────────┬──────────────┘
              ▼
┌────────────────────────────┐
│ controller.html calls:     │
│ socket.emit("next-image")  │
└─────────────┬──────────────┘
              ▼
┌────────────────────────────┐
│ firebase-bridge.js receives│
│ next-image                 │
└─────────────┬──────────────┘
              ▼
┌────────────────────────────┐
│ Firebase transaction reads │
│ currentImageIndex          │
└─────────────┬──────────────┘
              ▼
┌────────────────────────────┐
│ Add 1 to current index     │
│                            │
│ Example: 4 → 5             │
└─────────────┬──────────────┘
              ▼
┌────────────────────────────┐
│ Save new index to Firebase │
└─────────────┬──────────────┘
              ▼
┌────────────────────────────┐
│ Display receives new index │
└─────────────┬──────────────┘
              ▼
┌────────────────────────────┐
│ Poster image changes       │
│ Poster name changes        │
└────────────────────────────┘
17. Why Firebase Transaction Is Used for Image Navigation

The bridge uses a transaction for next and previous navigation:

stateRef
    .child("currentImageIndex")
    .transaction((current) => {
        current = Number(current || 0);
        return current + 1;
    });

A transaction is useful because it reads the current value and safely calculates the next value.

Without it:

Device reads index = 5
Another update happens
Device writes index = 6

There can potentially be synchronization conflicts.

With a transaction:

Firebase reads latest value
        │
        ▼
Function calculates new value
        │
        ▼
Firebase safely commits update
18. Celebration Effects — Internal Working

Your system contains four visual effects:

🎊 Party Popper
✨ Gold Shower
🎆 Fireworks
🎉 Streamers

The controller sends:

socket.emit("celebrate", effectType);

For example:

socket.emit("celebrate", "fireworks");

The complete logic is:

User selects Fireworks
         │
         ▼
Controller emits:
celebrate + fireworks
         │
         ▼
Firebase receives command
         │
         ▼
Display receives:
event = celebrate
payload = fireworks
         │
         ▼
Display checks effect type
         │
         ▼
Runs fireworks function
         │
         ▼
Creates animated particles
         │
         ▼
Animation plays
         │
         ▼
Temporary elements removed

Removing animation elements afterward is important. Otherwise, repeated celebrations could create thousands of unused HTML elements and reduce browser performance.

19. How Connection Detection Works

The bridge listens to Firebase's special connection location:

firebase
    .database()
    .ref(".info/connected")
    .on("value", (snap) => {
        // connection status
    });

Firebase automatically maintains:

.info/connected

When connected:

true

When disconnected:

false

Therefore:

Firebase .info/connected
           │
     ┌─────┴─────┐
     ▼           ▼
    true        false
     │           │
     ▼           ▼
  connect     disconnect
     │           │
     ▼           ▼
🟢 Connected  🔴 Disconnected
20. The Complete End-to-End Working of Your Project

The full project can be understood as this sequence:

1. GitHub Pages hosts all static files
                    │
                    ▼
2. Laptop opens display.html
                    │
                    ▼
3. Mobile opens controller.html
                    │
                    ▼
4. Both load Firebase SDK
                    │
                    ▼
5. Both read firebase-config.js
                    │
                    ▼
6. Both execute firebase-bridge.js
                    │
                    ▼
7. Both connect to same Firebase database
                    │
                    ▼
8. Mobile shows Connected
                    │
                    ▼
9. User presses a controller button
                    │
                    ▼
10. controller.html calls socket.emit()
                    │
                    ▼
11. firebase-bridge.js translates event
                    │
                    ▼
12. Command is written to Firebase
                    │
                    ▼
13. Laptop bridge detects database change
                    │
                    ▼
14. Corresponding event handler executes
                    │
                    ▼
15. Display updates visually
