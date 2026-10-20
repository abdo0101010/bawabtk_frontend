// Shared mock data for the Bawabtek prototype
import type { LucideIcon } from 'lucide-react';
import { BookOpen, BookMarked, BarChart3, QrCode, MessageSquare } from 'lucide-react';

export type CourseType = 'online' | 'offline';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface MindMapNode {
  id: string;
  label: string;
  summary: string;
  timestamp: number;
  position: [number, number];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  completed: boolean;
  notes: string;
  attachments: { name: string; size: string }[];
  videoSeconds: number;
  flashcards: Flashcard[];
  mindMapNodes: MindMapNode[];
}

export interface CenterSession {
  day: string;
  time: string;
  location: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  instructor: string;
  type: CourseType;
  progress: number;
  lessons: number;
  completedLessons: number;
  nextLesson: string;
  color: string;
  cover: string;
  lessonList: Lesson[];
  centerSession?: CenterSession;
}

export const COURSES: Course[] = [
  {
    id: 'c1',
    title: 'الفيزياء الحديثة',
    subtitle: 'الموجات والكوانتم',
    instructor: 'أ. كريم منصور',
    type: 'online',
    progress: 72,
    lessons: 24,
    completedLessons: 17,
    nextLesson: 'حالة الجسيم في صندوق',
    color: 'from-forest-600 to-jungle-500',
    cover: 'https://images.pexels.com/photos/9785612/pexels-photo-9785612.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    lessonList: [
      { id: 'l1-1', title: 'مقدمة في ميكانيكا الكم', duration: '18:24', completed: true, notes: 'مرحباً بكم في الكورس. هذا الدرس يقدم المفاهيم الأساسية لميكانيكا الكم وازدواجية الموجة والجسيم.', attachments: [{ name: 'مقدمة_الكم.pdf', size: '1.2 MB' }], videoSeconds: 1104, flashcards: [
        { id: 'f1-1a', front: 'ما هي ازدواجية الموجة والجسيم؟', back: 'ظاهرة تظهر فيها الجسيمات (كالإلكترونات) سلوك موجي أحياناً وجسيمي أحياناً أخرى، حسب طريقة القياس.' },
        { id: 'f1-1b', front: 'من اقترح مبدأ الارتياب؟', back: 'هايزنبرغ عام 1927 — لا يمكن تحديد موقع وزخم الجسيم بدقة في آن واحد.' },
        { id: 'f1-1c', front: 'ما وحدة ثابت بلانك h؟', back: '6.626 × 10⁻³⁴ جول·ثانية.' },
      ], mindMapNodes: [
        { id: 'm1-1a', label: 'ازدواجية الموجة', summary: 'الضوء والمادة يظهران سلوك موجي وجسيمي معاً.', timestamp: 120, position: [2, 1] },
        { id: 'm1-1b', label: 'مبدأ الارتياب', summary: 'هايزنبرغ: لا يمكن قياس الموقع والزخم بدقة متزامنة.', timestamp: 420, position: [-2, 0.5] },
        { id: 'm1-1c', label: 'ثابت بلانك', summary: 'الثابت الأساسي في ميكانيكا الكم h = 6.626e-34.', timestamp: 800, position: [0, -2] },
      ] },
      { id: 'l1-2', title: 'دالة الموجة', duration: '22:10', completed: true, notes: 'شرح دالة الموجة وتفسيرها الفيزيائي مع أمثلة عملية.', attachments: [], videoSeconds: 1330, flashcards: [
        { id: 'f1-2a', front: 'ماذا تمثل |ψ|²؟', back: 'كثافة احتمال وجود الجسيم عند نقطة معينة في الفراغ.' },
        { id: 'f1-2b', front: 'شرط التطبيع لدالة الموجة', back: 'تكامل |ψ|² على كامل الفراغ يجب أن يساوي 1.' },
      ], mindMapNodes: [
        { id: 'm1-2a', label: 'دالة الموجة ψ', summary: 'وصف رياضي للحالة الكمية للجسيم.', timestamp: 60, position: [0, 2] },
        { id: 'm1-2b', label: 'كثافة الاحتمال', summary: '|ψ|² تعطي احتمال وجود الجسيم.', timestamp: 600, position: [2, -1] },
        { id: 'm1-2c', label: 'التطبيع', summary: 'تكامل |ψ|² = 1 لضمان احتمال كلي يساوي 1.', timestamp: 1000, position: [-2, -1] },
      ] },
      { id: 'l1-3', title: 'معادلة شرودنغر', duration: '31:45', completed: true, notes: 'اشتقاق معادلة شرودنغر الخطية وحلولها للحالات المختلفة.', attachments: [{ name: 'شرودنغر_تمارين.pdf', size: '2.1 MB' }], videoSeconds: 1905, flashcards: [
        { id: 'f1-3a', front: 'صيغة معادلة شرودنغر المستقلة عن الزمن؟', back: '−(ℏ²/2m)∇²ψ + Vψ = Eψ' },
        { id: 'f1-3b', front: 'ما هو ℏ؟', back: 'ثابت بلانك المختزل h/2π.' },
      ], mindMapNodes: [
        { id: 'm1-3a', label: 'المعادلة الأساسية', summary: '−(ℏ²/2m)∇²ψ + Vψ = Eψ تصف الحالات الثابتة.', timestamp: 100, position: [0, 2] },
        { id: 'm1-3b', label: 'الجهد V', summary: 'دالة الجهد تحدد شكل الحلول ومستويات الطاقة.', timestamp: 800, position: [2, -1] },
        { id: 'm1-3c', label: 'مستويات الطاقة', summary: 'قيم E المسموحة تكون كمومة (مقطوعة).', timestamp: 1500, position: [-2, -1] },
      ] },
      { id: 'l1-4', title: 'بئر الجهد اللانهائي', duration: '26:30', completed: true, notes: 'حالة الجسيم المحصور في بئر جهد لانهائي ومستويات الطاقة.', attachments: [], videoSeconds: 1590, flashcards: [
        { id: 'f1-4a', front: 'مستويات الطاقة في البئر اللانهائي؟', back: 'En = n²π²ℏ²/(2mL²) حيث n = 1, 2, 3...' },
        { id: 'f1-4b', front: 'شرط الحدود في البئر اللانهائي؟', back: 'ψ = 0 عند الجدران x = 0 و x = L.' },
      ], mindMapNodes: [
        { id: 'm1-4a', label: 'الحدود', summary: 'ψ = 0 عند x = 0 و x = L.', timestamp: 120, position: [2, 1] },
        { id: 'm1-4b', label: 'مستويات الطاقة', summary: 'En = n²π²ℏ²/(2mL²).', timestamp: 700, position: [-2, 0] },
        { id: 'm1-4c', label: 'الدوال الموجية', summary: 'ψn = √(2/L) sin(nπx/L).', timestamp: 1200, position: [0, -2] },
      ] },
      { id: 'l1-5', title: 'حالة الجسيم في صندوق', duration: '24:15', completed: false, notes: 'تطبيق عملي على حالة الجسيم في صندوق وحساب القيم المتوقعة.', attachments: [{ name: 'صندوق_الجسيم.pdf', size: '1.8 MB' }], videoSeconds: 1455, flashcards: [
        { id: 'f1-5a', front: 'القيمة المتوقعة للموقع ⟨x⟩؟', back: 'L/2 للجسيم في بئر لانهائي متماثل.' },
        { id: 'f1-5b', front: 'القيمة المتوقعة للطاقة؟', back: 'En = n²π²ℏ²/(2mL²) — لا توجد قيم وسيطة.' },
      ], mindMapNodes: [
        { id: 'm1-5a', label: 'القيمة المتوقعة ⟨x⟩', summary: 'متوسط الموقع = L/2 للبئر المتماثل.', timestamp: 200, position: [2, 1] },
        { id: 'm1-5b', label: 'تطبيقات', summary: 'نمذجة الإلكترونات في الجزيئات الترافقية.', timestamp: 900, position: [-2, -1] },
        { id: 'm1-5c', label: 'القيم المتوقعة', summary: 'استخدام ψn لحساب ⟨x⟩ و ⟨p⟩ و ⟨E⟩.', timestamp: 1300, position: [0, 2] },
      ] },
    ],
  },
  {
    id: 'c2',
    title: 'الكيمياء العضوية',
    subtitle: 'المركبات والتفاعلات',
    instructor: 'أ. كريم منصور',
    type: 'offline',
    progress: 45,
    lessons: 18,
    completedLessons: 8,
    nextLesson: 'مجموعة الكربونيل',
    color: 'from-terra-500 to-terra-700',
    cover: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    lessonList: [
      { id: 'l2-1', title: 'مقدمة في الكيمياء العضوية', duration: '20:00', completed: true, notes: 'أساسيات الكيمياء العضوية والهياكل الجزيئية.', attachments: [], videoSeconds: 1200, flashcards: [
        { id: 'f2-1a', front: 'كم رابطة يكوّن الكربون؟', back: 'أربع روابط تساهمية دائماً.' },
        { id: 'f2-1b', front: 'الفرق بين الألكان والألكين؟', back: 'الألكان روابط أحادية، الألكين تحتوي رابطة مزدوجة C=C.' },
      ], mindMapNodes: [
        { id: 'm2-1a', label: 'الكربون', summary: 'يُكوّن 4 روابط تساهمية — أساس الكيمياء العضوية.', timestamp: 100, position: [0, 2] },
        { id: 'm2-1b', label: 'الألكانات', summary: 'روابط أحادية مشبعة، صيغة CnH2n+2.', timestamp: 500, position: [2, -1] },
        { id: 'm2-1c', label: 'الألكينات', summary: 'تحتوي رابطة مزدوجة C=C غير مشبعة.', timestamp: 900, position: [-2, -1] },
      ] },
      { id: 'l2-2', title: 'المركبات الأليفاتية', duration: '25:30', completed: true, notes: 'دراسة المركبات الأليفاتية وخصائصها.', attachments: [{ name: 'أليفاتية.pdf', size: '1.5 MB' }], videoSeconds: 1530, flashcards: [
        { id: 'f2-2a', front: 'ما هي المركبات الأليفاتية؟', back: 'مركبات عضوية ذات سلاسل كربونية مفتوحة غير حلقية.' },
      ], mindMapNodes: [
        { id: 'm2-2a', label: 'السلاسل المفتوحة', summary: 'مركبات أليفاتية: سلاسل خطية أو متفرعة.', timestamp: 150, position: [2, 1] },
        { id: 'm2-2b', label: 'الخصائص', summary: 'نقاط غليان منخفضة، ذوبانية محدودة في الماء.', timestamp: 800, position: [-2, 0] },
      ] },
      { id: 'l2-3', title: 'مجموعة الكربونيل', duration: '28:45', completed: false, notes: 'مجموعة الكربونيل وتفاعلاتها الكيميائية.', attachments: [], videoSeconds: 1725, flashcards: [
        { id: 'f2-3a', front: 'ما هي مجموعة الكربونيل؟', back: 'C=O — رابطة مزدوجة بين الكربون والأكسجين.' },
        { id: 'f2-3b', front: 'الفرق بين الكيتون والألدهيد؟', back: 'الألدهيد R-CHO، الكيتون R-CO-R (الكربون مرتبط بمجموعتين كربونيتين).' },
      ], mindMapNodes: [
        { id: 'm2-3a', label: 'الكربونيل C=O', summary: 'مجموعة وظيفية مركزية في الكيتونات والألدهيدات.', timestamp: 120, position: [0, 2] },
        { id: 'm2-3b', label: 'الألدهيدات', summary: 'R-CHO — الكربون مرتبط بـ H واحد على الأقل.', timestamp: 700, position: [2, -1] },
        { id: 'm2-3c', label: 'الكيتونات', summary: 'R-CO-R — الكربون مرتبط بمجموعتين كربونيتين.', timestamp: 1300, position: [-2, -1] },
      ] },
    ],
    centerSession: { day: 'السبت', time: '10:00 ص - 12:00 ظ', location: 'السنتر - الطابق الثاني · قاعة A' },
  },
  {
    id: 'c3',
    title: 'الأحياء الجزيئية',
    subtitle: 'الحمض النووي والوراثة',
    instructor: 'أ. كريم منصور',
    type: 'online',
    progress: 88,
    lessons: 20,
    completedLessons: 18,
    nextLesson: 'تعبير الجينات',
    color: 'from-jungle-500 to-forest-700',
    cover: 'https://images.pexels.com/photos/3825529/pexels-photo-3825529.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    lessonList: [
      { id: 'l3-1', title: 'بنية DNA', duration: '19:50', completed: true, notes: 'البنية الحلزونية المزدوجة للـ DNA.', attachments: [{ name: 'DNA_بنية.pdf', size: '1.3 MB' }], videoSeconds: 1190, flashcards: [
        { id: 'f3-1a', front: 'من اكتشف بنية DNA؟', back: 'واتسون وكريك عام 1953 بالاعتماد على صور فرانكلين بالأشعة السينية.' },
        { id: 'f3-1b', front: 'القواعد النيتروجينية في DNA؟', back: 'الأدنين (A) والغوانين (G) والسيتوسين (C) والثايمين (T).' },
      ], mindMapNodes: [
        { id: 'm3-1a', label: 'الحلزون المزدوج', summary: 'بنية watson-crick: خيطان ملتويان حول بعضهما.', timestamp: 100, position: [0, 2] },
        { id: 'm3-1b', label: 'القواعد النيتروجينية', summary: 'A-T و G-C ترابط بواسطة روابط هيدروجينية.', timestamp: 600, position: [2, -1] },
        { id: 'm3-1c', label: 'السكر والفوسفات', summary: 'العمود الفقري: سكر ديوكسيريبوز + فوسفات.', timestamp: 1000, position: [-2, -1] },
      ] },
      { id: 'l3-2', title: 'تعبير الجينات', duration: '23:40', completed: false, notes: 'آلية转录 وترجمة الجينات إلى بروتينات.', attachments: [], videoSeconds: 1420, flashcards: [
        { id: 'f3-2a', front: 'ما هو الترجمة (Translation)؟', back: 'تحويل تسلسل mRNA إلى بروتين على الريبوسوم.' },
        { id: 'f3-2b', front: 'الفرق بين转录 والترجمة؟', back: 'النسخ: DNA→mRNA في النواة. الترجمة: mRNA→بروتين في الريبوسوم.' },
      ], mindMapNodes: [
        { id: 'm3-2a', label: 'النسخ (Transcription)', summary: 'DNA → mRNA في النواة بواسطة RNA polymerase.', timestamp: 200, position: [2, 1] },
        { id: 'm3-2b', label: 'الترجمة (Translation)', summary: 'mRNA → بروتين على الريبوسوم.', timestamp: 800, position: [-2, 0] },
        { id: 'm3-2c', label: 'الشفرة الوراثية', summary: 'كل كودون (3 قواعد) يرمز لحامض أميني.', timestamp: 1300, position: [0, -2] },
      ] },
    ],
  },
  {
    id: 'c4',
    title: 'الرياضيات التطبيقية',
    subtitle: 'التفاضل والتكامل',
    instructor: 'أ. كريم منصور',
    type: 'offline',
    progress: 30,
    lessons: 30,
    completedLessons: 9,
    nextLesson: 'تكامل بالتجزئة',
    color: 'from-forest-700 to-forest-500',
    cover: 'https://images.pexels.com/photos/6238121/pexels-photo-6238121.jpeg?auto=compress&cs=tinysrgb&h=400&w=600',
    lessonList: [
      { id: 'l4-1', title: 'مقدمة في التفاضل', duration: '22:00', completed: true, notes: 'مفاهيم النهايات والمشتقات.', attachments: [], videoSeconds: 1320, flashcards: [
        { id: 'f4-1a', front: 'تعريف المشتقة كنهاية؟', back: "f'(x) = lim(h→0) [f(x+h) − f(x)] / h" },
        { id: 'f4-1b', front: 'مشتقة x^n؟', back: "n·x^(n−1)" },
      ], mindMapNodes: [
        { id: 'm4-1a', label: 'النهايات', summary: 'القيمة التي تقترب منها الدالة عند اقتراب x من نقطة.', timestamp: 150, position: [0, 2] },
        { id: 'm4-1b', label: 'تعريف المشتقة', summary: "f'(x) = lim(h→0) [f(x+h) − f(x)] / h.", timestamp: 700, position: [2, -1] },
        { id: 'm4-1c', label: 'قواعد الاشتقاق', summary: 'قاعدة القوة، القاعدة، قاعدة الجداء، قاعدة القسمة.', timestamp: 1100, position: [-2, -1] },
      ] },
      { id: 'l4-2', title: 'تكامل بالتجزئة', duration: '30:15', completed: false, notes: 'تقنية التكامل بالتجزئة مع أمثلة متنوعة.', attachments: [{ name: 'تكامل_تجزئة.pdf', size: '2.5 MB' }], videoSeconds: 1815, flashcards: [
        { id: 'f4-2a', front: 'صيغة التكامل بالتجزئة؟', back: '∫u dv = uv − ∫v du' },
        { id: 'f4-2b', front: 'متى نستخدم التكامل بالتجزئة؟', back: 'عندما يكون التكامل منتج دالتين يسهل اشتقاق إحداهما وتكامل الأخرى.' },
      ], mindMapNodes: [
        { id: 'm4-2a', label: 'الصيغة الأساسية', summary: '∫u dv = uv − ∫v du.', timestamp: 120, position: [0, 2] },
        { id: 'm4-2b', label: 'اختيار u و dv', summary: 'قاعدة LIATE: اختيار u حسب الأولوية اللوغاريتم، الدالة العكسية، الجبرية، المثلثية، الأسية.', timestamp: 800, position: [2, -1] },
        { id: 'm4-2c', label: 'أمثلة', summary: '∫x·e^x dx و ∫ln(x) dx أمثلة كلاسيكية.', timestamp: 1400, position: [-2, 0] },
      ] },
    ],
    centerSession: { day: 'الأحد', time: '4:00 م - 6:00 م', location: 'السنتر - الطابق الأول · قاعة C' },
  },
];

export interface FeatureCard {
  id: string;
  title: string;
  desc: string;
  icon: LucideIcon;
}

export const FEATURES: FeatureCard[] = [
  {
    id: 'f1',
    title: 'كورسات أونلاين',
    desc: 'محتوى مرئي تفاعلي عالي الجودة مع متابعة لحظية لتقدّمك.',
    icon: BookOpen,
  },
  {
    id: 'f2',
    title: 'حضور بالباركود',
    desc: 'باركود خاص لكل طالب يُسجَّل حضوره في المركز بثوانٍ.',
    icon: QrCode,
  },
  {
    id: 'f3',
    title: 'تقارير واتساب',
    desc: 'تنبيهات آلية لولي الأمر بالدرجات والحضور عبر واتساب.',
    icon: MessageSquare,
  },
];

export interface StudentInfo {
  name: string;
  grade: string;
  avatar: string;
  parentPhone: string;
  email: string;
  barcode: string;
  joined: string;
}

export const STUDENT: StudentInfo = {
  name: 'ليث الحسيني',
  grade: 'الصف الثالث الثانوي',
  avatar: 'https://images.pexels.com/photos/5308640/pexels-photo-5308640.jpeg?auto=compress&cs=tinysrgb&h=300&w=300',
  parentPhone: '+963 944 123 456',
  email: 'laith.h@bawabtek.edu',
  barcode: 'BW-2026-0007-LH',
  joined: 'سبتمبر 2025',
};

export interface ScannerStudent {
  id: string;
  name: string;
  grade: string;
  avatar: string;
  enrolled: boolean;
  barcode: string;
}

export const SCANNER_STUDENTS: ScannerStudent[] = [
  {
    id: 's1',
    name: 'ليث الحسيني',
    grade: 'ثالث ثانوي علمي',
    avatar: 'https://images.pexels.com/photos/5308640/pexels-photo-5308640.jpeg?auto=compress&cs=tinysrgb&h=300&w=300',
    enrolled: true,
    barcode: 'BW-2026-0007-LH',
  },
  {
    id: 's2',
    name: 'ميرا عبد الله',
    grade: 'ثالث ثانوي أدبي',
    avatar: 'https://images.pexels.com/photos/16160855/pexels-photo-16160855.jpeg?auto=compress&cs=tinysrgb&h=300&w=300',
    enrolled: true,
    barcode: 'BW-2026-0011-MR',
  },
  {
    id: 's3',
    name: 'زياد قاسم',
    grade: 'ثاني ثانوي',
    avatar: 'https://images.pexels.com/photos/6942776/pexels-photo-6942776.jpeg?auto=compress&cs=tinysrgb&h=300&w=300',
    enrolled: false,
    barcode: 'BW-2026-0042-ZK',
  },
  {
    id: 's4',
    name: 'جواد سالم',
    grade: 'ثالث ثانوي علمي',
    avatar: 'https://images.pexels.com/photos/16105554/pexels-photo-16105554.jpeg?auto=compress&cs=tinysrgb&h=300&w=300',
    enrolled: true,
    barcode: 'BW-2026-0019-JS',
  },
];

export const STATS = [
  { label: 'كورسات نشطة', value: 4, icon: BookMarked },
  { label: 'ساعات مكتملة', value: 86, icon: BarChart3 },
  { label: 'حضور هذا الشهر', value: 14, icon: QrCode },
  { label: 'متوسط الدرجات', value: 92, icon: BarChart3 },
];

/* ===== Teacher Dashboard data ===== */

export interface TeacherCourse {
  id: string;
  title: string;
  subtitle: string;
  type: CourseType;
  gradeLevel: string;
  price: number;
  students: number;
  revenue: number;
  lessons: number;
  cover: string;
  published: boolean;
}

export const TEACHER_COURSES: TeacherCourse[] = [
  {
    id: 'tc1',
    title: 'الفيزياء الحديثة',
    subtitle: 'الموجات والكوانتم',
    type: 'online',
    gradeLevel: 'الصف الثالث الثانوي',
    price: 450,
    students: 142,
    revenue: 63900,
    lessons: 24,
    cover: 'https://images.pexels.com/photos/531817/pexels-photo-531817.jpeg?auto=compress&cs=tinysrgb&h=300&w=450',
    published: true,
  },
  {
    id: 'tc2',
    title: 'الكيمياء العضوية',
    subtitle: 'المركبات والتفاعلات',
    type: 'offline',
    gradeLevel: 'الصف الثاني الثانوي',
    price: 600,
    students: 68,
    revenue: 40800,
    lessons: 18,
    cover: 'https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&h=300&w=450',
    published: true,
  },
  {
    id: 'tc3',
    title: 'الأحياء الجزيئية',
    subtitle: 'الحمض النووي والوراثة',
    type: 'online',
    gradeLevel: 'الصف الثالث الثانوي',
    price: 350,
    students: 95,
    revenue: 33250,
    lessons: 20,
    cover: 'https://images.pexels.com/photos/3825529/pexels-photo-3825529.jpeg?auto=compress&cs=tinysrgb&h=300&w=450',
    published: true,
  },
  {
    id: 'tc4',
    title: 'الرياضيات التطبيقية',
    subtitle: 'التفاضل والتكامل',
    type: 'offline',
    gradeLevel: 'الصف الأول الثانوي',
    price: 500,
    students: 53,
    revenue: 26500,
    lessons: 30,
    cover: 'https://images.pexels.com/photos/6238121/pexels-photo-6238121.jpeg?auto=compress&cs=tinysrgb&h=300&w=450',
    published: false,
  },
];

export interface AttendanceLog {
  id: string;
  studentName: string;
  avatar: string;
  course: string;
  barcode: string;
  gradeLevel: string;
  dateTime: string;
  time: string;
  status: 'present' | 'absent';
  whatsappSent: 'sent' | 'pending' | 'failed';
}

export const INITIAL_ATTENDANCE: AttendanceLog[] = [
  {
    id: 'a1',
    studentName: 'ليث الحسيني',
    avatar: 'https://images.pexels.com/photos/5308640/pexels-photo-5308640.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
    course: 'الكيمياء العضوية',
    barcode: 'BW-2026-0007-LH',
    gradeLevel: 'الصف الثالث الثانوي',
    dateTime: '2026-10-18',
    time: '08:01:14',
    status: 'present',
    whatsappSent: 'sent',
  },
  {
    id: 'a2',
    studentName: 'ميرا عبد الله',
    avatar: 'https://images.pexels.com/photos/16160855/pexels-photo-16160855.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
    course: 'الكيمياء العضوية',
    barcode: 'BW-2026-0011-MR',
    gradeLevel: 'الصف الثاني الثانوي',
    dateTime: '2026-10-18',
    time: '08:03:42',
    status: 'present',
    whatsappSent: 'sent',
  },
  {
    id: 'a3',
    studentName: 'جواد سالم',
    avatar: 'https://images.pexels.com/photos/16105554/pexels-photo-16105554.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
    course: 'الرياضيات التطبيقية',
    barcode: 'BW-2026-0019-JS',
    gradeLevel: 'الصف الأول الثانوي',
    dateTime: '2026-10-17',
    time: '09:12:05',
    status: 'present',
    whatsappSent: 'pending',
  },
  {
    id: 'a4',
    studentName: 'سارة الخطيب',
    avatar: 'https://images.pexels.com/photos/16160855/pexels-photo-16160855.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
    course: 'الفيزياء الحديثة',
    barcode: 'BW-2026-0023-SK',
    gradeLevel: 'الصف الثالث الثانوي',
    dateTime: '2026-10-17',
    time: '10:45:30',
    status: 'absent',
    whatsappSent: 'failed',
  },
];

export const LIVE_CHECKIN_POOL: Omit<AttendanceLog, 'id' | 'time' | 'dateTime'>[] = [
  {
    studentName: 'جواد سالم',
    avatar: 'https://images.pexels.com/photos/16105554/pexels-photo-16105554.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
    course: 'الرياضيات التطبيقية',
    barcode: 'BW-2026-0019-JS',
    gradeLevel: 'الصف الأول الثانوي',
    status: 'present',
    whatsappSent: 'pending',
  },
  {
    studentName: 'سارة الخطيب',
    avatar: 'https://images.pexels.com/photos/16160855/pexels-photo-16160855.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
    course: 'الفيزياء الحديثة',
    barcode: 'BW-2026-0023-SK',
    gradeLevel: 'الصف الثالث الثانوي',
    status: 'present',
    whatsappSent: 'sent',
  },
  {
    studentName: 'آرام يوسف',
    avatar: 'https://images.pexels.com/photos/6942776/pexels-photo-6942776.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
    course: 'الكيمياء العضوية',
    barcode: 'BW-2026-0031-AY',
    gradeLevel: 'الصف الثاني الثانوي',
    status: 'present',
    whatsappSent: 'sent',
  },
  {
    studentName: 'هند مصطفى',
    avatar: 'https://images.pexels.com/photos/5308640/pexels-photo-5308640.jpeg?auto=compress&cs=tinysrgb&h=120&w=120',
    course: 'الرياضيات التطبيقية',
    barcode: 'BW-2026-0028-HM',
    gradeLevel: 'الصف الثالث الثانوي',
    status: 'present',
    whatsappSent: 'pending',
  },
];

export const REVENUE_WEEK = [
  { day: 'السبت', value: 3200 },
  { day: 'الأحد', value: 4800 },
  { day: 'الاثنين', value: 4100 },
  { day: 'الثلاثاء', value: 6200 },
  { day: 'الأربعاء', value: 5400 },
  { day: 'الخميس', value: 7800 },
  { day: 'الجمعة', value: 2400 },
];

export const TEACHER = {
  name: 'أ. كريم منصور',
  role: 'معلّم · فيزياء وكيمياء',
  avatar: 'https://images.pexels.com/photos/8617725/pexels-photo-8617725.jpeg?auto=compress&cs=tinysrgb&h=200&w=200',
};

/* ===== Dashboard Stats & Service Layer ===== */

export interface DashboardStats {
  totalStudents: number;
  totalRevenue: number;
  publishedCourses: number;
  pendingCourses: number;
  attendanceRate: number;
  studentsDelta: string;
  revenueDelta: string;
  coursesDelta: string;
  attendanceDelta: string;
}

export interface TeacherProfile {
  name: string;
  role: string;
  avatar: string;
}

export interface DashboardData {
  teacher: TeacherProfile;
  courses: TeacherCourse[];
  attendance: AttendanceLog[];
  stats: DashboardStats;
  revenueWeek: { day: string; value: number }[];
}

export const GRADE_LEVELS = [
  'الصف الأول الثانوي',
  'الصف الثاني الثانوي',
  'الصف الثالث الثانوي',
];

export const RELATION_TYPES = ['الأب', 'الأم', 'الأخ', 'أخرى'];

export function formatEGP(value: number): string {
  return new Intl.NumberFormat('ar-EG').format(value);
}

export async function fetchTeacherDashboardData(): Promise<DashboardData> {
  await new Promise((r) => setTimeout(r, 500));
  const publishedCount = TEACHER_COURSES.filter((c) => c.published).length;
  const pendingCount = TEACHER_COURSES.filter((c) => !c.published).length;
  const totalStudents = TEACHER_COURSES.reduce((s, c) => s + c.students, 0);
  const totalRevenue = TEACHER_COURSES.reduce((s, c) => s + c.revenue, 0);
  return {
    teacher: TEACHER,
    courses: TEACHER_COURSES,
    attendance: INITIAL_ATTENDANCE,
    revenueWeek: REVENUE_WEEK,
    stats: {
      totalStudents,
      totalRevenue,
      publishedCourses: publishedCount,
      pendingCourses: pendingCount,
      attendanceRate: 94,
      studentsDelta: '+24 هذا الشهر',
      revenueDelta: '+12% عن الشهر الماضي',
      coursesDelta: `${pendingCount} قيد المراجعة`,
      attendanceDelta: 'هذا الأسبوع',
    },
  };
}
