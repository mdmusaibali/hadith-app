import { View, FlatList, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, TextInput } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { getBooks } from "../store/thunks/general";
import { Book } from "../components";
import { BooksScreenNavigationProp } from "../navigators/types";
import { Book as BookType } from "../types/general";
import messaging from "@react-native-firebase/messaging";

interface BooksScreenProps {
  navigation: BooksScreenNavigationProp;
}

const BooksScreen = ({ navigation }: BooksScreenProps) => {
  const [loading, setLoading] = useState(true);
  const books = useAppSelector((state) => state.general.books);
  const [filteredBooks, setFilteredBooks] = useState(books);
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = React.useState("");

  useEffect(() => {
    setFilteredBooks(books);
  }, [books]);

  useEffect(() => {
    (async () => {
      try {
        // trigerred when app is opened by clicking on notification when app is in killed state
        const notification = await messaging().getInitialNotification();
        if (notification && notification.notification) {
          const hadith = notification.notification.body;
          const imgUrl = notification.notification.android?.imageUrl;
          if (hadith && imgUrl) {
            navigation.navigate("Daily", { hadith, imgUrl });
          }
          console.log("getInitialNotification: hadith", hadith);
          console.log("getInitialNotification: imgUrl", imgUrl);
        }
      } catch (error) {
        console.log("Error: getInitialNotification");
      }
    })();
    // trigerred when app is opened by clicking on notification when app is in background state
    const unsubscribe = messaging().onNotificationOpenedApp((notification) => {
      if (notification && notification.notification) {
        const hadith = notification.notification.body;
        const imgUrl = notification.notification.android?.imageUrl;
        if (hadith && imgUrl) {
          navigation.navigate("Daily", { hadith, imgUrl });
        }
        console.log("onNotificationOpenedApp: hadith", hadith);
        console.log("onNotificationOpenedApp: imgUrl", imgUrl);
      }
    });

    return unsubscribe;
  }, []);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    const newFilteredBooks = books.filter(
      (book) =>
        book.bookName
          .toLowerCase()
          .trim()
          .startsWith(query.toLowerCase().trim()) ||
        book.writerName
          .toLowerCase()
          .trim()
          .startsWith(query.toLowerCase().trim())
    );
    setFilteredBooks(newFilteredBooks);
  };

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
        <>
          <FlatList
            data={filteredBooks}
            keyExtractor={(item: BookType) => String(item.id)}
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
              <RefreshControl refreshing={loading} onRefresh={fetchBooks} />
            }
            renderItem={({ item }) => (
              <Book book={item} onBookPress={showChapters} />
            )}
          />
        </>
      )}
    </View>
  );
};

export default BooksScreen;
