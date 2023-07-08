import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  HadithsScreenNavigationProp,
  HadithsScreenRouteProp,
} from "../navigators/types";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { getHadiths } from "../store/thunks/general";
import {
  ActivityIndicator,
  Avatar,
  Text as PaperText,
} from "react-native-paper";
import { Hadith as HadithType } from "../types/general";
import { Hadith } from "../components";
import { generalActions } from "../store/slice/general";

interface HadithsScreenProps {
  route: HadithsScreenRouteProp;
  navigation: HadithsScreenNavigationProp;
}
const HadithsScreen = ({ route, navigation }: HadithsScreenProps) => {
  const { bookSlug, chapterEnglish, chapterNumber } = route.params;
  const dispatch = useAppDispatch();
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(true);
  const hadiths = useAppSelector((state) => state.general.hadiths);
  const isNextPageOfHadithsAvailable = useAppSelector(
    (state) => state.general.isNextPageOfHadithsAvailable
  );
  navigation.setOptions({ title: chapterEnglish });

  const loadHadiths = (emptyPrevious?: Boolean) => {
    if (emptyPrevious) {
      dispatch(generalActions.emptyHadiths());
      if (pageNumber !== 1) setPageNumber(1);
      fetchHadiths(1);
    } else {
      setPageNumber((prevValue) => prevValue + 1);
      if (isNextPageOfHadithsAvailable) {
        console.log("Loaded more");
        fetchHadiths(pageNumber + 1);
      } else {
        console.log("Limit reached");
      }
    }
  };

  const fetchHadiths = (pageNumber: number) => {
    setLoading(true);
    dispatch(
      getHadiths({ bookSlug, chapterNumber, pageNumber: String(pageNumber) })
    ).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    loadHadiths(true);
  }, []);

  return (
    <View style={{ flex: 1 }}>
      {loading && hadiths.length === 0 && (
        <ActivityIndicator size={"large"} style={{ marginTop: 10 }} />
      )}
      {hadiths.length !== 0 && (
        <FlatList
          data={hadiths}
          keyExtractor={(item: HadithType) => String(item.id)} // TODO: give typings here
          refreshControl={
            <RefreshControl
              refreshing={loading && hadiths.length === 0}
              onRefresh={loadHadiths.bind(null, true)}
            />
          }
          ListFooterComponent={
            loading && hadiths.length !== 0 ? (
              <ActivityIndicator
                size={"small"}
                style={{ marginVertical: 16 }}
              />
            ) : (
              <View></View>
            )
          }
          onEndReachedThreshold={0.4}
          onEndReached={loadHadiths.bind(null, false)}
          renderItem={({ item }) => <Hadith hadith={item} />}
        />
      )}
      {!loading && hadiths.length === 0 && (
        <ScrollView
          contentContainerStyle={styles.empty}
          refreshControl={
            <RefreshControl
              refreshing={loading && hadiths.length === 0}
              onRefresh={loadHadiths.bind(null, true)}
            />
          }
        >
          <Avatar.Icon
            icon={"note-off-outline"}
            size={100}
            style={{ marginBottom: 16 }}
          ></Avatar.Icon>
          <PaperText variant="headlineMedium" style={{ marginBottom: 6 }}>
            It's not you. It's us.
          </PaperText>
          <PaperText variant="titleSmall">
            We were not able to find hadith's from this chapter
          </PaperText>
        </ScrollView>
      )}
    </View>
  );
};

export default HadithsScreen;

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
