import { View, Text, FlatList, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import {
  ChaptersScreenNavigationProp,
  ChaptersScreenRouteProp,
} from "../navigators/types";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { getChapters } from "../store/thunks/general";
import { ActivityIndicator, TextInput } from "react-native-paper";
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
  const [filteredChapters, setFilteredChapters] = useState(chapters);

  useEffect(() => {
    setFilteredChapters(chapters);
  }, [chapters]);

  const [searchQuery, setSearchQuery] = React.useState("");

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    const newfilteredChapters = chapters.filter(
      (chapter) =>
        chapter.chapterNumber
          .toLowerCase()
          .trim()
          .startsWith(query.toLowerCase().trim()) ||
        chapter.chapterEnglish
          .toLowerCase()
          .trim()
          .startsWith(query.toLowerCase().trim())
    );
    setFilteredChapters(newfilteredChapters);
  };

  const fetchChapters = () => {
    dispatch(getChapters({ bookSlug })).then(() => {
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
          data={filteredChapters}
          keyExtractor={(item: ChapterType) => String(item.id)}
          ListHeaderComponent={
            <TextInput
              label="Search"
              value={searchQuery}
              onChangeText={onChangeSearch}
              mode="outlined"
              style={{ width: "92%", alignSelf: "center", marginVertical: 8 }}
            />
          }
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
