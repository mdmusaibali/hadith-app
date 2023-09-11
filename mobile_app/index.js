import { registerRootComponent } from "expo";
import messaging from "@react-native-firebase/messaging";
import App from "./App";
// import notifee, { AndroidStyle } from "@notifee/react-native";

// Register background handler
try {
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    // const hadith = remoteMessage.data?.hadith;
    // const image = remoteMessage.data?.image;
    // const channelId = await notifee.createChannel({
    //   id: "default",
    //   name: "Default Channel",
    // });
    //   notifee.displayNotification({
    //     title: "Daily Hadith",
    //     body: "Your daily hadith from Hadith Pro",
    //     android: {
    //       channelId,
    //       style: {
    //         type: AndroidStyle.BIGTEXT,
    //         text: hadith,
    //       },
    //     },
    //   });
    // notifee.displayNotification({
    //   title: "Daily hadith from Hadith Pro",
    //   body: hadith,
    //   android: {
    //     channelId,
    //     style: {
    //       type: AndroidStyle.BIGPICTURE,
    //       picture: image,
    //     },
    //   },
    // });
    console.log("Notification recieved");
  });
} catch (error) {
  console.log("Error: setBackgroundMessageHandler");
}

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
