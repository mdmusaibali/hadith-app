import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { DailyHadithScreenRouteProp } from "../navigators/types";

interface DailyHadithScreenProps {
  route: DailyHadithScreenRouteProp;
}

const DailyHadith = ({ route }: DailyHadithScreenProps) => {
  const hadith = route.params.hadith;
  const imgUrl = route.params.imgUrl;
  return (
    <View>
      <Text>{hadith}</Text>
      <Text>{imgUrl}</Text>
    </View>
  );
};

export default DailyHadith;
