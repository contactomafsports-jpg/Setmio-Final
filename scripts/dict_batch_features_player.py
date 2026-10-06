"""Translations for uncovered Features and PlayerPage keys across 9 secondary languages:
gl, ca, va, eu, ar, pt, fr, de, it, plus es and en.
"""

FEATURES_PLAYER_TRANSLATIONS = {}

def add_fp(key, es, en, gl, ca, va, eu, ar, pt, fr, de, it):
    FEATURES_PLAYER_TRANSLATIONS[key] = {
        "es": es, "en": en, "gl": gl, "ca": ca, "va": va, "eu": eu,
        "ar": ar, "pt": pt, "fr": fr, "de": de, "it": it
    }

# --- FEATURES ---
add_fp("features.domoticaBadge",
       "Hardware & Pistas Inteligentes", "Hardware & Smart Courts", "Hardware e Pistas Intelixentes", "Maquinari i Pistes Intel·ligents", "Maquinari i Pistes Intel·ligents",
       "Hardwarea eta Kantxa Adimendunak", "الأجهزة والملاعب الذكية", "Hardware e Campos Inteligentes", "Matériel et Terrains Intelligents", "Hardware & Smarte Plätze", "Hardware e Campi Intelligenti")

add_fp("features.domoticaDesc",
       "Descubre nuestro módulo exclusivo de Domótica IoT para control de iluminación LED, aperturas por PIN temporal y cámaras de repetición.",
       "Discover our turnkey IoT automation module for automated LED floodlighting, time-boxed PIN access, and video highlights.",
       "Descobre o noso módulo exclusivo de Domótica IoT para control de iluminación LED, aperturas por PIN temporal e cámaras de repetición.",
       "Descobreix el nostre mòdul exclusiu de Domòtica IoT per a control d'il·luminació LED, obertures per PIN temporal i càmeres de repetició.",
       "Descobreix el nostre mòdul exclusiu de Domòtica IoT per a control d'il·luminació LED, obertures per PIN temporal i càmeres de repetició.",
       "Ezagutu gure IoT Domotika modulu esklusiboa LED argiak kontrolatzeko, aldi baterako PIN bidezko sarbideetarako eta errepikapen-kameretarako.",
       "اكتشف نظام أتمتة إنترنت الأشياء الحصري للتحكم في إضاءة LED، بوابات الدخول برمز PIN المؤقت وكاميرات تسجيل الأهداف.",
       "Descubra o nosso módulo exclusivo de Domótica IoT para iluminação LED, acessos por PIN temporário e câmaras de repetição.",
       "Découvrez notre module exclusif d'automatisation IoT pour l'éclairage LED, les accès par code PIN et les caméras de replay.",
       "Entdecken Sie unser IoT-Modul für automatisierte LED-Flutlichtsteuerung, PIN-Zutritt und Replay-Kameras.",
       "Scopri il nostro modulo esclusivo di Domotica IoT per luci LED, accessi con PIN temporaneo e telecamere replay.")

add_fp("features.domoticaTitle",
       "¿Buscas automatizar luces y cerraduras?", "Looking to automate lighting and court access?",
       "Buscas automatizar luces e pechaduras?", "Busques automatitzar llums i panys?", "Busques automatitzar llums i panys?",
       "Argiak eta sarrailak automatizatu nahi dituzu?", "هل تبحث عن أتمتة الإضاءة والأقفال الإلكترونية؟",
       "Procura automatizar iluminação e fechaduras?", "Vous souhaitez automatiser l'éclairage et les accès ?",
       "Möchten Sie Beleuchtung und Schlösser automatisieren?", "Cerchi di automatizzare luci e serrature?")

add_fp("features.mainSubtitle",
       "Una plataforma modular y conectada para profesionalizar la gestión deportiva, automatizar reservas y cobros, y ofrecer a tus jugadores la mejor experiencia del pádel.",
       "A modular, connected platform to elevate facility management, automate bookings and payments, and deliver the premier padel experience.",
       "Unha plataforma modular e conectada para profesionalizar a xestión deportiva, automatizar reservas e cobros, e ofrecer aos teus xogadores a mellor experiencia do pádel.",
       "Una plataforma modular i connectada per professionalitzar la gestió esportiva, automatitzar reserves i cobraments, i oferir als teus jugadors la millor experiència del pàdel.",
       "Una plataforma modular i connectada per professionalitzar la gestió esportiva, automatitzar reserves i cobraments, i oferir als teus jugadors la millor experiència del pàdel.",
       "Plataforma modular eta konektatua kirol-kudeaketa profesionalizatzeko, erreserbak eta ordainketak automatizatzeko, eta jokalariei padel esperientzia onena eskaintzeko.",
       "منصة معيارية متكاملة للارتقاء بإدارة الأندية الرياضية، أتمتة الحجوزات والمدفوعات، وتقديم أفضل تجربة لعشاق البادل.",
       "Uma plataforma modular e integrada para profissionalizar a gestão desportiva, automatizar reservas e pagamentos e oferecer a melhor experiência de padel.",
       "Une plateforme modulaire et connectée pour professionnaliser la gestion sportive, automatiser les réservations et offrir la meilleure expérience padel.",
       "Eine modulare Komplettplattform für professionelles Clubmanagement, automatisierte Buchungen und ein erstklassiges Padel-Erlebnis.",
       "Una piattaforma modulare e integrata per professionalizzare la gestione sportiva, automatizzare prenotazioni e incassi e offrire la migliore esperienza.")

# Module 0: Cuadrante
add_fp("features.module.0.title",
       "Cuadrante de Reservas & Disponibilidad en Tiempo Real", "Real-Time Booking Grid & Court Availability",
       "Cuadrante de Reservas e Dispoñibilidade en Tempo Real", "Quadrant de Reserves i Disponibilitat en Temps Real", "Quadrant de Reserves i Disponibilitat en Temps Real",
       "Erreserben Koadrantea eta Denbora Errealeko Erabilgarritasuna", "جدول الحجوزات والملاعب الشاغرة لحظياً",
       "Grelha de Reservas e Disponibilidade em Tempo Real", "Planning des Réservations et Disponibilité en Temps Réel",
       "Echtzeit-Buchungskalender & Platzverfügbarkeit", "Tabellone Prenotazioni e Disponibilità in Tempo Reale")

add_fp("features.module.0.desc",
       "Motor de cuadrante visual optimizado para dispositivos táctiles y móviles. Gestiona pistas cubiertas, exteriores e individuales con tarifas dinámicas por franja horaria.",
       "Visual schedule engine optimized for touchscreens and mobile. Manage indoor, outdoor, and single courts with dynamic time-based pricing.",
       "Motor de cuadrante visual optimizado para dispositivos táctiles e móbiles. Xestiona pistas cubertas, exteriores e individuais con tarifas dinámicas por franxa horaria.",
       "Motor de quadrant visual optimitzat per a dispositius tàctils i mòbils. Gestiona pistes cobertes, exteriors i individuals amb tarifes dinàmiques per franja horària.",
       "Motor de quadrant visual optimitzat per a dispositius tàctils i mòbils. Gestiona pistes cobertes, exteriors i individuals amb tarifes dinàmiques per franja horària.",
       "Gailu ukigarrietarako eta mugikorretarako optimizatutako koadrante-motor bisuala. Kudeatu estalitako kantxak, kanpokoak eta banakakoak ordu-tartearen araberako tarifa dinamikoekin.",
       "محرك جدول تفاعلي محسن للشاشات اللمسية والهواتف الذكية. إدارة الملاعب المغطاة والمكشوفة بأسعار ديناميكية حسب الأوقات.",
       "Motor de grelha visual otimizado para ecrãs táteis e smartphones. Faça a gestão de campos cobertos, exteriores e individuais com preços dinâmicos por horário.",
       "Moteur de planning visuel tactile et mobile. Gérez terrains couverts, extérieurs et simples avec tarification dynamique par créneau horaire.",
       "Visueller Buchungskalender optimiert für Touchscreens und Mobilgeräte. Verwalten Sie Hallen- und Außenplätze mit dynamischen Zeittarifen.",
       "Motore visivo ottimizzato per touch screen e smartphone. Gestisci campi coperti, scoperti e singoli con tariffe dinamiche per fascia oraria.")

add_fp("features.module.0.f.0",
       "División automática de pago entre 4 jugadores (Split Payments)", "Automated 4-way split payments among match participants",
       "División automática de pago entre 4 xogadores (Split Payments)", "Divisió automàtica de pagament entre 4 jugadors (Split Payments)", "Divisió automàtica de pagament entre 4 jugadors (Split Payments)",
       "Ordainketa zatiketa automatikoa 4 jokalariren artean (Split Payments)", "تقسيم تلقائي للدفع بين اللاعبين الـ 4 بالتساوي",
       "Divisão automática de pagamento entre 4 jogadores (Split Payments)", "Paiement fractionné automatique entre les 4 joueurs (Split Payments)",
       "Automatische 4-Wege-Gebührenteilung unter Spielern (Split Payments)", "Divisione automatica del pagamento tra 4 giocatori (Split Payments)")

add_fp("features.module.0.f.1",
       "Políticas de cancelación con penalización y fianza configurables", "Customizable cancellation policies with deposits and penalties",
       "Políticas de cancelación con penalización e fianza configurables", "Polítiques de cancel·lació amb penalització i fiança configurables", "Polítiques de cancel·lació amb penalització i fiança configurables",
       "Ezeztatze-politikak zigor eta fidantza konfiguragarriekin", "سياسات إلغاء مرنة مع غرامات وعربونات قابلة للضبط",
       "Políticas de cancelamento com penalizações e caução configuráveis", "Politiques d'annulation personnalisables avec pénalités et arrhes",
       "Individuelle Stornobedingungen mit Kaution und Ausfallgebühren", "Politiche di cancellazione con penali e cauzione configurabili")

add_fp("features.module.0.f.2",
       "Sincronización instantánea sin solapamientos ni reservas duplicadas", "Zero-collision sub-millisecond sync preventing double bookings",
       "Sincronización instantánea sen solapamentos nin reservas duplicadas", "Sincronització instantània sense encavalcaments ni reserves duplicades", "Sincronització instantània sense encavalcaments ni reserves duplicades",
       "Berehalako sinkronizazioa gainjartzerik eta erreserba bikoizturik gabe", "مزامنة فورية تمنع تضارب المواعيد والحجوزات المزدوجة",
       "Sincronização instantânea sem sobreposições nem reservas duplicadas", "Synchronisation instantanée prévenant les réservations en double",
       "Konfliktfreie Sofort-Synchronisierung verhindert Doppelbuchungen", "Sincronizzazione istantanea senza sovrapposizioni né prenotazioni doppie")

add_fp("features.module.0.f.3",
       "Gestión de partidas fijas semanales de abonados", "Standing weekly recurring member slots management",
       "Xestión de partidas fixas semanais de abonados", "Gestió de partides fixes setmanals d'abonats", "Gestió de partides fixes setmanals d'abonats",
       "Abonatuen asteko partida finkoen kudeaketa", "إدارة المواعيد الأسبوعية الثابتة للمشتركين",
       "Gestão de jogos fixos semanais de sócios", "Gestion des parties hebdomadaires récurrentes pour abonnés",
       "Verwaltung fester wöchentlicher Stamm-Abo-Plätze", "Gestione partite fisse settimanali degli abbonati")

# Module 1: Escuela
add_fp("features.module.1.badge",
       "Escuela & Clinics", "Academy & Clinics", "Escola e Clinics", "Escola i Clínics", "Escola i Clínics",
       "Eskola eta Klinikak", "المدارس والتدريب المتخصص", "Escola e Clínicas", "École & Stages", "Schule & Lehrgänge", "Scuola & Stage")

add_fp("features.module.1.title",
       "Academia, Cursos & Gestión de Alumnos", "Academy, Group Courses & Student Management",
       "Academia, Cursos e Xestión de Alumnos", "Acadèmia, Cursos i Gestió d'Alumnes", "Acadèmia, Cursos i Gestió d'Alumnes",
       "Akademia, Ikastaroak eta Ikasleen Kudeaketa", "إدارة الأكاديميات، الدورات التدريبية والطلاب",
       "Academia, Cursos e Gestão de Alunos", "Académie, Cours Collectifs & Gestion des Élèves",
       "Padel-Akademie, Kurse & Schülerverwaltung", "Accademia, Corsi e Gestione Allievi")

add_fp("features.module.1.desc",
       "Estructuración de cursos mensuales, trimestrales y clases sueltas particulares. Asignación de profesores con cálculo automático de liquidaciones.",
       "Structure recurring monthly or quarterly terms alongside individual private coaching. Automated coach payroll settlement calculation.",
       "Estructuración de cursos mensuais, trimestrais e clases soltas particulares. Asignación de profesores con cálculo automático de liquidacións.",
       "Estructuració de cursos mensuals, trimestrals i classes soltes particulars. Assignació de professors amb càlcul automàtic de liquidacions.",
       "Estructuració de cursos mensuals, trimestrals i classes soltes particulars. Assignació de professors amb càlcul automàtic de liquidacions.",
       "Hileko eta hiruhileko ikastaroen zein banakako klase solteen antolaketa. Irakasleen esleipena likidazioen kalkulu automatikoarekin.",
       "تنظيم الدورات الشهرية، الفصلية والدروس الخصوصية. توزيع المدربين واحتساب مستحقاتهم المالية تلقائياً.",
       "Estruturação de cursos mensais, trimestrais e aulas particulares avulsas. Atribuição de treinadores com cálculo automático de liquidações.",
       "Organisation des cycles mensuels, trimestriels et cours individuels. Affectation des entraîneurs et calcul automatique des rémunérations.",
       "Strukturierung monatlicher Kurse, Quartalslehrgänge und Einzelstunden. Trainerzuweisung mit automatischer Provisionsberechnung.",
       "Organizzazione di corsi mensili, trimestrali e lezioni private. Assegnazione maestri e calcolo automatico dei compensi.")

add_fp("features.module.1.f.0",
       "Control de asistencia y recuperación de clases canceladas por lluvia", "Attendance tracking with automated rain-check class makeup vouchers",
       "Control de asistencia e recuperación de clases canceladas por choiva", "Control d'assistència i recuperació de classes cancel·lades per pluja", "Control d'assistència i recuperació de classes cancel·lades per pluja",
       "Bertaratze-kontrola eta euriagatik bertan behera utzitako klaseak berreskuratzea", "تسجيل الحضور وتعويض الحصص الملغاة بسبب الأمطار",
       "Registo de presenças e recuperação de aulas canceladas pela chuva", "Feuilles de présence et gestion des reports de cours en cas de pluie",
       "Anwesenheitskontrolle und Nachholtermine bei Regenabsagen", "Registro presenze e recupero lezioni annullate per maltempo")

add_fp("features.module.1.f.1",
       "Cuotas diferenciadas para socios y no socios", "Differentiated fee structures for members and non-members",
       "Cotas diferenciadas para socios e non socios", "Quotes diferenciades per a socis i no socis", "Quotes diferenciades per a socis i no socis",
       "Kuota bereiziak bazkideentzat eta bazkide ez direnentzat", "رسوم واشتراكات متباينة للأعضاء وغير الأعضاء",
       "Mensalidades diferenciadas para sócios e não-sócios", "Tarification différenciée adhérents et non-adhérents",
       "Differenzierte Tarife für Mitglieder und Gastspieler", "Tariffe agevolate per soci e prezzi per non soci")

add_fp("features.module.1.f.2",
       "Listas de espera automáticas con aviso instantáneo de vacantes", "Automated waitlists with instant vacancy notifications",
       "Listas de agarda automáticas con aviso instantáneo de vacantes", "Llistes d'espera automàtiques amb avís instantani de vacants", "Llistes d'espera automàtiques amb avís instantani de vacants",
       "Itxaron-zerrenda automatikoak plaza hutsak berehala jakinarazteko", "قوائم انتظار ذكية مع إشعارات فورية عند توفر أماكن شاغرة",
       "Listas de espera automáticas com notificação instantânea de vagas", "Listes d'attente automatiques avec alerte instantanée de place libre",
       "Automatische Wartelisten mit Sofortbenachrichtigung bei freien Plätzen", "Liste d'attesa automatiche con notifica immediata posti liberi")

add_fp("features.module.1.f.3",
       "Ficha de progreso técnico y nivel dinámico por alumno", "Student technical development card and decimal level tracking",
       "Ficha de progreso técnico e nivel dinámico por alumno", "Fitxa de progrés tècnic i nivell dinàmic per alumne", "Fitxa de progrés tècnic i nivell dinàmic per alumne",
       "Aurrerapen teknikoaren fitxa eta maila dinamikoa ikasle bakoitzeko", "سجل التطور الفني وتقييم المستوى الرياضي لكل طالب",
       "Ficha de evolução técnica e nível dinâmico por aluno", "Fiche de progression technique et niveau dynamique par élève",
       "Technisches Entwicklungsprofil und Einstufung pro Schüler", "Scheda di avanzamento tecnico e livello dinamico per allievo")

# Module 2: TPV
add_fp("features.module.2.badge",
       "Ventas en Barra", "Bar & POS", "Vendas en Barra", "Vendes a Barra", "Vendes a Barra",
       "Barrako Salmentak", "المبيعات ونقاط البيع", "Vendas ao Balcão", "Ventes Bar & Restauration", "Gastronomie & Barverkauf", "Vendite al Bar")

add_fp("features.module.2.title",
       "TPV Táctil de Bar, Cafetería & Pro Shop", "Touch POS for Bar, Cafeteria & Pro Shop",
       "TPV Táctil de Bar, Cafetería e Pro Shop", "TPV Tàctil de Bar, Cafeteria i Botiga Pro", "TPV Tàctil de Bar, Cafeteria i Botiga Pro",
       "Taberna, Kafetegi eta Pro Shop-eko TPV Taktila", "نقطة بيع لمسية للكافيتريا والمتجر الرياضي",
       "POS Tátil de Bar, Cafetaria e Loja Pro Shop", "Caisse Tactile Bar, Snack & Pro Shop",
       "Touch-Kassensystem für Bar, Gastronomie & Pro Shop", "POS Touch per Bar, Tavola Calda e Pro Shop")

add_fp("features.module.2.desc",
       "Punto de venta táctil con cartas visuales de bebidas y material deportivo. Carga consumos directamente a la reserva de pista o al saldo del monedero del socio.",
       "Visual touch POS interface for food, beverage, and sporting equipment. Charge purchases directly to match bookings or member virtual wallets.",
       "Punto de venda táctil con cartas visuales de bebidas e material deportivo. Carga consumos directamente á reserva de pista ou ao saldo do moedeiro do socio.",
       "Punt de venda tàctil amb cartes visuals de begudes i material esportiu. Carrega consums directament a la reserva de pista o al saldo del moneder del soci.",
       "Punt de venda tàctil amb cartes visuals de begudes i material esportiu. Carrega consums directament a la reserva de pista o al saldo del moneder del soci.",
       "Salmenta-puntu ukigarria edarien eta kirol-materialaren menu bisualekin. Kargatu kontsumoak zuzenean kantxaren erreserbari edo bazkidearen diru-zorroari.",
       "نقطة بيع لمسية بواجهات بصرية للمشروبات والعتاد الرياضي. خصم فوري على حساب حجز الملعب أو من محفظة العضو الرقمية.",
       "Ponto de venda tátil com ementas visuais de bebidas e artigos desportivos. Impute consumos diretamente à reserva de campo ou à carteira do sócio.",
       "Interface tactile pour boissons, snacks et matériel. Facturez directement sur la réservation de court ou le solde du compte joueur.",
       "Visuelles Touch-Kassensystem für Gastronomie und Sportartikel. Buchung direkt auf Platzreservierungen oder Spielerguthaben.",
       "Punto vendita touch per bevande, snack e attrezzatura sportiva. Addebito diretto sulla prenotazione del campo o sul borsellino del socio.")

add_fp("features.module.2.f.0",
       "Cierre y arqueo de caja con desglose de formas de pago", "End-of-day register closing and cash reconciliation by payment method",
       "Peche e arqueo de caixa con desglose de formas de pago", "Tancament i arqueig de caixa amb desglossament de formes de pagament", "Tancament i arqueig de caixa amb desglossament de formes de pagament",
       "Kaxa ixtea eta kaxa-zenbaketa ordainketa-moduen arabera", "إغلاق ومطابقة الصندوق اليومي مع تفصيل وسائل الدفع",
       "Fecho e reconciliação de caixa discriminado por método de pagamento", "Clôture de caisse et réconciliation par moyen de paiement",
       "Tagesabschluss und Kassenabgleich aufgeschlüsselt nach Zahlungsart", "Chiusura di cassa e quadratura dettagliata per metodo di pagamento")

add_fp("features.module.2.f.1",
       "Impresión térmica nativa de tickets de caja", "Native thermal receipt printer driver integration",
       "Impresión térmica nativa de tickets de caixa", "Impressió tèrmica nativa de tiquets de caixa", "Impressió tèrmica nativa de tiquets de caixa",
       "Kaxa-tiketen inprimatze termiko natiboa", "طباعة إيصالات حرارية متوافقة مع كافة الطابعات",
       "Impressão térmica nativa de talões de caixa", "Impression thermique native des reçus de caisse",
       "Direkte Anbindung von Thermobondruckern für Belege", "Stampa termica nativa degli scontrini di cassa")

add_fp("features.module.2.f.2",
       "Control de stock de bolas, grips, palas de test y consumibles", "Inventory control for balls, grips, test rackets, and equipment",
       "Control de stock de bólas, grips, palas de test e consumibles", "Control d'estoc de pilotes, grips, pales de test i consumibles", "Control d'estoc de pilotes, grips, pales de test i consumibles",
       "Piloten, gripen, probako palen eta kontsumigarrien stock-kontrola", "إدارة مخزون الكرات، المقابض، مضارب التجربة والمستلزمات",
       "Controlo de inventário de bolas, grips, raquetes de teste e consumíveis", "Suivi des stocks de balles, surgrips, raquettes de test et accessoires",
       "Lagerbestandsführung für Bälle, Grips, Testschläger und Verbrauchsmaterial", "Gestione magazzino per palline, grip, racchette test e consumabili")

add_fp("features.module.2.f.3",
       "Cobro combinado con tarjeta bancaria, efectivo o Bizum", "Hybrid payments supporting card, cash, and mobile wallets",
       "Cobro combinado con tarxeta bancaria, efectivo ou Bizum", "Cobrament combinat amb targeta bancària, efectiu o Bizum", "Cobrament combinat amb targeta bancària, efectiu o Bizum",
       "Ordainketa konbinatua banku-txartelarekin, eskudirutan edo Bizumekin", "دفع مرن يجمع بين البطاقات البنكية، النقد والمحافظ الإلكترونية",
       "Cobrança combinada com cartão bancário, numerário ou Bizum", "Encaissement combiné carte bancaire, espèces ou paiement mobile",
       "Kombinierte Bezahlung mit EC-/Kreditkarte, Bargeld oder mobilen Wallets", "Pagamento combinato con carta, contanti o portafoglio digitale")

# Module 3: Torneos
add_fp("features.module.3.title",
       "Gestor de Torneos, Ligas & Rankings", "Tournament, League & Ranking Manager",
       "Xestor de Torneos, Ligas e Rankings", "Gestor de Tornejos, Lligues i Rànquings", "Gestor de Tornejos, Lligues i Rànquings",
       "Txapelketa, Liga eta Sailkapenen Kudeatzailea", "نظام إدارة البطولات، الدوريات والتصنيفات",
       "Gestor de Torneios, Ligas e Rankings", "Gestionnaire de Tournois, Ligues & Classements",
       "Turnier-, Liga- und Ranglistenverwaltung", "Gestore Tornei, Campionati e Classifiche")

add_fp("features.module.3.desc",
       "Organización de torneos de fin de semana, ligas regulares de empresa y pozos americanos. Generación automática de cuadros de eliminatorias y consolación.",
       "Run weekend open tournaments, corporate leagues, and Americanos. Automated draw brackets with main and consolation rounds.",
       "Organización de torneos de fin de semana, ligas regulares de empresa e pozos americanos. Xeración automática de cadros de eliminatorias e consolación.",
       "Organització de tornejos de cap de setmana, lligues regulars d'empresa i pous americans. Generació automàtica de quadres d'eliminatòries i consolació.",
       "Organització de tornejos de cap de setmana, lligues regulars d'empresa i pous americans. Generació automàtica de quadres d'eliminatòries i consolació.",
       "Asteburuko txapelketen, enpresa-liga erregularren eta txapelketa amerikarren antolaketa. Kanporaketa eta kontsolazio koadroen sorrera automatikoa.",
       "تنظيم بطولات عطلة نهاية الأسبوع، دوريات الشركات والبطولات السريعة. توليد تلقائي لجداول المباريات الإقصائية وأدوار الترضية.",
       "Organização de torneios de fim de semana, ligas de empresas e poços americanos. Geração automática de quadros de eliminação e consolação.",
       "Organisation de tournois du week-end, championnats d'entreprises et tournois montante-descendante. Tableaux éliminatoires automatiques.",
       "Organisation von Wochenendturnieren, Firmenligen und Americanos. Automatische Generierung von Haupt- und Trostrundenbäumen.",
       "Organizzazione tornei del weekend, campionati aziendali e formule all'americana. Generazione automatica di tabelloni e consolazione.")

add_fp("features.module.3.f.0",
       "Inscripciones online con cobro anticipado de la cuota de pareja", "Online team registrations with automated upfront entry fee collection",
       "Inscricións online con cobro anticipado da cota de parella", "Inscripcions online amb cobrament anticipat de la quota de parella", "Inscripcions online amb cobrament anticipat de la quota de parella",
       "Lineako izen-emateak bikote-kuotaren aldez aurreko ordainketarekin", "تسجيل الثنائيات عبر الإنترنت مع تحصيل رسوم الاشتراك مسبقاً",
       "Inscrições online com cobrança antecipada da inscrição da dupla", "Inscriptions en ligne avec paiement anticipé par équipe",
       "Online-Anmeldung mit automatisiertem Einzug der Startgebühr pro Paar", "Iscrizioni online con pagamento anticipato della quota a coppia")

add_fp("features.module.3.f.1",
       "Publicación de horarios y resultados en vivo en la web del club", "Live court order of play and match results broadcast on club website",
       "Publicación de horarios e resultados en vivo na web do club", "Publicació d'horaris i resultats en viu a la web del club", "Publicació d'horaris i resultats en viu a la web del club",
       "Ordutegiak eta emaitzak zuzenean argitaratzea klubaren webgunean", "نشر المواعيد والنتائج مباشرة على الموقع الرسمي للنادي",
       "Publicação de horários e resultados em direto no site do clube", "Publication des horaires et scores en direct sur le site du club",
       "Veröffentlichung von Spielansetzungen und Live-Ergebnissen im Web", "Pubblicazione di orari e risultati in tempo reale sul sito del club")

add_fp("features.module.3.f.2",
       "Rankings del club con cálculo de puntos federados o sociales", "Official club rankings calculating social or federated circuit points",
       "Rankings do club con cálculo de puntos federados ou sociais", "Rànquings del club amb càlcul de punts federats o socials", "Rànquings del club amb càlcul de punts federats o socials",
       "Klubaren sailkapenak federatu edo gizarte-puntuen kalkuluarekin", "تصنيفات النادي مع احتساب النقاط الرسمية والاجتماعية",
       "Rankings do clube com cálculo de pontos federados ou sociais", "Classements internes avec attribution de points loisir ou fédéraux",
       "Club-Ranglisten mit Berechnung verbandsoffizieller oder interner Punkte", "Classifiche del circolo con calcolo punteggi federali o sociali")

add_fp("features.module.3.f.3",
       "Generación y exportación de cuadros oficiales y actas", "Export official tournament brackets and competition match sheets",
       "Xeración e exportación de cadros oficiais e actas", "Generació i exportació de quadres oficials i actes", "Generació i exportació de quadres oficials i actes",
       "Koadro ofizialen eta akten sorrera eta esportazioa", "إنشاء وتصدير الجداول الرسمية ومحاضر المباريات",
       "Geração e exportação de quadros oficiais e atas de jogo", "Génération et export des feuilles de match et tableaux officiels",
       "Generierung und Export offizieller Spielberichtsbögen und Tableaus", "Generazione ed esportazione di tabelloni ufficiali e verbali")

# Module 4: CRM
add_fp("features.module.4.badge",
       "Fidelización", "Player Retention", "Fidelización", "Fidelització", "Fidelització",
       "Fidelizazioa", "ولاء العملاء", "Fidelização", "Fidélisation", "Kundenbindung", "Fidelizzazione")

add_fp("features.module.4.title",
       "CRM Deportivo & Ficha Técnica del Jugador", "Athletic CRM & Player Technical Profile",
       "CRM Deportivo e Ficha Técnica do Xogador", "CRM Esportiu i Fitxa Tècnica del Jugador", "CRM Esportiu i Fitxa Tècnica del Jugador",
       "Kirol CRM eta Jokalariaren Fitxa Teknikoa", "نظام إدارة علاقات اللاعبين والسجلات الرياضية",
       "CRM Desportivo e Ficha Técnica do Jogador", "CRM Sportif & Fiche Technique du Joueur",
       "Sportler-CRM & Technisches Spielerprofil", "CRM Sportivo e Scheda Tecnica del Giocatore")

add_fp("features.module.4.desc",
       "Base de datos unificada de clientes con historial de partidos, balance cara a cara (H2H), pala favorita, posición habitual y monedero virtual recargable.",
       "Unified member directory detailing match history, head-to-head records, preferred racket, court position, and reloadable digital balance.",
       "Base de datos unificada de clientes con historial de partidos, balance cara a cara (H2H), pala favorita, posición habitual e moedeiro virtual recargable.",
       "Base de dades unificada de clients amb historial de partits, balanç cara a cara (H2H), pala preferida, posició habitual i moneder virtual recarregable.",
       "Base de dades unificada de clients amb historial de partits, balanç cara a cara (H2H), pala preferida, posició habitual i moneder virtual recarregable.",
       "Bezeroen datu-base bateratua partiden historiarekin, aurrez aurreko balantzearekin (H2H), pala gogokoenarekin, ohiko posizioarekin eta diru-zorro birtual kargagarriarekin.",
       "قاعدة بيانات موحدة للاعبين تتضمن سجل المباريات، المواجهات المباشرة، موقع اللعب المفضل والمحفظة الرقمية.",
       "Base de dados unificada de clientes com histórico de jogos, confronto direto (H2H), raquete favorita, posição em campo e carteira digital.",
       "Base de données membres unifiée avec historique des matchs, face-à-face, matériel favori, côté de jeu et portefeuille prépayé.",
       "Zentrale Mitgliederdatenbank mit Match-Historie, H2H-Bilanzen, bevorzugter Spielseite und aufladbarem Guthabenkonto.",
       "Database unificato dei soci con storico partite, testa a testa (H2H), racchetta preferita, posizione in campo e borsellino digitale.")

add_fp("features.module.4.f.0",
       "Monedero digital con bonificaciones por recarga anticipada", "Virtual wallet with automated bonus credits on bulk preloads",
       "Moedeiro dixital con bonificacións por recarga anticipada", "Moneder digital amb bonificacions per recàrrega anticipada", "Moneder digital amb bonificacions per recàrrega anticipada",
       "Diru-zorro digitala aldez aurretik kargatzeagatik emandako hobariak dituena", "محفظة رقمية مع مكافآت رصيد إضافية عند الشحن المسبق",
       "Carteira digital com bónus em recargas antecipadas", "Portefeuille numérique avec bonus crédités lors des rechargements",
       "Digitales Guthabenkonto mit automatischen Auflade-Boni", "Borsellino elettronico con bonus di ricarica anticipata")

add_fp("features.module.4.f.1",
       "Segmentación por cuotas de socio (familiar, individual, jubilado)", "Membership tier segmentation (family, individual, junior, senior)",
       "Segmentación por cotas de socio (familiar, individual, xubilado)", "Segmentació per quotes de soci (familiar, individual, jubilat)", "Segmentació per quotes de soci (familiar, individual, jubilat)",
       "Bazkide-kuoten araberako segmentazioa (familia, banakakoa, erretiratua)", "تصنيف الأعضاء بحسب الاشتراكات (عائلي، فردي، متقاعد)",
       "Segmentação por categorias de sócio (familiar, individual, sénior)", "Segmentation par catégories d'adhésion (famille, individuel, senior)",
       "Segmentierung nach Mitgliedsbeiträgen (Familie, Einzel, Jugend)", "Segmentazione quote associative (familiare, singolo, senior)")

add_fp("features.module.4.f.2",
       "Métricas de compañero más frecuente y rival habitual", "Frequent partner and top recurring rival analytics",
       "Métricas de compañeiro máis frecuente e rival habitual", "Mètriques de company més freqüent i rival habitual", "Mètriques de company més freqüent i rival habitual",
       "Ohiko kidearen eta ohiko arerioaren neurketak", "إحصائيات الشريك الأكثر تكراراً والمنافس المعتاد",
       "Métricas de parceiro mais frequente e adversário habitual", "Statistiques des partenaires et adversaires les plus fréquents",
       "Auswertungen zu häufigsten Spielpartnern und Lieblingsgegnern", "Statistiche su compagno più frequente e avversario abituale")

add_fp("features.module.4.f.3",
       "Auditoría de reservas y cancelaciones por usuario", "User-level booking activity and cancellation audit tracking",
       "Auditoría de reservas e cancelacións por usuario", "Auditoria de reserves i cancel·lacions per usuari", "Auditoria de reserves i cancel·lacions per usuari",
       "Erabiltzaile bakoitzeko erreserben eta ezeztapenen auditoretza", "سجل تدقيق كامل للحجوزات والإلغاءات لكل مستخدم",
       "Auditoria de reservas e cancelamentos por utilizador", "Historique et audit des réservations et annulations par joueur",
       "Revisionssicheres Buchungs- und Stornoprotokoll pro Nutzer", "Audit completo di prenotazioni e cancellazioni per utente")

# Module 5: Facturación
add_fp("features.module.5.badge",
       "Administración", "Financial Admin", "Administración", "Administració", "Administració",
       "Administrazioa", "الإدارة المالية", "Administração", "Comptabilité & Facturation", "Finanzverwaltung", "Amministrazione")

add_fp("features.module.5.title",
       "Facturación, Cuotas Recurrentes & Remesas SEPA", "Invoicing, Recurring Dues & SEPA XML Banking",
       "Facturación, Cotas Recorrentes e Remesas SEPA", "Facturació, Quotes Recurrents i Remeses SEPA", "Facturació, Quotes Recurrents i Remeses SEPA",
       "Fakturazioa, Errepikatzen diren Kuotak eta SEPA Igorpenak", "الفوترة، الاشتراكات الدورية وسداد SEPA البنكي",
       "Faturação, Mensalidades Recorrentes e Débitos SEPA", "Facturation, Cotisations Récurrentes & Prélèvements SEPA",
       "Rechnungsstellung, Monatsbeiträge & SEPA-Lastschriften", "Fatturazione, Quote Ricorrenti e Distinte SEPA")

add_fp("features.module.5.desc",
       "Automatización financiera para clubes: cobro de cuotas mensuales de abonados, emisión de facturas oficiales con IVA desglosado y exportación contable.",
       "Financial automation for clubs: monthly membership dues collection, breakdown tax invoices, and accounting export integration.",
       "Automatización financeira para clubs: cobro de cotas mensuais de abonados, emisión de facturas oficiais con IVE desglosado e exportación contable.",
       "Automatització financera per a clubs: cobrament de quotes mensuals d'abonats, emissió de factures oficials amb IVA desglossat i exportació comptable.",
       "Automatització financera per a clubs: cobrament de quotes mensuals d'abonats, emissió de factures oficials amb IVA desglossat i exportació comptable.",
       "Klubentzako finantza-automatizazioa: abonatuen hileko kuoten kobrantza, BEZa banakatuta duten faktura ofizialen jaulkipena eta kontabilitate-esportazioa.",
       "أتمتة مالية متقدمة للأندية: تحصيل الاشتراكات الشهرية، إصدار الفواتير الرسمية مع تفصيل الضرائب والتصدير المحاسبي.",
       "Automatização financeira para clubes: cobrança de mensalidades, emissão de faturas oficiais com IVA discriminado e exportação contabilística.",
       "Automatisation financière complète : prélèvement des cotisations, factures conformes avec TVA ventilée et exports comptables.",
       "Finanzautomatisierung für Clubs: Einzug von Monatsbeiträgen, rechtssichere Rechnungen mit Steuerausweis und Buchhaltungsexport.",
       "Automazione amministrativa per circoli: incasso quote mensili, emissione fatture elettroniche con IVA ed export contabile.")

add_fp("features.module.5.f.0",
       "Generación de archivos de remesas bancarias SEPA XML (Core / B2B)", "Direct generation of compliant SEPA XML bank batch files (Core / B2B)",
       "Xeración de arquivos de remesas bancarias SEPA XML (Core / B2B)", "Generació d'arxius de remeses bancàries SEPA XML (Core / B2B)", "Generació d'arxius de remeses bancàries SEPA XML (Core / B2B)",
       "SEPA XML banku-igorpen fitxategiak sortzea (Core / B2B)", "إنشاء ملفات السداد البنكي الأوروبي الموحد SEPA XML (Core / B2B)",
       "Geração de ficheiros de débitos diretos SEPA XML (Core / B2B)", "Génération des fichiers de prélèvement bancaire SEPA XML (Core / B2B)",
       "Erstellung standardisierter SEPA-XML-Lastschriftdateien (Core / B2B)", "Generazione file per distinte bancarie SEPA XML (Core / B2B)")

add_fp("features.module.5.f.1",
       "Emisión y descarga de facturas en PDF para clientes de empresa", "Instant PDF corporate tax invoice generation and member download",
       "Emisión e descarga de facturas en PDF para clientes de empresa", "Emissió i descàrrega de factures en PDF per a clients d'empresa", "Emissió i descàrrega de factures en PDF per a clients d'empresa",
       "Enpresa-bezeroentzako fakturak PDFn jaulki eta deskargatzea", "إصدار وتحميل فواتير PDF ضريبية للشركات والعملاء",
       "Emissão e descarregamento de faturas em PDF para clientes empresariais", "Émission et téléchargement instantané de factures PDF pour entreprises",
       "Erstellung und Download revisionssicherer PDF-Rechnungen für Firmen", "Emissione e download fatture in formato PDF per aziende e soci")

add_fp("features.module.5.f.2",
       "Control estricto de morosidad y cobro automático de recibos devueltos", "Automated re-billing for rejected direct debits and debtor tracking",
       "Control estrito de morosidade e cobro automático de recibos devoltos", "Control estricte de morositat i cobrament automàtic de rebuts retornats", "Control estricte de morositat i cobrament automàtic de rebuts retornats",
       "Zorren kontrol zorrotza eta itzulitako ordainagirien kobrantza automatikoa", "متابعة دقيقة للمتأخرات وإعادة تحصيل الإيصالات المرتجعة آلياً",
       "Controlo rigoroso de incumprimentos e cobrança de recibos devolvidos", "Suivi strict des impayés et recouvrement automatisé des rejets",
       "Zuverlässiges Mahnwesen und automatische Nachbelastung von Rücklastschriften", "Gestione del credito e riaddebito automatico degli insoluti")

add_fp("features.module.5.f.3",
       "Conciliación con pasarelas de pago Stripe, Redsys y TPV físico", "Settlement reconciliation across Stripe, Redsys, and on-site POS terminals",
       "Conciliación con pasarelas de pago Stripe, Redsys e TPV físico", "Conciliació amb passarel·les de pagament Stripe, Redsys i TPV físic", "Conciliació amb passarel·les de pagament Stripe, Redsys i TPV físic",
       "Adiskidetzea Stripe, Redsys eta TPV fisikoarekin ordainketa-pasabideetan", "مطابقة مصرفية تلقائية مع بوابات Stripe وRedsys وأجهزة الدفع اليدوية",
       "Reconciliação com gateways de pagamento Stripe, Redsys e POS físico", "Rapprochement avec Stripe, passerelles bancaires et TPE physiques",
       "Automatischer Zahlungsabgleich mit Stripe, Bank-Gateways und Vor-Ort-Terminals", "Riconciliazione bancaria con Stripe, Redsys e POS fisico")

# Module 6: IA
add_fp("features.module.6.title",
       "Copiloto de IA Multicanal (BYOK)", "Multichannel AI Copilot (BYOK)",
       "Copiloto de IA Multicanle (BYOK)", "Copilot d'IA Multicanal (BYOK)", "Copilot d'IA Multicanal (BYOK)",
       "Kanal anitzeko IA Laguntzailea (BYOK)", "المساعد الذكي متعدد القنوات (BYOK)",
       "Copiloto de IA Multicanal (BYOK)", "Copilote IA Multicanal (BYOK)",
       "Multikanal-KI-Copilot (BYOK)", "Assistente IA Multicanale (BYOK)")

add_fp("features.module.6.desc",
       "Asistente conversacional inteligente que atiende consultas de clientes en tu web y WhatsApp oficial. Informa de disponibilidad de pistas y tarifas automáticamente.",
       "Smart conversational assistant answering member inquiries across your web and official WhatsApp. Automatically informs on availability and rates.",
       "Asistente conversacional intelixente que atende consultas de clientes na túa web e WhatsApp oficial. Informa de dispoñibilidade de pistas e tarifas automaticamente.",
       "Assistent conversacional intel·ligent que atén consultes de clients al teu web i WhatsApp oficial. Informa de disponibilitat de pistes i tarifes automàticament.",
       "Assistent conversacional intel·ligent que atén consultes de clients al teu web i WhatsApp oficial. Informa de disponibilitat de pistes i tarifes automàticament.",
       "Elkarrizketa-laguntzaile adimenduna, zure webgunean eta WhatsApp ofizialean bezeroen kontsultak erantzuten dituena. Kantxen erabilgarritasunari eta tarifei buruzko informazioa automatikoki ematen du.",
       "مساعد محادثة ذكي يجيب على استفسارات اللاعبين عبر موقع النادي وواتساب الرسمي، ويقدم معلومات الملاعب والأسعار المتاحة لحظياً.",
       "Assistente conversacional inteligente que responde a clientes no seu site e WhatsApp oficial. Informa sobre disponibilidade de campos e preços.",
       "Assistant conversationnel intelligent pour votre site et WhatsApp officiel. Renseigne automatiquement sur la disponibilité des pistes et tarifs.",
       "Intelligenter KI-Chat-Assistent für Website und offizielles WhatsApp. Gibt rund um die Uhr Auskunft über freie Plätze und Tarife.",
       "Assistente conversazionale che risponde alle richieste dei soci su web e WhatsApp ufficiale, informando su disponibilità e tariffe.")

add_fp("features.module.6.f.0",
       "Soporte Bring Your Own Key (BYOK) para claves API propias", "Bring Your Own Key (BYOK) support for private generative AI keys",
       "Soporte Bring Your Own Key (BYOK) para chaves API propias", "Suport Bring Your Own Key (BYOK) per a claus API pròpies", "Suport Bring Your Own Key (BYOK) per a claus API pròpies",
       "Bring Your Own Key (BYOK) euskarria API gako propioentzat", "دعم استخدام مفاتيح API الخاصة بالعميل (BYOK)",
       "Suporte Bring Your Own Key (BYOK) para chaves de API próprias", "Prise en charge Bring Your Own Key (BYOK) pour vos clés API privées",
       "Bring Your Own Key (BYOK) Unterstützung für eigene API-Keys", "Supporto Bring Your Own Key (BYOK) per chiavi API proprietarie")

add_fp("features.module.6.f.1",
       "Activación por canales: Web oficial, WhatsApp e Instagram", "Integrated omnichannel endpoints: Web, WhatsApp, and Instagram",
       "Activación por canles: Web oficial, WhatsApp e Instagram", "Activació per canals: Web oficial, WhatsApp i Instagram", "Activació per canals: Web oficial, WhatsApp i Instagram",
       "Kanalen bidezko aktibazioa: Web ofiziala, WhatsApp eta Instagram", "تفعيل فوري عبر القنوات: الموقع الرسمي، واتساب وإنستغرام",
       "Ativação por canais: Site oficial, WhatsApp e Instagram", "Activation multicanale : Site officiel, WhatsApp et Instagram",
       "Aktivierung über Website, WhatsApp und Instagram", "Attivazione canali: Sito web ufficiale, WhatsApp e Instagram")

add_fp("features.module.6.f.2",
       "Tono de voz configurable (profesional, cercano, deportivo)", "Configurable tone of voice (formal, friendly, athletic)",
       "Tono de voz configurable (profesional, próximo, deportivo)", "To de veu configurable (professional, proper, esportiu)", "To de veu configurable (professional, proper, esportiu)",
       "Ahots-tonu konfiguragarria (profesionala, hurbila, kirolekoa)", "نبرة صوت وإجابات مخصصة (احترافية، ودودة، رياضية)",
       "Tom de voz configurável (profissional, próximo, desportivo)", "Tonalité éditoriale paramétrable (institutionnelle, chaleureuse, sportive)",
       "Individuelle Tonalität (professionell, nahbar, sportlich)", "Tono di voce personalizzabile (professionale, amichevole, sportivo)")

add_fp("features.module.6.f.3",
       "Soporte multiidioma nativo para atender a turistas y socios internacionales", "Native multilingual intelligence serving expat players and tourists",
       "Soporte multiidioma nativo para atender a turistas e socios internacionais", "Suport multiidioma natiu per atendre turistes i socis internacionals", "Suport multiidioma natiu per atendre turistes i socis internacionals",
       "Hizkuntza anitzeko euskarri natiboa turistak eta nazioarteko bazkideak artatzeko", "دعم أصيل للغات المتعددة لخدمة السياح واللاعبين الدوليين",
       "Suporte multilíngue nativo para atender turistas e sócios internacionais", "Assistance multilingue native pour touristes et membres internationaux",
       "Mehrsprachige Antworten für Touristen und internationale Mitglieder", "Supporto multilingue nativo per turisti e giocatori internazionali")

# Module 7: Marca Blanca
add_fp("features.module.7.badge",
       "Tu Propia Marca", "Your Own Brand", "A Túa Propia Marca", "La Teva Pròpia Marca", "La Teva Pròpia Marca",
       "Zure Marka Propioa", "علامتك التجارية المستقلة", "A Sua Própria Marca", "Votre Propre Marque", "Ihre Eigene Marke", "Il Tuo Marchio")

add_fp("features.module.7.title",
       "Marca Blanca Integral & App Móvil Corporativa", "Full White-Label Identity & Corporate Mobile App",
       "Marca Branca Integral e App Móbil Corporativa", "Marca Blanca Integral i App Mòbil Corporativa", "Marca Blanca Integral i App Mòbil Corporativa",
       "Marka Zuri Osoa eta Mugikorreko Aplikazio Korporatiboa", "علامة بيضاء متكاملة وتطبيق جوال خاص بالنادي",
       "Marca Branca Integral e App Móvel Corporativa", "Marque Blanche Complète & Application Mobile Dédiée",
       "Vollständiges White-Label & Eigene Club-App", "White Label Completa e App Mobile Dedicata")

add_fp("features.module.7.desc",
       "Tu club con su propio dominio web (tuclub.com), colores corporativos, logotipo y app instalable en iPhone y Android sin pagar comisiones a tiendas de apps.",
       "Your facility on its dedicated custom domain (yourclub.com), brand palette, logos, and progressive web app on iOS/Android with zero store tax.",
       "O teu club co seu propio dominio web (oteuclub.com), cores corporativas, logotipo e app instalable en iPhone e Android sen pagar comisións a tendas de apps.",
       "El teu club amb el seu propi domini web (elteuclub.cat), colors corporatius, logotip i app instal·lable a iPhone i Android sense pagar comissions a botigues d'apps.",
       "El teu club amb el seu propi domini web (elteuclub.com), colors corporatius, logotip i app instal·lable a iPhone i Android sense pagar comissions a botigues d'apps.",
       "Zure kluba bere web-domeinu propioarekin (zurekluba.eus), kolore korporatiboekin, logotipoarekin eta iPhone eta Android-en instalagarri den aplikazioarekin.",
       "ناديك بهويته المستقلة ونطاقه الخاص (yourclub.com)، ألوانه وشعاره وتطبيق قابل للتثبيت على هواتف آيفون وأندرويد بدون عمولات متاجر.",
       "O seu clube com domínio próprio (oseuclube.pt), cores corporativas, logótipo e app instalável em iOS e Android sem comissões de lojas de apps.",
       "Votre club sous son propre nom de domaine, vos couleurs, logo et application installable sur iPhone et Android sans commissions d'app stores.",
       "Ihr Club unter eigener Domain (ihrclub.de), mit Vereinsfarben, Logo und installierbarer iOS/Android-App ohne Store-Gebühren.",
       "Il tuo circolo con dominio proprietario (tuocircolo.it), colori sociali, logo e app installabile su iPhone e Android senza commissioni store.")

add_fp("features.module.7.f.0",
       "Conexión de dominio propio con certificado SSL gratuito", "Custom domain binding with automated free SSL certificate",
       "Conexión de dominio propio con certificado SSL gratuíto", "Connexió de domini propi amb certificat SSL gratuït", "Connexió de domini propi amb certificat SSL gratuït",
       "Domeinu propioaren konexioa doako SSL ziurtagiriarekin", "ربط النطاق الخاص مع شهادة أمان SSL مشفرة مجاناً",
       "Ligação de domínio próprio com certificado SSL gratuito", "Connexion de nom de domaine personnalisé avec SSL gratuit inclus",
       "Eigene Domain-Aufschaltung mit kostenlosem SSL-Zertifikat", "Collegamento dominio personalizzato con certificato SSL gratuito")

add_fp("features.module.7.f.1",
       "App web de alta velocidad instalable en 1 toque en la pantalla de inicio", "Ultra-fast installable web app added to home screen in 1 tap",
       "App web de alta velocidade instalable en 1 toque na pantalla de inicio", "App web d'alta velocitat instal·lable en 1 toc a la pantalla d'inici", "App web d'alta velocitat instal·lable en 1 toc a la pantalla d'inici",
       "Abiadura handiko web aplikazioa hasierako pantailan ukitu bakarrean instalagarria", "تطبيق ويب فائق السرعة يثبت بلمسة واحدة على الشاشة الرئيسية",
       "App web de alta velocidade instalável com 1 toque no ecrã inicial", "Application web ultra-rapide installable en 1 clic sur l'écran d'accueil",
       "Installierbare PWA-App mit 1 Klick auf dem Home-Bildschirm", "Web app ultra-veloce installabile con 1 tocco sulla schermata home")

add_fp("features.module.7.f.2",
       "Sin menciones técnicas a plataformas intermediarias", "Zero third-party provider watermarks or branding",
       "Sen mencións técnicas a plataformas intermediarias", "Sense mencions tècniques a plataformes intermediàries", "Sense mencions tècniques a plataformes intermediàries",
       "Bitarteko plataformen aipamen teknikorik gabe", "بدون أي إشارة إلى منصات أو وسطاء تقنيين خارجيين",
       "Sem menções a plataformas intermediárias", "Aucune mention visible de plateforme tierce",
       "Keine störenden Hinweise auf zwischengeschaltete Plattformen", "Nessun riferimento a piattaforme terze")

add_fp("features.module.7.f.3",
       "Diseño responsive adaptado a cualquier dispositivo y pantalla", "Fully responsive UI tailored for any screen size or form factor",
       "Deseño responsive adaptado a calquera dispositivo e pantalla", "Disseny adaptable adaptat a qualsevol dispositiu i pantalla", "Disseny adaptable adaptat a qualsevol dispositiu i pantalla",
       "Gailu eta pantaila guztietara egokitutako diseinu sentikorra", "تصميم متجاوب ومتوافق مع جميع الهواتف والحواسب اللوحية",
       "Design responsivo adaptado a qualquer dispositivo e ecrã", "Design responsive optimisé pour smartphones, tablettes et ordinateurs",
       "Responsive Benutzeroberfläche für alle Bildschirme und Geräte", "Design responsive ottimizzato per qualsiasi dispositivo e schermo")

add_fp("features.register",
       "Activar Mi Club", "Activate My Club", "Activar o Meu Club", "Activar el Meu Club", "Activar el Meu Club",
       "Aktibatu Nire Kluba", "تفعيل ناديي الآن", "Ativar o Meu Clube", "Activer Mon Club", "Meinen Club aktivieren", "Attiva il Mio Circolo")

# --- PLAYER PAGE ---
add_fp("playerPage.title",
       "Juega más al pádel.", "Play more padel.", "Xoga máis ao pádel.", "Juga més al pàdel.", "Juga més al pàdel.",
       "Jokatu padel gehiago.", "العب المزيد من البادل.", "Jogue mais padel.", "Jouez plus au padel.", "Mehr Padel spielen.", "Gioca di più a padel.")

add_fp("playerPage.titleHighlight",
       "Sin esperas, llamadas ni deudas.", "Zero waiting, calls, or debts.", "Sen esperas, chamadas nin débedas.", "Sense esperes, trucades ni deutes.", "Sense esperes, trucades ni deutes.",
       "Itxaronaldirik, deirik eta zorrik gabe.", "بدون انتظار، اتصالات أو ديون بين الأصدقاء.", "Sem esperas, chamadas nem dívidas.", "Sans attente, appels ni dettes.", "Ohne Wartezeiten, Anrufe oder Schulden.", "Senza attese, chiamate né debiti.")

add_fp("playerPage.subtitle",
       "El portal móvil definitivo para los apasionados del pádel. Encuentra pista en tus clubes favoritos, completa partidos con compañeros de tu mismo nivel, divide el pago y abre la pista con tu móvil.",
       "The premier mobile app for padel players. Find courts at your favorite clubs, join open matches matched to your skill level, split payments, and open court doors from your phone.",
       "O portal móbil definitivo para os apaixonados do pádel. Atopa pista nos teus clubs favoritos, completa partidos con compañeiros do teu mesmo nivel, divide o pago e abre a pista co teu móbil.",
       "El portal mòbil definitiu per als apassionats del pàdel. Troba pista als teus clubs preferits, completa partits amb companys del teu mateix nivell, divideix el pagament i obre la pista amb el teu mòbil.",
       "El portal mòbil definitiu per als apassionats del pàdel. Troba pista als teus clubs preferits, completa partits amb companys del teu mateix nivell, divideix el pagament i obre la pista amb el teu mòbil.",
       "Padelzaleentzako mugikorreko atari bikaina. Aurkitu kantxa zure klub gogokoenetan, osatu partidak zure maila bereko kideekin, zatitu ordainketa eta ireki kantxa zure mugikorrarekin.",
       "التطبيق المثالي لعشاق رياضة البادل. احجز ملاعبك المفضلة، انضم لمباريات تناسب مستواك، قسم الدفع وافتح أبواب الملعب بهاتفك.",
       "O portal móvel definitivo para os apaixonados por padel. Encontre campos nos seus clubes favoritos, complete partidas ao seu nível, divida pagamentos e abra o campo com o smartphone.",
       "Le portail mobile de référence pour les joueurs de padel. Réservez vos terrains favoris, rejoignez des parties équilibrées, partagez l'addition et déverrouillez les pistes depuis votre smartphone.",
       "Das ultimative Padel-Portal. Plätze buchen, Gleichgesinnte auf passendem Niveau finden, Gebühren teilen und Plätze direkt mit dem Smartphone öffnen.",
       "Il portale mobile definitivo per gli appassionati di padel. Trova campo nei tuoi circoli preferiti, gioca con compagni del tuo livello, dividi il costo e apri il campo con lo smartphone.")

add_fp("playerPage.ctaDemo",
       "Ver Demo Guiada", "Watch Guided Demo", "Ver Demo Guiada", "Veure Demo Guiada", "Veure Demo Guiada",
       "Ikusi Gidatutako Demoa", "مشاهدة العرض التجريبي", "Ver Demo Guiada", "Voir la Démo Guidée", "Geführte Demo ansehen", "Guarda la Demo Guidata")

add_fp("playerPage.stat1",
       "Reserva en 15 segundos", "Book in 15 seconds", "Reserva en 15 segundos", "Reserva en 15 segons", "Reserva en 15 segons",
       "Erreserbatu 15 segundotan", "حجز في 15 ثانية فقط", "Reserve em 15 segundos", "Réservation en 15 secondes", "Buchung in 15 Sekunden", "Prenota in 15 secondi")

add_fp("playerPage.stat2",
       "Nivel Decimal 1.0 - 7.0", "Decimal Rating 1.0 - 7.0", "Nivel Decimal 1.0 - 7.0", "Nivell Decimal 1.0 - 7.0", "Nivell Decimal 1.0 - 7.0",
       "Maila Hamartarra 1.0 - 7.0", "مستوى رقمي دقيق 1.0 - 7.0", "Nível Decimal 1.0 - 7.0", "Niveau Décimal 1.0 - 7.0", "Präzises Ranking 1.0 - 7.0", "Livello Decimale 1.0 - 7.0")

add_fp("playerPage.stat3",
       "Split Payment con Bizum", "Instant Split Payments", "Split Payment con Bizum", "Split Payment amb Bizum", "Split Payment amb Bizum",
       "Ordainketa zatitua Bizumekin", "دفع فوري مقسم", "Split Payment imediato", "Paiement partagé instantané", "Gebührenteilung per App", "Split payment istantaneo")

# Player features 1..6
add_fp("playerPage.f1.badge",
       "Reservas 24/7", "24/7 Bookings", "Reservas 24/7", "Reserves 24/7", "Reserves 24/7",
       "24/7 Erreserbak", "حجوزات على مدار الساعة", "Reservas 24/7", "Réservations 24h/24", "24/7-Buchungen", "Prenotazioni 24/7")

add_fp("playerPage.f1.title",
       "Reserva Rápida en Menos de 15 Segundos", "Rapid Court Booking in Under 15 Seconds",
       "Reserva Rápida en Menos de 15 Segundos", "Reserva Ràpida en Menys de 15 Segons", "Reserva Ràpida en Menys de 15 Segons",
       "Erreserba Azkarra 15 Segundo Baino Gutxiagoan", "حجز سريع في أقل من 15 ثانية",
       "Reserva Rápida em Menos de 15 Segundos", "Réservation Express en Moins de 15 Secondes",
       "Blitzschnelle Platzbuchung in unter 15 Sekunden", "Prenotazione Rapida in Meno di 15 Secondi")

add_fp("playerPage.f1.desc",
       "Consulta disponibilidad de pistas cubiertas, panorámicas o exteriores en tiempo real. Selecciona turno, divide el pago y recibe tu confirmación instantánea sin intermediarios ni llamadas.",
       "Check real-time availability of indoor, panoramic, or outdoor courts. Choose your slot, split the fee, and receive instant confirmation without phone calls.",
       "Consulta dispoñibilidade de pistas cubertas, panorámicas ou exteriores en tempo real. Selecciona turno, divide o pago e recibe a túa confirmación instantánea sen intermediarios nin chamadas.",
       "Consulta disponibilitat de pistes cobertes, panoràmiques o exteriors en temps real. Selecciona torn, divideix el pagament i rep la teva confirmació instantània sense intermediaris ni trucades.",
       "Consulta disponibilitat de pistes cobertes, panoràmiques o exteriors en temps real. Selecciona torn, divideix el pagament i rep la teva confirmació instantània sense intermediaris ni trucades.",
       "Kontsultatu estalitako, panoramiko edo kanpoko kantxen erabilgarritasuna denbora errealean. Hautatu txanda, zatitu ordainketa eta jaso berehalako berrespena.",
       "اطلع على توافر الملاعب المغطاة والبانورامية لحظياً. اختر موعدك وقسم الدفع واستلم تأكيد الحجز فوراً بدون اتصالات.",
       "Consulte a disponibilidade de campos cobertos, panorâmicos ou exteriores em tempo real. Escolha o horário, divida o pagamento e receba confirmação instantânea.",
       "Consultez la disponibilité des courts en temps réel. Choisissez votre créneau, partagez le paiement et recevez une confirmation immédiate sans appel téléphonique.",
       "Echtzeit-Verfügbarkeit für Hallen-, Panorama- und Freiplätze. Zeitfenster wählen, Gebühr teilen und Sofortbestätigung erhalten.",
       "Verifica la disponibilità di campi indoor, panoramici o all'aperto in tempo reale. Scegli l'orario, dividi il costo e ricevi conferma immediata.")

add_fp("playerPage.f1.highlight",
       "Cuadrante en Tiempo Real", "Real-Time Schedule", "Cuadrante en Tempo Real", "Quadrant en Temps Real", "Quadrant en Temps Real",
       "Denbora Errealeko Koadrantea", "جدول مواعيد فوري ومباشر", "Grelha em Tempo Real", "Planning en Temps Réel", "Echtzeit-Belegungsplan", "Tabellone in Tempo Reale")

add_fp("playerPage.f1.tech",
       "Prevención de colisiones de reserva por microsegundo y confirmación inmediata.",
       "Sub-millisecond collision prevention and instant confirmation.",
       "Prevención de colisións de reserva por microsegundo e confirmación inmediata.",
       "Prevenció de col·lisions de reserva per microsegon i confirmació immediata.",
       "Prevenció de col·lisions de reserva per microsegon i confirmació immediata.",
       "Erreserba-talkak mikrosekundotan ekiditea eta berehalako berrespena.",
       "منع تضارب الحجوزات بدقة أجزاء الثانية وتأكيد فوري.",
       "Prevenção de colisões de reserva ao microssegundo e confirmação imediata.",
       "Prévention des conflits de réservation à la microseconde et validation immédiate.",
       "Kollisionsfreie Buchungen im Mikrosekundenbereich mit Sofortbestätigung.",
       "Prevenzione delle sovrapposizioni al microsecondo e conferma immediata.")

add_fp("playerPage.f2.badge",
       "Partidos Nivelados", "Balanced Matches", "Partidos Nivelados", "Partits Anivellats", "Partits Anivellats",
       "Partida Parekatuak", "مباريات متكافئة المستوى", "Partidas Niveladas", "Matchs Équilibrés", "Ausgeglichene Matches", "Partite Livellate")

add_fp("playerPage.f2.title",
       "Partidos Abiertos con Nivel Dinámico (Play!)", "Open Matches with Dynamic Rating (Play!)",
       "Partidos Abertos con Nivel Dinámico (Play!)", "Partits Oberts amb Nivell Dinàmic (Play!)", "Partits Oberts amb Nivell Dinàmic (Play!)",
       "Partida Irekiak Maila Dinamikoarekin (Play!)", "مباريات مفتوحة بمستوى ديناميكي متكافئ (Play!)",
       "Partidas Abertas com Nível Dinâmico (Play!)", "Parties Ouvertes avec Niveau Dynamique (Play!)",
       "Offene Matches mit dynamischer Spielstärke (Play!)", "Partite Aperte con Livello Dinamico (Play!)")

add_fp("playerPage.f2.desc",
       "¿Te falta un cuarto jugador para tu partida? Crea o únete a partidos abiertos filtrados por tu nivel decimal exacto (ej. 3.75) y tu posición preferida en pista (drive, revés o indistinto).",
       "Missing a fourth player? Create or join open matches filtered by exact decimal skill rating (e.g. 3.75) and preferred side (forehand or backhand).",
       "Fáltache un cuarto xogador para a túa partida? Crea ou únete a partidos abertos filtrados polo teu nivel decimal exacto (ex. 3.75) e a túa posición preferida en pista.",
       "Et falta un quart jugador per al teu partit? Crea o uneix-te a partits oberts filtrats pel teu nivell decimal exacte (ex. 3.75) i la teva posició preferida a pista.",
       "Et falta un quart jugador per al teu partit? Crea o uneix-te a partits oberts filtrats pel teu nivell decimal exacte (ex. 3.75) i la teva posició preferida a pista.",
       "Laugarren jokalari bat falta zaizu? Sortu edo sartu partida irekietan zure maila hamartar zehatzaren (adib. 3.75) eta kantxako posizio gogokoenaren arabera iragazita.",
       "هل ينقصك لاعب رابع لإكمال مباراتك؟ أنشئ أو انضم إلى مباريات مفتوحة مفلترة حسب مستواك الرقمي الدقيق وجهتك المفضلة في الملعب.",
       "Falta o quarto jogador? Crie ou adira a partidas abertas filtradas pelo seu nível decimal exato (ex. 3.75) e posição preferida no campo.",
       "Il vous manque un quatrième joueur ? Rejoignez des parties ouvertes filtrées selon votre niveau décimal précis (ex. 3,75) et votre côté de jeu.",
       "Fehlt der vierte Mann? Erstellen Sie offene Matches gefiltert nach exakter Dezimal-Spielstärke (z.B. 3.75) und bevorzugter Position.",
       "Ti manca il quarto giocatore? Crea o unisciti a partite aperte filtrate per il tuo livello decimale esatto (es. 3.75) e posizione in campo.")

add_fp("playerPage.f2.highlight",
       "Algoritmo Matchmaking", "Matchmaking Algorithm", "Algoritmo Matchmaking", "Algorisme Matchmaking", "Algorisme Matchmaking",
       "Matchmaking Algoritmoa", "خوارزمية التوفيق الذكي", "Algoritmo Matchmaking", "Algorithme de Matchmaking", "Matchmaking-Algorithmus", "Algoritmo di Matchmaking")

add_fp("playerPage.f2.tech",
       "Algoritmo ELO adaptado a pádel por parejas que recalcula el rating tras cada partido.",
       "Padel-adapted pair ELO algorithm recalculating ratings after each verified match.",
       "Algoritmo ELO adaptado a pádel por parellas que recalcula o rating tras cada partido.",
       "Algorisme ELO adaptat a pàdel per parelles que recalcula el rating després de cada partit.",
       "Algorisme ELO adaptat a pàdel per parelles que recalcula el rating després de cada partit.",
       "Bikotekako padelera egokitutako ELO algoritmoa, partida bakoitzaren ondoren balorazioa birkalkulatzen duena.",
       "خوارزمية تصنيف ELO مخصصة للبادل بالثنائيات تعيد احتساب النقاط بعد كل مباراة.",
       "Algoritmo ELO adaptado a duplas de padel que recalcula a pontuação após cada jogo.",
       "Algorithme ELO adapté au padel en double recalculant le classement après chaque match.",
       "Padel-spezifischer Doppel-ELO-Algorithmus zur Neuberechnung der Spielstärke nach jedem Match.",
       "Algoritmo ELO per coppie che ricalcola il rating al termine di ogni incontro.")

add_fp("playerPage.f3.badge",
       "1/4 por Jugador", "1/4 Per Player", "1/4 por Xogador", "1/4 per Jugador", "1/4 per Jugador",
       "1/4 Jokalari Bakoitzeko", "الربع لكل لاعب", "1/4 por Jogador", "1/4 par Joueur", "1/4 pro Spieler", "1/4 a Giocatore")

add_fp("playerPage.f3.title",
       "Pago Dividido Automático (Split Payments)", "Automated Split Payments (1/4 per player)",
       "Pago Dividido Automático (Split Payments)", "Pagament Dividit Automàtic (Split Payments)", "Pagament Dividit Automàtic (Split Payments)",
       "Ordainketa Zatiketa Automatikoa (Split Payments)", "تقسيم الحساب تلقائياً بين اللاعبين",
       "Pagamento Dividido Automático (Split Payments)", "Partage Automatique des Frais (Split Payments)",
       "Automatische Gebührenteilung (Split Payments)", "Pagamento Frazionato Automatico (Split Payments)")

add_fp("playerPage.f3.desc",
       "Cada jugador paga su 25% de la pista directamente desde su propio móvil por Bizum, tarjeta o monedero virtual. Olvídate para siempre de perseguir a tus amigos para que te paguen.",
       "Each player pays their 25% court share directly from their smartphone via card, mobile transfer, or digital balance. No more chasing friends for money.",
       "Cada xogador paga o seu 25% da pista directamente desde o seu propio móbil por Bizum, tarxeta ou moedeiro virtual. Esquece para sempre de perseguir os teus amigos para que che paguen.",
       "Cada jugador paga el seu 25% de la pista directament des del seu propi mòbil per Bizum, targeta o moneder virtual. Oblida't per sempre de perseguir els teus amics perquè et paguin.",
       "Cada jugador paga el seu 25% de la pista directament des del seu propi mòbil per Bizum, targeta o moneder virtual. Oblida't per sempre de perseguir els teus amics perquè et paguin.",
       "Jokalari bakoitzak kantxaren %25 ordaintzen du bere mugikorretik txartel, Bizum edo diru-zorro birtual bidez. Ahaztu lagunen atzetik ibiltzea kobratzeko.",
       "يدفع كل لاعب حصته البالغة 25% مباشرة من هاتفه بالبطاقة أو المحفظة الإلكترونية. وداعاً لملاحقة الأصدقاء لجمع تكلفة الحجز.",
       "Cada jogador paga os seus 25% do campo diretamente pelo telemóvel por cartão ou carteira digital. Deixe de ter de cobrar aos amigos.",
       "Chaque joueur règle sa part de 25% depuis son mobile par carte ou solde prépayé. Fini de courir après les remboursements de vos partenaires.",
       "Jeder Spieler zahlt seinen 25%-Anteil direkt per Smartphone via Karte oder Guthaben. Nie wieder Freunden wegen Platzgeld hinterherlaufen.",
       "Ogni giocatore paga il suo 25% direttamente dal proprio smartphone con carta o borsellino digitale. Dimentica di dover rincorrere gli amici.")

add_fp("playerPage.f3.highlight",
       "Cero Deudas", "Zero Debts", "Cero Débedas", "Zero Deutes", "Zero Deutes",
       "Zorrik Gabe", "بدون ديون أو مستحقات معلقة", "Zero Dívidas", "Zéro Dettes", "Keine Schulden", "Zero Debiti")

add_fp("playerPage.f3.tech",
       "Liquidación directa al banco del club sin retención de fondos ni comisiones a jugadores.",
       "Direct bank settlement with zero escrow delays or player fees.",
       "Liquidación directa ao banco do club sen retención de fondos nin comisións a xogadores.",
       "Liquidació directa al banc del club sense retenció de fons ni comissions a jugadors.",
       "Liquidació directa al banc del club sense retenció de fons ni comissions a jugadors.",
       "Likidazio zuzena klubaren bankura funtsak atxiki gabe eta jokalariei komisiorik kobratu gabe.",
       "تحويل مباشر وفوري لحساب النادي البنكي دون احتجاز للأموال أو عمولات على اللاعبين.",
       "Liquidação direta na conta do clube sem retenção de fundos nem comissões.",
       "Virement direct vers le compte bancaire du club sans frais pour les joueurs.",
       "Direkte Auszahlung auf das Clubkonto ohne Einbehalt oder Spielergebühren.",
       "Liquidazione diretta sul conto bancario del circolo senza trattenute né commissioni ai giocatori.")

add_fp("playerPage.f4.badge",
       "Acceso Inteligente", "Smart Access", "Acceso Intelixente", "Accés Intel·ligent", "Accés Intel·ligent",
       "Sarbide Adimenduna", "دخول ذكي بدون تلامس", "Acesso Inteligente", "Accès Connecté", "Smarter Zutritt", "Accesso Intelligente")

add_fp("playerPage.f4.title",
       "Tu Teléfono es la Llave del Club (Domótica IoT)", "Your Phone Unlocks the Club (IoT Court Automation)",
       "O teu Teléfono é a Chave do Club (Domótica IoT)", "El teu Telèfon és la Clau del Club (Domòtica IoT)", "El teu Telèfon és la Clau del Club (Domòtica IoT)",
       "Zure Telefonoa da Klubeko Giltza (IoT Domotika)", "هاتفك هو مفتاح الدخول للملعب (أتمتة إنترنت الأشياء)",
       "O seu Telemóvel é a Chave do Clube (Domótica IoT)", "Votre Smartphone Ouvre le Court (Domotique IoT)",
       "Ihr Smartphone ist der Clubschlüssel (IoT-Automation)", "Il tuo Smartphone è la Chiave del Circolo (Domotica IoT)")

add_fp("playerPage.f4.desc",
       "Al confirmar tu reserva, tu aplicación genera automáticamente el código PIN y código QR para abrir tornos, cancelas de pista y encender los focos LED en el horario exacto del partido.",
       "Upon booking, your app automatically produces a time-boxed PIN and QR code to unlock gates, access courts, and activate LED floodlights during match time.",
       "Ao confirmar a túa reserva, a túa aplicación xera automaticamente o código PIN e código QR para abrir tornos, cancelas de pista e acender os focos LED no horario exacto do partido.",
       "En confirmar la teva reserva, la teva aplicació genera automàticament el codi PIN i codi QR per obrir torns, cancel·les de pista i encendre els focs LED a l'horari exacte del partit.",
       "En confirmar la teva reserva, la teva aplicació genera automàticament el codi PIN i codi QR per obrir torns, cancel·les de pista i encendre els focs LED a l'horari exacte del partit.",
       "Erreserba berrestean, zure aplikazioak PIN eta QR kodeak sortzen ditu tornuak, kantxako ateak irekitzeko eta partidarako ordu zehatzean LED fokoak pizteko.",
       "بمجرد تأكيد الحجز، ينشئ تطبيقك تلقائياً رمز PIN ورمز QR لفتح البوابات وتشغيل أضواء LED في التوقيت الدقيق لمباراتك.",
       "Ao confirmar a reserva, a sua app gera automaticamente o PIN e QR code para abrir torniquetes, portões e acender a iluminação LED no horário exato.",
       "Dès confirmation, l'application génère un code PIN et QR code temporaires pour ouvrir les accès et allumer les projecteurs LED à l'heure précise.",
       "Nach Bestätigung generiert Ihre App einen PIN und QR-Code zum Öffnen von Drehkreuzen, Platztüren und Aktivieren des Flutlichts zum Spielbeginn.",
       "Alla conferma, l'app genera automaticamente PIN e QR code temporanei per aprire tornelli, cancelli del campo e accendere i fari LED all'orario esatto.")

add_fp("playerPage.f4.highlight",
       "Pistas Autónomas", "Autonomous Courts", "Pistas Autónomas", "Pistes Autònomes", "Pistes Autònomes",
       "Kantxa Autonomoak", "ملاعب ذكية تعمل ذاتياً", "Campos Autónomos", "Courts Autonomes", "Autonome Plätze", "Campi Autonomi")

add_fp("playerPage.f4.tech",
       "Integración nativa con relés industriales y cerraduras electrónicas IP con tolerancia offline.",
       "Industrial relay control and IP smart locks with offline fault tolerance.",
       "Integración nativa con relés industriais e pechaduras electrónicas IP con tolerancia offline.",
       "Integració nativa amb relés industrials i panys electrònics IP amb tolerància offline.",
       "Integració nativa amb relés industrials i panys electrònics IP amb tolerància offline.",
       "Integrazio natiboa errele industrialekin eta IP sarraila elektronikoekin lineaz kanpoko tolerantziarekin.",
       "تكامل صناعي مع مرحلات التحكم والأقفال الإلكترونية المتصلة مع قدرة العمل دون اتصال بالإنترنت.",
       "Integração nativa com relés industriais e fechaduras eletrónicas com tolerância offline.",
       "Intégration native aux relais industriels et serrures IP avec tolérance hors-ligne.",
       "Industrie-Relaissteuerung und smarte IP-Schlösser mit Offline-Pufferung.",
       "Integrazione nativa con relè industriali e serrature IP con tolleranza offline.")

add_fp("playerPage.f5.badge",
       "Competición & Ranking", "Competition & Rankings", "Competición e Ranking", "Competició i Rànquing", "Competició i Rànquing",
       "Lehia eta Sailkapena", "المنافسات والتصنيف الرياضي", "Competição e Ranking", "Compétition & Classement", "Wettkampf & Ranking", "Competizione e Classifiche")

add_fp("playerPage.f5.title",
       "Ficha Deportiva, Nivel y Estadísticas Pro", "Athletic Record, Level & Performance Metrics",
       "Ficha Deportiva, Nivel e Estatísticas Pro", "Fitxa Esportiva, Nivell i Estadístiques Pro", "Fitxa Esportiva, Nivell i Estadístiques Pro",
       "Kirol Fitxa, Maila eta Estatistika Profesionalak", "السجل الرياضي، المستوى والإحصائيات المتقدمة",
       "Ficha Desportiva, Nível e Estatísticas Pro", "Fiche Sportive, Niveau & Statistiques Pro",
       "Spielerpass, Spielstärke & Profi-Statistiken", "Scheda Sportiva, Livello e Statistiche Pro")

add_fp("playerPage.f5.desc",
       "Accede a tu historial deportivo completo: porcentaje de victorias, evolución de nivel decimal, compañero más frecuente, rival habitual y posición en el ranking oficial del club.",
       "View complete career stats: win percentage, decimal skill curve, most frequent teammate, recurring rivals, and position on the club official ranking ladder.",
       "Accede ao teu historial deportivo completo: porcentaxe de vitorias, evolución de nivel decimal, compañeiro máis frecuente, rival habitual e posición no ranking oficial do club.",
       "Accedeix al teu historial esportiu complet: percentatge de victòries, evolució de nivell decimal, company més freqüent, rival habitual i posició al rànquing oficial del club.",
       "Accedeix al teu historial esportiu complet: percentatge de victòries, evolució de nivell decimal, company més freqüent, rival habitual i posició al rànquing oficial del club.",
       "Sar zaitez zure kirol-historia osoan: garaipenen ehunekoa, maila hamartarraren eboluzioa, ohiko kidea, ohiko arerioa eta klubeko sailkapen ofizialeko postua.",
       "اطلع على سجلك الرياضي الكامل: نسبة الانتصارات، منحنى تطور المستوى الرقمي، الشريك المفضل والمنافس المعتاد وترتيبك في النادي.",
       "Aceda ao seu histórico desportivo completo: percentagem de vitórias, evolução do nível decimal, parceiro mais frequente e posição no ranking do clube.",
       "Accédez à vos statistiques complètes : pourcentage de victoires, courbe de progression décimale, partenaires favoris et position au classement du club.",
       "Voller Einblick in Ihre sportliche Bilanz: Siegquote, Spielstärken-Verlauf, häufigste Partner und Position im offiziellen Club-Ranking.",
       "Accedi al tuo storico sportivo completo: percentuale di vittorie, evoluzione del livello decimale, compagno più frequente e posizione in classifica.")

add_fp("playerPage.f5.highlight",
       "Rating Decimal", "Decimal Rating", "Rating Decimal", "Rànquing Decimal", "Rànquing Decimal",
       "Balorazio Hamartarra", "تصنيف رقمي دقيق", "Pontuação Decimal", "Classement Décimal", "Dezimal-Rating", "Rating Decimale")

add_fp("playerPage.f5.tech",
       "Registro pormenorizado de enfrentamientos y métricas de rendimiento por temporada.",
       "Detailed head-to-head match records and seasonal performance metrics.",
       "Rexistro polo miúdo de enfrontamentos e métricas de rendemento por tempada.",
       "Registre detallat d'enfrontaments i mètriques de rendiment per temporada.",
       "Registre detallat d'enfrontaments i mètriques de rendiment per temporada.",
       "Aurrez aurreko norgehiagoken eta sasoiko errendimendu-neurketen erregistro zehatza.",
       "سجل تفصيلي للمواجهات المباشرة ومؤشرات الأداء الرياضي عبر المواسم.",
       "Registo minucioso de confrontos diretos e métricas de desempenho por época.",
       "Historique détaillé des confrontations directes et métriques de performance par saison.",
       "Detaillierte Bilanz direkter Duelle und saisonale Leistungskurven.",
       "Registro dettagliato degli scontri diretti e metriche di rendimento per stagione.")

add_fp("playerPage.f6.badge",
       "Torneos Oficiales", "Official Tournaments", "Torneos Oficiais", "Tornejos Oficials", "Tornejos Oficials",
       "Txapelketa Ofizialak", "البطولات الرسمية", "Torneios Oficiais", "Tournois Officiels", "Offizielle Turniere", "Tornei Ufficiali")

add_fp("playerPage.f6.title",
       "Inscripción a Torneos, Pozos y Ligas Sociales", "Tournaments, Americanos & Social League Registration",
       "Inscrición a Torneos, Pozos e Ligas Sociais", "Inscripció a Tornejos, Pous i Lligues Socials", "Inscripció a Tornejos, Pous i Lligues Socials",
       "Izen-ematea Txapelketetan, Txapelketa Amerikarretan eta Liga Sozialetan", "التسجيل في البطولات، المسابقات السريعة والدوريات الاجتماعية",
       "Inscrição em Torneios, Poços e Ligas Sociais", "Inscriptions Tournois, Formats Américains & Ligues",
       "Anmeldung zu Turnieren, Americanos & Clubligen", "Iscrizione a Tornei, All'Americana e Campionati Sociali")

add_fp("playerPage.f6.desc",
       "Inscríbete junto a tu pareja en torneos federados, ligas regulares de fin de semana y pozos americanos. Consulta cuadros de juego en vivo, horarios de partidos y resultados al instante.",
       "Sign up with your partner for weekend tournaments, Americanos, and corporate leagues. Check real-time brackets, court times, and results as matches conclude.",
       "Inscríbete xunto á túa parella en torneos federados, ligas regulares de fin de semana e pozos americanos. Consulta cadros de xogo en vivo, horarios de partidos e resultados ao instante.",
       "Inscriu-te amb la teva parella a tornejos federats, lligues regulars de cap de setmana i pous americans. Consulta quadres de joc en viu, horaris de partits i resultats a l'instant.",
       "Inscriu-te amb la teva parella a tornejos federats, lligues regulars de cap de setmana i pous americans. Consulta quadres de joc en viu, horaris de partits i resultats a l'instant.",
       "Eman izena zure bikotearekin federatutako txapelketetan, asteburuko liga erregularretan eta txapelketa amerikarretan. Kontsultatu joko-koadroak, partiden ordutegiak eta emaitzak berehala.",
       "سجل مع شريكك في البطولات الرسمية، دوريات نهاية الأسبوع والمسابقات المفتوحة. تابع جداول المباريات الحية ومواعيد اللعب والنتائج فوراً.",
       "Inscreva-se com a sua dupla em torneios federados, ligas de fim de semana e poços americanos. Consulte quadros de jogos em direto, horários e resultados ao instante.",
       "Inscrivez-vous en double aux tournois homologués, championnats et tournois amicaux. Consultez les tableaux en direct, programmations et scores en temps réel.",
       "Melden Sie sich mit Ihrem Partner zu Turnieren, Wochenendligen und Americanos an. Verfolgen Sie Live-Tableaus, Spielzeiten und Resultate in Echtzeit.",
       "Iscriviti in coppia a tornei federali, campionati del weekend e formule all'americana. Consulta tabelloni in tempo reale, orari e risultati all'istante.")

add_fp("playerPage.f6.highlight",
       "Cuadros en Directo", "Live Brackets", "Cadros en Directo", "Quadres en Directe", "Quadres en Directe",
       "Zuzeneko Koadroak", "جداول مباريات مباشرة", "Quadros em Direto", "Tableaux en Direct", "Live-Tableaus", "Tabelloni in Diretta")

add_fp("playerPage.f6.tech",
       "Generación automática de cuadros de eliminatorias y publicación de actas en tiempo real.",
       "Automated elimination bracket generation and real-time scoresheet publication.",
       "Xeración automática de cadros de eliminatorias e publicación de actas en tempo real.",
       "Generació automàtica de quadres d'eliminatòries i publicació d'actes en temps real.",
       "Generació automàtica de quadres d'eliminatòries i publicació d'actes en temps real.",
       "Kanporaketa-koadroen sorrera automatikoa eta akten argitaratzea denbora errealean.",
       "إنشاء تلقائي لجداول المباريات الإقصائية ونشر فوري لمحاضر ونتائج المباريات.",
       "Geração automática de quadros de eliminação e publicação de atas em tempo real.",
       "Génération automatique des tableaux éliminatoires et publication instantanée des feuilles de match.",
       "Automatische Generierung von Turnierbäumen und Veröffentlichung offizieller Spielberichte in Echtzeit.",
       "Generazione automatica dei tabelloni a eliminazione diretta e pubblicazione istantanea dei verbali di gara.")

print(f"dict_batch_features_player.py ready with {len(FEATURES_PLAYER_TRANSLATIONS)} keys!")
