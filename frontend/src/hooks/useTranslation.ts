import { useWeather } from '../context/WeatherContext';
import { getTranslation, TranslationKeys } from '../localization/uiTranslations';

export const useTranslation = () => {
  const { language } = useWeather();
  const t: TranslationKeys = getTranslation(language);

  return { t, currentLanguage: language };
};
