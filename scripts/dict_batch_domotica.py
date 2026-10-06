"""Complete translations for all domotica keys across 9 secondary languages:
gl, ca, va, eu, ar, pt, fr, de, it, plus es and en.
Also produces domotica.hardware.item_1 through item_6.
"""

DOMOTICA_TRANSLATIONS = {}

def add_d(key, es, en, gl, ca, va, eu, ar, pt, fr, de, it):
    DOMOTICA_TRANSLATIONS[key] = {
        "es": es, "en": en, "gl": gl, "ca": ca, "va": va, "eu": eu,
        "ar": ar, "pt": pt, "fr": fr, "de": de, "it": it
    }

# General domotica keys
add_d("domotica.auditClub",
      "Auditar mi club", "Audit My Club", "Auditar o meu club", "Auditar el meu club", "Auditar el meu club",
      "Ikuskatu nire kluba", "تدقيق وتأهيل النادي", "Auditar o meu clube", "Auditer mon club", "Meinen Club auditieren", "Audit del mio circolo")

add_d("domotica.bannerCta",
      "Solicitar Estudio de Domótica Gratuito", "Request Free Automation Assessment", "Solicitar Estudo de Domótica Gratuito",
      "Sol·licitar Estudi de Domòtica Gratuït", "Sol·licitar Estudi de Domòtica Gratuït", "Eskatu Doako Domotika Azterketa",
      "طلب دراسة أتمتة مجانية", "Solicitar Estudo de Domótica Gratuito", "Demander une Étude Domotique Gratuite",
      "Kostenlose Automationsanalyse anfordern", "Richiedi Studio Domotico Gratuito")

add_d("domotica.bannerSub",
      "Nuestros ingenieros evalúan la instalación eléctrica de tu club y preparan los cuadros de mando preconfigurados para conectar y funcionar.",
      "Our engineers assess your club's electrical infrastructure and deliver preconfigured control panels ready for plug-and-play operation.",
      "Os nosos enxeñeiros avalían a instalación eléctrica do teu club e preparan os cadros de mando preconfigurados para conectar e funcionar.",
      "Els nostres enginyers avaluen la instal·lació elèctrica del teu club i preparen els quadres de comandament preconfigurats per connectar i funcionar.",
      "Els nostres enginyers avaluen la instal·lació elèctrica del teu club i preparen els quadres de comandament preconfigurats per connectar i funcionar.",
      "Gure ingeniariek zure klubaren instalazio elektrikoa ebaluatzen dute eta konektatu eta erabiltzeko aginte-panel aurrez konfiguratutakoak prestatzen dituzte.",
      "يقوم مهندسونا بتقييم الشبكة الكهربائية في ناديك وتجهيز لوحات التحكم مسبقة الضبط للتشغيل الفوري والمباشر.",
      "Os nossos engenheiros avaliam a instalação elétrica do seu clube e preparam os quadros de comando pré-configurados prontos a ligar e utilizar.",
      "Nos ingénieurs évaluent l'installation électrique de votre club et préparent des tableaux de commande préconfigurés prêts à l'emploi.",
      "Unsere Ingenieure prüfen die Elektroinstallation Ihres Clubs und liefern vorkonfigurierte Plug-and-Play-Steuerungsschränke.",
      "I nostri ingegneri valutano l'impianto elettrico del tuo circolo e configurano quadri di comando pronti all'uso immediato.")

add_d("domotica.bannerTitle",
      "¿Quieres automatizar las pistas de tu club?", "Ready to automate your club's courts?",
      "Queres automatizar as pistas do teu club?", "Vols automatitzar les pistes del teu club?", "Vols automatitzar les pistes del teu club?",
      "Zure klubeko kantxak automatizatu nahi dituzu?", "هل ترغب في أتمتة ملاعب ناديك بالكامل؟",
      "Quer automatizar os campos do seu clube?", "Voulez-vous automatiser les pistes de votre club ?",
      "Möchten Sie die Plätze Ihres Clubs automatisieren?", "Vuoi automatizzare i campi del tuo circolo?")

add_d("domotica.catalogTitle",
      "Hardware y Automatizaciones IoT Disponibles", "Available IoT Hardware & Automations",
      "Hardware e Automatizacións IoT Dispoñibles", "Maquinari i Automatitzacions IoT Disponibles", "Maquinari i Automatitzacions IoT Disponibles",
      "Eskuragarri dauden IoT Hardware eta Automatizazioak", "أجهزة وحلول إنترنت الأشياء المتاحة للأتمتة",
      "Hardware e Automatizações IoT Disponíveis", "Matériel et Automatisations IoT Disponibles",
      "Verfügbare IoT-Hardware & Automationen", "Hardware e Automazioni IoT Disponibili")

add_d("domotica.closed",
      "Cerrado", "Locked", "Pechado", "Tancat", "Tancat", "Itxita", "مغلق", "Fechado", "Fermé", "Geschlossen", "Chiuso")

add_d("domotica.compatible",
      "Compatible con relés Schneider, Finder y Shelly", "Compatible with Schneider, Finder, and Shelly relays",
      "Compatible con relés Schneider, Finder e Shelly", "Compatible amb relés Schneider, Finder i Shelly", "Compatible amb relés Schneider, Finder i Shelly",
      "Schneider, Finder eta Shelly erreleekin bateragarria", "متوافق مع مرحلات شنايدر وفايندر وشيلي",
      "Compatível com relés Schneider, Finder e Shelly", "Compatible avec les relais Schneider, Finder et Shelly",
      "Kompatibel mit Relais von Schneider, Finder und Shelly", "Compatibile con relè Schneider, Finder e Shelly")

add_d("domotica.ledOn",
      "Encendido (400 Lux)", "Active (400 Lux)", "Aceso (400 Lux)", "Encès (400 Lux)", "Encès (400 Lux)",
      "Piztuta (400 Lux)", "مضاء (400 لوكس)", "Ligado (400 Lux)", "Allumé (400 Lux)", "Eingeschaltet (400 Lux)", "Acceso (400 Lux)")

add_d("domotica.pinError",
      "PIN incorrecto. Prueba con #4829 o #1234.", "Invalid PIN. Try #4829 or #1234.",
      "PIN incorrecto. Proba con #4829 ou #1234.", "PIN incorrecte. Prova amb #4829 o #1234.", "PIN incorrecte. Prova amb #4829 o #1234.",
      "PIN okerra. Saiatu #4829 edo #1234-rekin.", "رمز PIN غير صحيح. جرب #4829 أو #1234.",
      "PIN incorreto. Tente #4829 ou #1234.", "Code PIN erroné. Essayez le #4829 ou #1234.",
      "Falscher PIN. Versuchen Sie #4829 oder #1234.", "PIN errato. Prova con #4829 o #1234.")

add_d("domotica.pinPlaceholder",
      "Introduce PIN (ej: 4829)", "Enter PIN (e.g. 4829)", "Introduce PIN (ex: 4829)",
      "Introdueix PIN (ex: 4829)", "Introdueix PIN (ex: 4829)", "Idatzi PINa (adib: 4829)",
      "أدخل رمز PIN (مثال: 4829)", "Introduza o PIN (ex: 4829)", "Entrez le code PIN (ex : 4829)",
      "PIN eingeben (z. B. 4829)", "Inserisci PIN (es: 4829)")

add_d("domotica.pinSuccess",
      "PIN correcto (#4829). Puerta abierta durante 10 segundos.", "PIN accepted (#4829). Door unlocked for 10 seconds.",
      "PIN correcto (#4829). Porta aberta durante 10 segundos.", "PIN correcte (#4829). Porta oberta durant 10 segons.", "PIN correcte (#4829). Porta oberta durant 10 segons.",
      "PIN zuzena (#4829). Atea irekita 10 segundoz.", "رمز PIN صحيح (#4829). الباب مفتوح لمدة 10 ثوانٍ.",
      "PIN correto (#4829). Porta aberta durante 10 segundos.", "Code PIN valide (#4829). Porte déverrouillée pendant 10 secondes.",
      "PIN korrekt (#4829). Tür für 10 Sekunden entriegelt.", "PIN corretto (#4829). Porta sbloccata per 10 secondi.")

add_d("domotica.simSubtitle",
      "Comprueba cómo reacciona la pista inteligente cuando un jugador interactúa con el sistema de acceso y luces.",
      "See how the smart court reacts in real time when a player interacts with access and lighting controls.",
      "Comproba como reacciona a pista intelixente cando un xogador interactúa co sistema de acceso e luces.",
      "Comprova com reacciona la pista intel·ligent quan un jugador interactua amb el sistema d'accés i llums.",
      "Comprova com reacciona la pista intel·ligent quan un jugador interactua amb el sistema d'accés i llums.",
      "Ikusi nola erantzuten duen kantxa adimendunak jokalari batek sarbide eta argi-sistemarekin elkarreragiten duenean.",
      "شاهد كيف يستجيب الملعب الذكي لحظياً عندما يتفاعل اللاعب مع بوابات الدخول والإضاءة.",
      "Veja como o campo inteligente reage em tempo real quando um jogador interage com o controlo de acessos e iluminação.",
      "Observez comment le court intelligent réagit en temps réel lorsqu'un joueur utilise les accès et l'éclairage.",
      "Erleben Sie live, wie der Smart Court reagiert, wenn Spieler Zutritts- und Lichtsteuerungen bedienen.",
      "Scopri come risponde il campo intelligente quando un giocatore interagisce con luci e accessi.")

add_d("domotica.status",
      "Estado: ", "Status: ", "Estado: ", "Estat: ", "Estat: ", "Egoera: ", "الحالة: ", "Estado: ", "Statut : ", "Status: ", "Stato: ")

add_d("domotica.subtitle",
      "Conecta tu software de gestión directamente con las luces LED, tornos de acceso, cámaras de repetición y sistemas de climatización de tus pistas. Automatización industrial llave en mano instalable en menos de 48 horas.",
      "Link management software directly to LED court lighting, access turnstiles, highlight cameras, and HVAC climate controls. Turnkey industrial automation operational in under 48 hours.",
      "Conecta o teu software de xestión directamente coas luces LED, tornos de acceso, cámaras de repetición e sistemas de climatización das túas pistas. Automatización industrial chave en man instalable en menos de 48 horas.",
      "Connecta el teu programari de gestió directament amb els llums LED, torns d'accés, càmeres de repetició i sistemes de climatització de les teves pistes. Automatització industrial clau en mà instal·lable en menys de 48 hores.",
      "Connecta el teu programari de gestió directament amb els llums LED, torns d'accés, càmeres de repetició i sistemes de climatització de les teves pistes. Automatització industrial clau en mà instal·lable en menys de 48 hores.",
      "Lotu zure kudeaketa-softwarea zuzenean zure kantxetako LED argiekin, sarbide-tornuekin, errepikapen-kamerekin eta klimatizazio-sistemekin. Giltza eskuan motako automatizazio industriala 48 ordu baino gutxiagoan instalagarria.",
      "اربط برنامج إدارة النادي مباشرة بإضاءة الملاعب، البوابات الإلكترونية، كاميرات الإعادة وأنظمة التكييف. أتمتة صناعية متكاملة وجاهزة للتشغيل خلال 48 ساعة فقط.",
      "Ligue o seu software de gestão diretamente às luzes LED, torniquetes de acesso, câmaras de repetição e climatização dos seus campos. Automatização industrial pronta a funcionar em menos de 48 horas.",
      "Connectez votre logiciel de gestion directement à l'éclairage LED, aux tourniquets d'accès, caméras de replay et systèmes de ventilation. Automatisation industrielle clé en main installable en moins de 48 heures.",
      "Verbinden Sie Ihre Clubsoftware direkt mit LED-Flutlicht, Drehkreuzen, Replay-Kameras und Hallenklimatisierung. Schlüsselfertige Industrieautomation innerhalb von 48 Stunden einsatzbereit.",
      "Collega il software di gestione direttamente ai fari LED, ai tornelli d'accesso, alle telecamere replay e alla climatizzazione dei campi. Automazione industriale chiavi in mano installabile in 48 ore.")

add_d("domotica.titleHighlight",
      "Abre las 24 horas sin costes de recepción.", "Operate 24/7 with zero front-desk overhead.",
      "Abre as 24 horas sen custos de recepción.", "Obre les 24 hores sense costos de recepció.", "Obre les 24 hores sense costos de recepció.",
      "Ireki 24 orduz harrera-kosturik gabe.", "تشغيل الملاعب على مدار 24 ساعة بدون تكاليف استقبال إضافية.",
      "Abra 24 horas sem custos de receção.", "Ouvrez 24h/24 sans frais d'accueil supplémentaires.",
      "24/7-Betrieb ohne Rezeptionspersonal.", "Apertura 24 ore su 24 senza costi di reception.")

add_d("domotica.turnOnLights",
      "Encender Focos", "Turn On Floodlights", "Acender Focos", "Encendre Focs", "Encendre Focs",
      "Piztu Argiak", "تشغيل الإضاءة", "Ligar Focos", "Allumer Projecteurs", "Flutlicht einschalten", "Accendi Fari")

add_d("domotica.turnstileTitle",
      "Torno / Puerta de Pista", "Turnstile / Court Gate", "Torno / Porta de Pista",
      "Torn / Porta de Pista", "Torn / Porta de Pista", "Tornua / Kantxako Atea",
      "بوابة / قفل الملعب الإلكتروني", "Torniquete / Porta de Campo", "Tourniquet / Porte du Court",
      "Drehkreuz / Platz-Tür", "Tornello / Porta Campo")

add_d("domotica.unlocked",
      "Desbloqueado (Abierto)", "Unlocked (Open)", "Desbloqueado (Aberto)", "Desbloquejat (Obert)", "Desbloquejat (Obert)",
      "Desblokeatuta (Irekita)", "مفتوح وغير مقفل", "Desbloqueado (Aberto)", "Déverrouillé (Ouvert)", "Entriegelt (Offen)", "Sbloccato (Aperto)")

# MODULE 1: Luces LED
m1 = {
    "badge": ("Eficiencia LED", "LED Efficiency", "Eficiencia LED", "Eficiència LED", "Eficiència LED", "LED Eraginkortasuna", "كفاءة إضاءة LED", "Eficiência LED", "Efficacité LED", "LED-Energieeffizienz", "Efficienza LED"),
    "title": ("Encendido y Apagado Automático de Focos LED", "Automated LED Spotlight Activation & Scheduling", "Acendido e Apagado Automático de Focos LED", "Encesa i Apagada Automàtica de Focs LED", "Encesa i Apagada Automàtica de Focs LED", "LED Fokoen Pizte eta Itzaltze Automatikoa", "تشغيل وإطفاء كشافات LED تلقائياً", "Ligação e Desligamento Automático de Projetores LED", "Allumage et Extinction Automatique des Projecteurs LED", "Automatische LED-Flutlichtsteuerung nach Belegungsplan", "Accensione e Spegnimento Automatico Fari LED"),
    "desc": ("Sincronización milimétrica con el cuadrante de reservas. Los proyectores LED se activan automáticamente 5 minutos antes del turno y se apagan al finalizar.",
             "Sub-second sync with bookings. LED lights turn on 5 minutes prior to game start and switch off automatically at match end.",
             "Sincronización milimétrica co cuadrante de reservas. Os proxectores LED actívanse automaticamente 5 minutos antes do turno e apáganse ao rematar.",
             "Sincronització mil·limètrica amb el quadrant de reserves. Els projectors LED s'activen automàticament 5 minuts abans del torn i s'apaguen en finalitzar.",
             "Sincronització mil·limètrica amb el quadrant de reserves. Els projectors LED s'activen automàticament 5 minuts abans del torn i s'apaguen en finalitzar.",
             "Milimetrozko sinkronizazioa erreserba-koadrantearekin. LED proiektagailuak automatikoki pizten dira txanda baino 5 minutu lehenago eta amaitzean itzaltzen dira.",
             "مزامنة دقيقة مع جدول الحجوزات. تضاء كشافات LED تلقائياً قبل بدء المباراة بـ 5 دقائق وتنطفئ فور انتهائها.",
             "Sincronização milimétrica com a grelha de reservas. Os projetores LED ligam-se automaticamente 5 minutos antes do horário e desligam-se no fim.",
             "Synchronisation parfaite avec le planning. Les projecteurs LED s'allument automatiquement 5 minutes avant la partie et s'éteignent à la fin.",
             "Präzise Kopplung an den Belegungsplan. LED-Strahler schalten sich 5 Minuten vor Spielbeginn ein und nach Spielende automatisch ab.",
             "Sincronizzazione perfetta con le prenotazioni. I fari LED si accendono 5 minuti prima della partita e si spengono al termine."),
    "kpi": ("-40% en consumo de luz", "-40% Lighting Costs", "-40% no consumo de luz", "-40% en consum de llum", "-40% en consum de llum", "-%40 argi-kontsumoan", "-40% في استهلاك الكهرباء", "-40% no consumo de luz", "-40% sur la facture d'éclairage", "-40% Stromkosten für Beleuchtung", "-40% consumi di illuminazione"),
    "s0": ("Encendido y apagado suave (sin picos de tensión ni deslumbramiento)", "Soft ramp up and down (zero voltage spikes, anti-glare)", "Acendido e apagado suave (sen picos de tensión nin cegamento)", "Encesa i apagada suau (sense pics de tensió ni enlluernament)", "Encesa i apagada suau (sense pics de tensió ni enlluernament)", "Pizte eta itzaltze leuna (tentsio-gailurrik eta distirarik gabe)", "تشغيل وإطفاء تدريجي يحمي من ارتفاع الجهد والتوهج", "Ligação e corte suaves (sem picos de tensão nem encandeamento)", "Allumage progressif sans pics de tension ni éblouissement", "Sanftes Ein- und Ausschalten ohne Spannungsspitzen oder Blendung", "Accensione e spegnimento graduale senza picchi di tensione"),
    "s1": ("Margen de cortesía de 5 minutos al finalizar el partido", "5-minute courtesy buffer after match completion", "Marxe de cortesía de 5 minutos ao rematar o partido", "Marge de cortesia de 5 minuts en finalitzar el partit", "Marge de cortesia de 5 minuts en finalitzar el partit", "5 minutuko adeitasun-tartea partida amaitzean", "مهلة إضافية لمدة 5 دقائق لجمع الكرات والمغادرة", "Margem de cortesia de 5 minutos no final do jogo", "Délai de courtoisie de 5 minutes après la fin de partie", "5 Minuten Nachspielzeit-Kulanz nach dem Match", "5 minuti di cortesia al termine della partita"),
    "s2": ("Control remoto manual desde app móvil para personal de mantenimiento", "Remote manual override via mobile app for facility staff", "Control remoto manual desde app móbil para persoal de mantemento", "Control remot manual des d'app mòbil per a personal de manteniment", "Control remot manual des d'app mòbil per a personal de manteniment", "Eskuzko urruneko kontrola mantentze-langileentzat mugikorreko aplikaziotik", "تحكم يدوي عن بُعد من التطبيق لفريق الصيانة", "Controlo remoto manual através de app para equipa de manutenção", "Contrôle manuel à distance via l'application pour la maintenance", "Manuelle Fernsteuerung per Smartphone-App für Platzwarte", "Controllo manuale remoto via app per manutentori"),
    "s3": ("Ahorro comprobado de hasta un 40% en la factura eléctrica mensual", "Proven savings of up to 40% on monthly electric bills", "Aforro comprobado de ata un 40% na factura eléctrica mensual", "Estalvi comprovat de fins a un 40% a la factura elèctrica mensual", "Estalvi comprovat de fins a un 40% a la factura elèctrica mensual", "Hileko faktura elektrikoan %40rainoko aurrezpen frogatua", "توفير مثبت يصل إلى 40% في فاتورة الكهرباء الشهرية", "Poupança comprovada de até 40% na fatura de eletricidade mensal", "Économies vérifiées jusqu'à 40% sur la facture d'électricité", "Nachgewiesene Ersparnis von bis zu 40% bei monatlichen Stromkosten", "Risparmio certificato fino al 40% sulla bolletta elettrica mensile")
}

# MODULE 2: Accesos
m2 = {
    "badge": ("Acceso Autónomo", "Keyless Access", "Acceso Autónomo", "Accés Autònom", "Accés Autònom", "Sarbide Autonomoa", "دخول ذكي ذاتي", "Acesso Autónomo", "Accès Autonome", "Autonomer Zutritt", "Accesso Autonomo"),
    "title": ("Control de Accesos por PIN y Código QR Dinámico", "Dynamic PIN & QR Code Access Control", "Control de Accesos por PIN e Código QR Dinámico", "Control d'Accessos per PIN i Codi QR Dinàmic", "Control d'Accessos per PIN i Codi QR Dinàmic", "Sarbide-kontrola PIN eta QR Kode Dinamiko bidez", "التحكم في الدخول برمز PIN ورمز QR المتغير", "Controlo de Acessos por PIN e Código QR Dinâmico", "Contrôle d'Accès par Code PIN et QR Code Dynamique", "Zutrittskontrolle via dynamischem PIN und QR-Code", "Controllo Accessi tramite PIN e QR Code Dinamico"),
    "desc": ("Cerraduras electrónicas y tornos peatonales de alta resistencia conectados a la nube. Cada jugador recibe en su móvil un PIN temporal o QR válido exclusivamente durante su horario reservado.",
             "Heavy-duty smart locks and turnstiles cloud-connected. Players receive a time-boxed PIN or QR valid strictly for their booked slot.",
             "Pechaduras electrónicas e tornos peonís de alta resistencia conectados á nube. Cada xogador recibe no seu móbil un PIN temporal ou QR válido exclusivamente durante o seu horario reservado.",
             "Panys electrònics i torns per a vianants d'alta resistència connectats al núvol. Cada jugador rep al mòbil un PIN temporal o QR vàlid exclusivament durant el seu horari reservat.",
             "Panys electrònics i torns per a vianants d'alta resistència connectats al núvol. Cada jugador rep al mòbil un PIN temporal o QR vàlid exclusivament durant el seu horari reservat.",
             "Hodeiari konektatutako erresistentzia handiko sarraila elektronikoak eta oinezkoen tornuak. Jokalari bakoitzak bere mugikorrean PIN edo QR aldi baterako kode bat jasotzen du, erreserbatutako ordutegian soilik balio duena.",
             "أقفال إلكترونية وبوابات مرور متصلة بالسحاب. يستلم كل لاعب عبر هاتفه رمز PIN مؤقتاً أو رمز QR صالحاً حصرياً خلال فترة حجزه.",
             "Fechaduras eletrónicas e torniquetes pedestres de alta resistência ligados à nuvem. Cada jogador recebe no smartphone um PIN ou QR temporário válido apenas no horário reservado.",
             "Serrures électroniques et tourniquets connectés au cloud. Chaque joueur reçoit sur son smartphone un PIN ou QR code valable uniquement pendant son créneau réservé.",
             "Cloud-vernetzte Industrie-Elektronikschlösser und Drehkreuze. Jeder Spieler erhält einen zeitlich begrenzten PIN oder QR-Code auf sein Smartphone.",
             "Serrature elettroniche e tornelli ad alta resistenza connessi al cloud. Ogni giocatore riceve sul proprio smartphone un PIN temporaneo o QR code valido per la prenotazione."),
    "kpi": ("Operación 24/7 sin personal", "24/7 Unmanned Operations", "Operación 24/7 sen persoal", "Operació 24/7 sense personal", "Operació 24/7 sense personal", "24/7 funtzionamendua langilerik gabe", "تشغيل 24/7 بدون موظفي استقبال", "Operação 24/7 sem pessoal", "Exploitation 24h/24 sans personnel", "24/7-Betrieb ohne Rezeptionspersonal", "Operatività 24/7 senza presidio"),
    "s0": ("Apertura de pistas sin necesidad de personal en recepción", "Court access without on-site front desk staff", "Apertura de pistas sen necesidade de persoal en recepción", "Obertura de pistes sense necessitat de personal a recepció", "Obertura de pistes sense necessitat de personal a recepció", "Kantxak irekitzea harrerako langileen beharrik gabe", "فتح بوابات الملاعب ذاتياً دون حاجة لموظف استقبال", "Abertura de campos sem necessidade de equipa de receção", "Ouverture des terrains sans personnel d'accueil", "Platzöffnung ohne Rezeptionspersonal", "Apertura campi senza personale in reception"),
    "s1": ("Desbloqueo automático 10 minutos antes del inicio del turno", "Automatic unlocking 10 minutes prior to slot start", "Desbloqueo automático 10 minutos antes do inicio do turno", "Desbloqueig automàtic 10 minuts abans de l'inici del torn", "Desbloqueig automàtic 10 minuts abans de l'inici del torn", "Desblokeatze automatikoa txanda hasi baino 10 minutu lehenago", "فتح البوابات تلقائياً قبل بدء الموعد بـ 10 دقائق", "Desbloqueio automático 10 minutos antes do início do jogo", "Déverrouillage automatique 10 minutes avant le créneau", "Automatische Entriegelung 10 Minuten vor Spielbeginn", "Sblocco automatico 10 minuti prima dell'inizio del turno"),
    "s2": ("Registro de auditoría con fecha y milisegundo de entrada", "Audit log tracking precise entry timestamp to the millisecond", "Rexistro de auditoría con data e milisegundo de entrada", "Registre d'auditoria amb data i mil·lisegon d'entrada", "Registre d'auditoria amb data i mil·lisegon d'entrada", "Auditoretza-erregistroa sarbidearen data eta milisegundoarekin", "سجل تدقيق كامل يوثق تاريخ ولحظة الدخول بالمللي ثانية", "Registo de auditoria com data e milissegundo de entrada", "Journal d'audit horodaté à la milliseconde près", "Audit-Protokollierung mit sekundengenauem Zeitstempel", "Registro di audit con data e millisecondo d'ingresso"),
    "s3": ("Integración nativa con cancelas exteriores y puertas de cristal", "Native interface for perimeter gates and glass court doors", "Integración nativa con cancelas exteriores e portas de cristal", "Integració nativa amb cancel·les exteriors i portes de vidre", "Integració nativa amb cancel·les exteriors i portes de vidre", "Integrazio natiboa kanpoko hesiekin eta kristalezko ateekin", "تكامل مباشر مع البوابات الخارجية وأبواب الملاعب الزجاجية", "Integração nativa com portões exteriores e portas de vidro", "Intégration directe aux grilles extérieures et portes vitrées", "Direkte Ansteuerung von Außentoren und Glasplatztüren", "Integrazione nativa con cancelli perimetrali e porte in vetro")
}

# MODULE 3: Video
m3 = {
    "badge": ("Experiencia Viral", "Viral Highlights", "Experiencia Viral", "Experiència Viral", "Experiència Viral", "Esperientzia Birtuala", "تجربة تفاعلية وبث لقطات", "Experiência Viral", "Expérience Virale", "Highlight-Erlebnis", "Esperienza Virale"),
    "title": ("Cámaras de Repetición y Highlights con Pulsador en Pista", "Replay Cameras & Court Highlights Pushbutton", "Cámaras de Repetición e Highlights con Pulsador en Pista", "Càmeres de Repetició i Highlights amb Polsador a Pista", "Càmeres de Repetició i Highlights amb Polsador a Pista", "Errepikapen-kamerak eta Highlight-ak Kantxako Botoiarekin", "كاميرات إعادة اللقطات والأهداف مع زر في الملعب", "Câmaras de Repetição e Highlights com Botão no Campo", "Caméras de Replay et Highlights avec Bouton sur le Court", "Replay-Kameras & Highlight-Aufzeichnung mit Court-Buzzer", "Telecamere Replay e Highlights con Pulsante in Campo"),
    "desc": ("Sistema de grabación continua en bucle con pulsador físico inalámbrico instalado en el poste de la red. Cuando un jugador hace un punto épico, pulsa el botón y el clip se recorta y se envía a su app.",
             "Continuous rolling loop recording paired with a rugged net-post buzzer. Players hit the button after great points to instantly receive the clip in their app.",
             "Sistema de gravación continua en bucle con pulsador físico sen fíos instalado no poste da rede. Cando un xogador fai un punto épico, preme o botón e o clip recórtase e envíase á súa app.",
             "Sistema d'enregistrament continu en bucle amb polsador físic sense fils instal·lat al pal de la xarxa. Quan un jugador fa un punt èpic, prem el botó i el clip es retalla i s'envia a la seva app.",
             "Sistema d'enregistrament continu en bucle amb polsador físic sense fils instal·lat al pal de la xarxa. Quan un jugador fa un punt èpic, prem el botó i el clip es retalla i s'envia a la seva app.",
             "Etengabeko grabazio-sistema sarearen zutoinean jarritako haririk gabeko botoi fisikoarekin. Jokalari batek puntu bikaina egiten duenean, botoia sakatu eta klipa moztu eta bere aplikaziora bidaltzen da.",
             "نظام تسجيل حلقي مستمر مع زر لاسلكي مثبت على عمود الشبكة. عند إحراز نقطة مميزة، يضغط اللاعب على الزر ليتم اقتصاص الفيديو وإرساله فوراً إلى هاتفه.",
             "Sistema de gravação contínua em loop com botão físico sem fios instalado no poste da rede. Quando um jogador faz um ponto épico, prime o botão e o vídeo é enviado para a sua app.",
             "Système d'enregistrement en boucle avec bouton sans fil fixé au poteau du filet. Après un point mémorable, les joueurs appuient sur le bouton pour recevoir l'extrait vidéo.",
             "Kontinuierliche Ringspeicher-Aufnahme mit wasserdichtem Funk-Buzzer am Netzpfosten. Spieler drücken nach spektakulären Ballwechseln auf den Knopf und erhalten den Clip sofort.",
             "Sistema di registrazione continua con pulsante wireless installato sul palo della rete. Al termine di un punto spettacolare, i giocatori premono il pulsante per ricevere la clip."),
    "kpi": ("+400% engagement social", "+400% Social Engagement", "+400% engagement social", "+400% interacció social", "+400% interacció social", "+%400 sare sozialetako elkarrekintza", "+400% تفاعل على منصات التواصل", "+400% envolvimento social", "+400% d'engagement social", "+400% Social-Media-Engagement", "+400% engagement social"),
    "s0": ("Grabación en resolución Full HD 60fps con lente gran angular", "Full HD 60fps recording with ultra-wide angle lens", "Gravación en resolución Full HD 60fps con lente gran angular", "Enregistrament en resolució Full HD 60fps amb lent gran angular", "Enregistrament en resolució Full HD 60fps amb lent gran angular", "Full HD 60fps bereizmeneko grabazioa angelu zabaleko lentearekin", "تسجيل بدقة Full HD 60 إطار بالثانية بعدسة عريضة الزاوية", "Gravação em resolução Full HD 60fps com lente grande-angular", "Enregistrement Full HD 60fps avec objectif grand-angle", "Full-HD-Aufnahme bei 60 fps mit Weitwinkelobjektiv", "Registrazione Full HD 60fps con obiettivo grandangolare"),
    "s1": ("Generación automática de clip de 30 segundos (20s antes + 10s después)", "Auto-generated 30s clips (20s pre-action + 10s post-action)", "Xeración automática de clip de 30 segundos (20s antes + 10s despois)", "Generació automàtica de clip de 30 segons (20s abans + 10s després)", "Generació automàtica de clip de 30 segons (20s abans + 10s després)", "30 segundoko klipen sorrera automatikoa (20s lehenago + 10s geroago)", "إنتاج تلقائي لمقطع مدته 30 ثانية (20 ثانية قبل الضغطة + 10 ثوانٍ بعدها)", "Geração automática de clip de 30 segundos (20s antes + 10s depois)", "Génération automatique d'un clip de 30 secondes (20s avant + 10s après)", "Automatische 30-Sekunden-Clips (20s vor + 10s nach dem Tastendruck)", "Generazione automatica di clip da 30 secondi (20s prima + 10s dopo)"),
    "s2": ("Marca de agua con logotipo y patrocinadores del club", "Watermarked with club branding and sponsors", "Marca de auga con logotipo e patrocinadores do club", "Marca d'aigua amb logotip i patrocinadors del club", "Marca d'aigua amb logotip i patrocinadors del club", "Ur-marka klubaren logotipo eta babesleekin", "إضافة العلامة المائية لشعار النادي ورعاته الرسميين", "Marca de água com logótipo e patrocinadores do clube", "Filigrane automatique avec logo et sponsors du club", "Automatisches Wasserzeichen mit Clublogo und Sponsoren", "Filigrana personalizzata con logo e sponsor del circolo"),
    "s3": ("Opción de retransmisión en directo por streaming en YouTube", "Direct live-streaming capability to YouTube", "Opción de retransmisión en directo por streaming en YouTube", "Opció de retransmissió en directe per streaming a YouTube", "Opció de retransmissió en directe per streaming a YouTube", "YouTube bidezko zuzeneko igorpen aukera", "إمكانية البث المباشر للمباريات عبر يوتيوب", "Opção de transmissão em direto por streaming no YouTube", "Option de diffusion en direct par streaming sur YouTube", "Optionale Live-Streaming-Übertragung auf YouTube", "Opzione di trasmissione in diretta streaming su YouTube")
}

# MODULE 4: Clima
m4 = {
    "badge": ("Confort en Pista", "Court Climate Comfort", "Confort en Pista", "Confort a Pista", "Confort a Pista", "Kantxako Erosotasuna", "راحة وجودة بيئة اللعب", "Conforto no Campo", "Confort sur le Court", "Hallenklima & Komfort", "Comfort in Campo"),
    "title": ("Climatización, Aerotermia y Sensores Antihumedad", "HVAC, Heat Pumps & Anti-Humidity Sensors", "Climatización, Aerotermia e Sensores Antihumidade", "Climatització, Aerotèrmia i Sensors Antihumitat", "Climatització, Aerotèrmia i Sensors Antihumitat", "Klimatizazioa, Aerotermia eta Hezetasunaren Aurkako Sentsoreak", "التكييف، المضخات الحرارية ومستشعرات الرطوبة", "Climatização, Aerotermia e Sensores Anti-Humidade", "Climatisation, Aérothermie et Capteurs Anti-Humidité", "Klimatisierung, Wärmepumpen & Feuchtigkeitssensoren", "Climatizzazione, Pompe di Calore e Sensori Umidità"),
    "desc": ("Sondas IoT de temperatura, humedad relativa y punto de rocío en naves indoor. Activación inteligente de aerotermia y deshumidificadores para evitar cristales empañados.",
             "Indoor ambient IoT probes measuring temperature, humidity, and dew point. Smart activation of heat pumps and dehumidifiers prevents foggy glass walls.",
             "Sondas IoT de temperatura, humidade relativa e punto de orballo en naves indoor. Activación intelixente de aerotermia e deshumidificadores para evitar cristais embazados.",
             "Sondes IoT de temperatura, humitat relativa i punt de rosada en naus indoor. Activació intel·ligent d'aerotèrmia i deshumidificadors per evitar vidres entelats.",
             "Sondes IoT de temperatura, humitat relativa i punt de rosada en naus indoor. Activació intel·ligent d'aerotèrmia i deshumidificadors per evitar vidres entelats.",
             "Tenperatura, hezetasun erlatiboa eta ihintz-puntua neurtzeko IoT zundak estalitako pabiloietan. Aerotermia eta hezegailuak modu adimentsuan aktibatzea beira lausoak ekiditeko.",
             "مستشعرات إنترنت الأشياء لقياس درجة الحرارة، الرطوبة ونقطة الندى في الصالات المغلقة. تشغيل ذكي لمضخات الهواء ومزيلات الرطوبة لمنع تكثف البخار على الزجاج.",
             "Sondas IoT de temperatura, humidade relativa e ponto de orvalho em pavilhões indoor. Ativação inteligente de desumidificadores para evitar vidros embaciados.",
             "Sondes IoT de température, humidité relative et point de rosée en intérieur. Déclenchement intelligent des déshumidificateurs pour éviter les vitres embuées.",
             "IoT-Sensoren für Raumtemperatur, relative Feuchte und Taupunkt in Hallen. Automatisches Zuschalten von Entfeuchtern verhindert beschlagene Glasscheiben.",
             "Sonde IoT per temperatura, umidità relativa e punto di rugiada nei campi indoor. Gestione intelligente per evitare vetri appannati."),
    "kpi": ("Cristales 100% secos", "100% Dry Glass Walls", "Cristais 100% secos", "Vidres 100% secs", "Vidres 100% secs", "%100 kristal lehorrak", "زجاج جاف بنسبة 100%", "Vidros 100% secos", "Vitres 100% sèches", "100% beschlagfreie Glasscheiben", "Vetri 100% asciutti"),
    "s0": ("Prevención total de condensación en vidrios para rebotes limpios", "Zero condensation on glass perimeter for true ball rebounds", "Prevención total de condensación en vidrios para rebotes limpos", "Prevenció total de condensació en vidres per a rebots nets", "Prevenció total de condensació en vidres per a rebots nets", "Beiretan kondentsazioa erabat ekiditea errebote garbiak lortzeko", "منع كامل لتكثف الرطوبة على الزجاج لارتداد نقي للكرة", "Prevenção total de condensação nos vidros para ressaltos perfeitos", "Élimination totale de la condensation pour des rebonds parfaits", "Zuverlässige Vermeidung von Kondenswasser für saubere Abpraller", "Prevenzione totale della condensa sui vetri per rimbalzi perfetti"),
    "s1": ("Encendido de calefacción o aire acondicionado según ocupación real", "HVAC modulation driven by real court occupancy", "Acendido de calefacción ou aire acondicionado segundo ocupación real", "Encesa de calefacció o aire condicionat segons ocupació real", "Encesa de calefacció o aire condicionat segons ocupació real", "Berokuntza edo aire girotua piztea benetako okupazioaren arabera", "تشغيل التدفئة أو التكييف بحسب نسبة الإشغال الفعلية", "Ligação de aquecimento ou ar condicionado consoante a ocupação real", "Déclenchement du chauffage ou de la climatisation selon l'occupation", "Heizung oder Kühlung abhängig von der Platzbelegung schalten", "Attivazione riscaldamento o climatizzazione in base all'occupazione"),
    "s2": ("Telemetría continua de calidad del aire y niveles de CO2", "Continuous indoor air quality and CO2 level monitoring", "Telemetría continua de calidade do aire e niveis de CO2", "Telemetria contínua de qualitat de l'aire i nivells de CO2", "Telemetria contínua de qualitat de l'aire i nivells de CO2", "Etengabeko telemetria airearen kalitatean eta CO2 mailetan", "رصد مستمر لجودة الهواء الداخلي ونسب ثاني أكسيد الكربون", "Telemetria contínua da qualidade do ar e níveis de CO2", "Télémétrie continue de la qualité de l'air et du CO2", "Kontinuierliche Erfassung von Luftqualität und CO2-Werten", "Telemetria continua della qualità dell'aria e livelli di CO2"),
    "s3": ("Ajuste automático según previsión meteorológica exterior", "Automatic baseline calibration from exterior weather forecasts", "Axuste automático segundo previsión meteorolóxica exterior", "Ajust automàtic segons previsió meteorològica exterior", "Ajust automàtic segons previsió meteorològica exterior", "Egokitzapen automatikoa kanpoko iragarpen meteorologikoaren arabera", "ضبط تلقائي بالاعتماد على توقعات الطقس الخارجية", "Ajuste automático de acordo com a previsão meteorológica exterior", "Régulation prédictive selon la météo extérieure", "Automatische Anpassung an externe Wetterprognosen", "Regolazione automatica in base alle previsioni meteo esterne")
}

# MODULE 5: Radar
m5 = {
    "badge": ("Control en Tiempo Real", "Real-Time Occupancy", "Control en Tempo Real", "Control en Temps Real", "Control en Temps Real", "Denbora Errealeko Kontrola", "متابعة الإشغال لحظياً", "Controlo em Tempo Real", "Contrôle en Temps Réel", "Echtzeit-Präsenzkontrolle", "Controllo in Tempo Reale"),
    "title": ("Radar de Pista Ocupada y Detección de Presencia", "Microwave Radar & Court Occupancy Sensors", "Radar de Pista Ocupada e Detección de Presenza", "Radar de Pista Ocupada i Detecció de Presència", "Radar de Pista Ocupada i Detecció de Presència", "Kantxa Okupatuaren Radarra eta Presentzia Detekzioa", "رادار استشعار وجود اللاعبين وإشغال الملاعب", "Radar de Campo Ocupado e Deteção de Presença", "Radar de Présence et Détection d'Occupation du Court", "Mikrowellen-Radar & Platzanwesenheitserfassung", "Radar Campo Occupato e Rilevamento Presenza"),
    "desc": ("Sensores volumétricos microondas que monitorizan si los jugadores están efectivamente disputando el partido, liberando la pista o alertando a recepción en caso de no-show.",
             "Microwave volumetric sensors that confirm active play, auto-releasing unplayed courts or notifying reception of no-shows.",
             "Sensores volumétricos microondas que monitorizan se os xogadores están efectivamente disputando o partido, liberando a pista ou alertando a recepción en caso de no-show.",
             "Sensors volumètrics microones que monitoritzen si els jugadors estan efectivament disputant el partit, alliberant la pista o alertant a recepció en cas de no-show.",
             "Sensors volumètrics microones que monitoritzen si els jugadors estan efectivament disputant el partit, alliberant la pista o alertant a recepció en cas de no-show.",
             "Mikrouhin-sentsore bolumetrikoak, jokalariek partida jokatzen ari diren monitorizatzen dutenak, kantxa askatuz edo harrerari jakinaraziz bertaratu ezean.",
             "مستشعرات موجية ترصد وجود اللاعبين الفعلي في الملعب، وتلغي الحجز تلقائياً أو تنبه الاستقبال في حال التخلف عن الحضور.",
             "Sensores volumétricos de micro-ondas que monitorizam se os jogadores estão em campo, libertando o campo ou alertando em caso de falta de comparência.",
             "Capteurs volumétriques micro-ondes vérifiant la présence réelle des joueurs, libérant le terrain ou alertant l'accueil en cas de no-show.",
             "Volumetrische Mikrowellensensoren prüfen die tatsächliche Platzbelegung, geben Plätze bei No-Shows frei oder informieren die Rezeption.",
             "Sensori volumetrici a microonde che monitorano la presenza effettiva in campo, liberando lo slot o avvisando in caso di no-show."),
    "kpi": ("Liberación de pistas libres", "Instant No-Show Court Release", "Liberación de pistas libres", "Alliberament de pistes lliures", "Alliberament de pistes lliures", "Kantxa libreen askatzea", "إعادة إتاحة الملاعب الشاغرة", "Libertação de campos vagos", "Libération des créneaux inoccupés", "Automatische Platzfreigabe bei No-Show", "Rilascio immediato campi liberi"),
    "s0": ("Detección no invasiva sin reconocimiento facial ni cámaras invasivas", "Non-invasive volumetric sensing (no facial recognition or cameras)", "Detección non invasiva sen recoñecemento facial nin cámaras invasivas", "Detecció no invasiva sense reconeixement facial ni càmeres invasives", "Detecció no invasiva sense reconeixement facial ni càmeres invasives", "Detekzio ez-inbaditzailea aurpegi-ezagutzarik eta kamera inbaditzailerik gabe", "كشف غير جراحي بدون كاميرات مراقبة أو التعرف على الوجوه", "Deteção não invasiva sem reconhecimento facial nem câmaras invasivas", "Détection non intrusive sans reconnaissance faciale ni caméras", "DSGVO-konforme Erfassung ohne Kameras oder Gesichtserkennung", "Rilevamento non invasivo senza telecamere né riconoscimento facciale"),
    "s1": ("Aviso a recepción tras 15 minutos de incomparecencia", "Front-desk alert after 15 minutes of player no-show", "Aviso a recepción tras 15 minutos de incomparecencia", "Avís a recepció després de 15 minuts d'incompareixença", "Avís a recepció després de 15 minuts d'incompareixença", "Harrerari jakinarazpena 15 minutu bertaratu gabe igaro ondoren", "إشعار موظفي الاستقبال بعد 15 دقيقة في حال عدم الحضور", "Alerta à receção após 15 minutos de não comparência", "Alerte envoyée à l'accueil après 15 minutes de retard", "Benachrichtigung der Rezeption nach 15 Minuten Abwesenheit", "Notifica alla reception dopo 15 minuti di mancata presenza"),
    "s2": ("Control de juego no autorizado fuera de horario reservado", "Detection of unauthorized court usage outside booked times", "Control de xogo non autorizado fóra de horario reservado", "Control de joc no autoritzat fora d'horari reservat", "Control de joc no autoritzat fora d'horari reservat", "Baimenik gabeko jokoaren kontrola erreserbatutako ordutegitik kanpo", "رصد ومنع اللعب غير المصرح به خارج أوقات الحجز", "Controlo de utilização não autorizada fora do horário reservado", "Détection d'utilisation non autorisée en dehors des créneaux réservés", "Erkennung unbefugter Nutzung außerhalb gebuchter Zeiten", "Controllo dell'uso non autorizzato fuori dagli orari prenotati"),
    "s3": ("Comunicación por protocolo industrial MQTT cifrado de baja latencia", "Secure low-latency industrial MQTT encrypted protocol", "Comunicación por protocolo industrial MQTT cifrado de baixa latencia", "Comunicació per protocol industrial MQTT xifrat de baixa latència", "Comunicació per protocol industrial MQTT xifrat de baixa latència", "Latentzia baxuko zifratutako MQTT protokolo industrial bidezko komunikazioa", "اتصال مشفر فائق السرعة عبر بروتوكول MQTT الصناعي", "Comunicação por protocolo industrial MQTT encriptado de baixa latência", "Communication industrielle chiffrée par protocole MQTT à faible latence", "Verschlüsseltes industrielles MQTT-Protokoll mit minimaler Latenz", "Comunicazione industriale cifrata a bassa latenza su protocollo MQTT")
}

# MODULE 6: Pantallas
m6 = {
    "badge": ("Señalética Digital", "Digital Signage", "Sinalética Dixital", "Senyalística Digital", "Senyalística Digital", "Seinaleztapen Digitala", "اللوحات والشاشات الرقمية", "Sinalética Digital", "Affichage Dynamique", "Digital Signage", "Segnaletica Digitale"),
    "title": ("Pantallas de Marcador y Cartelería Digital", "Live Scoreboard Displays & Digital Signage", "Pantallas de Marcador e Cartelaría Dixital", "Pantalles de Marcador i Cartellera Digital", "Pantalles de Marcador i Cartellera Digital", "Markagailu Pantailak eta Karteldegia Digitala", "شاشات تسجيل النتائج واللوحات الإعلانية الرقمية", "Ecrãs de Marcador e Sinalética Digital", "Écrans de Score et Affichage Numérique", "Live-Spielstandsanzeigen & Digital Signage Displays", "Schermi Segnapunti e Tabelloni Digitali"),
    "desc": ("Pantallas en pista y en recepción que muestran marcadores en directo, próximas reservas, partidos abiertos y publicidad de patrocinadores.",
             "On-court and reception displays broadcasting live scores, upcoming schedules, open matches, and sponsor advertising.",
             "Pantallas en pista e en recepción que mostran marcadores en directo, próximas reservas, partidos abertos e publicidade de patrocinadores.",
             "Pantalles a pista i a recepció que mostren marcadors en directe, properes reserves, partits oberts i publicitat de patrocinadors.",
             "Pantalles a pista i a recepció que mostren marcadors en directe, properes reserves, partits oberts i publicitat de patrocinadors.",
             "Kantxako eta harrerako pantailak, zuzeneko markagailuak, hurrengo erreserbak, partida irekiak eta babesleen publizitatea erakusten dutenak.",
             "شاشات على الملاعب وفي الاستقبال لعرض النتائج مباشرة، المواعيد القادمة، المباريات المفتوحة وإعلانات الرعاة.",
             "Ecrãs no campo e na receção que mostram marcadores em direto, próximas reservas, jogos abertos e publicidade de patrocinadores.",
             "Écrans sur les courts et à l'accueil affichant les scores en direct, les réservations à venir et les partenaires du club.",
             "Displays an Plätzen und Rezeption für Live-Spielstände, nächste Buchungen, offene Matches und Sponsorenwerbung.",
             "Schermi in campo e in reception con punteggi in tempo reale, prossime prenotazioni, partite aperte e sponsor."),
    "kpi": ("Nuevos ingresos por patrocinio", "Sponsorship Ad Revenue", "Novos ingresos por patrocinio", "Nous ingressos per patrocini", "Nous ingressos per patrocini", "Babesletza bidezko diru-sarrera berriak", "عوائد وإيرادات جديدة من الرعاة", "Novas receitas de patrocínio", "Nouveaux revenus publicitaires", "Zusätzliche Sponsoring-Einnahmen", "Nuovi ricavi da sponsorizzazioni"),
    "s0": ("Marcador en vivo sincronizado con la app del jugador", "Real-time scoreboard synchronized with player app", "Marcador en vivo sincronizado coa app do xogador", "Marcador en viu sincronitzat amb l'app del jugador", "Marcador en viu sincronitzat amb l'app del jugador", "Zuzeneko markagailua jokalariaren aplikazioarekin sinkronizatuta", "لوحة نتائج حية متزامنة مباشرة مع تطبيق اللاعب", "Marcador em direto sincronizado com a app do jogador", "Affichage du score synchronisé avec l'application mobile des joueurs", "Live-Punktestand synchronisiert mit der Spieler-App", "Tabellone segnapunti in tempo reale sincronizzato con l'app"),
    "s1": ("Parrilla de reservas y turnos en tiempo real", "Real-time daily schedule and court schedule rotation", "Grella de reservas e quendas en tempo real", "Graella de reserves i torns en temps real", "Graella de reserves i torns en temps real", "Erreserben eta txanden koadrantea denbora errealean", "جدول الملاعب والمواعيد الشاغرة لحظياً", "Grelha de reservas e horários em tempo real", "Planning des réservations et créneaux en direct", "Echtzeit-Übersicht aller Tagesbuchungen und Plätze", "Griglia delle prenotazioni e turni in tempo reale"),
    "s2": ("Rotación programada de anuncios de patrocinadores", "Scheduled carousel rotation for club sponsors", "Rotación programada de anuncios de patrocinadores", "Rotació programada d'anuncis de patrocinadors", "Rotació programada d'anuncis de patrocinadors", "Babesleen iragarkien txandakatze programatua", "عرض دوري مجدول لإعلانات شركاء ورعاة النادي", "Rotação programada de anúncios de patrocinadores", "Rotation programmée des bannières partenaires et sponsors", "Rotierende Einblendung von Sponsorenwerbung", "Rotazione programmata degli annunci degli sponsor"),
    "s3": ("Gestión remota de contenidos desde el panel", "Remote digital signage management via admin back-office", "Xestión remota de contidos desde o panel", "Gestió remota de continguts des del tauler", "Gestió remota de continguts des del tauler", "Edukiaren urruneko kudeaketa administrazio-paneletik", "إدارة محتوى الشاشات عن بُعد من لوحة التحكم", "Gestão remota de conteúdos a partir do painel de administração", "Gestion à distance des contenus depuis l'espace d'administration", "Zentrale Inhaltsverwaltung über das Admin-Dashboard", "Gestione remota dei contenuti dal pannello di controllo")
}

MODULE_DATA = [
    ("dom-luces", "item_1", m1),
    ("dom-accesos", "item_2", m2),
    ("dom-video", "item_3", m3),
    ("dom-clima", "item_4", m4),
    ("dom-radar", "item_5", m5),
    ("dom-pantallas", "item_6", m6),
]

for mod_id, item_key, m in MODULE_DATA:
    for field, vals in [("badge", m["badge"]), ("title", m["title"]), ("desc", m["desc"]), ("kpi", m["kpi"])]:
        # Module key
        add_d(f"domotica.module.{mod_id}.{field}", *vals)
        # Hardware key
        add_d(f"domotica.hardware.{item_key}.{field}", *vals)
    for idx in range(4):
        s_vals = m[f"s{idx}"]
        add_d(f"domotica.module.{mod_id}.specs.{idx}", *s_vals)
        add_d(f"domotica.hardware.{item_key}.specs.{idx}", *s_vals)


# MODULE: Cuadro
m_cuadro = {
    "badge": ("Hardware Conectado", "Connected Hardware", "Hardware Conectado", "Maquinari Connectat", "Maquinari Connectat", "Konektatutako Hardwarea", "أجهزة التحكم المتصلة", "Hardware Conectado", "Matériel Connecté", "Vernetzte Hardware", "Hardware Connesso"),
    "title": ("Cuadros Eléctricos Inteligentes y Relés Industriales", "Smart Electrical Panels & Industrial Relays", "Cadros Eléctricos Intelixentes e Relés Industriais", "Quadres Elèctrics Intel·ligents i Relés Industrials", "Quadres Elèctrics Intel·ligents i Relés Industrials", "Koadro Elektriko Adimendunak eta Errele Industrialak", "لوحات كهربائية ذكية ومرحلات صناعية", "Quadros Elétricos Inteligentes e Relés Industriais", "Armoires Électriques Intelligentes & Relais Industriels", "Smarte Schaltschränke & Industrie-Relais", "Quadri Elettrici Intelligenti e Relè Industriali"),
    "desc": ("Módulos de carril DIN instalados directamente en el cuadro eléctrico general del club. Fabricados bajo normativa europea para soportar cargas continuas y maniobras exigentes.",
             "DIN-rail modules installed directly into the club's primary distribution panel. European-certified to withstand heavy continuous industrial duty.",
             "Módulos de carril DIN instalados directamente no cadro eléctrico xeral do club. Fabricados baixo normativa europea para soportar cargas continuas e maniobras esixentes.",
             "Mòduls de carril DIN instal·lats directament al quadre elèctric general del club. Fabricats sota normativa europea per suportar càrregues contínues i maniobres exigents.",
             "Mòduls de carril DIN instal·lats directament al quadre elèctric general del club. Fabricats sota normativa europea per suportar càrregues contínues i maniobres exigents.",
             "Klubeko koadro elektriko orokorrean zuzenean instalatutako DIN errail-moduluak. Europako araudiaren arabera fabrikatuta, etengabeko karga handiak eta maniobra zorrotzak jasateko.",
             "وحدات مثبتة على سكك DIN في اللوحة الكهربائية الرئيسية للنادي. مصنعة وفق المعايير الأوروبية لتحمل الأحمال الكهربائية المستمرة.",
             "Módulos de calha DIN instalados diretamente no quadro elétrico geral do clube. Fabricados sob normas europeias para suportar cargas contínuas.",
             "Modules sur rail DIN installés directement dans l'armoire électrique générale. Certifiés aux normes européennes pour supporter des charges industrielles continues.",
             "DIN-Hutschienen-Module direkt in der Hauptverteilung des Clubs. Zertifiziert nach EU-Normen für hohe Dauerlasten und anspruchsvolle Schaltzyklen.",
             "Moduli su guida DIN installati direttamente nel quadro elettrico generale del circolo. Certificati secondo normative europee per carichi industriali continui."),
    "kpi": ("Telemetría kWh en vivo", "Live kWh Telemetry", "Telemetría kWh en vivo", "Telemetria kWh en viu", "Telemetria kWh en viu", "Zuzeneko kWh Telemetria", "قياس استهلاك الكهرباء الفوري kWh", "Telemetria kWh em tempo real", "Télémétrie kWh en direct", "Live-kWh-Verbrauchsmessung", "Telemetria kWh in tempo reale"),
    "s0": ("Conexión dual Ethernet cableada y respaldo 4G LTE", "Dual wired Ethernet plus failover 4G LTE backup", "Conexión dual Ethernet cableada e respaldo 4G LTE", "Connexió dual Ethernet cablejada i suport 4G LTE", "Connexió dual Ethernet cablejada i suport 4G LTE", "Ethernet kabledun konexio bikoitza eta 4G LTE babes-lotura", "اتصال إيثرنت سلكي مزدوج مع خط احتياطي 4G LTE", "Ligação dupla Ethernet e redundância 4G LTE", "Double connexion Ethernet filaire et secours 4G LTE", "Duale Ethernet-Verkabelung mit 4G-LTE-Ausfallsicherung", "Doppia connessione Ethernet cablata e backup 4G LTE"),
    "s1": ("Medición de consumo eléctrico en kWh en tiempo real por pista", "Per-court real-time electricity consumption metering in kWh", "Medición de consumo eléctrico en kWh en tempo real por pista", "Mesurament de consum elèctric en kWh en temps real per pista", "Mesurament de consum elèctric en kWh en temps real per pista", "Pista bakoitzeko argi-kontsumoaren neurketa kWh-tan denbora errealean", "قياس استهلاك الكهرباء بالكيلوواط/ساعة لكل ملعب لحظياً", "Medição do consumo elétrico em kWh em tempo real por campo", "Mesure en temps réel de la consommation électrique par court en kWh", "Echtzeit-Stromverbrauchsmessung in kWh pro Platz", "Misurazione del consumo elettrico in kWh in tempo reale per campo"),
    "s2": ("Corte de emergencia y rearme automático desde el panel admin", "Emergency kill-switch and auto-reset via admin dashboard", "Corte de emerxencia e rearme automático desde o panel admin", "Tall d'emergència i rearmament automàtic des del tauler admin", "Tall d'emergència i rearmament automàtic des del tauler admin", "Larrialdiko etetea eta berrezarpen automatikoa administrazio-paneletik", "فصل طوارئ فوري وإعادة تشغيل تلقائي من لوحة التحكم", "Corte de emergência e rearme automático pelo painel admin", "Coupure d'urgence et réarmement automatique depuis l'espace admin", "Notabschaltung und automatischer Wiederanlauf über das Admin-Dashboard", "Stacco di emergenza e riarmo automatico dal pannello admin"),
    "s3": ("Compatibles con cualquier instalación eléctrica existente sin obras", "Drop-in retrofit compatible with existing panels (zero masonry)", "Compatibles con calquera instalación eléctrica existente sen obras", "Compatibles amb qualsevol instal·lació elèctrica existent sense obres", "Compatibles amb qualsevol instal·lació elèctrica existent sense obres", "Edozein instalazio elektriko existenterekin bateragarria obrarik gabe", "متوافقة تماماً مع أي شبكة كهربائية قائمة بدون أي أعمال بناء", "Compatíveis com qualquer instalação elétrica existente sem obras", "Compatibles avec toute installation existante sans travaux lourds", "Kompatibel mit jeder bestehenden Elektroinstallation ganz ohne Baumaßnahmen", "Compatibili con qualsiasi impianto elettrico esistente senza opere murarie")
}

for field, vals in [("badge", m_cuadro["badge"]), ("title", m_cuadro["title"]), ("desc", m_cuadro["desc"]), ("kpi", m_cuadro["kpi"])]:
    add_d(f"domotica.module.dom-cuadro.{field}", *vals)
for idx in range(4):
    add_d(f"domotica.module.dom-cuadro.specs.{idx}", *m_cuadro[f"s{idx}"])

print(f"dict_batch_domotica.py ready with {len(DOMOTICA_TRANSLATIONS)} keys!")
