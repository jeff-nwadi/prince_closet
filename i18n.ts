import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "madeBy": "Made by:",
      "typography": "Typography:",
      "images": "Images:",
      "privacyPolicy": "Privacy Policy",
      "termsConditions": "Terms & Conditions",
      "brandName": "Prince's Closet",
      "menu": "Menu",
      "close": "Close",
      "shop": "Shop",
      "cart": "Cart({{count}})"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
