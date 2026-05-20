import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      navbar: {
        home: "Home",
        account: "My account",
        signIn: "Sign in",
        signOut: "Sign out",
      },
      footer: {
        brand: {
          description: "A boutique hotel offering luxury stays in the heart of the city. Where comfort meets elegance.",
        },
        contact: {
          title: "Contact",
          address: "12 Luxury Avenue,\nCity Center, 10001",
        },
        links: {
          title: "Quick links",
          home: "Home",
          account: "My Account",
          signIn: "Sign in",
        },
        bottom: {
          copyright: "© 2026 Aurelia Hotel. All rights reserved.",
        },
      },
      home: {
        hero: {
          tagline: "Where luxury meets comfort",
          title: "Find your perfect stay",
          titleAccent: "at Aurelia",
          subtitle: "Luxury rooms in the heart of the city. Book directly for the best rates.",
        },
        dates: {
          checkIn: "Check-in",
          checkOut: "Check-out",
          clear: "Clear",
          availability: "Showing availability for {{checkIn}} → {{checkOut}}",
        },
        filter: {
          label: "Room type:",
          types: {
            All: "All",
            "Standard Studio": "Standard Studio",
            Studio: "Studio",
            "Studio Deluxe": "Studio Deluxe",
            "One Bedroom": "One Bedroom",
            Suite: "Suite",
          },
        },
        rooms: {
          loading: "Loading rooms…",
          empty: "No rooms found for this type.",
        },
        booking: {
          success: "Booking confirmed! Room {{roomId}} · Ref: {{ref}}",
        },
      },
      account: {
        signOut: "Sign out",
        tabs: {
          reservations: "Reservations",
          profile: "Profile",
        },
        reservations: {
          upcoming: "Upcoming stays",
          noUpcoming: "No upcoming stays.",
          past: "Past stays",
          noPast: "No past stays yet.",
          room: "Room",
          night: "night",
          nights: "nights",
          cancel: "Cancel",
          cancelConfirm: "Are you sure you want to cancel this booking?",
          status: {
            reserved: "Reserved",
            "checked-in": "Checked in",
            "checked-out": "Completed",
            cancelled: "Cancelled",
          },
        },
        profile: {
          fullName: "Full name",
          email: "Email",
          passwordHint: "Leave password fields empty if you don't want to change it.",
          currentPassword: "Current password",
          currentPasswordPlaceholder: "Required to change password",
          newPassword: "New password",
          newPasswordPlaceholder: "Min. 6 characters",
          confirmPassword: "Confirm new password",
          confirmPasswordPlaceholder: "Repeat new password",
          save: "Save changes",
          saving: "Saving…",
          success: "Profile updated successfully!",
          errors: {
            passwordMismatch: "New passwords do not match.",
            passwordTooShort: "New password must be at least 6 characters.",
          },
        },
      },
    },
  },

  sq: {
    translation: {
      navbar: {
        home: "Kryefaqja",
        account: "Llogaria ime",
        signIn: "Hyni",
        signOut: "Dilni",
      },
      footer: {
        brand: {
          description: "Një hotel butik që ofron qëndrime luksoze në zemër të qytetit. Ku komoditeti takohet me elegancën.",
        },
        contact: {
          title: "Kontakt",
          address: "12 Bulevardi Luksoz,\nQendra e Qytetit, 10001",
        },
        links: {
          title: "Lidhje të shpejta",
          home: "Kryefaqja",
          account: "Llogaria ime",
          signIn: "Hyni",
        },
        bottom: {
          copyright: "© 2026 Aurelia Hotel. Të gjitha të drejtat e rezervuara.",
        },
      },
      home: {
        hero: {
          tagline: "Ku luksi takohet me komoditetin",
          title: "Gjeni qëndrimin tuaj të përsosur",
          titleAccent: "në Aurelia",
          subtitle: "Dhoma luksoze në zemër të qytetit. Rezervoni direkt për çmimet më të mira.",
        },
        dates: {
          checkIn: "Hyrja",
          checkOut: "Dalja",
          clear: "Fshi",
          availability: "Duke shfaqur disponueshmërinë për {{checkIn}} → {{checkOut}}",
        },
        filter: {
          label: "Lloji i dhomës:",
          types: {
            All: "Të gjitha",
            "Standard Studio": "Studio Standard",
            Studio: "Studio",
            "Studio Deluxe": "Studio Deluxe",
            "One Bedroom": "Një Dhomë Gjumi",
            Suite: "Suitë",
          },
        },
        rooms: {
          loading: "Duke ngarkuar dhomat…",
          empty: "Nuk u gjet asnjë dhomë për këtë lloj.",
        },
        booking: {
          success: "Rezervimi u konfirmua! Dhoma {{roomId}} · Ref: {{ref}}",
        },
      },
      account: {
        signOut: "Dilni",
        tabs: {
          reservations: "Rezervimet",
          profile: "Profili",
        },
        reservations: {
          upcoming: "Qëndrimet e ardhshme",
          noUpcoming: "Nuk ka qëndrime të ardhshme.",
          past: "Qëndrimet e kaluara",
          noPast: "Nuk ka ende qëndrime të kaluara.",
          room: "Dhoma",
          night: "natë",
          nights: "net",
          cancel: "Anulo",
          cancelConfirm: "Jeni i sigurt që doni të anuloni këtë rezervim?",
          status: {
            reserved: "Rezervuar",
            "checked-in": "Checked in",
            "checked-out": "Përfunduar",
            cancelled: "Anuluar",
          },
        },
        profile: {
          fullName: "Emri i plotë",
          email: "Email",
          passwordHint: "Lini fushat e fjalëkalimit bosh nëse nuk doni ta ndryshoni.",
          currentPassword: "Fjalëkalimi aktual",
          currentPasswordPlaceholder: "Kërkohet për të ndryshuar fjalëkalimin",
          newPassword: "Fjalëkalimi i ri",
          newPasswordPlaceholder: "Min. 6 karaktere",
          confirmPassword: "Konfirmo fjalëkalimin e ri",
          confirmPasswordPlaceholder: "Përsërit fjalëkalimin e ri",
          save: "Ruaj ndryshimet",
          saving: "Duke ruajtur…",
          success: "Profili u përditësua me sukses!",
          errors: {
            passwordMismatch: "Fjalëkalimet e reja nuk përputhen.",
            passwordTooShort: "Fjalëkalimi i ri duhet të ketë të paktën 6 karaktere.",
          },
        },
      },
    },
  },

  it: {
    translation: {
      navbar: {
        home: "Home",
        account: "Il mio account",
        signIn: "Accedi",
        signOut: "Esci",
      },
      footer: {
        brand: {
          description: "Un hotel boutique che offre soggiorni di lusso nel cuore della città. Dove il comfort incontra l'eleganza.",
        },
        contact: {
          title: "Contatti",
          address: "12 Viale del Lusso,\nCentro Città, 10001",
        },
        links: {
          title: "Link rapidi",
          home: "Home",
          account: "Il mio account",
          signIn: "Accedi",
        },
        bottom: {
          copyright: "© 2026 Aurelia Hotel. Tutti i diritti riservati.",
        },
      },
      home: {
        hero: {
          tagline: "Dove il lusso incontra il comfort",
          title: "Trova il tuo soggiorno perfetto",
          titleAccent: "all'Aurelia",
          subtitle: "Camere di lusso nel cuore della città. Prenota direttamente per le tariffe migliori.",
        },
        dates: {
          checkIn: "Check-in",
          checkOut: "Check-out",
          clear: "Cancella",
          availability: "Disponibilità per {{checkIn}} → {{checkOut}}",
        },
        filter: {
          label: "Tipo di camera:",
          types: {
            All: "Tutte",
            "Standard Studio": "Studio Standard",
            Studio: "Studio",
            "Studio Deluxe": "Studio Deluxe",
            "One Bedroom": "Monolocale",
            Suite: "Suite",
          },
        },
        rooms: {
          loading: "Caricamento camere…",
          empty: "Nessuna camera trovata per questo tipo.",
        },
        booking: {
          success: "Prenotazione confermata! Camera {{roomId}} · Rif: {{ref}}",
        },
      },
      account: {
        signOut: "Esci",
        tabs: {
          reservations: "Prenotazioni",
          profile: "Profilo",
        },
        reservations: {
          upcoming: "Soggiorni futuri",
          noUpcoming: "Nessun soggiorno futuro.",
          past: "Soggiorni passati",
          noPast: "Nessun soggiorno passato ancora.",
          room: "Camera",
          night: "notte",
          nights: "notti",
          cancel: "Annulla",
          cancelConfirm: "Sei sicuro di voler annullare questa prenotazione?",
          status: {
            reserved: "Prenotato",
            "checked-in": "Checked in",
            "checked-out": "Completato",
            cancelled: "Annullato",
          },
        },
        profile: {
          fullName: "Nome completo",
          email: "Email",
          passwordHint: "Lascia i campi password vuoti se non vuoi cambiarla.",
          currentPassword: "Password attuale",
          currentPasswordPlaceholder: "Richiesta per cambiare password",
          newPassword: "Nuova password",
          newPasswordPlaceholder: "Min. 6 caratteri",
          confirmPassword: "Conferma nuova password",
          confirmPasswordPlaceholder: "Ripeti la nuova password",
          save: "Salva modifiche",
          saving: "Salvataggio…",
          success: "Profilo aggiornato con successo!",
          errors: {
            passwordMismatch: "Le nuove password non corrispondono.",
            passwordTooShort: "La nuova password deve essere di almeno 6 caratteri.",
          },
        },
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;