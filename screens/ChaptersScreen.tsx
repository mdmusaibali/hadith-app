import { View, Text, FlatList, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import {
  ChaptersScreenNavigationProp,
  ChaptersScreenRouteProp,
} from "../navigators/types";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { getChapters } from "../store/thunks/general";
import { ActivityIndicator } from "react-native-paper";
import { Chapter } from "../components";
import { Chapter as ChapterType } from "../types/general";

interface ChaptersScreenProps {
  route: ChaptersScreenRouteProp;
  navigation: ChaptersScreenNavigationProp;
}

const ChaptersScreen = ({ route, navigation }: ChaptersScreenProps) => {
  const bookSlug = route.params.bookSlug;
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const chapters = useAppSelector((state) => state.general.chapters);

  const fetchChapters = () => {
    dispatch(getChapters({ bookSlug })).finally(() => {
      setLoading(false);
    });
  };

  const showHadiths = (
    bookSlug: string,
    chapterEnglish: string,
    chapterNumber: string
  ) => {
    navigation.navigate("Hadiths", { bookSlug, chapterEnglish, chapterNumber });
  };

  useEffect(() => {
    fetchChapters();
  }, []);

  return (
    <View>
      {loading && (
        <ActivityIndicator size={"large"} style={{ marginTop: 10 }} />
      )}
      {!loading && chapters.length !== 0 && (
        <FlatList
          data={chapters}
          keyExtractor={(item: ChapterType) => String(item.id)} // TODO: give typings here
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchChapters} />
          }
          renderItem={({ item }) => (
            <Chapter chapter={item} onChapterPress={showHadiths} />
          )}
        />
      )}
    </View>
  );
};

export default ChaptersScreen;
