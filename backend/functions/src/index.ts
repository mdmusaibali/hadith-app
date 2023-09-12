/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v1/https";
import { pubsub, config } from "firebase-functions";
import * as admin from "firebase-admin";
import {
  getRandomHadith,
  getUnsplashImageUrl,
  sendMessage,
} from "./utils/helpers";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript
try {
  admin.initializeApp(config().firebase);
} catch (error) {
  console.log("Error initialising", error);
}

exports.sendDailyNotification = pubsub
  .schedule("0 9 * * *")
  .timeZone("Asia/Kolkata")
  .onRun(async (context) => {
    try {
      // get hadith (Hadith api)
      const randomHadith = await getRandomHadith();
      // get unsplash url
      const imgUrl = await getUnsplashImageUrl();
      // doing this because fcm supports max payload size of 4kb and then there's imgUrl and title.
      // empty string check
      if (randomHadith) {
        // payload length check
        if (randomHadith.length > 3500 || randomHadith.length < 85) {
          // if exceeds 3500 then get new hadith and send
          const newRandomHadith = await getRandomHadith();
          if (newRandomHadith) {
            sendMessage(newRandomHadith, imgUrl);
          }
        } else {
          // else send the current one
          sendMessage(randomHadith, imgUrl);
        }
      } else {
        // if empty string then get new hadith and send
        const newRandomHadith = await getRandomHadith();
        if (newRandomHadith) {
          sendMessage(newRandomHadith, imgUrl);
        }
      }
      return null;
    } catch (error) {
      console.log("Something went wrong", error);
      return null;
    }
  });

// This function is for manual testing only. Please do not misuse.
exports.sendNotification = onRequest(async (req, res) => {
  try {
    const paramKey = req.query?.key;
    if (!paramKey) {
      res.send("Please send trigger key");
      return;
    }
    if (paramKey !== process.env.TRIGGER_KEY) {
      res.send("Invalid trigger key");
      return;
    }
    // get hadith (Hadith api)
    const randomHadith = await getRandomHadith();
    // get unsplash url
    const imgUrl = await getUnsplashImageUrl();
    // doing this because fcm supports max payload size of 4kb and then there's imgUrl and title.
    if (randomHadith) {
      if (randomHadith.length > 3500 || randomHadith.length < 85) {
        const newRandomHadith = await getRandomHadith();
        if (newRandomHadith) {
          sendMessage(newRandomHadith, imgUrl);
        }
      } else {
        sendMessage(randomHadith, imgUrl);
      }
    } else {
      const newRandomHadith = await getRandomHadith();
      if (newRandomHadith) {
        sendMessage(newRandomHadith, imgUrl);
      }
    }
    res.send("Notification sent");
    return;
  } catch (error) {
    console.log("Something went wrong", error);
    res.status(500).send(error);
    return;
  }
});
