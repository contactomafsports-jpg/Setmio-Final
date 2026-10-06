"""Translations for uncovered Pricing and Home keys across 9 secondary languages:
gl, ca, va, eu, ar, pt, fr, de, it, plus es and en.
"""

PRICING_HOME_TRANSLATIONS = {}

def add_ph(key, es, en, gl, ca, va, eu, ar, pt, fr, de, it):
    PRICING_HOME_TRANSLATIONS[key] = {
        "es": es, "en": en, "gl": gl, "ca": ca, "va": va, "eu": eu,
        "ar": ar, "pt": pt, "fr": fr, "de": de, "it": it
    }

# --- PRICING ---
add_ph("pricing.finalCta",
       "Solicitar Demo o Alta Directa", "Request Demo or Direct Onboarding",
       "Solicitar Demo ou Alta Directa", "Sol·licitar Demo o Alta Directa", "Sol·licitar Demo o Alta Directa",
       "Eskatu Demoa edo Zuzeneko Alta", "طلب تجربة أو تسجيل فوري", "Solicitar Demo ou Registo Direto",
       "Demander une Démo ou Inscription Directe", "Demo anfordern oder Direkt starten", "Richiedi Demo o Iscrizione Diretta")

add_ph("pricing.cycleYearlyDiscount",
       "Ahorra 20%", "Save 20%", "Aforra 20%", "Estalvia 20%", "Estalvia 20%",
       "Aurreztu %20", "وفر 20%", "Poupe 20%", "Économisez 20%", "20% sparen", "Risparmia il 20%")

add_ph("pricing.plans.professional.name",
       "Profesional", "Professional", "Profesional", "Professional", "Professional",
       "Profesionala", "احترافي", "Profissional", "Professionnel", "Professionell", "Professionale")

add_ph("pricing.toggleCycle",
       "Alternar facturación mensual y anual", "Toggle monthly and annual billing",
       "Alternar facturación mensual e anual", "Alternar facturació mensual i anual", "Alternar facturació mensual i anual",
       "Txandakatu hileroko eta urteko fakturazioa", "التبديل بين الفوترة الشهرية والسنوية",
       "Alternar faturação mensal e anual", "Basculer entre facturation mensuelle et annuelle",
       "Zwischen monatlicher und jährlicher Abrechnung wechseln", "Alterna fatturazione mensile e annuale")

# Tier: Coach
add_ph("pricing.tiers.coach.badge",
       "Entrenadores & Academias", "Coaches & Academies", "Adestradores e Academias", "Entrenadors i Acadèmies", "Entrenadors i Acadèmies",
       "Entrenatzaileak eta Akademiak", "المدربون والأكاديميات", "Treinadores e Academias", "Entraîneurs & Académies", "Trainer & Akademien", "Maestri e Accademie")

add_ph("pricing.tiers.coach.cta",
       "Elegir Plan Coach", "Choose Coach Plan", "Elixir Plan Coach", "Triar Pla Coach", "Triar Pla Coach",
       "Aukeratu Coach Plana", "اختيار باقة المدرب", "Escolher Plano Coach", "Choisir le Forfait Coach", "Coach-Paket wählen", "Scegli Piano Coach")

add_ph("pricing.tiers.coach.desc",
       "Para entrenadores individuales, preparadores físicos y pequeñas escuelas sin instalaciones propias.",
       "For freelance coaches, fitness trainers, and academies utilizing external court facilities.",
       "Para adestradores individuais, preparadores físicos e pequenas escolas sen instalacións propias.",
       "Per a entrenadors individuals, preparadors físics i petites escoles sense instal·lacions pròpies.",
       "Per a entrenadors individuals, preparadors físics i petites escoles sense instal·lacions pròpies.",
       "Banakako entrenatzaileentzat, prestatzaile fisikoentzat eta instalazio propiorik gabeko eskola txikientzat.",
       "للمدربين المستقلين، المعدين البدنيين والمدارس الرياضية التي لا تملك منشآت خاصة.",
       "Para treinadores individuais, preparadores físicos e pequenas escolas sem instalações próprias.",
       "Pour entraîneurs indépendants, préparateurs physiques et écoles sans installations dédiées.",
       "Für selbstständige Trainer, Athletik-Coaches und Tennisschulen ohne eigene Platzanlage.",
       "Per maestri freelance, preparatori atletici e accademie senza impianti propri.")

add_ph("pricing.tiers.coach.f1",
       "Hasta 40 alumnos activos simultáneos", "Up to 40 simultaneous active students",
       "Ata 40 alumnos activos simultáneos", "Fins a 40 alumnes actius simultanis", "Fins a 40 alumnes actius simultanis",
       "Gehienez 40 ikasle aktibo aldi berean", "حتى 40 طالباً نشطاً في نفس الوقت",
       "Até 40 alunos ativos em simultâneo", "Jusqu'à 40 élèves actifs simultanés",
       "Bis zu 40 aktive Schüler gleichzeitig", "Fino a 40 allievi attivi contemporaneamente")

add_ph("pricing.tiers.coach.f2",
       "Cobro recurrente mensual de cuotas", "Automated recurring monthly dues collection",
       "Cobro recorrente mensual de cotas", "Cobrament recurrent mensual de quotes", "Cobrament recurrent mensual de quotes",
       "Hileko kuoten kobrantza errepikakorra", "تحصيل الاشتراكات والرسوم الشهرية تلقائياً",
       "Cobrança recorrente mensal de mensalidades", "Prélèvement automatique des cotisations mensuelles",
       "Wiederkehrender monatlicher Beitragseinzug", "Incasso ricorrente mensile delle quote")

add_ph("pricing.tiers.coach.f4",
       "Ficha técnica y seguimiento de nivel de juego", "Technical player card & level progression tracking",
       "Ficha técnica e seguimento de nivel de xogo", "Fitxa tècnica i seguiment de nivell de joc", "Fitxa tècnica i seguiment de nivell de joc",
       "Fitxa teknikoa eta joko-mailaren jarraipena", "سجل فني وتتبع تطور مستوى اللاعب",
       "Ficha técnica e acompanhamento de nível de jogo", "Fiche technique et suivi de progression sportive",
       "Leistungskartei & Spielstärke-Entwicklung", "Scheda tecnica e monitoraggio del livello di gioco")

add_ph("pricing.tiers.coach.f5",
       "Portal web propio del profesor", "Personal white-label coach web portal",
       "Portal web propio do profesor", "Portal web propi del professor", "Portal web propi del professor",
       "Irakaslearen web-atari propioa", "بوابة ويب خاصة ومستقلة للمدرب",
       "Portal web próprio do treinador", "Portail web personnel dédié à l'entraîneur",
       "Eigenes Webportal für den Trainer", "Portale web personale per il maestro")

# Tier: Club Base
add_ph("pricing.tiers.club_base.badge",
       "Más Demandado", "Most Popular", "Máis Demandado", "Més Sol·licitat", "Més Sol·licitat",
       "Eskatuena", "الأكثر طلباً", "Mais Procurado", "Le Plus Populaire", "Beliebteste Wahl", "Più Richiesto")

add_ph("pricing.tiers.club_base.cta",
       "Empezar con Club Base", "Start with Club Base", "Comezar con Club Base", "Començar amb Club Base", "Començar amb Club Base",
       "Hasi Club Base-rekin", "ابدأ مع باقة النادي الأساسية", "Começar com Club Base", "Commencer avec Club Base", "Mit Club Base starten", "Inizia con Club Base")

add_ph("pricing.tiers.club_base.desc",
       "Ideal para clubes de pádel de hasta 4 pistas que desean informatizar sus reservas y automatizar cobros.",
       "Ideal for padel clubs up to 4 courts wanting to digitize bookings and automate payments.",
       "Ideal para clubs de pádel de ata 4 pistas que desexan informatizar as súas reservas e automatizar cobros.",
       "Ideal per a clubs de pàdel de fins a 4 pistes que volen informatitzar les seves reserves i automatitzar cobraments.",
       "Ideal per a clubs de pàdel de fins a 4 pistes que volen informatitzar les seves reserves i automatitzar cobraments.",
       "Erreserbak digitalizatu eta kobrantzak automatizatu nahi dituzten 4 kantxara arteko padel klubentzat egokia.",
       "مثالي لأندية البادل حتى 4 ملاعب الراغبة في حوسبة حجوزاتها وأتمتة عمليات الدفع.",
       "Ideal para clubes de padel até 4 campos que pretendem digitalizar reservas e automatizar cobranças.",
       "Idéal pour clubs de padel jusqu'à 4 terrains souhaitant digitaliser leurs réservations et paiements.",
       "Ideal für Padel-Clubs mit bis zu 4 Plätzen für digitale Buchungen und automatisierte Abrechnung.",
       "Ideale per circoli padel fino a 4 campi che desiderano informatizzare prenotazioni e incassi.")

add_ph("pricing.tiers.club_base.f1",
       "Hasta 4 pistas de pádel", "Up to 4 padel courts",
       "Ata 4 pistas de pádel", "Fins a 4 pistes de pàdel", "Fins a 4 pistes de pàdel",
       "Gehienez 4 padel kantxa", "حتى 4 ملاعب بادل",
       "Até 4 campos de padel", "Jusqu'à 4 courts de padel",
       "Bis zu 4 Padel-Plätze", "Fino a 4 campi da padel")

add_ph("pricing.tiers.club_base.f2",
       "Reservas online ilimitadas sin comisiones", "Unlimited online bookings with 0% commissions",
       "Reservas online ilimitadas sen comisións", "Reserves online il·limitades sense comissions", "Reserves online il·limitades sense comissions",
       "Erreserba mugagabeak komisiorik gabe", "حجوزات غير محدودة عبر الإنترنت بدون عمولات",
       "Reservas online ilimitadas sem comissões", "Réservations illimitées en ligne sans commission",
       "Unbegrenzte Online-Buchungen ohne Provision", "Prenotazioni online illimitate a zero commissioni")

add_ph("pricing.tiers.club_base.f3",
       "Web y App móvil de marca blanca", "Full white-label web and mobile app",
       "Web e App móbil de marca branca", "Web i App mòbil de marca blanca", "Web i App mòbil de marca blanca",
       "Web eta mugikorreko aplikazio marka zurian", "موقع وتطبيق جوال بعلامة تجارية بيضاء مخصصة",
       "Web e App móvel de marca branca", "Site web et application mobile en marque blanche",
       "White-Label-Website und mobile Smartphone-App", "Sito web e app mobile con white label dedicata")

add_ph("pricing.tiers.club_base.f4",
       "Split Payments (1/4 por jugador)", "Split Payments (1/4 fee per player)",
       "Split Payments (1/4 por xogador)", "Split Payments (1/4 per jugador)", "Split Payments (1/4 per jugador)",
       "Ordainketa zatitua (1/4 jokalari bakoitzeko)", "الدفع المقسم (ربع المبلغ لكل لاعب)",
       "Pagamentos divididos (1/4 por jogador)", "Paiement fractionné (1/4 par joueur)",
       "Split Payments (Gebührenteilung pro Spieler)", "Split payment (pagamento diviso in 4)")

add_ph("pricing.tiers.club_base.f6",
       "Soporte técnico prioritario por WhatsApp", "Priority support via dedicated WhatsApp",
       "Soporte técnico prioritario por WhatsApp", "Suport tècnic prioritari per WhatsApp", "Suport tècnic prioritari per WhatsApp",
       "Lehentasunezko laguntza teknikoa WhatsApp bidez", "دعم فني ذو أولوية عبر واتساب",
       "Suporte técnico prioritário por WhatsApp", "Support technique prioritaire par WhatsApp",
       "Prioritärer technischer Support via WhatsApp", "Supporto tecnico prioritario via WhatsApp")

# Tier: Club Pro
add_ph("pricing.tiers.club_pro.badge",
       "Clubes en Crecimiento", "Growing Clubs", "Clubs en Crecemento", "Clubs en Creixement", "Clubs en Creixement",
       "Hazten ari diren Klubak", "الأندية في مرحلة التوسع", "Clubes em Crescimento", "Clubs en Croissance", "Wachsende Clubs", "Circoli in Espansione")

add_ph("pricing.tiers.club_pro.cta",
       "Elegir Plan Pro", "Choose Pro Plan", "Elixir Plan Pro", "Triar Pla Pro", "Triar Pla Pro",
       "Aukeratu Pro Plana", "اختيار باقة برو الاحترافية", "Escolher Plano Pro", "Choisir le Forfait Pro", "Pro-Paket wählen", "Scegli Piano Pro")

add_ph("pricing.tiers.club_pro.desc",
       "Para clubes completos con escuela, torneos oficiales, bar cafetería y automatización domótica de pistas.",
       "For established facilities operating academies, official tournaments, bar/F&B, and court IoT automation.",
       "Para clubs completos con escola, torneos oficiais, bar cafetería e automatización domótica de pistas.",
       "Per a clubs complets amb escola, tornejos oficials, bar cafeteria i automatització domòtica de pistes.",
       "Per a clubs complets amb escola, tornejos oficials, bar cafeteria i automatització domòtica de pistes.",
       "Eskola, txapelketa ofizialak, taberna eta kantxen automatizazio domotikoa duten klub osoentzat.",
       "للأندية المتكاملة التي تدير مدارس رياضية، بطولات رسمية، كافتيريا وأتمتة ملاعب.",
       "Para clubes completos com escola, torneios oficiais, cafetaria e automatização domótica de campos.",
       "Pour clubs complets avec école, tournois officiels, bar-restaurant et domotique des terrains.",
       "Für Komplettanlagen mit Padel-Schule, Turnieren, Gastronomie und IoT-Court-Automation.",
       "Per circoli completi con scuola padel, tornei ufficiali, bar caffetteria e domotica IoT.")

add_ph("pricing.tiers.club_pro.f2",
       "Módulo completo de Escuela y Academias", "Complete Academy & Coaching School engine",
       "Módulo completo de Escola e Academias", "Mòdul complet d'Escola i Acadèmies", "Mòdul complet d'Escola i Acadèmies",
       "Eskola eta Akademien modulu osoa", "نظام متكامل لإدارة الأكاديميات والمدارس الرياضية",
       "Módulo completo de Escola e Academias", "Module complet École et Académie",
       "Vollständiges Schul- und Akademiemodul", "Modulo completo Scuola Padel e Corsi")

add_ph("pricing.tiers.club_pro.f4",
       "Apertura de pistas por PIN y Código QR", "Automated court access via PIN & QR Code",
       "Apertura de pistas por PIN e Código QR", "Obertura de pistes per PIN i Codi QR", "Obertura de pistes per PIN i Codi QR",
       "Kantxak irekitzea PIN eta QR Kode bidez", "فتح الملاعب برمز PIN ورمز QR",
       "Abertura de campos por PIN e Código QR", "Ouverture des terrains par PIN et QR Code",
       "Türöffnung via PIN und dynamischem QR-Code", "Apertura campi automatica con PIN e QR Code")

add_ph("pricing.tiers.club_pro.f5",
       "TPV Táctil de Bar, Cafetería y Tienda", "Touch POS for bar, cafeteria & pro shop",
       "TPV Táctil de Bar, Cafetería e Tenda", "TPV Tàctil de Bar, Cafeteria i Botiga", "TPV Tàctil de Bar, Cafeteria i Botiga",
       "Taberna, Kafetegi eta Dendetarako TPV Taktila", "نقطة بيع لمسية للكافيتريا والمتجر الرياضي",
       "POS Tátil de Bar, Cafetaria e Loja", "Caisse tactile bar, brasserie et pro-shop",
       "Touch-Kassensystem für Gastronomie & Shop", "POS Touch per bar, caffetteria e pro shop")

add_ph("pricing.tiers.club_pro.f6",
       "Gestor de Torneos, Ligas y Rankings FEP", "Official Tournament, League & Ranking Manager",
       "Xestor de Torneos, Ligas e Rankings", "Gestor de Tornejos, Lligues i Rànquings", "Gestor de Tornejos, Lligues i Rànquings",
       "Txapelketa, Liga eta Sailkapenen Kudeatzailea", "نظام إدارة البطولات، الدوريات والتصنيفات الرسمية",
       "Gestor de Torneios, Ligas e Rankings", "Gestionnaire de Tournois, Ligues et Classements",
       "Turnier-, Liga- und Ranglistenverwaltung", "Gestore Tornei, Campionati e Classifiche")

# Tier: Enterprise
add_ph("pricing.tiers.enterprise.badge",
       "Cadenas & Franquicias", "Chains & Enterprise", "Cadeas e Franquías", "Cadenes i Franquícies", "Cadenes i Franquícies",
       "Kateak eta Frankiziak", "السلاسل الرياضية والامتيازات", "Cadeias e Franquias", "Réseaux & Franchises", "Ketten & Sportzentren", "Catene & Franchising")

add_ph("pricing.tiers.enterprise.desc",
       "Solución a medida para grandes complejos deportivos, cadenas multi-club y federaciones de pádel.",
       "Custom enterprise deployment for multi-location athletic facilities, chains, and regional federations.",
       "Solución a medida para grandes complexos deportivos, cadeas multi-club e federacións de pádel.",
       "Solució a mida per a grans complexos esportius, cadenes multiclub i federacions de pàdel.",
       "Solució a mida per a grans complexos esportius, cadenes multiclub i federacions de pàdel.",
       "Neurrira egindako irtenbidea kirol-gune handientzat, klub anitzeko kateentzat eta federazioentzat.",
       "حلول مخصصة للمجمعات الرياضية الكبرى، السلاسل متعددة الفروع والاتحادات الرياضية.",
       "Solução à medida para grandes complexos desportivos, cadeias multi-clube e federações.",
       "Solution sur mesure pour grands complexes, réseaux multi-clubs et fédérations régionales.",
       "Maßgeschneiderte Unternehmenslösung für Sportzentren, Multi-Standort-Ketten und Verbände.",
       "Soluzione su misura per grandi centri sportivi, catene multi-circolo e federazioni.")

add_ph("pricing.tiers.enterprise.f1",
       "Gestión multi-sede centralizada", "Centralized multi-facility management",
       "Xestión multi-sede centralizada", "Gestió multiseu centralitzada", "Gestió multiseu centralitzada",
       "Hainbat egoitzen kudeaketa zentralizatua", "إدارة مركزية موحدة لعدة فروع ومنشآت",
       "Gestão multi-espaço centralizada", "Gestion centralisée multi-sites",
       "Zentrales Multi-Standort-Management", "Gestione centralizzata multi-sede")

add_ph("pricing.tiers.enterprise.f2",
       "Dominio propio personalizado (tuclub.com)", "Custom dedicated domain name (yourclub.com)",
       "Dominio propio personalizado (oteuclub.com)", "Domini propi personalitzat (elteuclub.cat)", "Domini propi personalitzat (elteuclub.com)",
       "Domeinu pertsonalizatu propioa (zurekluba.eus)", "نطاق ويب خاص ومخصص بالكامل (yourclub.com)",
       "Domínio próprio personalizado (oseuclube.pt)", "Nom de domaine dédié personnalisé (votreclub.fr)",
       "Eigene Wunsch-Domain (ihrclub.de)", "Dominio personalizzato dedicato (tuocircolo.it)")

add_ph("pricing.tiers.enterprise.f3",
       "Integración API con tornos y cerraduras industriales", "Industrial API integration with relays and gates",
       "Integración API con tornos e pechaduras industriais", "Integració API amb torns i panys industrials", "Integració API amb torns i panys industrials",
       "API integrazioa sarbide-tornu eta sarraila industrialekin", "ربط برمجي API مع البوابات الإلكترونية والأقفال الصناعية",
       "Integração API com torniquetes e fechaduras industriais", "Intégration API aux tourniquets et serrures industrielles",
       "API-Anbindung an Drehkreuze und Industrieschlösser", "Integrazione API con tornelli e serrature industriali")

add_ph("pricing.tiers.enterprise.f4",
       "Facturación electrónica y remesas SEPA bancarias", "Electronic invoicing & automated SEPA XML banking",
       "Facturación electrónica e remesas SEPA bancarias", "Facturació electrònica i remeses SEPA bancàries", "Facturació electrònica i remeses SEPA bancàries",
       "Fakturazio elektronikoa eta SEPA banku-igorpenak", "فوترة إلكترونية متطورة وملفات سداد بنكي SEPA",
       "Faturação eletrónica e débitos diretos SEPA", "Facturation électronique et prélèvements bancaires SEPA",
       "Elektronische Rechnungsstellung & SEPA-Lastschriften", "Fatturazione elettronica e mandati bancari SEPA")

add_ph("pricing.tiers.enterprise.f5",
       "Gestor de cuenta y onboarding presencial dedicado", "Dedicated account manager & on-site staff onboarding",
       "Xestor de conta e onboarding presencial dedicado", "Gestor de compte i incorporació presencial dedicada", "Gestor de compte i incorporació presencial dedicada",
       "Kontu-kudeatzaile dedikatua eta aurrez aurreko onboarding-a", "مدير حساب مخصص وتدريب ميداني لفريق العمل",
       "Gestor de conta dedicado e formação presencial", "Gestionnaire de compte dédié et formation sur site",
       "Persönlicher Account Manager & Vor-Ort-Schulung", "Account manager dedicato e formazione del personale in sede")

add_ph("pricing.tiers.enterprise.f6",
       "SLA garantizado del 99.9% de disponibilidad", "Guaranteed 99.9% uptime SLA",
       "SLA garantido do 99.9% de dispoñibilidade", "SLA garantit del 99.9% de disponibilitat", "SLA garantit del 99.9% de disponibilitat",
       "%%99,9ko erabilgarritasun bermatuko SLA", "اتفاقية مستوى خدمة SLA بنسبة توفر 99.9%",
       "SLA garantido de 99.9% de disponibilidade", "SLA garanti avec 99,9% de disponibilité",
       "Garantierte 99,9% Verfügbarkeits-SLA", "SLA garantito con disponibilità del 99.9%")

# --- HOME ---
add_ph("home.advantages.iot.title",
       "Domótica IoT & Luces LED", "IoT Smart Courts & LED Lights", "Domótica IoT e Luces LED", "Domòtica IoT i Llums LED", "Domòtica IoT i Llums LED",
       "IoT Domotika eta LED Argiak", "أتمتة إنترنت الأشياء وإضاءة LED", "Domótica IoT e Luzes LED", "Domotique IoT et Projecteurs LED", "IoT-Automation & LED-Flutlicht", "Domotica IoT e Luci LED")

add_ph("home.advantages.tournaments.title",
       "Torneos & Competición", "Tournaments & Leagues", "Torneos e Competición", "Tornejos i Competició", "Tornejos i Competició",
       "Txapelketak eta Lehia", "البطولات والمنافسات الرسمية", "Torneios e Competição", "Tournois et Compétition", "Turniere & Spielbetrieb", "Tornei e Competizioni")

add_ph("home.corporate.demoTitle",
       "Solicita una Demo Guiada o Prueba el Sistema por Rol", "Request a Guided Demo or Test-Drive by Role",
       "Solicita unha Demo Guiada ou Proba o Sistema por Rol", "Sol·licita una Demo Guiada o Prova el Sistema per Rol", "Sol·licita una Demo Guiada o Prova el Sistema per Rol",
       "Eskatu Gidatutako Demoa edo Probatu Sistema Rolen Arabera", "اطلب عرضاً تجريبياً أو جرب النظام بحسب الدور",
       "Solicite uma Demo Guiada ou Experimente o Sistema por Função", "Demandez une Démo Guidée ou Testez par Profil",
       "Geführte Demo anfordern oder System nach Rolle testen", "Richiedi una Demo Guidata o Prova per Ruolo")

add_ph("home.corporate.demos.btnExplore",
       "Explorar Web Pública del Club", "Explore Club Public Website", "Explorar Web Pública do Club", "Explorar Web Pública del Club", "Explorar Web Pública del Club",
       "Arakatu Klubaren Web Publikoa", "استكشاف الموقع العام للنادي", "Explorar Web Pública do Clube", "Explorer le Site Public du Club", "Öffentliche Club-Website ansehen", "Esplora il Sito Pubblico del Circolo")

add_ph("home.corporate.demos.proBadge",
       "FIP Top 20 · Academia de Competición", "FIP Top 20 · Elite Competition Academy", "FIP Top 20 · Academia de Competición", "FIP Top 20 · Acadèmia de Competició", "FIP Top 20 · Acadèmia de Competició",
       "FIP Top 20 · Lehiaketa Akademia", "أكاديمية النخبة · أفضل 20 عالمياً FIP", "FIP Top 20 · Academia de Competição", "FIP Top 20 · Académie Élite", "FIP Top 20 · Leistungsakademie", "FIP Top 20 · Accademia Agonistica")

add_ph("home.corporate.guarantee2",
       "Migración de datos en 24h", "24h Data Migration", "Migración de datos en 24h", "Migració de dades en 24h", "Migració de dades en 24h",
       "Datuen migrazioa 24 ordutan", "نقل كامل للبيانات خلال 24 ساعة", "Migração de dados em 24h", "Migration des données en 24h", "Datenmigration innerhalb von 24h", "Migrazione dati in 24h")

add_ph("home.corporate.guarantee3",
       "Soporte personalizado 365 días", "365-Day Dedicated Support", "Soporte personalizado 365 días", "Suport personalitzat 365 dies", "Suport personalitzat 365 dies",
       "Laguntza pertsonalizatua 365 egunetan", "دعم فني مخصص 365 يوماً في السنة", "Suporte dedicado 365 dias", "Assistance dédiée 365 jours par an", "Persönlicher Support an 365 Tagen", "Supporto dedicato 365 giorni l'anno")

add_ph("home.corporate.metric1.title",
       "Marca Blanca Integral", "100% White-Label Brand", "Marca Branca Integral", "Marca Blanca Integral", "Marca Blanca Integral",
       "Marka Zuri Osoa", "علامة تجارية بيضاء بالكامل", "Marca Branca Integral", "Marque Blanche Intégrale", "Vollständiges White-Label", "White Label Integrale")

add_ph("home.corporate.metric3.desc",
       "Con partidos nivelados automáticos", "With automated dynamic matchmaking", "Con partidos nivelados automáticos", "Amb partits anivellats automàtics", "Amb partits anivellats automàtics",
       "Partida parekatu automatikoekin", "مع مباريات متكافئة ومستوى متوازن", "Com partidas niveladas automáticas", "Avec matchs équilibrés automatiques", "Mit automatischem Niveau-Matchmaking", "Con partite livellate automatiche")

add_ph("home.corporate.metric4.desc",
       "Infraestructura Vercel & Supabase Cloud", "Cloud Infrastructure on Vercel & Supabase", "Infraestrutura Cloud de Alta Velocidade", "Infraestructura Cloud d'Alta Velocitat", "Infraestructura Cloud d'Alta Velocitat",
       "Abiadura handiko Cloud azpiegitura", "بنية سحابية فائقة السرعة والأمان", "Infraestrutura Cloud de Alta Velocidade", "Infrastructure Cloud Haute Performance", "Hochverfügbare Cloud-Infrastruktur", "Infrastruttura Cloud ad Alta Velocità")

add_ph("home.corporate.mockup.aiLabel",
       "Copiloto IA en WhatsApp:", "WhatsApp AI Assistant:", "Copiloto IA en WhatsApp:", "Copilot IA a WhatsApp:", "Copilot IA a WhatsApp:",
       "WhatsApp-eko IA Laguntzailea:", "المساعد الذكي عبر واتساب:", "Copiloto IA no WhatsApp:", "Assistant IA sur WhatsApp :", "WhatsApp-KI-Assistent:", "Assistente IA su WhatsApp:")

add_ph("home.corporate.mockup.revenueTrend",
       "+28% vs semana anterior", "+28% vs previous week", "+28% vs semana anterior", "+28% vs setmana anterior", "+28% vs setmana anterior",
       "+%28 aurreko astearekin alderatuta", "+28% مقارنة بالأسبوع الماضي", "+28% vs semana anterior", "+28% par rapport à la semaine passée", "+28% gegenüber Vorwoche", "+28% rispetto alla settimana precedente")

add_ph("home.corporate.modal.badge",
       "Alta de Club en Setmio", "Setmio Club Onboarding", "Alta de Club en Setmio", "Alta de Club a Setmio", "Alta de Club a Setmio",
       "Klubaren Alta Setmio-n", "تسجيل نادي جديد في ستميو", "Registo de Clube no Setmio", "Inscription de Club sur Setmio", "Club-Registrierung bei Setmio", "Registrazione Circolo su Setmio")

add_ph("home.corporate.modal.courtsLabel",
       "Número de Pistas", "Number of Courts", "Número de Pistas", "Nombre de Pistes", "Nombre de Pistes",
       "Kantxa Kopurua", "عدد الملاعب", "Número de Campos", "Nombre de Terrains", "Anzahl der Plätze", "Numero di Campi")

add_ph("home.corporate.modal.emailLabel",
       "Email de Contacto", "Contact Email", "Email de Contacto", "Email de Contacte", "Email de Contacte",
       "Harremanetarako Posta", "البريد الإلكتروني للتواصل", "Email de Contacto", "Email de Contact", "Kontakt-E-Mail", "Email di Contatto")

add_ph("home.corporate.modal.phoneLabel",
       "Teléfono / WhatsApp", "Phone / WhatsApp", "Teléfono / WhatsApp", "Telèfon / WhatsApp", "Telèfon / WhatsApp",
       "Telefonoa / WhatsApp", "الهاتف / واتساب", "Telefone / WhatsApp", "Téléphone / WhatsApp", "Telefon / WhatsApp", "Telefono / WhatsApp")

add_ph("home.corporate.modules.ai.title",
       "Copiloto IA en WhatsApp", "24/7 WhatsApp AI Copilot", "Copiloto IA en WhatsApp", "Copilot IA a WhatsApp", "Copilot IA a WhatsApp",
       "IA Laguntzailea WhatsApp-en", "مساعد ذكاء اصطناعي على واتساب", "Copiloto IA no WhatsApp", "Assistant IA sur WhatsApp", "KI-Copilot auf WhatsApp", "Assistente IA su WhatsApp")

add_ph("home.corporate.modules.iot.title",
       "Domótica IoT Inteligente", "Smart IoT Automation", "Domótica IoT Intelixente", "Domòtica IoT Intel·ligent", "Domòtica IoT Intel·ligent",
       "IoT Domotika Adimenduna", "أتمتة إنترنت الأشياء الذكية", "Domótica IoT Inteligente", "Domotique IoT Intelligente", "Smarte IoT-Automation", "Domotica IoT Intelligente")

add_ph("home.corporate.pricing.clubBaseFeat2",
       "Reservas ilimitadas online", "Unlimited online bookings", "Reservas ilimitadas online", "Reserves il·limitades online", "Reserves il·limitades online",
       "Erreserba mugagabeak sarean", "حجوزات غير محدودة عبر الإنترنت", "Reservas online ilimitadas", "Réservations illimitées en ligne", "Unbegrenzte Online-Buchungen", "Prenotazioni illimitate online")

add_ph("home.corporate.pricing.clubBaseTitle",
       "Plan Club Base", "Club Base Plan", "Plan Club Base", "Pla Club Base", "Pla Club Base",
       "Club Base Plana", "باقة النادي الأساسية", "Plano Club Base", "Forfait Club Base", "Club Base Paket", "Piano Club Base")

add_ph("home.corporate.pricing.clubProFeat5",
       "Domótica IoT de pistas", "Court IoT Automation", "Domótica IoT de pistas", "Domòtica IoT de pistes", "Domòtica IoT de pistes",
       "Kantxen IoT domotika", "أتمتة إنترنت الأشياء للملاعب", "Domótica IoT de campos", "Domotique IoT des terrains", "IoT-Platzsteuerung", "Domotica IoT per i campi")

add_ph("home.corporate.pricing.clubProTitle",
       "Plan Club Pro", "Club Pro Plan", "Plan Club Pro", "Pla Club Pro", "Pla Club Pro",
       "Club Pro Plana", "باقة النادي الاحترافية", "Plano Club Pro", "Forfait Club Pro", "Club Pro Paket", "Piano Club Pro")

add_ph("home.corporate.pricing.coachTitle",
       "Coach / Academia", "Coach / Academy", "Adestrador / Academia", "Entrenador / Acadèmia", "Entrenador / Acadèmia",
       "Entrenatzailea / Akademia", "المدرب / الأكاديمية", "Treinador / Academia", "Entraîneur / Académie", "Trainer / Akademie", "Maestro / Accademia")

add_ph("home.corporate.pricing.eliteFeat2",
       "Copiloto IA 24/7 en WhatsApp", "24/7 AI Copilot on WhatsApp", "Copiloto IA 24/7 en WhatsApp", "Copilot IA 24/7 a WhatsApp", "Copilot IA 24/7 a WhatsApp",
       "24/7 IA Laguntzailea WhatsApp-en", "مساعد ذكي على مدار الساعة عبر واتساب", "Copiloto IA 24/7 no WhatsApp", "Assistant IA 24/7 sur WhatsApp", "24/7-KI-Copilot auf WhatsApp", "Assistente IA 24/7 su WhatsApp")

add_ph("home.corporate.pricing.eliteFeat5",
       "Integración ERP & API REST", "Enterprise ERP & REST API Sync", "Integración ERP e API REST", "Integració ERP i API REST", "Integració ERP i API REST",
       "ERP eta REST API integrazioa", "تكامل كامل مع أنظمة ERP وواجهات REST API", "Integração ERP e API REST", "Intégration ERP & API REST", "ERP-Anbindung & REST-API", "Integrazione ERP e API REST")

add_ph("home.corporate.pricing.elitePlanTitle",
       "Enterprise Marca Blanca", "White-Label Enterprise", "Enterprise Marca Branca", "Enterprise Marca Blanca", "Enterprise Marca Blanca",
       "Enterprise Marka Zuria", "باقة إنتربرايز بالعلامة البيضاء", "Enterprise Marca Branca", "Entreprise Marque Blanche", "Enterprise White-Label", "Enterprise White Label")

add_ph("home.corporate.solutions.coaches.btn",
       "Ver solución para profesores", "Explore Coach Solution", "Ver solución para adestradores", "Veure solució per a entrenadors", "Veure solució per a entrenadors",
       "Ikusi irakasleentzako irtenbidea", "عرض حلول المدربين والأكاديميات", "Ver solução para treinadores", "Découvrir la solution entraîneurs", "Lösung für Trainer ansehen", "Scopri soluzione per maestri")

add_ph("home.corporate.solutions.coaches.title",
       "Profesores & Academias", "Coaches & Academies", "Adestradores e Academias", "Entrenadors i Acadèmies", "Entrenadors i Acadèmies",
       "Irakasleak eta Akademiak", "المدربون والأكاديميات", "Treinadores e Academias", "Entraîneurs & Académies", "Trainer & Akademien", "Maestri e Accademie")

add_ph("home.corporate.solutions.pro.btn",
       "Ver solución profesional", "Explore Pro Athlete Solution", "Ver solución profesional", "Veure solució professional", "Veure solució professional",
       "Ikusi irtenbide profesionala", "عرض الحلول الرياضية الاحترافية", "Ver solução profissional", "Découvrir la solution professionnelle", "Profi-Lösung ansehen", "Scopri soluzione atleti")

add_ph("home.corporate.video.aria",
       "Partido profesional de pádel", "Professional padel match video", "Partido profesional de pádel", "Partit professional de pàdel", "Partit professional de pàdel",
       "Padel partida profesionala", "مباراة بادل احترافية", "Jogo profissional de padel", "Match professionnel de padel", "Professionelles Padel-Match", "Partita professionistica di padel")

add_ph("home.demo.badge",
       "Demos Interactivas y Personalizadas por Rol", "Interactive Role-Based Live Demos", "Demos Interactivas e Personalizadas por Rol", "Demos Interactives i Personalitzades per Rol", "Demos Interactives i Personalitzades per Rol",
       "Rolaren araberako Demo Interaktiboak", "عروض تفاعلية حية مخصصة بحسب الدور", "Demos Interativas e Personalizadas por Perfil", "Démos Interactives par Rôle", "Interaktive Demos nach Benutzerrolle", "Demo Interattive Personalizzate per Ruolo")

add_ph("home.demo.roleClub",
       "Gerentes de Club", "Club Managers", "Xerentes de Club", "Gerents de Club", "Gerents de Club",
       "Klubeko Kudeatzaileak", "مديرو الأندية الرياضية", "Diretores de Clube", "Directeurs de Club", "Club-Manager & Betreiber", "Direttori di Circolo")

add_ph("home.demo.roleCoaches",
       "Profesores & Academias", "Coaches & Academies", "Adestradores e Academias", "Entrenadors i Acadèmies", "Entrenadors i Acadèmies",
       "Irakasleak eta Akademiak", "المدربون والأكاديميات", "Treinadores e Academias", "Entraîneurs & Académies", "Trainer & Akademien", "Maestri e Accademie")

add_ph("home.demo.rolePlayers",
       "Jugadores & Socios", "Players & Club Members", "Xogadores e Socios", "Jugadors i Socis", "Jugadors i Socis",
       "Jokalariak eta Bazkideak", "اللاعبون والأعضاء", "Jogadores e Sócios", "Joueurs & Membres", "Spieler & Clubmitglieder", "Giocatori e Soci")

add_ph("home.demo.rolePro",
       "Jugadores Profesionales", "Pro Athletes", "Xogadores Profesionais", "Jugadors Professionals", "Jugadors Professionals",
       "Jokalari Profesionalak", "اللاعبون المحترفون", "Jogadores Profissionais", "Joueurs Professionnels", "Profi-Spieler & Athleten", "Giocatori Professionisti")

add_ph("home.demo.title",
       "Solicita una Demo Guiada o Prueba el Sistema por Rol", "Request a Guided Demo or Test-Drive by Role",
       "Solicita unha Demo Guiada ou Proba o Sistema por Rol", "Sol·licita una Demo Guiada o Prova el Sistema per Rol", "Sol·licita una Demo Guiada o Prova el Sistema per Rol",
       "Eskatu Gidatutako Demoa edo Probatu Sistema Rolen Arabera", "اطلب عرضاً تجريبياً أو جرب النظام بحسب الدور",
       "Solicite uma Demo Guiada ou Experimente o Sistema por Função", "Demandez une Démo Guidée ou Testez par Profil",
       "Geführte Demo anfordern oder System nach Rolle testen", "Richiedi una Demo Guidata o Prova per Ruolo")

add_ph("home.matches.join",
       "Unirme a esta Partida", "Join Match", "Unirme a esta Partida", "Unir-me a aquest Partit", "Unir-me a aquest Partit",
       "Bat egin partida honekin", "الانضمام إلى هذه المباراة", "Entrar nesta Partida", "Rejoindre la Partie", "Diesem Match beitreten", "Partecipa alla Partita")

add_ph("home.search.afternoon",
       "Tardes (16:00 - 20:00)", "Afternoons (16:00 - 20:00)", "Tardes (16:00 - 20:00)", "Tardes (16:00 - 20:00)", "Tardes (16:00 - 20:00)",
       "Arratsaldeak (16:00 - 20:00)", "فترة بعد الظهر (16:00 - 20:00)", "Tardes (16:00 - 20:00)", "Après-midi (16h00 - 20h00)", "Nachmittags (16:00 - 20:00)", "Pomeriggio (16:00 - 20:00)")

add_ph("home.search.catalog",
       "Ver catálogo de 8 pistas", "View all 8 courts", "Ver catálogo de 8 pistas", "Veure catàleg de 8 pistes", "Veure catàleg de 8 pistes",
       "Ikusi 8 kantxako katalogoa", "عرض دليل الملاعب الـ 8", "Ver catálogo de 8 campos", "Consulter les 8 terrains", "Alle 8 Plätze anzeigen", "Visualizza tutti gli 8 campi")

add_ph("home.search.players.indoor",
       "Pista Indoor Climatizada", "Indoor Climate-Controlled Court", "Pista Indoor Climatizada", "Pista Indoor Climatitzada", "Pista Indoor Climatitzada",
       "Estalitako Kantxa Klimatizatua", "ملعب داخلي مغطى ومكيف", "Campo Indoor Climatizado", "Court Couvert Climatisé", "Klimatisierter Hallenplatz", "Campo Indoor Climatizzato")

add_ph("home.teams.masculino1.name",
       "Absoluto Masculino A", "Men's First Team", "Absoluto Masculino A", "Absolut Masculí A", "Absolut Masculí A",
       "Gizonezkoen Lehen Taldea", "فريق الرجال الأول", "Absoluto Masculino A", "Équipe Première Hommes", "Herren 1", "Assoluto Maschile A")

print(f"dict_batch_pricing_home.py ready with {len(PRICING_HOME_TRANSLATIONS)} keys!")
