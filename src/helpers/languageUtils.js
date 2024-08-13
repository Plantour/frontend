import { useRecoilState } from "recoil";
import { languageState } from "../state/atom";
import { translations } from "../list/translations";

export const useLanguage = () => {
  const [language, setLanguage] = useRecoilState(languageState);

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return {
    language,
    changeLanguage,
    translations: translations[language] || translations["en"],
  };
};
