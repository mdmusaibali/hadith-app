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
  sendCustomMessage,
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
      // get unsplash url
      const imgUrl = await getUnsplashImageUrl();
      // For hadith's from hadithapi.com (DEPRICATED FOR NOW)//////////////////////////////////////
      // doing this because fcm supports max payload size of 4kb and then there's imgUrl and title.
      // if (randomHadith) {
      //   if (randomHadith.length > 3500 || randomHadith.length < 85) {
      //     const newRandomHadith = await getRandomHadith();
      //     if (newRandomHadith) {
      //       console.log(newRandomHadith, imgUrl);
      //       // sendMessage(newRandomHadith, imgUrl);
      //     }
      //   } else {
      //     console.log(randomHadith, imgUrl);
      //     // sendMessage(randomHadith, imgUrl);
      //   }
      // } else {
      //   const newRandomHadith = await getRandomHadith();
      //   if (newRandomHadith) {
      //     console.log(newRandomHadith, imgUrl);
      //     // sendMessage(newRandomHadith, imgUrl);
      //   }
      // }
      ////////////////////////////////////////////////////////////////////////////////////////////
      // 3 try mechanism
      // TRY 1
      let randomHadith;
      randomHadith = await getRandomHadith();
      if (
        randomHadith &&
        randomHadith.length < 3500 &&
        randomHadith.length > 85
      ) {
        sendMessage(randomHadith, imgUrl);
        return null;
      }
      // TRY 2
      randomHadith = await getRandomHadith();
      if (
        randomHadith &&
        randomHadith.length < 3500 &&
        randomHadith.length > 85
      ) {
        sendMessage(randomHadith, imgUrl);
        return null;
      }
      // TRY 3
      randomHadith = await getRandomHadith();
      if (
        randomHadith &&
        randomHadith.length < 3500 &&
        randomHadith.length > 85
      ) {
        sendMessage(randomHadith, imgUrl);
        return null;
      }
      throw new Error(
        "Hadith did not meet criterias in 3 try. Notification failed."
      );
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
      res.send("Please send trigger key as param");
      return;
    }
    if (paramKey !== process.env.TRIGGER_KEY) {
      res.send("Invalid trigger key");
      return;
    }
    // get unsplash url
    const imgUrl = await getUnsplashImageUrl();
    // For hadith's from hadithapi.com (DEPRICATED FOR NOW)//////////////////////////////////////
    // doing this because fcm supports max payload size of 4kb and then there's imgUrl and title.
    // if (randomHadith) {
    //   if (randomHadith.length > 3500 || randomHadith.length < 85) {
    //     const newRandomHadith = await getRandomHadith();
    //     if (newRandomHadith) {
    //       console.log(newRandomHadith, imgUrl);
    //       // sendMessage(newRandomHadith, imgUrl);
    //     }
    //   } else {
    //     console.log(randomHadith, imgUrl);
    //     // sendMessage(randomHadith, imgUrl);
    //   }
    // } else {
    //   const newRandomHadith = await getRandomHadith();
    //   if (newRandomHadith) {
    //     console.log(newRandomHadith, imgUrl);
    //     // sendMessage(newRandomHadith, imgUrl);
    //   }
    // }
    ////////////////////////////////////////////////////////////////////////////////////////////
    // 3 try mechanism
    // TRY 1
    let randomHadith;
    randomHadith = await getRandomHadith();
    if (
      randomHadith &&
      randomHadith.length < 3500 &&
      randomHadith.length > 85
    ) {
      sendMessage(randomHadith, imgUrl);
      res.send("Notification sent");
      return;
    }
    // TRY 2
    randomHadith = await getRandomHadith();
    if (
      randomHadith &&
      randomHadith.length < 3500 &&
      randomHadith.length > 85
    ) {
      sendMessage(randomHadith, imgUrl);
      res.send("Notification sent");
      return;
    }
    // TRY 3
    randomHadith = await getRandomHadith();
    if (
      randomHadith &&
      randomHadith.length < 3500 &&
      randomHadith.length > 85
    ) {
      sendMessage(randomHadith, imgUrl);
      res.send("Notification sent");
      return;
    }
    throw new Error(
      "Hadith did not meet criterias in 3 try. Notification failed."
    );
  } catch (error) {
    console.log("Something went wrong", error);
    res.status(500).send(error);
    return;
  }
});

exports.sendCustomNotification = onRequest(async (req, res) => {
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

    const { imageUrl, title, body } = req.body;
    if (!imageUrl || !title || !body) {
      throw new Error("Please send imageUrl, title and body");
    }

    sendCustomMessage(title, body, imageUrl);
    res.send("Notification sent.");
    return;
  } catch (error) {
    if (error instanceof Error) res.status(500).send(error.message);
    else res.status(500).send("Something went wrong");
    return;
  }
});
