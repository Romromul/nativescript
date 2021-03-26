import { dirname, resolve } from 'path';

import { getPackageJson, getProjectRootPath } from './project';
import { error, info } from './log';
import { env } from '../';

import AndroidPlatform from '../platforms/android';
import iOSPlatform from '../platforms/ios';

export interface INativeScriptPlatform {
	getEntryPath?(): string;

	getDistPath?(): string;
}

export type Platform = Extract<keyof typeof platforms, string>;

const platforms: {
	[name: string]: INativeScriptPlatform;
} = {
	android: AndroidPlatform,
	ios: iOSPlatform,
};

/**
 * Utility to register a new supported platform.
 *
 * @param {string} name The name of the platform (eg. web, desktop)
 * @param platform A platform definition of the platform specifics
 */
export function addPlatform(name: string, platform: INativeScriptPlatform) {
	info(`Adding platform ${name}`, platform);
	platforms[name] = platform;
}

/**
 * Utility to get the currently targeted platform definition
 */
export function getPlatform(): INativeScriptPlatform {
	return platforms[getPlatformName()];
}

/**
 * Utility to get the currently targeted platform name
 */
export function getPlatformName(): Platform {
	if (env?.android) {
		return 'android';
	}

	if (env?.ios) {
		return 'ios';
	}

	// support custom platforms
	if (env?.platform) {
		if (platforms[env.platform]) {
			return env.platform;
		}

		throw error(`
			Invalid platform: ${env.platform}

			Valid platforms: ${Object.keys(platforms).join(', ')}
		`);
	}

	throw error(`
		You need to provide a target platform!

		Available platforms: ${Object.keys(platforms).join(', ')}

		Use --env.platform=<platform> or --env.android, --env.ios to specify the target platform.
	`);
}

/**
 * Utility to get the entry file path for the currently targeted platform
 */
export function getEntryPath() {
	const platform = getPlatform();

	// use platform specific entry path
	if (platform.getEntryPath) {
		return platform.getEntryPath();
	}

	// fallback to main field in package.json
	const packageJson = getPackageJson();

	return resolve(getProjectRootPath(), packageJson.main);
}

/**
 * Utility to get the entry file directory path for the currently targeted platform
 */
export function getEntryDirPath() {
	return dirname(getEntryPath());
}

/**
 * Utility to get the dist file path for the currently targeted platform
 */
export function getDistPath() {
	const platform = getPlatform();

	// use platform specific entry path
	if (platform.getDistPath) {
		return platform.getDistPath();
	}

	// fallback to a generic platforms/<platform>/dist folder
	return `platforms/${getPlatformName()}/dist`;
}

/**
 * Utility to get the absolute dist file path for the currently targeted platform
 */
export function getAbsoluteDistPath() {
	return resolve(getProjectRootPath(), getDistPath());
}
