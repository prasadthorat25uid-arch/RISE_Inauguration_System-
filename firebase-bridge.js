/* 
  RISE Inauguration Firebase Bridge
  Provides a Socket.IO-compatible interface using Firebase Realtime Database.
*/

(function () {
  const cfg = window.FIREBASE_CONFIG || {};

  if (!cfg.apiKey || !cfg.databaseURL || !cfg.projectId) {
    console.error("Firebase configuration is missing or incomplete.");
    return;
  }

  try {
    if (!firebase.apps.length) {
      firebase.initializeApp(cfg);
    }
  } catch (error) {
    console.error("Firebase initialization failed:", error);
    return;
  }

  const db = firebase.database();

  const clientId =
    "client_" +
    Math.random().toString(36).slice(2) +
    "_" +
    Date.now();

  const commandRef = db.ref("smartCurtain/command");
  const stateRef = db.ref("smartCurtain/state");

  function io() {
    const handlers = {};
    let lastCommandId = null;
    let initialized = false;

    const socket = {
      id: clientId,

      on(event, callback) {
        if (!handlers[event]) {
          handlers[event] = [];
        }

        handlers[event].push(callback);

        // Listen for curtain state
        if (event === "curtain-state") {
          stateRef.child("curtainState").on("value", (snap) => {
            if (snap.exists()) {
              callback(snap.val());
            }
          });
        }

        // Listen for current image
        if (event === "show-image") {
          stateRef.child("currentImageIndex").on("value", (snap) => {
            if (snap.exists()) {
              callback(Number(snap.val()));
            }
          });
        }

        return socket;
      },

      emit(event, payload) {
        const updates = {};

        if (event === "open-curtain") {
          updates.curtainState = "open";
        }

        if (event === "close-curtain") {
          updates.curtainState = "closed";
        }

        if (event === "show-image") {
          updates.currentImageIndex = Number(payload);
        }

        if (Object.keys(updates).length > 0) {
          stateRef.update(updates);
        }

        if (event === "next-image" || event === "prev-image") {
          stateRef
            .child("currentImageIndex")
            .transaction((current) => {
              current = Number(current || 0);

              if (event === "next-image") {
                return current + 1;
              }

              return current - 1;
            });
        }

        return commandRef.set({
          id:
            clientId +
            "_" +
            Date.now() +
            "_" +
            Math.random().toString(36).slice(2),

          event: event,

          payload: payload === undefined ? null : payload,

          sender: clientId,

          timestamp: firebase.database.ServerValue.TIMESTAMP
        });
      }
    };

    function fire(event, payload) {
      const callbacks = handlers[event] || [];

      callbacks.forEach((callback) => {
        try {
          callback(payload);
        } catch (error) {
          console.error(
            "Error while handling event:",
            event,
            error
          );
        }
      });
    }

    // Detect Firebase connection status
    firebase
      .database()
      .ref(".info/connected")
      .on("value", (snap) => {
        if (snap.val() === true) {
          console.log("🔥 Firebase connected");
          fire("connect");
        } else {
          console.log("⚠️ Firebase disconnected");
          fire("disconnect");
        }
      });

    // Listen for commands from other devices
    commandRef.on("value", (snap) => {
      const cmd = snap.val();

      if (!cmd || !cmd.id) {
        return;
      }

      // Ignore existing command when page first loads
      if (!initialized) {
        initialized = true;
        lastCommandId = cmd.id;
        return;
      }

      // Ignore duplicate commands
      if (cmd.id === lastCommandId) {
        return;
      }

      // Ignore commands sent by this same device
      if (cmd.sender === clientId) {
        return;
      }

      lastCommandId = cmd.id;

      fire(cmd.event, cmd.payload);
    });

    return socket;
  }

  window.io = io;

  console.log("✅ RISE Inauguration Firebase Bridge loaded successfully");
})();
