import React, { memo } from "react";
import { Card, Avatar } from "react-native-paper";
import { Chapter as ChapterType } from "../../types/general";

interface ChapterProps {
  chapter: ChapterType;
  onChapterPress: (
    bookSlug: string,
    chapterEnglish: string,
    chapterNumber: string
  ) => void;
}

const Chapter: React.FC<ChapterProps> = ({ chapter, onChapterPress }) => {
  const onCardPress = () => {
    onChapterPress(
      chapter.bookSlug,
      chapter.chapterEnglish,
      chapter.chapterNumber
    );
  };

  return (
    <Card
      style={{ width: "92%", alignSelf: "center", marginVertical: 8 }}
      onPress={onCardPress}
    >
      <Card.Title
        title={chapter.chapterEnglish}
        subtitle={chapter.chapterUrdu}
        left={(props) => (
          <Avatar.Text {...props} label={chapter.chapterNumber} />
        )}
      />
    </Card>
  );
};

export default memo(Chapter);
