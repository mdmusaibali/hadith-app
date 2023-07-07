import { View, Text, FlatList, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { getBooks } from "../store/thunks/general";
import { Book } from "../components";
import { BooksScreenNavigationProp } from "../navigators/types";
import { Book as BookType } from "../types/general";

interface BooksScreenProps {
  navigation: BooksScreenNavigationProp;
}

const BooksScreen = ({ navigation }: BooksScreenProps) => {
  const [loading, setLoading] = useState(true);
  const books = useAppSelector((state) => state.general.books);
  const dispatch = useAppDispatch();

  const fetchBooks = () => {
    dispatch(getBooks()).finally(() => {
      setLoading(false);
    });
  };

  const showChapters = (bookSlug: string) => {
    navigation.navigate("Chapters", { bookSlug });
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <View>
      {loading && (
        <ActivityIndicator size={"large"} style={{ marginTop: 10 }} />
      )}
      {!loading && books.length !== 0 && (
        <FlatList
          data={books}
          keyExtractor={(item: BookType) => String(item.id)} // TODO: give typings here
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={fetchBooks} />
          }
          renderItem={({ item }) => (
            <Book book={item} onBookPress={showChapters} />
          )}
        />
      )}
    </View>
  );
};

export default BooksScreen;
