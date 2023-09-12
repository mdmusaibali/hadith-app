import {
  ImageBackground,
  ScrollView,
  Text,
  Share,
  ToastAndroid,
} from "react-native";
import { useRef, useState } from "react";
import { FAB, Portal } from "react-native-paper";
import { DailyHadithScreenRouteProp } from "../navigators/types";
import ViewShot from "react-native-view-shot";
// import * as Sharing from "expo-sharing";
import Sharing from "react-native-share";

interface DailyHadithScreenProps {
  route: DailyHadithScreenRouteProp;
}

const hadithProMessage =
  "Download Hadith pro now and get daily hadiths: https://play.google.com/store/apps/details?id=com.hadith.musaib";

const DailyHadith = ({ route }: DailyHadithScreenProps) => {
  const hadith = route.params.hadith;
  const imgUrl = route.params.imgUrl;
  const [state, setState] = useState({ open: false });
  const viewShot = useRef<any>(null);

  const onStateChange = ({ open }: { open: boolean }) => setState({ open });

  const onShareAsText = () => {
    Share.share({ message: hadith + "\n\n\n" + hadithProMessage });
  };

  const onShareAsImage = async () => {
    try {
      const uri = await viewShot.current?.capture();
      const shareOptions = {
        title: "Share via",
        message: hadithProMessage,
        url: "file://" + uri,
        filename: "hadith", // only for base64 file in Android
      };
      Sharing.open(shareOptions);
    } catch (error) {
      ToastAndroid.show("Something went wrong", ToastAndroid.SHORT);
      console.log(error);
    }
  };

  const { open } = state;
  return (
    <ViewShot options={{ format: "jpg", quality: 0.9 }} ref={viewShot}>
      <ImageBackground source={{ uri: imgUrl }}>
        <ScrollView
          style={{
            minHeight: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
          }}
          contentContainerStyle={{
            minHeight: "100%",
            justifyContent: "center",
            alignItems: "center",
            padding: 15,
          }}
        >
          <Text
            style={{
              color: "white",
              textAlign: "left",
              fontSize: 18,
              letterSpacing: 1,
              lineHeight: 28,
            }}
          >
            {hadith}
          </Text>
        </ScrollView>
        <Portal>
          <FAB.Group
            open={open}
            visible
            icon={open ? "close" : "share-variant"}
            actions={[
              {
                icon: "format-text-variant",
                label: "Share as text",
                onPress: onShareAsText,
              },
              {
                icon: "image-area",
                label: "Share as image",
                onPress: onShareAsImage,
              },
            ]}
            onStateChange={onStateChange}
            onPress={() => {
              if (open) {
                // do something if the speed dial is open
              }
            }}
          />
        </Portal>
      </ImageBackground>
    </ViewShot>
  );
};

export default DailyHadith;
