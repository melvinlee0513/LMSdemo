import {
  Atom,
  Award,
  Beaker,
  BookMarked,
  BookOpen,
  Brain,
  Briefcase,
  Building2,
  Calculator,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock,
  Compass,
  FlaskConical,
  Globe,
  GraduationCap,
  Handshake,
  Heart,
  Highlighter,
  Languages,
  Laptop,
  Library,
  Lightbulb,
  LineChart,
  MapPin,
  Medal,
  MessageCircle,
  Microscope,
  NotebookPen,
  PenTool,
  Phone,
  Presentation,
  Puzzle,
  Ruler,
  ScrollText,
  Sigma,
  Sparkles,
  Star,
  Target,
  Timer,
  TrendingUp,
  Trophy,
  UserCheck,
  Users,
  Video,
  Zap,
  type LucideIcon,
} from "lucide-react";

import type { IconName } from "@/lib/icon-names";

/**
 * The icon vocabulary centres may reference by name in configuration.
 * Named imports keep tree-shaking intact — only these icons ship.
 */
const icons: Record<IconName, LucideIcon> = {
  atom: Atom,
  award: Award,
  beaker: Beaker,
  bookOpen: BookOpen,
  bookMarked: BookMarked,
  brain: Brain,
  briefcase: Briefcase,
  building: Building2,
  calculator: Calculator,
  calendarDays: CalendarDays,
  checkCircle: CheckCircle2,
  clipboardCheck: ClipboardCheck,
  clock: Clock,
  compass: Compass,
  flaskConical: FlaskConical,
  globe: Globe,
  graduationCap: GraduationCap,
  handshake: Handshake,
  heart: Heart,
  highlighter: Highlighter,
  languages: Languages,
  laptop: Laptop,
  library: Library,
  lightbulb: Lightbulb,
  lineChart: LineChart,
  mapPin: MapPin,
  medal: Medal,
  messageCircle: MessageCircle,
  microscope: Microscope,
  notebookPen: NotebookPen,
  penTool: PenTool,
  phone: Phone,
  presentation: Presentation,
  puzzle: Puzzle,
  ruler: Ruler,
  scrollText: ScrollText,
  sigma: Sigma,
  sparkles: Sparkles,
  star: Star,
  target: Target,
  timer: Timer,
  trendingUp: TrendingUp,
  trophy: Trophy,
  userCheck: UserCheck,
  users: Users,
  video: Video,
  zap: Zap,
};

export function getIcon(name: IconName): LucideIcon {
  return icons[name];
}

export function Icon({
  name,
  className,
  strokeWidth = 1.75,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  const Component = icons[name];
  return (
    <Component className={className} strokeWidth={strokeWidth} aria-hidden="true" />
  );
}
