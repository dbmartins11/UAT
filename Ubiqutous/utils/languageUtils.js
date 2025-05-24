// utils/languageUtils.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const translations = {
  en: {
    edit_profile: 'Edit Profile',
    logout: 'Logout',
    new_username: 'New username',
    new_email: 'New email',
    about_me: 'About me...',
    current_password: 'Current password (required)',
    new_password: 'New password (optional)',
    save_changes: 'Save Changes',
    auth_required: 'Authentication required',
    enter_current_password: 'Enter your current password to confirm changes.',
    email_not_verified: 'Email not verified',
    verify_email_first: 'Please verify your current email before changing it.',
    send_verification: 'Send verification',
    verification_sent: 'Verification email sent!',
    weak_password: 'Weak password',
    min_6_characters: 'New password must be at least 6 characters.',
    success: 'Success',
    profile_updated: 'Profile updated successfully!',
    error: 'Error',
  },
  pt: {
    edit_profile: 'Editar Perfil',
    logout: 'Terminar Sessão',
    new_username: 'Novo nome de utilizador',
    new_email: 'Novo email',
    about_me: 'Sobre mim...',
    current_password: 'Senha atual (obrigatória)',
    new_password: 'Nova senha (opcional)',
    save_changes: 'Guardar Alterações',
    auth_required: 'Autenticação necessária',
    enter_current_password: 'Insira a senha atual para confirmar as alterações.',
    email_not_verified: 'Email não verificado',
    verify_email_first: 'Verifique o seu email atual antes de alterá-lo.',
    send_verification: 'Enviar verificação',
    verification_sent: 'Email de verificação enviado!',
    weak_password: 'Senha fraca',
    min_6_characters: 'A nova senha deve ter pelo menos 6 caracteres.',
    success: 'Sucesso',
    profile_updated: 'Perfil atualizado com sucesso!',
    error: 'Erro',
  },
  sl: {
    edit_profile: 'Uredi profil',
    logout: 'Odjava',
    new_username: 'Novo uporabniško ime',
    new_email: 'Nov e-poštni naslov',
    about_me: 'O meni...',
    current_password: 'Trenutno geslo (obvezno)',
    new_password: 'Novo geslo (neobvezno)',
    save_changes: 'Shrani spremembe',
    auth_required: 'Potrebna je avtentikacija',
    enter_current_password: 'Vnesite trenutno geslo za potrditev sprememb.',
    email_not_verified: 'E-pošta ni preverjena',
    verify_email_first: 'Najprej preverite trenutno e-pošto.',
    send_verification: 'Pošlji preverjanje',
    verification_sent: 'Preveritveno e-poštno sporočilo poslano!',
    weak_password: 'Šibko geslo',
    min_6_characters: 'Novo geslo mora imeti vsaj 6 znakov.',
    success: 'Uspeh',
    profile_updated: 'Profil uspešno posodobljen!',
    error: 'Napaka',
  },
};


// Obter idioma atual da AsyncStorage
export const getCurrentLanguage = async () => {
  const lang = await AsyncStorage.getItem('appLanguage');
  return lang || 'en'; // padrão: inglês
};

// Traduzir uma chave com base no idioma
export const translate = (key, lang = 'en') => {
  return translations[lang]?.[key] || translations['en']?.[key] || key;
};
