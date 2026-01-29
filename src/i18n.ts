import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  // Detects user language (from browser settings)
  .use(LanguageDetector)
  // Passes i18n instance to react-i18next
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React handles escaping already
    },
    resources: {
      en: {
        translation: {
          title: "Grade Statistics",
          searchPlaceholder: "Search Course (e.g. TDDE35)",
          searchButton: "Search",
          errorTitle: "Error",
          errorFetch: "Failed to fetch data.",
          filterPlaceholder: "Filter by Exam",
          chartBar: "Bar Chart",
          chartPie: "Pie Chart",
          noExams: "No exams found for this filter.",
          tooltipGrade: "Grade",
          tooltipQty: "Quantity",
          tooltipPerc: "Percentage",
          date: "Date",
          students: "Students"
        }
      },
      sv: {
        translation: {
          title: "Betygsstatistik",
          searchPlaceholder: "Sök kurs (t.ex. TDDE35)",
          searchButton: "Sök",
          errorTitle: "Fel",
          errorFetch: "Kunde inte hämta data.",
          filterPlaceholder: "Filtrera på Tenta",
          chartBar: "Stapeldiagram",
          chartPie: "Cirkeldiagram",
          noExams: "Inga tentor hittades med detta filter.",
          tooltipGrade: "Betyg",
          tooltipQty: "Antal",
          tooltipPerc: "Andel",
          date: "Datum",
          students: "Studenter"
        }
      }
    }
  });

export default i18n;