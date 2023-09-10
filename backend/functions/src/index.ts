/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from "firebase-functions/v1/https";
import { pubsub } from "firebase-functions";
import axios from "axios";
import { messaging } from "firebase-admin";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

exports.sendDailyNotification = pubsub
  .schedule("*/30 * * * *")
  .timeZone("Asia/Kolkata")
  .onRun(async (context) => {
    try {
      // Fetch data from your API
      const apiResponse = await axios.get(
        "https://api.sunnah.com/v1/hadiths/random",
        {
          headers: {
            "X-API-Key": process.env.HADITH_API_KEY,
          },
        }
      );
      const notificationData = apiResponse.data;
      console.log(notificationData);

      // TODO: Send notification using FCM
      //   const message = {
      //     data: {
      //       // Include data from the API in the notification
      //       key1: notificationData.someKey,
      //       key2: notificationData.anotherKey,
      //     },
      //     notification: {
      //       title: "Daily Notification",
      //       body: "Your notification body goes here",
      //     },
      //     // Add tokens or topic to target specific devices or a group of devices
      //     tokens: ["", ""],
      //     condition: "",
      //   };

      return null;
    } catch (error) {
      console.error("Error sending notification:", error);
      return null;
    }
  });

exports.sendNotification = onRequest(async (req, res) => {
  try {
    const apiResponse = await axios.get(
      "https://api.sunnah.com/v1/hadiths/random",
      {
        headers: {
          "X-API-Key": process.env.HADITH_API_KEY,
        },
      }
    );
    const notificationData = apiResponse.data;
    const hadith = notificationData?.hadith[0].body;

    messaging().sendToTopic("all", {
      data: apiResponse.data,
      notification: {
        title: "Your daily hadith from Hadith Pro",
        body: hadith,
      },
    });
  } catch (error) {
    console.log("Something went wrong", error);
    res.status(500).send(error);
  }
});
