export type ModuleStatus = 'active' | 'coming-soon';

export interface DashboardModule {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  status: ModuleStatus;
  color: string; // Tailwind color class e.g. 'blue', 'green'
}

// The 8 planned modules — export this constant
export const DASHBOARD_MODULES: DashboardModule[] = [
  { id: 'newspaper', name: 'Daily Newspaper', description: 'Read CSS-relevant news filtered by AI', icon: '📰', route: '/news', status: 'active', color: 'blue' },
  { id: 'mcq', name: 'MCQ Engine', description: 'Practice multiple choice questions offline', icon: '📝', route: '/mcq', status: 'coming-soon', color: 'green' },
  { id: 'vocabulary', name: 'Vocabulary Tracker', description: 'Track and memorize difficult words', icon: '📖', route: '/vocabulary', status: 'coming-soon', color: 'purple' },
  { id: 'quote-vault', name: 'Quote & Data Vault', description: 'Memorize quotes with spaced repetition', icon: '💎', route: '/quotes', status: 'coming-soon', color: 'amber' },
  { id: 'timeline', name: 'Current Affairs Timeline', description: 'Visual timeline of current events', icon: '📅', route: '/timeline', status: 'coming-soon', color: 'red' },
  { id: 'whos-who', name: "Who's Who Tracker", description: 'Key officials and appointments directory', icon: '👤', route: '/whos-who', status: 'coming-soon', color: 'teal' },
  { id: 'data-dashboard', name: 'Pakistan Data Dashboard', description: 'Key statistics with sparkline trends', icon: '📊', route: '/data', status: 'coming-soon', color: 'indigo' },
  { id: 'important-days', name: 'Important Days & Dates', description: 'Calendar of nationally observed days', icon: '🗓️', route: '/dates', status: 'coming-soon', color: 'rose' },
];
