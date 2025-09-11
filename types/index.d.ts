// TypeScript definitions for Kids Tasks Card components

declare global {
  const __DEV__: boolean;
  const __PROD__: boolean;

  interface Window {
    KidsTasksUtils?: typeof KidsTasksUtils;
    KidsTasksStyleManager?: KidsTasksStyleManagerV2;
    KidsTasksPerformanceMonitor?: KidsTasksPerformanceMonitor;
    KidsTasksCard?: typeof KidsTasksCard;
    KidsTasksChildCard?: typeof KidsTasksChildCard;
    KidsTasksBaseCard?: typeof KidsTasksBaseCard;
    ktPerf?: {
      report(): PerformanceReport | null;
      toggle(): void;
      clear(): void;
    };
    ktLogger?: KidsTasksLogger;
    ktDebug?: () => void;
    KidsTasksDebug?: {
      reloadCard(cardElement: HTMLElement): void;
      reloadAllCards(): void;
      inspectCard(cardElement: HTMLElement): void;
    };
  }
}

// Home Assistant types
export interface HomeAssistant {
  states: { [entity_id: string]: HassEntity };
  config: HassConfig;
  themes: { [theme_name: string]: any };
  selectedTheme: string | null;
  panels: { [panel_key: string]: any };
  panelUrl: string;
  language: string;
  locale: HassLocale;
  resources: { [resource_id: string]: any };
  translationMetadata: { [key: string]: any };
  suspendWhenHidden: boolean;
  enableShortcuts: boolean;
  moreInfoEntityId: string | null;
  user: HassUser;
  userData?: { [key: string]: any };
  hassUrl(path?: string): string;
  callService(
    domain: string,
    service: string,
    serviceData?: { [key: string]: any },
    target?: { [key: string]: any }
  ): Promise<any>;
  callWS(msg: { [key: string]: any }): Promise<any>;
  sendWS(msg: { [key: string]: any }): void;
  connection: any;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: { [key: string]: any };
  context: HassContext;
  last_changed: string;
  last_updated: string;
}

export interface HassContext {
  id: string;
  parent_id?: string;
  user_id?: string;
}

export interface HassConfig {
  latitude: number;
  longitude: number;
  elevation: number;
  unit_system: {
    length: string;
    mass: string;
    volume: string;
    temperature: string;
  };
  location_name: string;
  time_zone: string;
  components: string[];
  config_dir: string;
  allowlist_external_dirs: string[];
  allowlist_external_urls: string[];
  version: string;
  config_source: string;
  recovery_mode: boolean;
  state: 'NOT_RUNNING' | 'STARTING' | 'RUNNING' | 'STOPPING' | 'FINAL_WRITE';
  external_url: string | null;
  internal_url: string | null;
}

export interface HassUser {
  id: string;
  name: string;
  is_owner: boolean;
  is_admin: boolean;
  credentials: Array<{
    auth_provider_type: string;
    auth_provider_id: string;
  }>;
  mfa_modules: Array<{
    id: string;
    name: string;
    enabled: boolean;
  }>;
}

export interface HassLocale {
  language: string;
  country: string | null;
  script: string | null;
  variant: string | null;
}

// Kids Tasks specific types
export interface KidsTasksCardConfig {
  type: 'custom:kids-tasks-card';
  title?: string;
  show_navigation?: boolean;
  show_completed?: boolean;
  show_rewards?: boolean;
  mode?: 'dashboard' | 'summary' | 'management';
  child_filter?: string[];
}

export interface KidsTasksChildCardConfig {
  type: 'custom:kids-tasks-child-card';
  child_id: string;
  title?: string;
  show_avatar?: boolean;
  show_progress?: boolean;
  show_rewards?: boolean;
  show_completed?: boolean;
}

export interface Child {
  id: string;
  name: string;
  points: number;
  coins: number;
  level: number;
  avatar: string;
  cosmetics?: {
    avatar?: { emoji: string };
    outfits?: any[];
  };
  [key: string]: any;
}

export interface Task {
  id: string;
  name: string;
  status: 'todo' | 'completed' | 'validated' | 'cancelled';
  points: number;
  coins: number;
  assigned_children: string[];
  completed_at?: string;
  validated_at?: string;
  icon?: string;
  category?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  [key: string]: any;
}

export interface Reward {
  id: string;
  name: string;
  description?: string;
  cost_points: number;
  cost_coins: number;
  icon?: string;
  category?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  available?: boolean;
  [key: string]: any;
}

export interface ChildStats {
  completedToday: number;
  totalToday: number;
  totalTasks: number;
  pointsEarned?: number;
  coinsEarned?: number;
}

export interface GlobalStats {
  totalTasks: number;
  completedToday: number;
  totalPoints: number;
  totalChildren: number;
}

// Performance monitoring types
export interface PerformanceMetrics {
  renderTimes: RenderMetric[];
  domUpdates: DOMUpdateMetric[];
  eventHandlers: EventHandlerMetric[];
  memoryUsage: MemoryMetric[];
  componentCounts: { [component: string]: { events: number } };
}

export interface RenderMetric {
  component: string;
  duration: number;
  timestamp: number;
}

export interface DOMUpdateMetric {
  operation: string;
  elementCount: number;
  timestamp: number;
}

export interface EventHandlerMetric {
  event: string;
  component: string;
  action: 'add' | 'remove';
  timestamp: number;
}

export interface MemoryMetric {
  used: number;
  total: number;
  limit: number;
  timestamp: number;
}

export interface PerformanceReport {
  summary: {
    uptime: number;
    avgRenderTime: number;
    totalRenders: number;
    domUpdates: number;
    memoryTrend: number;
    activeComponents: number;
  };
  details: {
    slowRenders: RenderMetric[];
    componentBreakdown: { [component: string]: { events: number } };
    memoryUsage: MemoryMetric[];
  };
}

// Component classes
export declare class KidsTasksBaseCard extends HTMLElement {
  protected _hass: HomeAssistant | undefined;
  protected _initialized: boolean;
  protected config: any;
  protected shadowRoot: ShadowRoot;

  // Performance and render optimization
  protected _lastRenderState: any;
  protected _renderDebounceTimer: number | null;
  protected _isRendering: boolean;
  protected _pendingRender: boolean;

  // Touch interaction
  protected _touchStates: WeakMap<Element, any>;
  protected _touchControllers: Map<string, AbortController>;
  protected _isMobile: boolean;

  set hass(hass: HomeAssistant);
  setConfig(config: any): void;
  render(): void;
  smartRender(force?: boolean): void;
  shouldUpdate(oldHass: HomeAssistant, newHass: HomeAssistant): boolean;
  handleAction(action: string, id?: string, event?: Event): void;
  handleClick(event: Event): void;
  
  protected _performRender(force?: boolean): void;
  protected _needsRender(): boolean;
  protected _getCurrentRenderState(): any;
  protected _updateRenderState(): void;
  protected _handleRenderError(error: Error): void;
  protected _cleanupTouchInteractions(): void;
  protected disconnectedCallback(): void;

  connectedCallback(): void;
  static getConfigElement(): HTMLElement;
  static getStubConfig(): any;
}

export declare class KidsTasksCard extends KidsTasksBaseCard {
  protected currentView: string;

  setConfig(config: KidsTasksCardConfig): void;
  render(): void;
  getChildren(): Child[];
  getChildStats(child: Child): ChildStats;
  calculateGlobalStats(children: Child[]): GlobalStats;
  
  protected renderNavigation(): string;
  protected renderCurrentView(children: Child[]): string;
  protected renderDashboard(children: Child[]): string;
  protected renderSummary(children: Child[]): string;
  protected renderManagement(children: Child[]): string;
  protected renderChildCard(child: Child): string;
}

export declare class KidsTasksChildCard extends KidsTasksBaseCard {
  protected currentTab: string;
  protected tasksFilter: string;
  protected rewardsFilter: string;
  protected _refreshTimeout: number | null;
  protected _allTimers: Set<number>;
  protected _lastDataHash: string | null;
  protected _isVisible: boolean;
  protected _refreshRate: number;

  setConfig(config: KidsTasksChildCardConfig): void;
  render(): void;
  getChild(): Child | null;
  getChildTasks(childId: string): Task[];
  getChildRewards(childId: string): Reward[];
  
  protected _setupSmartRefresh(): void;
  protected _scheduleNextRefresh(): void;
  protected _getDataHash(): string | null;
  protected _setupVisibilityDetection(): void;
  protected _removeVisibilityDetection(): void;
  protected _cleanupTimers(): void;
}

export declare class KidsTasksUtils {
  static detectMobileDevice(): boolean;
  static formatDuration(seconds: number): string;
  static formatDateTime(date: string | Date): string;
  static debounce<T extends (...args: any[]) => any>(func: T, wait: number): T;
  static throttle<T extends (...args: any[]) => any>(func: T, limit: number): T;
  static renderIcon(icon: string, className?: string): string;
  static emptySection(title: string, message: string, icon?: string): string;
  static formatPoints(points: number): string;
  static formatCoins(coins: number): string;
  static getStatusColor(status: string): string;
  static safeString(str: any): string;
  static isValidEntityId(entityId: string): boolean;
}

export declare class KidsTasksStyleManagerV2 {
  static injectGlobalStyles(): void;
  static getGlobalStyles(): string;
  static getCSSVariables(): { [key: string]: string };
  static getVariableCount(): number;
  
  protected static generateUtilityClasses(): string;
  protected static generateComponentStyles(): string;
  protected static generateResponsiveStyles(): string;
}

export declare class KidsTasksPerformanceMonitor {
  constructor();
  
  trackRender(componentName: string, startTime: number, endTime: number): void;
  trackDOMUpdate(operation: string, elementCount?: number): void;
  trackEventHandler(event: string, component: string, action?: 'add' | 'remove'): void;
  
  generateReport(): PerformanceReport | null;
  startProfile(name: string): { name: string; startTime: number } | null;
  endProfile(profile: { name: string; startTime: number } | null): number | void;
  toggle(enabled?: boolean): void;
  destroy(): void;
  
  wrapRender<T extends (...args: any[]) => any>(component: any, originalRender: T): T;
}

export declare class KidsTasksLogger {
  constructor();
  
  error(message: string, ...args: any[]): void;
  warn(message: string, ...args: any[]): void;
  info(message: string, ...args: any[]): void;
  debug(message: string, ...args: any[]): void;
  perf(component: string, action: string, duration: number): void;
  group(title: string, callback: () => void): void;
  
  toggleDebug(): void;
  setLevel(level: 'error' | 'warn' | 'info' | 'debug'): void;
}

export declare class KidsTasksErrorBoundary {
  constructor();
  
  handleComponentError(component: any, methodName: string, error: Error, args?: any[]): any;
  wrapComponent(component: any, methodName: string): void;
  getErrorStats(): {
    totalErrors: number;
    errorsByComponent: { [component: string]: number };
    recentErrors: any[];
  };
  clearErrors(): void;
}

export declare class KidsTasksAccessibility {
  constructor();
  
  announce(message: string, priority?: 'polite' | 'assertive'): void;
  enhanceCardAccessibility(card: HTMLElement): void;
  announceToUser(message: string, priority?: 'polite' | 'assertive'): void;
  enhanceCard(card: HTMLElement): void;
}

export declare class KidsTasksDOMDiffer {
  constructor();
  
  diff(element: Element, newHTML: string, oldHTML?: string): boolean;
  clearCache(element: Element): void;
  getCacheSize(): number;
}

// Editor components
export declare class KidsTasksCardEditor extends HTMLElement {
  hass: HomeAssistant;
  config: KidsTasksCardConfig;
  
  setConfig(config: KidsTasksCardConfig): void;
  configChanged(config: KidsTasksCardConfig): void;
}

export declare class KidsTasksChildCardEditor extends HTMLElement {
  hass: HomeAssistant;
  config: KidsTasksChildCardConfig;
  
  setConfig(config: KidsTasksChildCardConfig): void;
  configChanged(config: KidsTasksChildCardConfig): void;
}

// Utility functions
export declare function enhancedRender(element: HTMLElement, newHTML: string): boolean;
export declare function withErrorBoundary<T extends HTMLElement>(component: T): T;

export {};