import { View, FlatList, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, TextInput } from "react-native-paper";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { getBooks } from "../store/thunks/general";
import { Book } from "../components";
import { BooksScreenNavigationProp } from "../navigators/types";
import { Book as BookType } from "../types/general";
import messaging, {
  FirebaseMessagingTypes,
} from "@react-native-firebase/messaging";

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

  // For testing only
  // const hadithT="(the mother of the faithful believers) The commencement of the Divine Inspiration to Allah's Messenger (ﷺ) was in the form of good dreams which came true like bright daylight, and then the love of seclusion was bestowed upon him. He used to go in seclusion in the cave of Hira where he used to worship (Allah alone) continuously for many days before his desire to see his family. He used to take with him the journey food for the stay and then come back to (his wife) Khadija to take his food likewise again till suddenly the Truth descended upon him while he was in the cave of Hira. The angel came to him and asked him to read. The Prophet (ﷺ) replied, \"I do not know how to read.\" The Prophet (ﷺ) added, \"The angel caught me (forcefully) and pressed me so hard that I could not bear it any more. He then released me and again asked me to read and I replied, 'I do not know how to read.' Thereupon he caught me again and pressed me a second time till I could not bear it any more. He then released me and again asked me to read but again I replied, 'I do not know how to read (or what shall I read)?' Thereupon he caught me for the third time and pressed me, and then released me and said, 'Read in the name of your Lord, who has created (all that exists), created man from a clot. Read! And your Lord is the Most Generous.\" (96.1, 96.2, 96.3) Then Allah's Messenger (ﷺ) returned with the Inspiration and with his heart beating severely. Then he went to Khadija bint Khuwailid and said, \"Cover me! Cover me!\" They covered him till his fear was over and after that he told her everything that had happened and said, \"I fear that something may happen to me.\" Khadija replied, \"Never! By Allah, Allah will never disgrace you. You keep good relations with your kith and kin, help the poor and the destitute, serve your guests generously and assist the deserving calamity-afflicted ones.\" Khadija then accompanied him to her cousin Waraqa bin Naufal bin Asad bin 'Abdul 'Uzza, who, during the pre-Islamic Period became a Christian and used to write the writing with Hebrew letters. He would write from the Gospel in Hebrew as much as Allah wished him to write. He was an old man and had lost his eyesight. Khadija said to Waraqa, \"Listen to the story of your nephew, O my cousin!\" Waraqa asked, \"O my nephew! What have you seen?\" Allah's Messenger (ﷺ) described whatever he had seen. Waraqa said, \"This is the same one who keeps the secrets (angel Gabriel) whom Allah had sent to Moses. I wish I were young and could live up to the time when your people would turn you out.\" Allah's Messenger (ﷺ) asked, \"Will they drive me out?\" Waraqa replied in the affirmative and said, \"Anyone (man) who came with something similar to what you have brought was treated with hostility; and if I should remain alive till the day when you will be turned out then I would support you strongly.\" But after a few days Waraqa died and the Divine Inspiration was also paused for a while."
  // const imgUrlT="https://images.unsplash.com/photo-1693165074594-774461bc1564?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"
  // navigation.navigate("Daily", { hadith:hadithT, imgUrl:imgUrlT });

  const handleNotification = (
    notification: FirebaseMessagingTypes.RemoteMessage
  ) => {
    if (notification.notification) {
      const hadith = notification.notification.body;
      const imgUrl = notification.notification.android?.imageUrl;
      if (hadith && imgUrl) {
        navigation.navigate("Daily", { hadith, imgUrl });
      }
      console.log("getInitialNotification: hadith", hadith);
      console.log("getInitialNotification: imgUrl", imgUrl);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        // trigerred when app is opened by clicking on notification when app is in killed state
        const notification = await messaging().getInitialNotification();
        if (notification) handleNotification(notification);
      } catch (error) {
        console.log("Error: getInitialNotification");
      }
    })();
    // trigerred when app is opened by clicking on notification when app is in background state
    const unsubscribeNotiOpen = messaging().onNotificationOpenedApp(
      (notification) => {
        if (notification) handleNotification(notification);
      }
    );
    return unsubscribeNotiOpen;
  }, []);

  useEffect(() => {
    const unsubscribeOnMessage = messaging().onMessage((notification) => {
      if (notification) handleNotification(notification);
    });
    return unsubscribeOnMessage;
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
    dispatch(getBooks()).then(() => {
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
