"""Translations for all remaining uncovered keys:
demo, club, corporateContact, blog, register, footer, common, role, iot, contact,
nav, solutions, booking, tenant, auth, white_label, language, modules, ai.
Across 9 secondary languages: gl, ca, va, eu, ar, pt, fr, de, it, plus es and en.
"""

REMAINING_TRANSLATIONS = {}

def add_r(key, es, en, gl, ca, va, eu, ar, pt, fr, de, it):
    REMAINING_TRANSLATIONS[key] = {
        "es": es, "en": en, "gl": gl, "ca": ca, "va": va, "eu": eu,
        "ar": ar, "pt": pt, "fr": fr, "de": de, "it": it
    }

# --- DEMO ---
add_r("demo.close",
      "Cerrar", "Close", "Pechar", "Tancar", "Tancar", "Itxi", "إغلاق", "Fechar", "Fermer", "Schließen", "Chiudi")

add_r("demo.description",
      "Explora las interfaces completas y datos reales según cada perfil de usuario en la plataforma.",
      "Explore full interactive interfaces with production-grade data tailored for each role.",
      "Explora as interfaces completas e datos reais segundo cada perfil de usuario na plataforma.",
      "Explora les interfícies completes i dades reals segons cada perfil d'usuari a la plataforma.",
      "Explora les interfícies completes i dades reals segons cada perfil d'usuari a la plataforma.",
      "Arakatu interfaze osoak eta datu errealak plataformako erabiltzaile-profil bakoitzaren arabera.",
      "استكشف الواجهات الكاملة والبيانات الحقيقية بحسب كل دور في المنصة.",
      "Explore as interfaces completas e dados reais de acordo com cada perfil de utilizador.",
      "Explorez les interfaces complètes et les données en direct selon chaque rôle sur la plateforme.",
      "Erkunden Sie die Benutzeroberflächen und Echtdaten für jedes spezifische Benutzerprofil.",
      "Esplora le interfacce complete e i dati reali per ogni profilo utente sulla piattaforma.")

add_r("demo.experienceToastDescription",
      "Abriendo experiencia de", "Opening experience for", "Abrindo experiencia de", "Obrint experiència de", "Obrint experiència de",
      "Esperientzia irekitzen:", "فتح البيئة التجريبية لـ", "A abrir experiência de", "Ouverture de l'environnement", "Öffne Demo-Modus für", "Apertura esperienza per")

add_r("demo.experienceToastSuffix",
      "...", "...", "...", "...", "...", "...", "...", "...", "...", "...", "...")

add_r("demo.heading",
      "Selecciona el Rol de Demostración", "Select Demo User Role", "Selecciona o Rol de Demostración", "Selecciona el Rol de Demostració", "Selecciona el Rol de Demostració",
      "Hautatu Demorako Rola", "اختر الدور التجريبي للاستكشاف", "Selecione a Função de Demonstração", "Sélectionnez le Rôle de Démonstration", "Wählen Sie eine Demo-Rolle", "Seleziona il Ruolo Demo")

add_r("demo.note",
      "Los usuarios con rol profesional (Admin o Profesor) pueden conmutar a Modo Jugador en cualquier momento con el selector en cabecera.",
      "Professional roles (Admins and Coaches) can switch to Player View anytime via the top header bar toggle.",
      "Os usuarios con rol profesional (Admin ou Profesor) poden conmutar a Modo Xogador en calquera momento co selector en cabeceira.",
      "Els usuaris amb rol professional (Admin o Professor) poden commutar a Mode Jugador en qualsevol moment amb el selector a la capçalera.",
      "Els usuaris amb rol professional (Admin o Professor) poden commutar a Mode Jugador en qualsevol moment amb el selector a la capçalera.",
      "Rol profesionala duten erabiltzaileek (Admin edo Irakaslea) Jokalari Modura alda dezakete edozein unetan goiburuko hautatzailearekin.",
      "يمكن للمستخدمين من أصحاب الحسابات الإدارية والمدربين التبديل إلى وضع اللاعب في أي وقت من الشريط العلوي.",
      "Os utilizadores profissionais (Admin ou Treinador) podem alternar para o Modo Jogador a qualquer momento pelo cabeçalho.",
      "Les profils professionnels (Admin ou Entraîneur) peuvent basculer en Mode Joueur à tout moment via l'en-tête.",
      "Nutzer mit Profi-Rollen (Admin oder Trainer) können jederzeit über die Kopfzeile in die Spieler-Ansicht wechseln.",
      "Gli utenti con ruolo professionale (Admin o Maestro) possono passare alla Modalità Giocatore in qualsiasi momento dall'header.")

add_r("demo.roles.coach_club.access",
      "Has ingresado al entorno con perfil y permisos de Profesor de Club.",
      "You have accessed the demo environment as a Club Coach.",
      "Accediches á contorna con perfil e permisos de Profesor de Club.",
      "Has accedit a l'entorn amb perfil i permisos de Professor de Club.",
      "Has accedit a l'entorn amb perfil i permisos de Professor de Club.",
      "Klubeko Irakaslearen profil eta baimenekin sartu zara ingurunean.",
      "لقد دخلت إلى البيئة التجريبية بصلاحيات مدرب النادي.",
      "Entrou no ambiente de demonstração com perfil e permissões de Treinador do Clube.",
      "Vous avez accédé à l'environnement avec le profil et les permissions d'Entraîneur du Club.",
      "Sie haben den Demo-Bereich als Club-Trainer mit vollen Rechten betreten.",
      "Sei entrato nell'ambiente demo con profilo e permessi di Maestro del Circolo.")

add_r("demo.roles.coach_club.badge",
      "Profesor de Club", "Club Coach", "Profesor de Club", "Professor de Club", "Professor de Club",
      "Klubeko Irakaslea", "مدرب النادي", "Treinador do Clube", "Entraîneur du Club", "Club-Trainer", "Maestro del Circolo")

add_r("demo.roles.coach_independent.access",
      "Has ingresado al entorno con perfil y permisos de Profesor Cliente.",
      "You have accessed the demo environment as an Independent Coach.",
      "Accediches á contorna con perfil e permisos de Profesor Cliente.",
      "Has accedit a l'entorn amb perfil i permisos de Professor Client.",
      "Has accedit a l'entorn amb perfil i permisos de Professor Client.",
      "Irakasle Bezeroaren profil eta baimenekin sartu zara ingurunean.",
      "لقد دخلت إلى البيئة التجريبية بصلاحيات مدرب مستقل.",
      "Entrou no ambiente de demonstração como Treinador Independente.",
      "Vous avez accédé à l'environnement avec les permissions d'Entraîneur Indépendant.",
      "Sie haben den Demo-Bereich als selbstständiger Trainer betreten.",
      "Sei entrato nell'ambiente demo con permessi di Maestro Indipendente.")

add_r("demo.roles.coach_independent.badge",
      "Profesor Cliente", "Independent Coach", "Profesor Cliente", "Professor Client", "Professor Client",
      "Irakasle Bezeroa", "مدرب مستقل", "Treinador Independente", "Entraîneur Indépendant", "Freiberuflicher Trainer", "Maestro Indipendente")

add_r("demo.roles.player.access",
      "Has ingresado al entorno con perfil y permisos de Área Jugador.",
      "You have accessed the demo environment with Player permissions.",
      "Accediches á contorna con perfil e permisos de Área Xogador.",
      "Has accedit a l'entorn amb perfil i permisos d'Àrea Jugador.",
      "Has accedit a l'entorn amb perfil i permisos d'Àrea Jugador.",
      "Jokalari Eremuaren profil eta baimenekin sartu zara ingurunean.",
      "لقد دخلت إلى البيئة التجريبية بصلاحيات منطقة اللاعبين.",
      "Entrou no ambiente de demonstração com permissões da Área do Jogador.",
      "Vous avez accédé à l'environnement avec les permissions de l'Espace Joueur.",
      "Sie haben den Demo-Bereich im Spieler-Modus betreten.",
      "Sei entrato nell'ambiente demo con permessi Area Giocatore.")

add_r("demo.roles.player.badge",
      "Área Jugador", "Player Area", "Área Xogador", "Àrea Jugador", "Àrea Jugador",
      "Jokalari Eremua", "منطقة اللاعب", "Área do Jogador", "Espace Joueur", "Spieler-Bereich", "Area Giocatore")

add_r("demo.roles.player_amateur.access",
      "Has ingresado al entorno con perfil y permisos de Área Jugador.",
      "You have accessed the demo environment with Amateur Player permissions.",
      "Accediches á contorna con perfil e permisos de Área Xogador.",
      "Has accedit a l'entorn amb perfil i permisos d'Àrea Jugador.",
      "Has accedit a l'entorn amb perfil i permisos d'Àrea Jugador.",
      "Jokalari Eremuaren profil eta baimenekin sartu zara ingurunean.",
      "لقد دخلت إلى البيئة التجريبية بصلاحيات منطقة اللاعبين الهواة.",
      "Entrou no ambiente de demonstração com permissões da Área do Jogador.",
      "Vous avez accédé à l'environnement avec les permissions de l'Espace Joueur.",
      "Sie haben den Demo-Bereich als Freizeitspieler betreten.",
      "Sei entrato nell'ambiente demo con permessi Area Giocatore.")

add_r("demo.roles.player_amateur.badge",
      "Área Jugador", "Player Area", "Área Xogador", "Àrea Jugador", "Àrea Jugador",
      "Jokalari Eremua", "منطقة اللاعب", "Área do Jogador", "Espace Joueur", "Spieler-Bereich", "Area Giocatore")

add_r("demo.roles.superadmin.access",
      "Has ingresado al entorno con perfil y permisos de Plataforma Global.",
      "You have accessed the demo environment with Global Platform SuperAdmin permissions.",
      "Accediches á contorna con perfil e permisos de Plataforma Global.",
      "Has accedit a l'entorn amb perfil i permisos de Plataforma Global.",
      "Has accedit a l'entorn amb perfil i permisos de Plataforma Global.",
      "Plataforma Globalaren profil eta baimenekin sartu zara ingurunean.",
      "لقد دخلت إلى البيئة التجريبية بصلاحيات المشرف العام للمنصة.",
      "Entrou no ambiente de demonstração como Superadministrador Global.",
      "Vous avez accédé à l'environnement avec les permissions SuperAdmin Global.",
      "Sie haben den Demo-Bereich mit globalen Plattform-Administratorrechten betreten.",
      "Sei entrato nell'ambiente demo con permessi di SuperAdmin Piattaforma Globale.")

add_r("demo.roles.superadmin.badge",
      "Plataforma Global", "Global Platform", "Plataforma Global", "Plataforma Global", "Plataforma Global",
      "Plataforma Globala", "المنصة العالمية", "Plataforma Global", "Plateforme Globale", "Globale Plattform", "Piattaforma Globale")

add_r("demo.roles.tenant_owner.access",
      "Has ingresado al entorno con perfil y permisos de Gestión Club.",
      "You have accessed the demo environment with Club Owner & Manager permissions.",
      "Accediches á contorna con perfil e permisos de Xestión Club.",
      "Has accedit a l'entorn amb perfil i permisos de Gestió Club.",
      "Has accedit a l'entorn amb perfil i permisos de Gestió Club.",
      "Klub Kudeaketaren profil eta baimenekin sartu zara ingurunean.",
      "لقد دخلت إلى البيئة التجريبية بصلاحيات مدير ومالك النادي.",
      "Entrou no ambiente de demonstração com permissões de Gestão do Clube.",
      "Vous avez accédé à l'environnement avec les permissions de Gestionnaire de Club.",
      "Sie haben den Demo-Bereich mit Club-Manager-Berechtigungen betreten.",
      "Sei entrato nell'ambiente demo con permessi di Gestione Circolo.")

add_r("demo.roles.tenant_owner.badge",
      "Gestión Club", "Club Management", "Xestión Club", "Gestió Club", "Gestió Club",
      "Klub Kudeaketa", "إدارة النادي", "Gestão do Clube", "Gestion du Club", "Club-Verwaltung", "Gestione Circolo")

add_r("demo.selectorToastDescription",
      "Abriendo selector de roles...", "Opening role switcher...", "Abrindo selector de roles...", "Obrint selector de rols...", "Obrint selector de rols...",
      "Rolen hautatzailea irekitzen...", "فتح نافذة اختيار الأدوار...", "A abrir seletor de funções...", "Ouverture du sélecteur de rôles...", "Öffne Rollen-Auswahl...", "Apertura selettore ruoli...")

add_r("demo.selectorToastTitle",
      "Selector de demo", "Demo switcher", "Selector de demo", "Selector de demo", "Selector de demo",
      "Demo hautatzailea", "محدد الأدوار التجريبية", "Seletor de demo", "Sélecteur de démo", "Demo-Auswahl", "Selettore demo")

add_r("demo.title",
      "Entorno Demo", "Demo Environment", "Contorna Demo", "Entorn Demo", "Entorn Demo",
      "Demo Ingurunea", "البيئة التجريبية", "Ambiente de Demonstração", "Environnement de Démo", "Demo-Umgebung", "Ambiente Demo")

add_r("demo.tryAs",
      "Probar como", "Test as", "Probar como", "Provar com a", "Provar com a",
      "Probatu gisa:", "تجربة كـ", "Experimentar como", "Tester en tant que", "Testen als", "Prova come")

# --- CLUB ---
add_r("club.kpi.iot_doors_connected",
      "Tornos y varchi automatizados", "Automated Turnstiles & Access Gates", "Tornos e portas automatizadas", "Torns i portes automatitzades", "Torns i portes automatitzades",
      "Tornu eta ate automatizatuak", "البوابات الإلكترونية المتصلة", "Torniquetes e portas automatizadas", "Tourniquets et accès automatisés", "Automatisierte Drehkreuze & Tore", "Tornelli e varchi automatizzati")

add_r("club.kpi.iot_lights_on",
      "Luces LED encendidas", "LED Lights Active", "Luces LED acesas", "Llums LED encesos", "Llums LED encesos",
      "Piztutako LED argiak", "أضواء LED المضاءة", "Luzes LED ligadas", "Éclairages LED allumés", "Aktive LED-Flutlichter", "Luci LED accese")

add_r("club.kpi.iot_summary",
      "Resumen Domótica IoT", "IoT Automation Summary", "Resumo Domótica IoT", "Resum Domòtica IoT", "Resum Domòtica IoT",
      "IoT Domotikaren Laburpena", "ملخص أتمتة إنترنت الأشياء", "Resumo Domótica IoT", "Synthèse Domotique IoT", "IoT-Automationsübersicht", "Riepilogo Domotica IoT")

add_r("club.kpi.occupancy_rate",
      "% Ocupación en Tiempo Real", "% Real-Time Occupancy", "% Ocupación en Tempo Real", "% Ocupació en Temps Real", "% Ocupació en Temps Real",
      "Denbora Errealeko Okupazio %a", "نسبة الإشغال لحظياً", "% Ocupação em Tempo Real", "% d'Occupation en Direct", "% Auslastung in Echtzeit", "% Occupazione in Tempo Reale")

add_r("club.kpi.revenue_month",
      "Facturación del Mes", "Monthly Revenue", "Facturación do Mes", "Facturació del Mes", "Facturació del Mes",
      "Hileko Fakturazioa", "إيرادات الشهر الحالي", "Faturação do Mês", "Chiffre d'Affaires du Mois", "Monatsumsatz", "Fatturato del Mese")

add_r("club.kpi.revenue_today",
      "Ingresos de Hoy", "Today's Revenue", "Ingresos de Hoxe", "Ingressos d'Avui", "Ingressos d'Avui",
      "Gaurko Sarrerak", "إيرادات اليوم", "Receitas de Hoje", "Recettes du Jour", "Heutiger Tagesumsatz", "Incassi di Oggi")

add_r("club.nav.academy",
      "Escuela / Entrenadores", "Academy & Coaches", "Escola / Adestradores", "Escola / Entrenadors", "Escola / Entrenadors",
      "Eskola / Irakasleak", "المدرسة والمدربون", "Escola / Treinadores", "École & Entraîneurs", "Schule & Trainer", "Scuola & Maestri")

add_r("club.nav.dashboard",
      "Inicio", "Dashboard", "Inicio", "Inici", "Inici",
      "Hasiera", "الرئيسية", "Início", "Tableau de Bord", "Übersicht", "Dashboard")

add_r("club.nav.domains",
      "Dominios y DNS", "Domains & DNS", "Dominios e DNS", "Dominis i DNS", "Dominis i DNS",
      "Domeinuak eta DNS", "النطاقات وخوادم DNS", "Domínios e DNS", "Domaines & DNS", "Domains & DNS", "Domini e DNS")

add_r("club.nav.logout",
      "Cerrar Sesión / Salir Demo", "Log Out / Exit Demo", "Pechar Sesión / Saír Demo", "Tancar Sessió / Sortir Demo", "Tancar Sessió / Sortir Demo",
      "Saioa Itxi / Atera Demotik", "تسجيل الخروج / مغادرة الديمو", "Terminar Sessão / Sair da Demo", "Déconnexion / Quitter Démo", "Abmelden / Demo beenden", "Disconnetti / Esci Demo")

add_r("club.nav.more",
      "Más", "More", "Máis", "Més", "Més", "Gehiago", "المزيد", "Mais", "Plus", "Mehr", "Altro")

add_r("club.nav.pos",
      "TPV / Caja", "POS & Cashier", "TPV / Caixa", "TPV / Caixa", "TPV / Caixa",
      "TPV / Kaxa", "نقطة البيع / الصندوق", "POS / Caixa", "Caisse & TPV", "Kasse & POS", "POS / Cassa")

add_r("club.nav.shop",
      "Tienda y Pedidos", "Shop & Orders", "Tenda e Pedidos", "Botiga i Comandes", "Botiga i Comandes",
      "Denda eta Eskaerak", "المتجر والطلبات", "Loja e Encomendas", "Boutique & Commandes", "Shop & Bestellungen", "Shop e Ordini")

add_r("club.nav.teams",
      "Equipos y Plantillas", "Club Teams & Rosters", "Equipos e Plantillas", "Equips i Plantilles", "Equips i Plantilles",
      "Taldeak eta Txantiloiak", "الفرق والتشكيلات", "Equipas e Plantéis", "Équipes & Effectifs", "Mannschaften & Kader", "Squadre e Rose")

add_r("club.nav.tournaments",
      "Torneos y Ligas", "Tournaments & Leagues", "Torneos e Ligas", "Tornejos i Lligues", "Tornejos i Lligues",
      "Txapelketak eta Ligak", "البطولات والدوريات", "Torneios e Ligas", "Tournois & Championnats", "Turniere & Ligen", "Tornei e Campionati")

add_r("club.nav.whitelabel",
      "Configuración de Marca Blanca", "White-Label Configuration", "Configuración de Marca Branca", "Configuració de Marca Blanca", "Configuració de Marca Blanca",
      "Marka Zuriaren Konfigurazioa", "إعدادات العلامة التجارية البيضاء", "Configuração de Marca Branca", "Paramètres Marque Blanche", "White-Label-Einstellungen", "Configurazione White Label")

add_r("club.status.closed",
      "Cerrado", "Closed", "Pechado", "Tancat", "Tancat", "Itxita", "مغلق", "Fechado", "Fermé", "Geschlossen", "Chiuso")

add_r("club.status.closed_desc",
      "Club cerrado temporalmente. Solo acceso personal de mantenimiento.",
      "Facility temporarily closed. Maintenance personnel only.",
      "Club pechado temporalmente. Só acceso persoal de mantemento.",
      "Club tancat temporalment. Només accés personal de manteniment.",
      "Club tancat temporalment. Només accés personal de manteniment.",
      "Kluba aldi baterako itxita. Mantentze-langileek bakarrik dute sarbidea.",
      "النادي مغلق مؤقتاً. الدخول مقتصر على طاقم الصيانة فقط.",
      "Clube temporariamente fechado. Apenas acesso da equipa de manutenção.",
      "Club temporairement fermé. Accès réservé au personnel de maintenance.",
      "Club vorübergehend geschlossen. Zutritt nur für Platzwarte und Personal.",
      "Circolo temporaneamente chiuso. Accesso consentito solo alla manutenzione.")

add_r("club.status.open",
      "Abierto", "Open", "Aberto", "Obert", "Obert", "Irekita", "مفتوح", "Aberto", "Ouvert", "Geöffnet", "Aperto")

add_r("club.status.open_desc",
      "Instalaciones abiertas y reservas en marcha.",
      "Facility operating normally and taking bookings.",
      "Instalacións abertas e reservas en marcha.",
      "Instal·lacions obertes i reserves en marxa.",
      "Instal·lacions obertes i reserves en marxa.",
      "Instalazioak irekita eta erreserbak martxan.",
      "الملاعب مفتوحة واستقبال الحجوزات يعمل بشكل طبيعي.",
      "Instalações abertas e reservas a decorrer.",
      "Installations ouvertes et réservations en cours.",
      "Anlage geöffnet, Spiel- und Buchungsbetrieb aktiv.",
      "Struttura aperta e prenotazioni attive.")

add_r("club.status.toggle",
      "Estado del Club", "Facility Operational Status", "Estado do Club", "Estat del Club", "Estat del Club",
      "Klubaren Egoera", "حالة النادي التشغيلية", "Estado do Clube", "Statut du Club", "Club-Status", "Stato del Circolo")

# --- CORPORATE CONTACT ---
add_r("corporateContact.title",
      "Hablemos sobre el futuro digital de tu club de pádel",
      "Let's discuss the digital future of your padel club",
      "Falemos sobre o futuro dixital do teu club de pádel",
      "Parlem sobre el futur digital del teu club de pàdel",
      "Parlem sobre el futur digital del teu club de pàdel",
      "Hitz egin dezagun zure padel klubaren etorkizun digitalaz",
      "لنتحدث عن المستقبل الرقمي لنادي البادل الخاص بك",
      "Vamos conversar sobre o futuro digital do seu clube de padel",
      "Échangeons sur l'avenir numérique de votre club de padel",
      "Lassen Sie uns über die digitale Zukunft Ihres Padel-Clubs sprechen",
      "Parliamo del futuro digitale del tuo circolo padel")

add_r("corporateContact.subtitle",
      "Nuestro equipo de consultores y especialistas en software deportivo está a tu disposición para asesorarte sobre domótica IoT, migración de datos y planes a medida.",
      "Our software and sports engineering consultants are ready to advise on IoT court automation, frictionless data migration, and tailored plans.",
      "O noso equipo de consultores e especialistas en software deportivo está á túa disposición para asesorarte sobre domótica IoT, migración de datos e plans a medida.",
      "El nostre equip de consultors i especialistes en programari esportiu està a la teva disposició per assessorar-te sobre domòtica IoT, migració de dades i plans a mida.",
      "El nostre equip de consultors i especialistes en programari esportiu està a la teva disposició per assessorar-te sobre domòtica IoT, migració de dades i plans a mida.",
      "Gure kirol-softwareko aditu eta aholkulari taldea zure esku dago IoT domotikari, datuen migrazioari eta neurrira egindako planei buruz aholkatzeko.",
      "فريقنا من الاستشاريين ومهندسي البرمجيات الرياضية مستعد لتقديم المشورة بشأن أتمتة الملاعب ونقل البيانات والباقات المخصصة.",
      "A nossa equipa de consultores e especialistas está ao seu dispor para aconselhar sobre domótica IoT, migração de dados e planos à medida.",
      "Notre équipe d'experts est à votre disposition pour vous conseiller sur la domotique IoT, la migration des données et nos solutions sur mesure.",
      "Unser Team aus Sportsoftware-Spezialisten berät Sie gerne zu IoT-Platzsteuerung, Datenmigration und individuellen Angeboten.",
      "Il nostro team di consulenti e specialisti è a tua disposizione per consigliarti su domotica IoT, migrazione dati e piani personalizzati.")

add_r("corporateContact.form.title",
      "Solicita un Estudio de Digitalización o Contacta con Nosotros",
      "Request a Digitalization Assessment or Reach Out",
      "Solicita un Estudo de Dixitalización ou Contacta Connosco",
      "Sol·licita un Estudi de Digitalització o Contacta amb Nosaltres",
      "Sol·licita un Estudi de Digitalització o Contacta amb Nosaltres",
      "Eskatu Digitalizazio Azterketa edo Jarri Harremanetan Gurekin",
      "اطلب دراسة التحول الرقمي أو تواصل معنا مباشرة",
      "Solicite um Estudo de Digitalização ou Fale Connosco",
      "Demandez une Étude de Digitalisation ou Contactez-Nous",
      "Digitalisierungsanalyse anfordern oder Kontakt aufnehmen",
      "Richiedi uno Studio di Digitalizzazione o Contattaci")

add_r("corporateContact.sales.title",
      "Ventas & Demostraciones", "Sales & Demonstrations", "Vendas e Demostracións", "Vendes i Demostracions", "Vendes i Demostracions",
      "Salmentak eta Erakustaldiak", "المبيعات والعروض التجريبية", "Vendas e Demonstrações", "Ventes & Démonstrations", "Vertrieb & Live-Demos", "Vendite e Dimostrazioni")

add_r("corporateContact.sales.desc",
      "Asesoramiento para comités, gerentes de club y academias. Demo personalizada en menos de 24h.",
      "Consulting for club owners, managers, and academies. Personalized walkthrough scheduled within 24h.",
      "Asesoramento para comités, xerentes de club e academias. Demo personalizada en menos de 24h.",
      "Assessorament per a comitès, gerents de club i acadèmies. Demo personalitzada en menys de 24h.",
      "Assessorament per a comitès, gerents de club i acadèmies. Demo personalitzada en menys de 24h.",
      "Klubeko batzorde, kudeatzaile eta akademientzako aholkularitza. Demo pertsonalizatua 24 ordu baino gutxiagoan.",
      "استشارات مخصصة لإدارات الأندية والأكاديميات. عرض تجريبي مخصص خلال أقل من 24 ساعة.",
      "Aconselhamento para direções, gerentes de clube e academias. Demo personalizada em menos de 24h.",
      "Conseil pour dirigeants, gérants de club et académies. Démo personnalisée sous 24h.",
      "Beratung für Vorstände, Clubbetreiber und Akademien. Maßgeschneiderte Demo innerhalb von 24h.",
      "Consulenza per comitati, gestori di circolo e accademie. Demo personalizzata entro 24 ore.")

add_r("corporateContact.sales.action",
      "Agendar Demo de 20 min", "Schedule 20-min Demo", "Axendar Demo de 20 min", "Programar Demo de 20 min", "Programar Demo de 20 min",
      "Antolatu 20 minutuko Demoa", "حجز موعد لعرض 20 دقيقة", "Agendar Demo de 20 min", "Planifier Démo de 20 min", "20-Minuten-Demo vereinbaren", "Prenota Demo di 20 min")

add_r("corporateContact.support.title",
      "Soporte Técnico & Hardware IoT", "Technical Support & IoT Hardware", "Soporte Técnico e Hardware IoT", "Suport Tècnic i Maquinari IoT", "Suport Tècnic i Maquinari IoT",
      "Laguntza Teknikoa eta IoT Hardwarea", "الدعم الفني وأجهزة إنترنت الأشياء", "Suporte Técnico e Hardware IoT", "Support Technique & Matériel IoT", "Technischer Support & IoT-Hardware", "Supporto Tecnico e Hardware IoT")

add_r("corporateContact.support.desc",
      "Asistencia técnica para cuadros eléctricos, relés IP, tornos de acceso y pasarelas bancarias.",
      "Technical assistance for control panels, IP relays, access turnstiles, and payment gateways.",
      "Asistencia técnica para cadros eléctricos, relés IP, tornos de acceso e pasarelas bancarias.",
      "Assistència tècnica per a quadres elèctrics, relés IP, torns d'accés i passarel·les bancàries.",
      "Assistència tècnica per a quadres elèctrics, relés IP, torns d'accés i passarel·les bancàries.",
      "Laguntza teknikoa koadro elektrikoentzat, IP erreleentzat, sarbide-tornuentzat eta banku-pasabideentzat.",
      "مساعدة تقنية فورية للوحات التحكم الكهربائية، مرحلات الشبكة، البوابات وبوابات الدفع البنكي.",
      "Assistência técnica para quadros elétricos, relés IP, torniquetes de acesso e gateways de pagamento.",
      "Assistance technique pour armoires électriques, relais IP, tourniquets et passerelles bancaires.",
      "Technischer Support für Schaltschränke, IP-Relais, Drehkreuze und Bank-Gateways.",
      "Assistenza tecnica per quadri elettrici, relè IP, tornelli e gateway di pagamento.")

add_r("corporateContact.support.action",
      "Canal Técnico WhatsApp", "WhatsApp Tech Channel", "Canle Técnico WhatsApp", "Canal Tècnic WhatsApp", "Canal Tècnic WhatsApp",
      "WhatsApp bidezko Kanal Teknikoa", "قناة الدعم الفني عبر واتساب", "Canal Técnico no WhatsApp", "Canal Technique WhatsApp", "WhatsApp-Supportkanal", "Canale Tecnico WhatsApp")

add_r("corporateContact.partners.title",
      "Alianzas, Cadenas & Federaciones", "Partnerships, Chains & Federations", "Alianzas, Cadeas e Federacións", "Aliances, Cadenes i Federacions", "Aliances, Cadenes i Federacions",
      "Aliantzak, Kateak eta Federazioak", "الشراكات، السلاسل الرياضية والاتحادات", "Parcerias, Cadeias e Federações", "Partenariats, Réseaux & Fédérations", "Partnerschaften, Ketten & Verbände", "Partnership, Catene e Federazioni")

add_r("corporateContact.partners.desc",
      "Integraciones API a medida, acuerdos federativos e implantaciones multi-sede a escala internacional.",
      "Custom REST API integrations, regional federation partnerships, and international multi-location rollouts.",
      "Integracións API a medida, acordos federativos e implantacións multi-sede a escala internacional.",
      "Integracions API a mida, acords federatius i implantacions multiseu a escala internacional.",
      "Integracions API a mida, acords federatius i implantacions multiseu a escala internacional.",
      "Neurrira egindako API integrazioak, federazio-hitzarmenak eta nazioarteko egoitza anitzeko ezarpenak.",
      "ربط برمجي API مخصص، اتفاقيات مع الاتحادات الرياضية ونشر الأنظمة في الفروع الدولية.",
      "Integrações de API à medida, acordos federativos e implementações multi-sede internacionais.",
      "Intégrations API sur mesure, accords fédéraux et déploiements multi-sites internationaux.",
      "Maßgeschneiderte API-Integrationen, Verbandskooperationen und internationale Multi-Standort-Rollouts.",
      "Integrazioni API su misura, accordi con federazioni ed espansione multi-sede internazionale.")

add_r("corporateContact.partners.action",
      "Contactar con Dirección", "Contact Management", "Contactar con Dirección", "Contactar amb Direcció", "Contactar amb Direcció",
      "Jarri Harremanetan Zuzendaritzarekin", "التواصل مع الإدارة العليا", "Contactar com a Direção", "Contacter la Direction", "Geschäftsleitung kontaktieren", "Contatta la Direzione")

add_r("corporateContact.faqSubtitle",
      "Todo lo que necesitas saber sobre migración, hardware y modelo de negocio.",
      "Everything you need to know about migration, hardware, and pricing.",
      "Todo o que necesitas saber sobre migración, hardware e modelo de negocio.",
      "Tot el que necessites saber sobre migració, maquinari i model de negoci.",
      "Tot el que necessites saber sobre migració, maquinari i model de negoci.",
      "Migrazioari, hardwareari eta negozio-ereduari buruz jakin behar duzun guztia.",
      "كل ما تحتاج لمعرفته حول نقل البيانات، الأجهزة ونموذج العمل.",
      "Tudo o que precisa de saber sobre migração, hardware e modelo de negócio.",
      "Tout ce que vous devez savoir sur la migration, le matériel et notre modèle tarifaire.",
      "Alles Wissenswerte über Datenmigration, Hardware und Geschäftsmodelle.",
      "Tutto quello che devi sapere su migrazione dati, hardware e modello di business.")

add_r("corporateContact.faqs.0.q",
      "¿Cómo es el proceso de migración de datos desde nuestro software actual?",
      "How does data migration from our existing software work?",
      "Como é o proceso de migración de datos desde o noso software actual?",
      "Com és el procés de migració de dades des del nostre programari actual?",
      "Com és el procés de migració de dades des del nostre programari actual?",
      "Nolakoa da datuen migrazio-prozesua gure egungo softwaretik?",
      "كيف تتم عملية نقل البيانات من برنامجنا الحالي إلى ستميو؟",
      "Como funciona o processo de migração de dados do nosso software atual?",
      "Comment se déroule la migration des données depuis notre logiciel actuel ?",
      "Wie läuft die Datenmigration von unserer bisherigen Software ab?",
      "Come funziona il processo di migrazione dati dal nostro software attuale?")

add_r("corporateContact.faqs.0.a",
      "Nuestro equipo de ingeniería se encarga del 100% de la migración de tu base de socios, historiales y reservas en menos de 24 horas sin interrumpir la operación habitual de tu club.",
      "Our engineering team handles 100% of your member base, booking histories, and financial data migration in under 24 hours without interrupting daily operations.",
      "O noso equipo de enxeñaría encárgase do 100% da migración da túa base de socios, historiais e reservas en menos de 24 horas sen interromper a operación habitual do teu club.",
      "El nostre equip d'enginyeria s'encarrega del 100% de la migració de la teva base de socis, historials i reserves en menys de 24 hores sense interrompre l'operació habitual del teu club.",
      "El nostre equip d'enginyeria s'encarrega del 100% de la migració de la teva base de socis, historials i reserves en menys de 24 hores sense interrompre l'operació habitual del teu club.",
      "Gure ingeniaritza-taldeak zure bazkideen datu-basearen, historikoen eta erreserben migrazioaren %100 egiten du 24 ordu baino gutxiagoan, zure klubaren ohiko jarduera eten gabe.",
      "يتولى فريقنا الهندسي نقل 100% من بيانات الأعضاء، السجلات والحجوزات خلال أقل من 24 ساعة دون أي انقطاع في عمل ناديك.",
      "A nossa equipa de engenharia trata de 100% da migração da base de sócios, históricos e reservas em menos de 24 horas sem interromper as operações do clube.",
      "Notre équipe d'ingénierie prend en charge 100% de la migration de vos membres, historiques et réservations en moins de 24 heures sans interruption d'activité.",
      "Unser Entwicklerteam übernimmt 100% der Migration Ihrer Mitgliederdaten, Historie und Buchungen in unter 24 Stunden ohne Betriebsunterbrechung.",
      "Il nostro team tecnico gestisce il 100% della migrazione di soci, storico e prenotazioni in meno di 24 ore senza interrompere l'attività del circolo.")

add_r("corporateContact.faqs.1.q",
      "¿Cuánto tiempo requiere la instalación de la domótica de luces y accesos?",
      "How long does it take to install court lighting and access automation?",
      "Canto tempo require a instalación da domótica de luces e accesos?",
      "Quant de temps requereix la instal·lació de la domòtica de llums i accessos?",
      "Quant de temps requereix la instal·lació de la domòtica de llums i accessos?",
      "Zenbat denbora behar da argien eta sarbideen domotika instalatzeko?",
      "كم من الوقت يستغرق تركيب أجهزة أتمتة الإضاءة والبوابات في الملاعب؟",
      "Quanto tempo demora a instalação da domótica de luzes e acessos?",
      "Combien de temps faut-il pour installer la domotique d'éclairage et d'accès ?",
      "Wie lange dauert die Installation der IoT-Licht- und Zutrittssteuerung?",
      "Quanto tempo richiede l'installazione della domotica per luci e accessi?")

add_r("corporateContact.faqs.3.q",
      "¿El software incluye aplicación móvil de marca blanca para nuestros socios?",
      "Does the software include a white-label mobile app for our members?",
      "O software inclúe aplicación móbil de marca branca para os nosos socios?",
      "El programari inclou aplicació mòbil de marca blanca per als nostres socis?",
      "El programari inclou aplicació mòbil de marca blanca per als nostres socis?",
      "Softwareak marka zuriko aplikazio mugikorra barne hartzen al du gure bazkideentzat?",
      "هل يشتمل البرنامج على تطبيق جوال بعلامة تجارية بيضاء مخصصة لأعضائنا؟",
      "O software inclui aplicação móvel de marca branca para os nossos sócios?",
      "Le logiciel comprend-il une application mobile en marque blanche pour nos membres ?",
      "Enthält die Software eine eigene White-Label-App für unsere Mitglieder?",
      "Il software include un'applicazione mobile white label per i nostri soci?")

add_r("corporateContact.faqs.3.a",
      "Sí. Tu club dispondrá de su propia web y app corporativa con tu logotipo, colores oficiales y dominio dedicado (ej. tuclub.com), sin referencias visibles a proveedores externos.",
      "Yes. Your facility receives its dedicated website and mobile app featuring your logo, official colors, and custom domain with zero third-party branding.",
      "Si. O teu club disporá da súa propia web e app corporativa co teu logotipo, cores oficiais e dominio dedicado (ex. oteuclub.com), sen referencias visibles a provedores externos.",
      "Sí. El teu club disposarà del seu propi web i app corporativa amb el teu logotip, colors oficials i domini dedicat (ex. elteuclub.cat), sense referències visibles a proveïdors externs.",
      "Sí. El teu club disposarà del seu propi web i app corporativa amb el teu logotip, colors oficials i domini dedicat (ex. elteuclub.com), sense referències visibles a proveïdors externs.",
      "Bai. Zure klubak bere webgunea eta aplikazio korporatiboa izango ditu zure logotipoarekin, kolore ofizialekin eta domeinu dedikatuarekin, kanpoko hornitzaileen aipamenik gabe.",
      "نعم. سيحصل ناديك على موقع وتطبيق خاص يحمل شعارك، ألوانك ونطاقك المستقل، بدون أي إشارة لشركات خارجية.",
      "Sim. O seu clube terá site e app corporativa própria com logótipo, cores oficiais e domínio dedicado sem referências externas visíveis.",
      "Oui. Votre club disposera de son propre site et application mobile à vos couleurs, avec votre logo et votre nom de domaine, sans référence à un tiers.",
      "Ja. Ihr Club erhält eine eigene Website und mobile App mit eigenem Logo, Clubfarben und Wunsch-Domain ganz ohne Drittanbieter-Hinweise.",
      "Sì. Il tuo circolo avrà il proprio sito web e app mobile con logo, colori ufficiali e dominio dedicato, senza riferimenti a fornitori terzi.")

add_r("corporateContact.faqs.4.q",
      "¿Qué formación y soporte técnico recibe nuestro equipo de recepción?",
      "What training and technical support does our front desk staff receive?",
      "Que formación e soporte técnico recibe o noso equipo de recepción?",
      "Quina formació i suport tècnic rep el nostre equip de recepció?",
      "Quina formació i suport tècnic rep el nostre equip de recepció?",
      "Zer prestakuntza eta laguntza tekniko jasotzen du gure harrerako lantaldeak?",
      "ما نوع التدريب والدعم الفني الذي يتلقاه موظفو الاستقبال في نادينا؟",
      "Que formação e apoio técnico recebe a nossa equipa de receção?",
      "Quelle formation et assistance technique reçoit notre équipe d'accueil ?",
      "Welche Schulung und technischen Support erhält unser Rezeptionsteam?",
      "Che formazione e supporto tecnico riceve il nostro personale di reception?")

add_r("corporateContact.faqs.4.a",
      "Ofrecemos formación telefónica y por videollamada personalizada para gerencia y personal de mostrador, además de soporte técnico prioritario los 365 días del año.",
      "We provide personalized video calls and live onboarding for managers and front-desk staff, along with priority technical support 365 days a year.",
      "Ofrecemos formación telefónica e por videochamada personalizada para xerencia e persoal de recepción, ademais de soporte técnico prioritario os 365 días do ano.",
      "Oferim formació telefònica i per videotrucada personalitzada per a gerència i personal de taulell, a més de suport tècnic prioritari els 365 dies de l'any.",
      "Oferim formació telefònica i per videotrucada personalitzada per a gerència i personal de taulell, a més de suport tècnic prioritari els 365 dies de l'any.",
      "Prestakuntza pertsonalizatua eskaintzen dugu telefonoz eta bideo-dei bidez kudeatzaileentzat eta harrerako langileentzat, bai eta lehentasunezko laguntza teknikoa urteko 365 egunetan ere.",
      "نوفر تدريباً شخصياً عبر الهاتف ومكالمات الفيديو للإدارة وموظفي الاستقبال، بالإضافة إلى دعم فني ذو أولوية على مدار 365 يوماً في السنة.",
      "Disponibilizamos formação personalizada por telefone e videochamada para gerência e receção, além de suporte prioritário 365 dias por ano.",
      "Nous assurons des formations personnalisées en visioconférence pour la direction et l'accueil, ainsi qu'un support prioritaire 365 jours par an.",
      "Wir bieten individuelle Video- und Telefonschulungen für Betreiber und Empfangspersonal sowie prioritären Support an 365 Tagen im Jahr.",
      "Offriamo formazione personalizzata via telefono e videochiamata per la direzione e il personale, oltre a supporto prioritario 365 giorni l'anno.")

add_r("corporateContact.toastSuccess",
      "Solicitud Corporativa Enviada", "Corporate Request Submitted", "Solicitude Corporativa Enviada", "Sol·licitud Corporativa Enviada", "Sol·licitud Corporativa Enviada",
      "Eskaera Korporatiboa Bidalita", "تم إرسال الطلب بنجاح", "Pedido Corporativo Enviado", "Demande Entreprise Envoyée", "Unternehmensanfrage gesendet", "Richiesta Aziendale Inviata")

# --- BLOG ---
add_r("blog.categories.tecnica",
      "Técnica & Táctica", "Technique & Tactics", "Técnica e Táctica", "Tècnica i Tàctica", "Tècnica i Tàctica",
      "Teknika eta Taktika", "التكنيك والتكتيك الرياضي", "Técnica e Tática", "Technique & Tactique", "Technik & Taktik", "Tecnica e Tattica")

add_r("blog.filters.tecnica",
      "Técnica & Táctica", "Technique & Tactics", "Técnica e Táctica", "Tècnica i Tàctica", "Tècnica i Tàctica",
      "Teknika eta Taktika", "التكنيك والتكتيك الرياضي", "Técnica e Tática", "Technique & Tactique", "Technik & Taktik", "Tecnica e Tattica")

add_r("blog.readingTime",
      "min de lectura", "min read", "min de lectura", "min de lectura", "min de lectura",
      "irakurketa min", "دقائق قراءة", "min de leitura", "min de lecture", "Min. Lesezeit", "min di lettura")

add_r("blog.readingTimeShort",
      "min de lectura", "min read", "min de lectura", "min de lectura", "min de lectura",
      "irakurketa min", "دقائق قراءة", "min de leitura", "min de lecture", "Min. Lesezeit", "min di lettura")

add_r("blog.tags",
      "Etiquetas", "Tags", "Etiquetas", "Etiquetes", "Etiquetes",
      "Etiketak", "الوسوم", "Etiquetas", "Mots-clés", "Schlagwörter", "Tag")

add_r("blog.posts.blog-1.readingTime",
      "4 min de lectura", "4 min read", "4 min de lectura", "4 min de lectura", "4 min de lectura",
      "4 min irakurketa", "4 دقائق قراءة", "4 min de leitura", "4 min de lecture", "4 Min. Lesezeit", "4 min di lettura")

add_r("blog.posts.blog-2.author",
      "Laura Senra · Preparadora Física", "Laura Senra · Fitness Coach", "Laura Senra · Preparadora Física", "Laura Senra · Preparadora Física", "Laura Senra · Preparadora Física",
      "Laura Senra · Prestatzaile Fisikoa", "لاورا سينرا · معدة بدنية رياضية", "Laura Senra · Preparadora Física", "Laura Senra · Préparatrice Physique", "Laura Senra · Fitnesstrainerin", "Laura Senra · Preparatrice Atletica")

add_r("blog.posts.blog-2.readingTime",
      "5 min de lectura", "5 min read", "5 min de lectura", "5 min de lectura", "5 min de lectura",
      "5 min irakurketa", "5 دقائق قراءة", "5 min de leitura", "5 min de lecture", "5 Min. Lesezeit", "5 min di lettura")

add_r("blog.posts.blog-2.tags",
      "Pistas, WPT, Mondo, Mantenimiento", "Courts, WPT, Turf, Maintenance", "Pistas, WPT, Mondo, Mantemento", "Pistes, WPT, Mondo, Manteniment", "Pistes, WPT, Mondo, Manteniment",
      "Kantxak, WPT, Mondo, Mantentzea", "ملاعب، تورنتو، عشب صناعي، صيانة", "Campos, WPT, Mondo, Manutenção", "Courts, WPT, Gazon, Entretien", "Plätze, WPT, Kunstrasen, Wartung", "Campi, WPT, Mondo, Manutenzione")

add_r("blog.posts.blog-3.author",
      "Dr. Marcos Rey · Fisioterapeuta Deportivo", "Dr. Marcos Rey · Sports Physiotherapist", "Dr. Marcos Rey · Fisioterapeuta Deportivo", "Dr. Marcos Rey · Fisioterapeuta Esportiu", "Dr. Marcos Rey · Fisioterapeuta Esportiu",
      "Dr. Marcos Rey · Kirol Fisioterapeuta", "د. ماركوس ري · أخصائي العلاج الطبيعي الرياضي", "Dr. Marcos Rey · Fisioterapeuta Desportivo", "Dr. Marcos Rey · Kinésithérapeute du Sport", "Dr. Marcos Rey · Sportphysiotherapeut", "Dott. Marcos Rey · Fisioterapista Sportivo")

add_r("blog.posts.blog-3.readingTime",
      "6 min de lectura", "6 min read", "6 min de lectura", "6 min de lectura", "6 min de lectura",
      "6 min irakurketa", "6 دقائق قراءة", "6 min de leitura", "6 min de lecture", "6 Min. Lesezeit", "6 min di lettura")

# --- REGISTER ---
add_r("register.captainTitle",
      "Habilitar perfil de Capitán de Equipo", "Enable Team Captain Profile", "Habilitar perfil de Capitán de Equipo", "Habilitar perfil de Capità d'Equip", "Habilitar perfil de Capità d'Equip",
      "Gaitu Taldeko Kapitainaren profila", "تفعيل ملف كابتن الفريق", "Ativar perfil de Capitão de Equipa", "Activer le profil Capitaine d'Équipe", "Team-Kapitän-Profil aktivieren", "Abilita profilo Capitano di Squadra")

add_r("register.level.beginner",
      "Principiante (1.0 - 2.0)", "Beginner (1.0 - 2.0)", "Iniciación (1.0 - 2.0)", "Principiant (1.0 - 2.0)", "Principiant (1.0 - 2.0)",
      "Hasiberria (1.0 - 2.0)", "مبتدئ (1.0 - 2.0)", "Iniciante (1.0 - 2.0)", "Débutant (1.0 - 2.0)", "Einsteiger (1.0 - 2.0)", "Principiante (1.0 - 2.0)")

add_r("register.level.intermediate",
      "Intermedio / Nivel Club (3.5 - 4.0)", "Intermediate / Club Level (3.5 - 4.0)", "Intermedio / Nivel Club (3.5 - 4.0)", "Intermedi / Nivell Club (3.5 - 4.0)", "Intermedi / Nivell Club (3.5 - 4.0)",
      "Tartekoa / Klub Maila (3.5 - 4.0)", "متوسط / مستوى النادي (3.5 - 4.0)", "Intermédio / Nível Clube (3.5 - 4.0)", "Intermédiaire / Niveau Club (3.5 - 4.0)", "Mittelstufe / Club-Niveau (3.5 - 4.0)", "Intermedio / Livello Circolo (3.5 - 4.0)")

add_r("register.level.intermediateHigh",
      "Intermedio Avanzado (3.5 - 4.0)", "Upper Intermediate (3.5 - 4.0)", "Intermedio Avanzado (3.5 - 4.0)", "Intermedi Avançat (3.5 - 4.0)", "Intermedi Avançat (3.5 - 4.0)",
      "Tarteko Aurreratua (3.5 - 4.0)", "متوسط متقدم (3.5 - 4.0)", "Intermédio Avançado (3.5 - 4.0)", "Intermédiaire Avancé (3.5 - 4.0)", "Fortgeschritten (3.5 - 4.0)", "Intermedio Avanzato (3.5 - 4.0)")

add_r("register.level.advanced",
      "Avanzado (4.5 - 5.0)", "Advanced (4.5 - 5.0)", "Avanzado (4.5 - 5.0)", "Avançat (4.5 - 5.0)", "Avançat (4.5 - 5.0)",
      "Aurreratua (4.5 - 5.0)", "متقدم (4.5 - 5.0)", "Avançado (4.5 - 5.0)", "Avancé (4.5 - 5.0)", "Sehr Fortgeschritten (4.5 - 5.0)", "Avanzato (4.5 - 5.0)")

add_r("register.level.competition",
      "Competición (5.0 - 5.5)", "Competition (5.0 - 5.5)", "Competición (5.0 - 5.5)", "Competició (5.0 - 5.5)", "Competició (5.0 - 5.5)",
      "Lehiaketa (5.0 - 5.5)", "مستوى المنافسات (5.0 - 5.5)", "Competição (5.0 - 5.5)", "Compétition (5.0 - 5.5)", "Wettkampf (5.0 - 5.5)", "Agonistico (5.0 - 5.5)")

add_r("register.level.pro",
      "Alta Competición / Pro (5.5+)", "Pro Circuit / Elite (5.5+)", "Alta Competición / Pro (5.5+)", "Alta Competició / Pro (5.5+)", "Alta Competició / Pro (5.5+)",
      "Goi Mailako Lehiaketa / Pro (5.5+)", "محترف / نخبة (5.5+)", "Alta Competição / Pro (5.5+)", "Haute Compétition / Pro (5.5+)", "Profi-Circuit / Elite (5.5+)", "Alta Competizione / Pro (5.5+)")

add_r("register.passwordMin",
      "Mínimo 6 caracteres", "Minimum 6 characters", "Mínimo 6 caracteres", "Mínim 6 caràcters", "Mínim 6 caràcters",
      "Gutxienez 6 karaktere", "6 أحرف كحد أدنى", "Mínimo 6 caracteres", "6 caractères minimum", "Mindestens 6 Zeichen", "Minimo 6 caratteri")

add_r("register.position",
      "Posición:", "Court Position:", "Posición:", "Posició:", "Posició:",
      "Posizioa:", "جهة اللعب في الملعب:", "Posição em Campo:", "Côté de jeu :", "Position auf dem Platz:", "Posizione in Campo:")

add_r("register.roles.coach_club.title",
      "Profesor de Club", "Club Coach", "Profesor de Club", "Professor de Club", "Professor de Club",
      "Klubeko Irakaslea", "مدرب النادي", "Treinador do Clube", "Entraîneur du Club", "Club-Trainer", "Maestro del Circolo")

add_r("register.step.account",
      "1. Cuenta", "1. Account", "1. Conta", "1. Compte", "1. Compte",
      "1. Kontua", "1. بيانات الحساب", "1. Conta", "1. Compte", "1. Benutzerkonto", "1. Account")

add_r("register.step.sports",
      "2. Perfil deportivo", "2. Player Profile", "2. Perfil deportivo", "2. Perfil esportiu", "2. Perfil esportiu",
      "2. Kirol profila", "2. الملف الرياضي", "2. Perfil desportivo", "2. Profil Sportif", "2. Spielerprofil", "2. Profilo Sportivo")

# --- FOOTER ---
add_r("footer.booking",
      "Reservar Pista Online", "Book Court Online", "Reservar Pista Online", "Reservar Pista Online", "Reservar Pista Online",
      "Erreserbatu Kantxa Sarean", "حجز ملعب عبر الإنترنت", "Reservar Campo Online", "Réserver un Court en Ligne", "Platz online buchen", "Prenota Campo Online")

add_r("footer.contactSupportActive",
      "Soporte técnico 24/7 activo", "24/7 Technical Support Active", "Soporte técnico 24/7 activo", "Suport tècnic 24/7 actiu", "Suport tècnic 24/7 actiu",
      "24/7 laguntza teknikoa aktibo", "دعم فني متاح 24/7", "Suporte técnico 24/7 ativo", "Support technique 24h/24 et 7j/7 actif", "24/7 Technischer Support aktiv", "Supporto tecnico 24/7 attivo")

add_r("footer.contactTitle",
      "Contacto & Soporte", "Contact & Support", "Contacto e Soporte", "Contacte i Suport", "Contacte i Suport",
      "Harremana eta Laguntza", "الاتصال والدعم الفني", "Contacto e Suporte", "Contact & Assistance", "Kontakt & Support", "Contatto e Supporto")

add_r("footer.faq",
      "Preguntas Frecuentes (FAQ)", "Frequently Asked Questions (FAQ)", "Preguntas Frecuentes (FAQ)", "Preguntes Freqüents (FAQ)", "Preguntes Freqüents (FAQ)",
      "Galdera Ohikoak (FAQ)", "الأسئلة الشائعة (FAQ)", "Perguntas Frequentes (FAQ)", "Foire Aux Questions (FAQ)", "Häufige Fragen (FAQ)", "Domande Frequenti (FAQ)")

add_r("footer.platformDemo",
      "Explorar demo por rol", "Explore Demo by Role", "Explorar demo por rol", "Explorar demo per rol", "Explorar demo per rol",
      "Arakatu demoa rolaren arabera", "استكشاف الديمو بحسب الدور", "Explorar demo por função", "Explorer la démo par rôle", "Demo nach Rolle erkunden", "Esplora demo per ruolo")

add_r("footer.privateClasses",
      "Clases Particulares & Adultos", "Private Lessons & Adults", "Clases Particulares e Adultos", "Classes Particulars i Adults", "Classes Particulars i Adults",
      "Eskola Partikularrak eta Helduak", "الدروس الخصوصية والكبار", "Aulas Particulares e Adultos", "Cours Particuliers & Adultes", "Einzelunterricht & Erwachsenentraining", "Lezioni Private e Adulti")

add_r("footer.solutionsAi",
      "Copiloto IA 24/7 en WhatsApp", "24/7 AI WhatsApp Copilot", "Copiloto IA 24/7 en WhatsApp", "Copilot IA 24/7 a WhatsApp", "Copilot IA 24/7 a WhatsApp",
      "24/7 IA Laguntzailea WhatsApp-en", "مساعد ذكي 24/7 على واتساب", "Copiloto IA 24/7 no WhatsApp", "Assistant IA 24/7 sur WhatsApp", "24/7-KI-Copilot auf WhatsApp", "Assistente IA 24/7 su WhatsApp")

add_r("footer.solutionsIot",
      "Domótica IoT de Pistas", "Court IoT Automation", "Domótica IoT de Pistas", "Domòtica IoT de Pistes", "Domòtica IoT de Pistes",
      "Kantxen IoT Domotika", "أتمتة إنترنت الأشياء للملاعب", "Domótica IoT de Campos", "Domotique IoT des Terrains", "IoT-Platzsteuerung", "Domotica IoT per Campi")

add_r("footer.solutionsTitle",
      "Soluciones", "Solutions", "Solucións", "Solucions", "Solucions",
      "Irtenbideak", "الحلول البرمجية", "Soluções", "Solutions", "Lösungen", "Soluzioni")

add_r("footer.tournaments",
      "Torneos & Ligas", "Tournaments & Leagues", "Torneos e Ligas", "Tornejos i Lligues", "Tornejos i Lligues",
      "Txapelketak eta Ligak", "البطولات والدوريات", "Torneios e Ligas", "Tournois & Ligues", "Turniere & Ligen", "Tornei e Campionati")

# --- COMMON ---
add_r("common.date",
      "Fecha", "Date", "Data", "Data", "Data", "Data", "التاريخ", "Data", "Date", "Datum", "Data")

add_r("common.delete",
      "Eliminar", "Delete", "Eliminar", "Eliminar", "Eliminar", "Ezabatu", "حذف", "Eliminar", "Supprimer", "Löschen", "Elimina")

add_r("common.details",
      "Detalles", "Details", "Detalles", "Detalls", "Detalls", "Xehetasunak", "التفاصيل", "Detalhes", "Détails", "Details", "Dettagli")

add_r("common.edit",
      "Editar", "Edit", "Editar", "Editar", "Editar", "Editatu", "تعديل", "Editar", "Modifier", "Bearbeiten", "Modifica")

add_r("common.loading",
      "Cargando...", "Loading...", "Cargando...", "Carregant...", "Carregant...", "Kargatzen...", "جارٍ التحميل...", "A carregar...", "Chargement...", "Laden...", "Caricamento...")

add_r("common.publish",
      "Publicar", "Publish", "Publicar", "Publicar", "Publicar", "Argitaratu", "نشر", "Publicar", "Publier", "Veröffentlichen", "Pubblica")

add_r("common.time",
      "Horario", "Time / Schedule", "Horario", "Horari", "Horari", "Ordutegia", "التوقيت", "Horário", "Horaire", "Uhrzeit", "Orario")

# --- ROLE ---
add_r("role.RECEPTION",
      "Recepción", "Front Desk", "Recepción", "Recepció", "Recepció", "Harrera", "الاستقبال", "Receção", "Accueil", "Rezeption", "Reception")

add_r("role.STAFF",
      "Empleado", "Staff Member", "Empregado", "Empleat", "Empleat", "Langilea", "الموظف", "Colaborador", "Employé", "Mitarbeiter", "Staff")

add_r("role.STORE_MANAGER",
      "Gerente Tienda", "Store Manager", "Xerente Tenda", "Gerent Botiga", "Gerent Botiga", "Dendako Kudeatzailea", "مدير المتجر", "Gerente de Loja", "Responsable Boutique", "Shop-Manager", "Responsabile Negozio")

add_r("role.SUPERADMIN",
      "Superadministrador HQ", "Platform SuperAdmin", "Superadministrador HQ", "Superadministrador HQ", "Superadministrador HQ", "Superadministratzailea HQ", "المشرف العام للمنصة", "Superadministrador HQ", "Super-Administrateur HQ", "Super-Administrator", "Superamministratore HQ")

add_r("role.TENANT_ADMIN",
      "Administrador", "Manager", "Administrador", "Administrador", "Administrador", "Administratzailea", "المدير", "Administrador", "Administrateur", "Administrator", "Amministratore")

add_r("role.TOURNAMENT_ORGANIZER",
      "Organizador Torneos", "Tournament Director", "Organizador Torneos", "Organitzador Tornejos", "Organitzador Tornejos", "Txapelketa Antolatzailea", "مدير البطولات", "Organizador de Torneios", "Directeur de Tournoi", "Turnierleiter", "Direttore Torneo")

# --- IOT ---
add_r("iot.court_controls",
      "Controles Domótica de Pista", "Court Automation Controls", "Controis Domótica de Pista", "Controls Domòtica de Pista", "Controls Domòtica de Pista",
      "Kantxako Domotika Kontrolak", "عناصر التحكم بأتمتة الملعب", "Controlos de Domótica do Campo", "Commandes Domotiques du Court", "IoT-Platzsteuerungen", "Controlli Domotici del Campo")

add_r("iot.door_open",
      "Abrir Puerta / Torno", "Open Door / Turnstile", "Abrir Porta / Torno", "Obrir Porta / Torn", "Obrir Porta / Torn",
      "Ireki Atea / Tornua", "فتح البوابة / القفل", "Abrir Porta / Torniquete", "Ouvrir Porte / Tourniquet", "Tür / Drehkreuz öffnen", "Apri Porta / Tornello")

add_r("iot.door_opening",
      "Abriendo acceso...", "Opening access...", "Abrindo acceso...", "Obrint accés...", "Obrint accés...",
      "Sarbidea irekitzen...", "جارٍ فتح البوابة...", "A abrir acesso...", "Ouverture de l'accès...", "Öffne Zugang...", "Apertura varco in corso...")

add_r("iot.multisport.padel",
      "Pádel", "Padel", "Pádel", "Pàdel", "Pàdel", "Padela", "بادل", "Padel", "Padel", "Padel", "Padel")

add_r("iot.multisport.tennis",
      "Tenis", "Tennis", "Tenis", "Tennis", "Tennis", "Tenisa", "تنس", "Ténis", "Tennis", "Tennis", "Tennis")

# --- CONTACT ---
add_r("contact.hours",
      "Horario de Apertura", "Opening Hours", "Horario de Apertura", "Horari d'Obertura", "Horari d'Obertura",
      "Ordutegia", "ساعات العمل الرسمية", "Horário de Funcionamento", "Horaires d'Ouverture", "Öffnungszeiten", "Orari di Apertura")

add_r("contact.phone",
      "Teléfono & WhatsApp", "Phone & WhatsApp", "Teléfono e WhatsApp", "Telèfon i WhatsApp", "Telèfon i WhatsApp",
      "Telefonoa eta WhatsApp", "الهاتف وواتساب", "Telefone e WhatsApp", "Téléphone & WhatsApp", "Telefon & WhatsApp", "Telefono e WhatsApp")

add_r("contact.reception",
      "Recepción:", "Front Desk:", "Recepción:", "Recepció:", "Recepció:", "Harrera:", "الاستقبال:", "Receção:", "Accueil :", "Rezeption:", "Reception:")

add_r("contact.whatsapp",
      "Chatear por WhatsApp", "Chat on WhatsApp", "Chatear por WhatsApp", "Xatejar per WhatsApp", "Xatejar per WhatsApp",
      "Txateatu WhatsApp bidez", "مراسلة عبر واتساب", "Conversar no WhatsApp", "Discuter sur WhatsApp", "Per WhatsApp chatten", "Chatta su WhatsApp")

# --- NAV ---
add_r("nav.home",
      "Inicio", "Home", "Inicio", "Inici", "Inici", "Hasiera", "الرئيسية", "Início", "Accueil", "Startseite", "Home")

add_r("nav.solutions",
      "Soluciones", "Solutions", "Solucións", "Solucions", "Solucions", "Irtenbideak", "الحلول", "Soluções", "Solutions", "Lösungen", "Soluzioni")

add_r("nav.contact",
      "Contacto", "Contact", "Contacto", "Contacte", "Contacte", "Harremana", "اتصل بنا", "Contacto", "Contact", "Kontakt", "Contatti")

add_r("nav.themeLight",
      "Activar modo claro", "Switch to light mode", "Activar modo claro", "Activar mode clar", "Activar mode clar",
      "Aktibatu modu argia", "تفعيل الوضع الفاتح", "Ativar modo claro", "Activer le mode clair", "Hellen Modus aktivieren", "Attiva modalità chiara")

# --- SOLUTIONS DETAIL ---
add_r("solutions.detail.complianceTitle",
      "Ficha Técnica de Integración y Cumplimiento", "Integration & Compliance Data Sheet",
      "Ficha Técnica de Integración e Cumprimento", "Fitxa Tècnica d'Integració i Compliment", "Fitxa Tècnica d'Integració i Compliment",
      "Integrazio eta Betetze Fitxa Teknikoa", "بطاقة البيانات الفنية للتكامل والامتثال القانوني",
      "Ficha Técnica de Integração e Conformidade", "Fiche Technique d'Intégration et Conformité",
      "Datenblatt für Systemintegration & Compliance", "Scheda Tecnica di Integrazione e Conformità")

add_r("solutions.detail.techSpec",
      "Especificación técnica:", "Technical specification:", "Especificación técnica:", "Especificació tècnica:", "Especificació tècnica:",
      "Zehaztapen teknikoa:", "المواصفات الفنية:", "Especificação técnica:", "Spécification technique :", "Technische Spezifikation:", "Specifiche tecniche:")

add_r("solutions.detail.workflowEyebrow",
      "Flujo de Trabajo", "Operational Workflow", "Fluxo de Traballo", "Flux de Treball", "Flux de Treball",
      "Lan-fluxua", "سير العمل التشغيلي", "Fluxo de Trabalho", "Flux Opérationnel", "Arbeitsablauf & Prozess", "Flusso Operativo")

add_r("solutions.detail.workflowTitle",
      "¿Cómo opera el sistema en el día a día?", "How does the system operate on a daily basis?",
      "Como opera o sistema no día a día?", "Com opera el sistema en el dia a dia?", "Com opera el sistema en el dia a dia?",
      "Nola funtzionatzen du sistemak egunerokoan?", "كيف يعمل النظام في التشغيل اليومي للنادي؟",
      "Como funciona o sistema no dia a dia?", "Comment le système fonctionne-t-il au quotidien ?",
      "Wie funktioniert das System im alltäglichen Clubbetrieb?", "Come funziona il sistema nella gestione quotidiana?")

# --- BOOKING ---
add_r("booking.selectDate",
      "1. Selecciona Fecha y Duración", "1. Select Date & Duration", "1. Selecciona Data e Duración", "1. Selecciona Data i Durada", "1. Selecciona Data i Durada",
      "1. Hautatu Data eta Iraupena", "1. حدد التاريخ ومدة الحجز", "1. Selecione Data e Duração", "1. Sélectionnez Date et Durée", "1. Datum und Spieldauer wählen", "1. Seleziona Data e Durata")

add_r("booking.selectCourt",
      "2. Elige Pista", "2. Select Court", "2. Elixe Pista", "2. Tria Pista", "2. Tria Pista",
      "2. Aukeratu Kantxa", "2. اختر الملعب المناسب", "2. Escolha o Campo", "2. Choisissez le Terrain", "2. Platz auswählen", "2. Scegli il Campo")

add_r("booking.selectTime",
      "3. Horario Disponible", "3. Available Time Slot", "3. Horario Dispoñible", "3. Horari Disponible", "3. Horari Disponible",
      "3. Ordutegi Eskuragarria", "3. المواعيد الشاغرة", "3. Horário Disponível", "3. Créneaux Disponibles", "3. Verfügbare Uhrzeit", "3. Orario Disponibile")

add_r("booking.paymentMode",
      "4. Modalidad de Pago y Compañeros", "4. Payment Mode & Players", "4. Modalidade de Pago e Compañeiros", "4. Modalitat de Pagament i Companys", "4. Modalitat de Pagament i Companys",
      "4. Ordainketa Modalitatea eta Kideak", "4. طريقة الدفع واللاعبون المشاركون", "4. Modalidade de Pagamento e Parceiros", "4. Mode de Paiement et Partenaires", "4. Zahlungsart und Mitspieler", "4. Modalità di Pagamento e Compagni")

# --- TENANT ---
add_r("tenant.ONLINE_STORE",
      "Tienda Especializada", "Online Padel Store", "Tenda Especializada", "Botiga Especialitzada", "Botiga Especialitzada",
      "Denda Espezializatua", "متجر متخصص في البادل", "Loja Especializada", "Boutique Spécialisée", "Padel-Fachgeschäft", "Negozio Specializzato")

add_r("tenant.PROFESSIONAL",
      "Profesional del Pádel", "Sports Professional", "Profesional do Pádel", "Professional del Pàdel", "Professional del Pàdel",
      "Padeleko Profesionala", "محترف رياضة البادل", "Profissional de Padel", "Professionnel du Padel", "Padel-Profi", "Professionista del Padel")

add_r("tenant.PRO_PLAYER",
      "Jugador Profesional", "Pro Athlete / Player", "Xogador Profesional", "Jugador Professional", "Jugador Professional",
      "Jokalari Profesionala", "لاعب محترف", "Jogador Profissional", "Joueur Professionnel", "Profi-Athlet", "Giocatore Professionista")

add_r("tenant.TOURNAMENT_ORGANIZER",
      "Organizador de Torneos", "Tournament Circuit", "Organizador de Torneos", "Organitzador de Tornejos", "Organitzador de Tornejos",
      "Txapelketa Antolatzailea", "منظم بطولات", "Organizador de Torneios", "Organisateur de Tournois", "Turnierveranstalter", "Organizzatore di Tornei")

# --- AUTH ---
add_r("auth.loginHere",
      "Inicia sesión aquí", "Log in here", "Inicia sesión aquí", "Inicia sessió aquí", "Inicia sessió aquí",
      "Hasi saioa hemen", "سجل دخولك هنا", "Inicie sessão aqui", "Connectez-vous ici", "Hier anmelden", "Accedi qui")

add_r("auth.passwordLabel",
      "Contraseña", "Password", "Contrasinal", "Contrasenya", "Contrasenya",
      "Pasahitza", "كلمة المرور", "Palavra-passe", "Mot de passe", "Passwort", "Password")

# --- WHITE LABEL ---
add_r("white_label.banner_notice",
      "Estás probando la app de jugador con la marca blanca del club",
      "You are testing the player app with club white-label branding",
      "Estás a probar a app de xogador coa marca branca do club",
      "Estàs provant l'app de jugador amb la marca blanca del club",
      "Estàs provant l'app de jugador amb la marca blanca del club",
      "Jokalariaren aplikazioa klubaren marka zuriarekin probatzen ari zara",
      "أنت الآن تختبر تطبيق اللاعبين بالعلامة التجارية الخاصة بالنادي",
      "Está a testar a app do jogador com a marca branca do clube",
      "Vous testez l'application joueur avec la marque blanche du club",
      "Sie testen die Spieler-App mit dem White-Label-Branding des Clubs",
      "Stai provando l'app giocatore con il brand white label del circolo")

add_r("white_label.player_view",
      "Vista Jugador", "Player View", "Vista Xogador", "Vista Jugador", "Vista Jugador",
      "Jokalari Ikuspegia", "واجهة اللاعب", "Vista do Jogador", "Vue Joueur", "Spieler-Ansicht", "Vista Giocatore")

# --- LANGUAGE ---
add_r("language.es",
      "Español", "Spanish", "Español", "Espanyol", "Espanyol", "Gaztelania", "الإسبانية", "Espanhol", "Espagnol", "Spanisch", "Spagnolo")

# --- MODULES ---
add_r("modules.access.title",
      "Control de Acceso por PIN", "PIN Code Access Control", "Control de Acceso por PIN", "Control d'Accés per PIN", "Control d'Accés per PIN",
      "PIN bidezko Sarbide Kontrola", "التحكم في الدخول برمز PIN", "Controlo de Acesso por PIN", "Contrôle d'Accès par Code PIN", "PIN-Code-Zutrittskontrolle", "Controllo Accessi tramite PIN")

# --- AI ---
add_r("ai.askPlaceholder",
      "Pregunta sobre disponibilidad, escuela, torneos...", "Ask about availability, academy, tournaments...",
      "Pregunta sobre dispoñibilidade, escola, torneos...", "Pregunta sobre disponibilitat, escola, tornejos...", "Pregunta sobre disponibilitat, escola, tornejos...",
      "Galdetu erabilgarritasunaz, eskolaz, txapelketaz...", "اسأل عن الملاعب الشاغرة، المدرسة، البطولات...",
      "Pergunte sobre disponibilidade, escola, torneios...", "Posez une question sur la disponibilité, l'école, les tournois...",
      "Fragen Sie nach freien Plätzen, Kursen, Turnieren...", "Chiedi informazioni su disponibilità, scuola, tornei...")

print(f"dict_batch_remaining.py ready with {len(REMAINING_TRANSLATIONS)} keys!")
