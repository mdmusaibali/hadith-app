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
import axios from "axios";
import { messaging } from "firebase-admin";
import * as admin from "firebase-admin";

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
      // get hadith
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

      //get random unsplash image
      const unsplashResponse = await axios.get(
        `https://api.unsplash.com/photos/random/?client_id=${process.env.UNSPLASH_ACCESS_KEY}&query=nature&orientation=landscape`
      );
      const unsplashData = unsplashResponse.data;
      const imgUrl = unsplashData?.urls?.small;

      messaging().sendToTopic("hadith", {
        data: {
          hadith,
          image: imgUrl,
        },
      });
      return null;
    } catch (error) {
      console.log("Something went wrong", error);
      return null;
    }
  });

exports.sendNotification = onRequest(async (req, res) => {
  try {
    // get hadith
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

    //get random unsplash image
    const unsplashResponse = await axios.get(
      `https://api.unsplash.com/photos/random/?client_id=${process.env.UNSPLASH_ACCESS_KEY}&query=nature&orientation=landscape`
    );
    const unsplashData = unsplashResponse.data;
    const imgUrl = unsplashData?.urls?.small;

    messaging().sendToTopic("hadith", {
      data: {
        hadith,
        image: imgUrl,
      },
    });
    res.send("Notification sent");
  } catch (error) {
    console.log("Something went wrong", error);
    res.status(500).send(error);
  }
});
