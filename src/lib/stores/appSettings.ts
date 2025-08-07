import { writable, derived } from 'svelte/store';
import { browser } from '$app/environment';

// Settings interface
interface AppSettings {
	theme: 'light' | 'dark' | 'auto';
	currency: 'php' | 'usd' | 'eur';
	tableDensity: 'comfortable' | 'compact' | 'cozy';
	fontFamily: 'inter' | 'roboto' | 'system';
	fontSize: 'small' | 'medium' | 'large';
	buttonStyle: 'rounded' | 'square' | 'pill';
	colorScheme: 'blue' | 'green' | 'purple' | 'orange';
	animationsEnabled: boolean;
	autoSave: boolean;
	showTooltips: boolean;
	compactMode: boolean;
	language: 'en' | 'ph';
}

// Default settings
const defaultSettings: AppSettings = {
	theme: 'light',
	currency: 'php',
	tableDensity: 'comfortable',
	fontFamily: 'inter',
	fontSize: 'medium',
	buttonStyle: 'rounded',
	colorScheme: 'blue',
	animationsEnabled: true,
	autoSave: true,
	showTooltips: true,
	compactMode: false,
	language: 'en'
};

// Storage key
const SETTINGS_STORAGE_KEY = 'propfit-app-settings';

// Create settings store
function createSettingsStore() {
	const { subscribe, set, update } = writable<AppSettings>(defaultSettings);

	return {
		subscribe,
		set,
		update,
		// Load settings from localStorage
		load: () => {
			if (browser) {
				try {
					const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
					if (stored) {
						const parsed = JSON.parse(stored);
						// Merge with defaults to handle new settings
						const merged = { ...defaultSettings, ...parsed };
						set(merged);
						return merged;
					}
				} catch (error) {
					console.warn('Failed to load settings from localStorage:', error);
				}
			}
			return defaultSettings;
		},
		// Save settings to localStorage
		save: (settings: AppSettings) => {
			if (browser) {
				try {
					localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
				} catch (error) {
					console.warn('Failed to save settings to localStorage:', error);
				}
			}
			set(settings);
		},
		// Update specific setting
		updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
			update((current) => {
				const updated = { ...current, [key]: value };
				if (browser) {
					try {
						localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
					} catch (error) {
						console.warn('Failed to save settings to localStorage:', error);
					}
				}
				return updated;
			});
		},
		// Reset to defaults
		reset: () => {
			if (browser) {
				localStorage.removeItem(SETTINGS_STORAGE_KEY);
			}
			set(defaultSettings);
		}
	};
}

export const appSettings = createSettingsStore();

// Derived stores for specific settings
export const currentTheme = derived(appSettings, ($settings) => $settings.theme);
export const currentCurrency = derived(appSettings, ($settings) => $settings.currency);
export const currentTableDensity = derived(appSettings, ($settings) => $settings.tableDensity);
export const currentFontFamily = derived(appSettings, ($settings) => $settings.fontFamily);
export const currentFontSize = derived(appSettings, ($settings) => $settings.fontSize);
export const currentButtonStyle = derived(appSettings, ($settings) => $settings.buttonStyle);
export const currentColorScheme = derived(appSettings, ($settings) => $settings.colorScheme);

// CSS class helpers
export const cssClasses = derived(appSettings, ($settings) => ({
	fontFamily: {
		inter: 'font-inter',
		roboto: 'font-roboto',
		system: 'font-system'
	}[$settings.fontFamily],
	fontSize: {
		small: 'text-sm',
		medium: 'text-base',
		large: 'text-lg'
	}[$settings.fontSize],
	buttonStyle: {
		rounded: 'rounded-lg',
		square: 'rounded-none',
		pill: 'rounded-full'
	}[$settings.buttonStyle],
	colorScheme: {
		blue: 'accent-blue',
		green: 'accent-green',
		purple: 'accent-purple',
		orange: 'accent-orange'
	}[$settings.colorScheme],
	tableDensity: {
		comfortable: 'table-comfortable',
		compact: 'table-compact',
		cozy: 'table-cozy'
	}[$settings.tableDensity]
}));

// Currency formatters
export const currencyFormatter = derived(currentCurrency, ($currency) => {
	const formatters = {
		php: (amount: number) => `₱${amount.toLocaleString('en-PH')}`,
		usd: (amount: number) => `$${amount.toLocaleString('en-US')}`,
		eur: (amount: number) => `€${amount.toLocaleString('de-DE')}`
	};
	return formatters[$currency];
});

// Export settings interface for TypeScript
export type { AppSettings };
