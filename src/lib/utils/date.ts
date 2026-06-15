import { HijriDate, GregorianDate } from "@/features/adhan/types/date-info";

function toArabicDigits(str: string): string {
  const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
  return str.replace(/[0-9]/g, (w) => arabicDigits[Number(w)]);
}

/**
 * Formats a Hijri date object into a localized string with Latin or Arabic script.
 */
export function formatHijriDate(
  hijri: HijriDate | undefined,
  gregorian: GregorianDate | undefined,
  locale: string
): string {
  if (!hijri || !gregorian) return "";

  const parsedDate = new Date(
    Number(gregorian.year),
    Number(gregorian.month.number) - 1,
    Number(gregorian.day)
  );
  const dayIndex = parsedDate.getDay();
  const monthIndex = hijri.month.number - 1;

  const weekdaysTR = ["Pazar", "Pazartesi", "Salı", "Çarşamba", "Perşembe", "Cuma", "Cumartesi"];
  const weekdaysEN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const weekdaysAR = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];

  const hijriMonthsTR = [
    "Muharrem", "Safer", "Rebiülevvel", "Rebiülahir", "Cemaziyelevvel", "Cemaziyelahir",
    "Recep", "Şaban", "Ramazan", "Şevval", "Zilkade", "Zilhicce"
  ];
  const hijriMonthsEN = [
    "Muharram", "Safar", "Rabi' al-awwal", "Rabi' al-thani", "Jumada al-awwal", "Jumada al-thani",
    "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu al-Qadah", "Dhu al-Hijjah"
  ];
  const hijriMonthsAR = [
    "المحرم", "صفر", "ربيع الأول", "ربيع الآخر", "جمادى الأولى", "جمادى الآخرة",
    "رجب", "شعبان", "رمضان", "شوال", "ذو القعدة", "ذو الحجة"
  ];

  if (locale === "tr") {
    return `${hijri.day} ${hijriMonthsTR[monthIndex]} ${hijri.year}, ${weekdaysTR[dayIndex]}`;
  } else if (locale === "ar") {
    const arabicDay = toArabicDigits(hijri.day);
    const arabicYear = toArabicDigits(hijri.year);
    return `${arabicDay} ${hijriMonthsAR[monthIndex]} ${arabicYear}، ${weekdaysAR[dayIndex]}`;
  } else {
    // English / Default
    return `${weekdaysEN[dayIndex]}, ${hijri.day} ${hijriMonthsEN[monthIndex]} ${hijri.year}`;
  }
}

/**
 * Formats a Gregorian date object into a localized string using native Intl.DateTimeFormat.
 */
export function formatGregorianDate(
  gregorian: GregorianDate | undefined,
  locale: string
): string {
  if (!gregorian) return "";

  const parsedDate = new Date(
    Number(gregorian.year),
    Number(gregorian.month.number) - 1,
    Number(gregorian.day)
  );

  try {
    const formatter = new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    return formatter.format(parsedDate);
  } catch (error) {
    // Fallback if Intl.DateTimeFormat fails or is not fully supported
    const weekdaysEN = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthsEN = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    
    const dayIndex = parsedDate.getDay();
    const monthIndex = parsedDate.getMonth();
    
    return `${weekdaysEN[dayIndex]}, ${monthsEN[monthIndex]} ${gregorian.day}, ${gregorian.year}`;
  }
}
