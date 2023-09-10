import React, { memo, useEffect, useState } from "react";
import { Card, List, Text as PaperText } from "react-native-paper";
import { Hadith as HadithType } from "./../../types/general";
import {
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "react-native-paper";
import * as Speech from "expo-speech";

interface HadithProps {
  hadith: HadithType;
}
const Hadith = ({ hadith }: HadithProps) => {
  const [expanded, setExpanded] = useState({
    arabic: false,
    urdu: false,
  });
  const theme = useTheme();
  const [isSpeakingEnglish, setIsSpeakingEnglish] = useState(false);
  const [isSpeakingUrdu, setIsSpeakingUrdu] = useState(false);

  const handleExpand = (id: string) => {
    setExpanded((prevValues) => ({
      ...prevValues,
      [id]: !prevValues[id as keyof typeof expanded],
    }));
  };

  useEffect(() => {
    if (!hadith.hadithEnglish && hadith.hadithUrdu) {
      setExpanded((prev) => ({ ...prev, urdu: true }));
    }
  }, []);

  const onSpeakStop = (language: "en" | "ur") => {
    language === "en" ? setIsSpeakingEnglish(false) : setIsSpeakingUrdu(false);
  };

  const stopSpeech = async () => {
    await Speech.stop();
  };

  const speak = async (
    content: string,
    language: "en" | "ur",
    voice: string
  ) => {
    await stopSpeech();
    Speech.speak(content, {
      language: language,
      voice: voice,
      onStopped: onSpeakStop.bind(null, language),
      onDone: onSpeakStop.bind(null, language),
    });
    language === "en" ? setIsSpeakingEnglish(true) : setIsSpeakingUrdu(true);
  };

  return (
    <Card style={styles.hadith}>
      <PaperText style={styles.hadithId}>{hadith.hadithNumber}</PaperText>
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
              color={theme.colors.onSurface}
            />
          </TouchableOpacity>
          {expanded.arabic && (
            <PaperText variant="headlineMedium" style={styles.hadithArabic}>
              {hadith.hadithArabic}
            </PaperText>
          )}
          <PaperText variant="bodyMedium">{hadith.englishNarrator}</PaperText>
          {hadith.hadithEnglish && (
            <>
              <PaperText variant="bodyLarge">{hadith.hadithEnglish}</PaperText>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 8,
                }}
              >
                <Feather
                  name={isSpeakingEnglish ? "volume-x" : "volume-2"}
                  size={24}
                  onPress={() => {
                    if (!isSpeakingEnglish)
                      speak(hadith.hadithEnglish, "en", "en-us-x-tpd-network");
                    else stopSpeech();
                  }}
                  disabled={hadith.hadithEnglish.length > 4000}
                  style={{
                    marginRight: 8,
                    alignSelf: "flex-start",
                    opacity: hadith.hadithEnglish.length > 4000 ? 0.3 : 1,
                  }}
                  color={theme.colors.onSurface}
                />
                {hadith.hadithEnglish.length > 4000 && (
                  <PaperText style={{ opacity: 0.3 }}>
                    Too long to speak, sorry.
                  </PaperText>
                )}
              </View>
            </>
          )}
          {!hadith.hadithEnglish && (
            <PaperText variant="bodyLarge">
              Sorry, english version unavailable.
            </PaperText>
          )}

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
              color={theme.colors.onSurface}
            />
          </TouchableOpacity>

          {expanded.urdu && (
            <>
              <PaperText variant="headlineSmall" style={styles.hadithUrdu}>
                {hadith.hadithUrdu}
              </PaperText>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginVertical: 8,
                }}
              >
                <Feather
                  name={isSpeakingUrdu ? "volume-x" : "volume-2"}
                  size={24}
                  onPress={() => {
                    if (!isSpeakingUrdu)
                      speak(hadith.hadithUrdu, "ur", "ur-pk-x-urm-network");
                    else stopSpeech();
                  }}
                  disabled={hadith.hadithUrdu.length > 4000}
                  style={{
                    marginRight: 8,
                    opacity: hadith.hadithUrdu.length > 4000 ? 0.3 : 1,
                  }}
                  color={theme.colors.onSurface}
                />
                {hadith.hadithUrdu.length > 4000 && (
                  <PaperText style={{ opacity: 0.3 }}>
                    Too long to speak, sorry.
                  </PaperText>
                )}
              </View>
            </>
          )}

          <PaperText style={{ opacity: 0.5 }}>
            {hadith.book.bookName}, {hadith.book.writerName}, Vol.
            {hadith.volume}, Chapter {hadith.chapter.chapterNumber}
          </PaperText>
        </List.Section>
      </Card.Content>
    </Card>
  );
};

export default memo(Hadith);

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
    marginBottom: 8,
    alignSelf: "flex-end",
  },
  accordionTitle: {
    fontWeight: "700",
  },
});
