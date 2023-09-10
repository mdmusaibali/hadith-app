import React, { memo } from "react";
import { Card, Avatar } from "react-native-paper";
import { Book as BookType } from "../../types/general";

interface BookProps {
  book: BookType;
  onBookPress: (bookSlug: string) => void;
}

const getLabel = (title: string) => {
  const words = title.split(" ");

  let initials = "";

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    if (word.length > 0) {
      initials += word.charAt(0).toUpperCase();
      if (initials.length === 2) {
        break;
      }
    }
  }

  return initials;
};

const Book: React.FC<BookProps> = ({ book, onBookPress }) => {
  const onCardPress = () => {
    onBookPress(book.bookSlug);
  };

  return (
    <Card
      style={{ width: "92%", alignSelf: "center", marginVertical: 8 }}
      onPress={onCardPress}
    >
      <Card.Title
        title={book.bookName}
        subtitle={book.writerName}
        left={(props) => (
          <Avatar.Text {...props} label={getLabel(book.bookName)} />
        )}
      />
    </Card>
  );
};

export default memo(Book);
