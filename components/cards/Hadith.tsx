import React, { useState } from "react";
import { Card, List, Text as PaperText } from "react-native-paper";
import { Hadith as HadithType } from "./../../types/general";
import { StyleSheet, TouchableOpacity, useColorScheme } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";

interface HadithProps {
  hadith: HadithType;
}
const Hadith = ({ hadith }: HadithProps) => {
  const [expanded, setExpanded] = useState({
    arabic: false,
    urdu: false,
  });
  const isDarkMode = useColorScheme() === "dark";
  const theme = useTheme();

  const handleExpand = (id: string) => {
    setExpanded((prevValues) => ({
      ...prevValues,
      [id]: !prevValues[id as keyof typeof expanded],
    }));
  };

  return (
    <Card style={styles.hadith}>
      <PaperText style={styles.hadithId}>{hadith.id}</PaperText>
      <Card.Content>
        <List.Section>
          <TouchableOpacity
            style={styles.accordionControl}
            onPress={handleExpand.bind(null, "arabic")}
          >
            <PaperText
              style={[styles.accordionTitle, { color: theme.colors.primary }]}
            >
              Arabic
            </PaperText>
            <Feather
              name={expanded.arabic ? "chevron-up" : "chevron-down"}
              color={isDarkMode ? "white" : "black"}
            />
          </TouchableOpacity>
          {expanded.arabic && (
            <PaperText variant="headlineMedium" style={styles.hadithArabic}>
              {hadith.hadithArabic}
            </PaperText>
          )}
          <PaperText variant="bodyMedium">{hadith.englishNarrator}</PaperText>
          <PaperText variant="bodyLarge">{hadith.hadithEnglish}</PaperText>

          <TouchableOpacity
            style={styles.accordionControl}
            onPress={handleExpand.bind(null, "urdu")}
          >
            <PaperText
              style={[styles.accordionTitle, { color: theme.colors.primary }]}
            >
              Urdu
            </PaperText>
            <Feather
              name={expanded.urdu ? "chevron-up" : "chevron-down"}
              color={isDarkMode ? "white" : "black"}
            />
          </TouchableOpacity>
          {expanded.urdu && (
            <PaperText variant="headlineSmall" style={styles.hadithUrdu}>
              {hadith.hadithUrdu}
            </PaperText>
          )}

          <PaperText style={{ opacity: 0.5 }}>
            {hadith.book.bookName}, {hadith.book.writerName}, Vol.{hadith.volume}, Chapter {hadith.chapter.chapterNumber}
          </PaperText>
        </List.Section>
      </Card.Content>
    </Card>
  );
};

export default Hadith;

const styles = StyleSheet.create({
  hadithArabic: { textAlign: "right", marginVertical: 16 },
  hadithEnglish: { marginVertical: 16 },
  hadithUrdu: { textAlign: "right", marginVertical: 16 },
  hadithId: { padding: 12, fontSize: 22, fontWeight: "900" },
  hadith: { width: "92%", alignSelf: "center", marginVertical: 8 },
  accordionControl: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 3,
  },
  accordionTitle: {
    fontWeight: "700",
  },
});
