import React from "react";
import { ScrollView, View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import clsx from "clsx";

import { useTheme } from "@/lib/storage/useThemeStore";
import { useTranslation } from "@/lib/i18n";
import { colors } from "@/lib/components/theme/colors";

type PolicyContent = {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: {
    title: string;
    content: string;
  }[];
};

const PRIVACY_DATA: Record<string, PolicyContent> = {
  tr: {
    title: "Gizlilik Politikası",
    lastUpdated: "Son Güncelleme: 2 Temmuz 2026",
    intro: "Salah uygulaması olarak gizliliğinize büyük önem veriyoruz. Bu gizlilik politikası, uygulamamızı kullanırken hangi bilgileri topladığımızı, bunları nasıl kullandığımızı ve haklarınızı açıklamaktadır.",
    sections: [
      {
        title: "1. Toplanan Veriler ve Kullanım Amaçları",
        content: "• Konum Bilgisi: Namaz vakitlerini bulunduğunuz yere göre en doğru şekilde hesaplamak ve Kıble pusulasını doğru yönlendirmek için konumunuza ihtiyaç duyarız. Konum verileriniz yalnızca cihazınızda işlenir ve sunucularımızda saklanmaz.\n\n• Profil Bilgileri: Kaydolmayı seçtiğinizde ad, soyad, e-posta adresi ve isteğe bağlı profil fotoğrafı gibi bilgileri toplarız. Misafir (anonim) girişi yaparsanız bu kişisel veriler sizden talep edilmez.\n\n• Cihaz Hareketleri (Sensörler): Cihazınızın pusulasını kullanarak Kıble yönünü doğru şekilde göstermek için hareket sensörlerine erişim sağlarız."
      },
      {
        title: "2. İzinler",
        content: "• Konum İzni: Arka planda veya uygulama açıkken namaz vakitlerini güncel tutmak için konum izni istenir.\n\n• Kamera ve Fotoğraf Galerisi İzni: Profil resmi ayarlamak veya çekmek istediğinizde bu izinlere ihtiyaç duyulur.\n\n• Bildirim İzni: Ezan vakitlerinde ezan sesi çalmak, namaz hatırlatmaları ve günlük ayet bildirimleri göndermek için bildirim izni zorunludur."
      },
      {
        title: "3. Üçüncü Taraf Hizmetleri ve Veri Paylaşımı",
        content: "• Supabase: Kullanıcı hesabı oluşturma, profil güncelleme, zikir ve dualarınızı cihazlar arası senkronize etme gibi altyapı hizmetleri için güvenli Supabase bulut veri tabanını kullanmaktayız. Verileriniz şifreli olarak saklanır.\n\n• Bildirim Altyapısı: Ezan ve hatırlatıcı bildirimlerini yönetmek için standart Expo bildirim servisleri kullanılmaktadır."
      },
      {
        title: "4. Veri Saklama ve Güvenlik",
        content: "Verileriniz cihazınızda güvenli yerel depolama (MMKV/SQLite) alanında ve bulutta şifreli Supabase sunucularında saklanır. Yetkisiz erişimleri önlemek amacıyla endüstri standardı güvenlik önlemleri almaktayız."
      },
      {
        title: "5. Kullanıcı Hakları ve Hesap Silme",
        content: "Dilediğiniz zaman profil ayarlarınızdan bilgilerinizi güncelleyebilir veya hesabınızı tamamen silebilirsiniz. Hesabınızı sildiğinizde, e-posta adresiniz dahil tüm senkronize edilmiş verileriniz Supabase veritabanımızdan kalıcı olarak temizlenir."
      },
      {
        title: "6. İletişim",
        content: "Gizlilik politikamızla ilgili her türlü soru, görüş ve talepleriniz için bizimle support@salahapp.com adresi üzerinden iletişime geçebilirsiniz."
      }
    ]
  },
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last Updated: July 2, 2026",
    intro: "At Salah, we care deeply about your privacy. This privacy policy explains what information we collect when you use our app, how we use it, and your rights regarding this data.",
    sections: [
      {
        title: "1. Data Collection and Usage",
        content: "• Location Information: We require your location to calculate precise prayer times for your exact geographic coordinates and to align the Qibla compass. Your location coordinates are processed locally on your device and are not stored on our servers.\n\n• Profile Information: If you choose to register, we collect your name, surname, email address, and optional profile image. If you sign in as a guest, we do not require this personal data.\n\n• Device Motion (Sensors): We access motion sensors to determine your device's orientation and point you towards the Qibla."
      },
      {
        title: "2. Requested Permissions",
        content: "• Location Permission: Used to keep prayer times updated. This can be configured for when the app is in use or in the background.\n\n• Camera & Photo Library: Needed only if you decide to take or upload a custom profile picture.\n\n• Notifications: Required to play Adhan alerts at prayer times, send daily verses, and other user-requested notifications."
      },
      {
        title: "3. Third-Party Services and Syncing",
        content: "• Supabase: We use secure Supabase cloud infrastructure to handle authentication, profile storage, and synchronize your dhikr tallies and custom duas across devices.\n\n• Notifications: We utilize Expo notification frameworks to trigger local and remote alerts."
      },
      {
        title: "4. Data Retention and Security",
        content: "Your configurations are saved locally via secure on-device storage (MMKV/SQLite) and synced securely with Supabase database clusters. We apply standard industry measures to safeguard your personal details."
      },
      {
        title: "5. Your Rights and Account Deletion",
        content: "You can update your personal profile details at any time. If you wish to delete your account, you can do so directly from your profile settings. Upon deletion, all of your synced data and email credentials are permanently removed from our active databases."
      },
      {
        title: "6. Contact Us",
        content: "For any questions or concerns regarding this privacy policy, feel free to reach out to us at support@salahapp.com."
      }
    ]
  },
  ar: {
    title: "سياسة الخصوصية",
    lastUpdated: "آخر تحديث: 2 يوليو 2026",
    intro: "نحن في تطبيق صلاح نولي أهمية قصوى لخصوصيتك. توضح سياسة الخصوصية هذه المعلومات التي نجمعها عند استخدامك للتطبيق، وكيفية استخدامها، وحقوقك المتعلقة بها.",
    sections: [
      {
        title: "1. جمع البيانات واستخدامها",
        content: "• معلومات الموقع: نحتاج إلى موقعك الجغرافي لحساب مواقيت الصلاة بدقة وتحديد اتجاه القبلة عبر البوصلة. يتم معالجة إحداثيات موقعك محليًا على جهازك ولا نقوم بتخزينها على خوادمنا.\n\n• معلومات الملف الشخصي: عند التسجيل، نجمع اسمك، واسم عائلتك، وبريدك الإلكتروني، وصورة اختيارية للملف الشخصي. في حال تسجيل الدخول كضيف، لن نطلب منك هذه البيانات الشخصية.\n\n• حركة الجهاز (المستشعرات): نصل إلى مستشعرات الحركة لتحديد اتجاه جهازك وتوجيهك بدقة نحو القبلة."
      },
      {
        title: "2. الأذونات المطلوبة",
        content: "• إذن الموقع: مطلوب للحفاظ على تحديث مواقيت الصلاة، سواء أثناء استخدام التطبيق أو في الخلفية.\n\n• الكاميرا ومكتبة الصور: نحتاج إليها فقط في حال رغبت في التقاط أو تحميل صورة لملفك الشخصي.\n\n• الإشعارات: مطلوبة لتشغيل تنبيهات الأذن في أوقات الصلاة، وإرسال الآيات اليومية، والتنبيهات الأخرى التي تطلبها."
      },
      {
        title: "3. خدمات الطرف الثالث والمزامنة",
        content: "• Supabase: نستخدم البنية التحتية السحابية الآمنة لـ Supabase لإدارة المصادقة وحفظ الملف الشخصي ومزامنة الأذكار والأدعية الخاصة بك عبر أجهزتك المختلفة.\n\n• الإشعارات: نستخدم إطار عمل إشعارات Expo لتشغيل التنبيهات المحلية والبعيدة."
      },
      {
        title: "4. الاحتفاظ بالبيانات وأمنها",
        content: "يتم حفظ إعداداتك محليًا على جهازك باستخدام مخزن بيانات آمن (MMKV/SQLite) وتتم مزامنتها بشكل آمن مع خوادم Supabase. نطبق معايير أمنية متقدمة لحماية بياناتك الشخصية."
      },
      {
        title: "5. حقوقك وحذف الحساب",
        content: "يمكنك تحديد بيانات ملفك الشخصي في أي وقت. إذا كنت ترغب في حذف حسابك نهائيًا، يمكنك القيام بذلك مباشرة من إعدادات الملف الشخصي. عند الحذف، يتم إزالة جميع بياناتك المتزامنة وبريدك الإلكتروني تمامًا من قواعد بياناتنا النشطة."
      },
      {
        title: "6. الاتصال بنا",
        content: "إذا كان لديك أي أسئلة أو استفسارات بخصوص سياسة الخصوصية هذه، فلا تتردد في الاتصال بنا عبر البريد الإلكتروني support@salahapp.com."
      }
    ]
  }
};

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { i18n } = useTranslation();

  const currentLang = (i18n.language?.split(/[-_]/)[0] ?? "tr") as string;
  const lang = currentLang === "en" || currentLang === "tr" || currentLang === "ar" ? currentLang : "tr";
  
  const policy = PRIVACY_DATA[lang];
  const isRtl = lang === "ar";

  return (
    <SafeAreaView
      className={clsx(
        "flex-1",
        isDark ? "bg-background-dark" : "bg-background-light"
      )}
      edges={["top"]}
    >
      {/* Header */}
      <View
        className={clsx(
          "flex-row items-center border-b px-4 py-3",
          isDark ? "border-border-dark/50 bg-background-dark" : "border-border-light bg-background-light",
          isRtl && "flex-row-reverse"
        )}
      >
        <Pressable
          onPress={() => router.back()}
          className="p-1 rounded-full active:opacity-60"
          hitSlop={12}
        >
          <MaterialIcons
            name={isRtl ? "chevron-right" : "chevron-left"}
            size={28}
            color={colors.primary[500]}
          />
        </Pressable>
        
        <View className="flex-1 px-4">
          <Text
            className={clsx(
              "text-lg font-bold",
              isDark ? "text-text-primaryDark" : "text-text-primaryLight",
              isRtl ? "text-right" : "text-left"
            )}
          >
            {policy.title}
          </Text>
        </View>
        
        {/* Empty space for alignment symmetry */}
        <View className="w-8" />
      </View>

      {/* Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Text
          className={clsx(
            "text-xs mb-4 font-semibold opacity-70",
            isDark ? "text-text-secondaryDark" : "text-text-secondaryLight",
            isRtl ? "text-right" : "text-left"
          )}
        >
          {policy.lastUpdated}
        </Text>

        <Text
          className={clsx(
            "text-base mb-6 leading-6",
            isDark ? "text-text-primaryDark" : "text-text-primaryLight",
            isRtl ? "text-right" : "text-left"
          )}
        >
          {policy.intro}
        </Text>

        {policy.sections.map((section, idx) => (
          <View key={idx} className="mb-6">
            <Text
              className={clsx(
                "text-base font-bold mb-2",
                isRtl ? "text-right" : "text-left"
              )}
              style={{ color: colors.primary[500] }}
            >
              {section.title}
            </Text>
            
            <Text
              className={clsx(
                "text-sm leading-6",
                isDark ? "text-text-secondaryDark" : "text-text-secondaryLight",
                isRtl ? "text-right" : "text-left"
              )}
            >
              {section.content}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
