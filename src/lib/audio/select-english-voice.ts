type VoiceLike = {
  lang?: string;
  name?: string;
};

const preferredKeywordGroups = [
  ["google", "english"],
  ["natural"],
  ["samantha"]
];

export function selectEnglishVoiceName(voices: VoiceLike[]) {
  const englishVoices = voices.filter((voice) => voice.lang?.toLowerCase().startsWith("en"));

  if (englishVoices.length === 0) {
    return null;
  }

  const preferred = preferredKeywordGroups
    .map((keywords) =>
      englishVoices.find((voice) =>
        keywords.every((keyword) => voice.name?.toLowerCase().includes(keyword))
      )
    )
    .find(Boolean);

  return preferred?.name ?? englishVoices[0]?.name ?? null;
}
