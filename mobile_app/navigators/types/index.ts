import type { StackNavigationProp } from "@react-navigation/stack";
import type { RouteProp } from "@react-navigation/native";

export type RootStackParamList = {
  Books: undefined;
  Chapters: { bookSlug: string };
  Hadiths: { bookSlug: string; chapterEnglish: string; chapterNumber: string };
};

export type BooksScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Books"
>;
export type ChaptersScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Chapters"
>;
export type HadithsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Hadiths"
>;

export type ChaptersScreenRouteProp = RouteProp<RootStackParamList, "Chapters">;
export type HadithsScreenRouteProp = RouteProp<RootStackParamList, "Hadiths">;
