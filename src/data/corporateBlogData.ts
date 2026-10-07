import { BlogPost } from '../types/database';

export const CORPORATE_BLOG_POSTS: BlogPost[] = [
  {
    id: 'corp-blog-1',
    tenantId: 'corporate-setmio',
    title: 'Automatización de pistas y domótica IoT: Cómo reducir un 65% el gasto energético y operar 24/7',
    titleKey: 'corporateBlog.posts.post1.title',
    excerptKey: 'corporateBlog.posts.post1.summary',
    summaryKey: 'corporateBlog.posts.post1.summary',
    authorKey: 'corporateBlog.posts.post1.author',
    readingTimeKey: 'corporateBlog.posts.post1.readingTime',
    tagsKey: 'corporateBlog.posts.post1.tags',
    slug: 'automatizacion-pistas-domotica-iot-ahorro-energetico',
    summary: 'Guía técnica para instalaciones deportivas: control inteligente de focos LED con relés Shelly Pro y cerraduras Salto KS con códigos PIN dinámicos por reserva.',
    content: `La automatización de pistas deportivas mediante domótica IoT representa una de las mayores palancas de rentabilidad para los clubes de pádel en la actualidad. 

El modelo tradicional con recepcionista permanente para encender interruptores manuales y entregar llaves físicas genera costes fijos elevados y un consumo eléctrico descontrolado cuando las pistas quedan encendidas sin jugadores.

### 1. Control de iluminación con relés industriales Shelly Pro
Mediante la integración nativa de Setmio con relés Shelly Pro Ethernet/Wi-Fi instalados en el cuadro eléctrico de cada pista:
- **Encendido programado de cortesía:** Los focos LED se activan automáticamente 5 minutos antes del inicio de la reserva.
- **Apagado retardado de seguridad:** Se apagan tras 10 minutos de cortesía tras concluir el partido, permitiendo a los jugadores recoger su material sin quedar a oscuras.
- **Modo Fail-Safe local:** Los relés mantienen el temporizador programado en su memoria local, garantizando que los focos funcionen incluso si se interrumpe la conexión a internet.

### 2. Control de accesos autónomo con cerraduras Salto KS
Las cerraduras electromagnéticas y teclados antivandálicos Salto KS eliminan la necesidad de llaves físicas:
- **Código PIN dinámico único:** Al confirmarse la reserva (sea desde la web o la app del socio), el motor de Setmio genera un código PIN de 4 dígitos terminado en almohadilla (#).
- **Ventana temporal estricta:** El PIN solo abre la puerta de la pista desde 10 minutos antes hasta 10 minutos después de la franja horaria contratada.
- **Auditoría y trazabilidad en tiempo real:** Cada apertura queda registrada en los logs del panel de control de Setmio Pro.

### 3. Resultados operativos reales
Los clubes que han implementado la domótica integral de Setmio registran una reducción media del 65% en su factura de luz y la posibilidad de abrir horarios de juego no tripulados a primera hora de la mañana y medianoche sin incrementar personal.`,
    coverImage: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&w=1200&q=80',
    author: 'Equipo de Ingeniería Setmio IoT',
    category: 'Tecnología & Domótica',
    readingTime: 5,
    publishedAt: '2026-10-01T09:00:00Z',
  },
  {
    id: 'corp-blog-2',
    tenantId: 'corporate-setmio',
    title: 'Marca Blanca en Pádel: Por qué los clubes líderes apuestan por su propia App y web nativa',
    titleKey: 'corporateBlog.posts.post2.title',
    excerptKey: 'corporateBlog.posts.post2.summary',
    summaryKey: 'corporateBlog.posts.post2.summary',
    authorKey: 'corporateBlog.posts.post2.author',
    readingTimeKey: 'corporateBlog.posts.post2.readingTime',
    tagsKey: 'corporateBlog.posts.post2.tags',
    slug: 'marca-blanca-padel-app-propia-retencion-socios',
    summary: 'Descubre cómo blindar tu comunidad de jugadores eliminando intermediarios, comisiones por reserva y fugas de tráfico hacia clubes de la competencia.',
    content: `Durante años, muchas instalaciones deportivas dependieron de plataformas intermediarias y marketplaces agregadores para gestionar sus reservas. Sin embargo, los operadores profesionales han comprobado que este modelo debilita su identidad de marca y les hace perder el control directo sobre sus clientes.

### 1. El riesgo de los marketplaces de reservas
Cuando un socio reserva a través de un agregador genérico, la plataforma le muestra ofertas y disponibilidad de pistas de clubes rivales en la misma ciudad. El club paga comisiones recurrentes por clientes que ya eran suyos y pierde el canal de comunicación directo.

### 2. Los beneficios de la Marca Blanca Setmio Pro
Con Setmio, cada club dispone de un ecosistema tecnológico 100% personalizado:
- **Dominio web propio con certificado SSL:** Ejemplo: *reservas.tupadelclub.com*.
- **Paleta de colores y logotipo oficial:** La experiencia visual respira los colores corporativos del centro.
- **App Progresiva (PWA) instalable:** El icono del club en la pantalla de inicio del móvil del socio.
- **Sin comisiones por reserva:** El 100% de los ingresos de pistas, clases y torneos van directos a la cuenta bancaria del club.

### 3. Aumento del 40% en la retención de socios
Al unificar reservas, escuela, partidos abiertos Play! y tienda oficial bajo una misma marca del club, la tasa de recurrencia mensual aumenta significativamente.`,
    coverImage: 'https://images.unsplash.com/photo-1526676037777-05a232554f77?auto=format&fit=crop&w=1200&q=80',
    author: 'Consultoría SaaS Setmio',
    category: 'Gestión de Clubes',
    readingTime: 6,
    publishedAt: '2026-09-24T10:30:00Z',
  },
  {
    id: 'corp-blog-3',
    tenantId: 'corporate-setmio',
    title: 'Estrategias de pricing dinámico y monetización de horas valle para maximizar la ocupación',
    titleKey: 'corporateBlog.posts.post3.title',
    excerptKey: 'corporateBlog.posts.post3.summary',
    summaryKey: 'corporateBlog.posts.post3.summary',
    authorKey: 'corporateBlog.posts.post3.author',
    readingTimeKey: 'corporateBlog.posts.post3.readingTime',
    tagsKey: 'corporateBlog.posts.post3.tags',
    slug: 'pricing-dinamico-monetizacion-horas-valle-padel',
    summary: 'Aprende a balancear la demanda entre mañanas y noches mediante tarifas horarias diferenciadas, bonos monedero con saldo bonificado y partidos abiertos.',
    content: `El mayor desafío operativo de un club de pádel no es llenar las pistas entre las 18:00 y las 22:00, sino rentabilizar las horas de baja demanda de lunes a viernes por la mañana y primeras horas de la tarde.

### 1. Tarifas horarias automáticas (Peak vs. Off-Peak)
El motor de cuadrantes de Setmio permite configurar tarifas diferenciadas por franja:
- **Tarifa Valle (Off-Peak):** Precios atractivos para jubilados, teletrabajadores y estudiantes universitarios que pueden jugar antes de las 17:00.
- **Tarifa Pico (Peak):** Tarifa estándar o prémium en las franjas de máxima ocupación de tarde y fin de semana.

### 2. Bonos monedero con recarga incentivada
El monedero digital interno fideliza la tesorería del club:
- Recarga de 100 € con 10 € de saldo adicional de cortesía válido exclusivamente en horarios valle.
- Cobro dividido instantáneo entre los 4 jugadores, eliminando la incomodidad de cuadrar cambios en efectivo en el mostrador.

### 3. Partidos abiertos Play! para completar cuadrantes
Cuando a una reserva le faltan 1 o 2 jugadores, la función de partido abierto notifica a los jugadores del mismo nivel NSRP mediante WhatsApp o notificación push, logrando que ninguna pista quede vacía por cancelaciones de última hora.`,
    coverImage: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=1200&q=80',
    author: 'Área de Estrategia de Negocio Setmio',
    category: 'Finanzas & Ocupación',
    readingTime: 4,
    publishedAt: '2026-09-15T12:00:00Z',
  },
  {
    id: 'corp-blog-4',
    tenantId: 'corporate-setmio',
    title: 'Gestión integral de escuelas y torneos: Cómo eliminar el 80% de la carga administrativa',
    titleKey: 'corporateBlog.posts.post4.title',
    excerptKey: 'corporateBlog.posts.post4.summary',
    summaryKey: 'corporateBlog.posts.post4.summary',
    authorKey: 'corporateBlog.posts.post4.author',
    readingTimeKey: 'corporateBlog.posts.post4.readingTime',
    tagsKey: 'corporateBlog.posts.post4.tags',
    slug: 'gestion-escuelas-torneos-automatizacion-administrativa',
    summary: 'Centraliza grupos por nivel, disponibilidad de monitores, cobro recurrente SEPA y cuadros de torneos federados con brackets interactivos.',
    content: `La coordinación de una escuela de pádel con más de 100 alumnos y la organización de torneos de fin de semana suelen convertirse en una pesadilla logística si se gestionan con hojas de cálculo y mensajes dispersos de WhatsApp.

### 1. Módulo de Escuela y Academias Docentes
Setmio Pro automatiza el ciclo de vida formativo completo:
- **Filtro de alumnos por nivel y edad:** Grupos homogéneos de 4 alumnos para garantizar un entrenamiento de calidad.
- **Asignación de pistas y profesores:** Cuadrante visual de entrenadores para evitar solapamientos de horario.
- **Remesas bancarias SEPA automáticas:** Cobro de cuotas mensuales a principio de mes con un solo clic.

### 2. Módulo de Competición, Ligas y Torneos
Organizar torneos y ligas con Setmio es ágil y profesional:
- **Inscripción y pago online de parejas:** Cierre automático de inscripciones al alcanzar el cupo máximo.
- **Generación de cuadros y brackets:** Cuadros principales, consolación y cruces automáticos.
- **Publicación de resultados en directo:** Los participantes consultan sus horarios de partido y resultados desde su propio teléfono móvil.`,
    coverImage: 'https://images.unsplash.com/photo-1521537634581-0dced2fee2ef?auto=format&fit=crop&w=1200&q=80',
    author: 'Dpto. de Producto & Competición Setmio',
    category: 'Escuelas & Competición',
    readingTime: 5,
    publishedAt: '2026-09-08T15:30:00Z',
  },
];
