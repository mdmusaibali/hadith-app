import { messaging } from "firebase-admin";
import axios from "axios";

export function pickRandomItem(array: any[]) {
  const length = array.length;
  const randomIndex = Math.floor(Math.random() * length);
  return array[randomIndex];
}

// For hadith's from hadithapi.com (DEPRICATED FOR NOW) //////////////////////////////////////////////////////////////////
// const bookSlugs: string[] = [
//   "sahih-bukhari",
//   "sahih-muslim",
//   "al-tirmidhi",
//   "abu-dawood",
//   "ibn-e-majah",
// ];

// const MAX_CHAP = 39;

// function getRandomNumber(upper_bound: number) {
//   const randomNumber = Math.random();
//   const generatedNumber = Math.floor(randomNumber * upper_bound) + 1;
//   return generatedNumber;
// }

// export const randomHadithUrl = () => {
//   const bookSlug = pickRandomItem(bookSlugs);
//   const chapterNumber = getRandomNumber(MAX_CHAP);
//   const url = `https://hadithapi.com/api/hadiths/?apiKey=${process.env.HADITH_API_KEY}&book=${bookSlug}&chapter=${chapterNumber}`;
//   return url;
// };

// export const getRandomHadith = async () => {
//   const randomUrl = randomHadithUrl();
//   const apiResponse = await axios.get(randomUrl);
//   const responseData = apiResponse.data;
//   const hadithData = responseData?.hadiths?.data;
//   if (hadithData && Array.isArray(hadithData)) {
//     const randomHadithObj = pickRandomItem(hadithData);
//     const englishNarrator = randomHadithObj?.englishNarrator;
//     const hadithEnglish = randomHadithObj?.hadithEnglish;
//     const volume = randomHadithObj?.volume;
//     const hadithNumber = randomHadithObj?.hadithNumber;
//     const bookName = randomHadithObj?.book?.bookName;
//     let randomHadithString: string;
//     if (englishNarrator) {
//       randomHadithString = englishNarrator + " " + hadithEnglish;
//     } else {
//       randomHadithString = hadithEnglish;
//     }
//     return (
//       randomHadithString.trim() +
//       `\n\n(${bookName || ""} vol.${volume || ""} #${hadithNumber || ""})`
//     );
//   }
//   return null;
// };
////////////////////////////////////////////////////////////////////////////////////
const bookSlugs: string[] = [
  "bukhari",
  "muslim",
  "tirmidhi",
  "abudawud",
  "ibnmajah",
];
export const getRandomHadith = async () => {
  const bookSlug = pickRandomItem(bookSlugs);
  const response = await axios.get(
    `https://random-hadith-generator.vercel.app/${bookSlug}/`
  );
  const data = response.data;
  const randomHadithObj = data?.data;
  const randomHadithString: string | null = randomHadithObj?.hadith_english;
  const randomHadithChapter = randomHadithObj?.chapterName;
  const randomHadithRef = randomHadithObj?.refno;
  if (randomHadithString) {
    return (
      `${randomHadithChapter.trim() || ""}` +
      `\n\n${randomHadithString.trim() || ""}` +
      `\n\n ${randomHadithRef || ""}`
    );
  }
  return null;
};

export const getUnsplashImageUrl = async () => {
  const unsplashResponse = await axios.get(
    `https://api.unsplash.com/photos/random/?client_id=${process.env.UNSPLASH_ACCESS_KEY}&query=nature&orientation=portrait`
  );
  const unsplashData = unsplashResponse.data;
  const imgUrl = unsplashData?.urls?.small;
  return imgUrl;
};

export const sendMessage = (body: string, image: string) => {
  messaging().send({
    topic: "hadith",
    notification: {
      title: "Daily hadith by Hadith Pro",
      body: body,
      imageUrl: image,
    },
    android: {
      priority: "high",
    },
  });
};

export const sendCustomMessage = (
  title: string,
  body: string,
  image: string
) => {
  messaging().send({
    topic: "hadith",
    notification: {
      title: title,
      body: body,
      imageUrl: image,
    },
    android: {
      priority: "high",
    },
  });
};
