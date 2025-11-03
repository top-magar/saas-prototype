// CSS Theme utilities for different app sections
export const themes = {
  marketing: {
    background: 'marketing-hero',
    heading: 'marketing-heading',
    subheading: 'marketing-subheading', 
    cta: 'marketing-cta',
    section: 'marketing-section',
    card: 'marketing-card',
    animation: 'marketing-fade-in',
  },
  dashboard: {
    layout: 'dashboard-layout',
    sidebar: 'dashboard-sidebar',
    main: 'dashboard-main',
    card: 'dashboard-card',
    metric: 'dashboard-metric',
    metricValue: 'dashboard-metric-value',
    metricLabel: 'dashboard-metric-label',
    table: 'dashboard-table',
    form: 'dashboard-form',
    btnPrimary: 'dashboard-btn-primary',
    btnSecondary: 'dashboard-btn-secondary',
  },
  global: {
    btnPrimary: 'btn-primary',
    btnSecondary: 'btn-secondary',
    cardElevated: 'card-elevated',
    container: 'container-responsive',
    section: 'section-padding',
    bgMutedSoft: 'bg-muted-soft',
    borderMutedSoft: 'border-muted-soft',
    bgCardSoft: 'bg-card-soft',
  },
} as const;

// Helper function to get theme classes
export function getThemeClasses(section: keyof typeof themes) {
  return themes[section];
}