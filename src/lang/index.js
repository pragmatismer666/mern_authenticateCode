import { addLocaleData } from 'react-intl';
import enLang from './entries/en-US';
import frLang from './entries/fr-FR';
import enRtlLang from './entries/en-US-rtl';

const AppLocale = {
    en: enLang,
    fr: frLang,
    enrtl:enRtlLang
};
addLocaleData(AppLocale.en.data);
addLocaleData(AppLocale.fr.data);
addLocaleData(AppLocale.enrtl.data);

export default AppLocale;
