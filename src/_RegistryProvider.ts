import Promise from 'dojo-core/Promise';

import {
	ActionLike,
	CombinedRegistry,
	StoreLike,
	WidgetLike
} from './createApp';

/**
 * Registry to (asynchronously) get instances by their ID.
 */
export interface Registry<T> {
	/**
	 * Asynchronously get an instance by its ID.
	 *
	 * @param id Identifier for the instance that is to be retrieved
	 * @return A promise for the instance. The promise rejects if no instance was found.
	 */
	get(id: string): Promise<T>;
}

/**
 * Provides access to read-only registries for actions, stores and widgets.
 */
export default class RegistryProvider {
	private actionRegistry: Registry<ActionLike>;
	private storeRegistry: Registry<StoreLike>;
	private widgetRegistry: Registry<WidgetLike>;

	private combinedRegistry: CombinedRegistry;
	constructor(combinedRegistry: CombinedRegistry) {
		this.combinedRegistry = combinedRegistry;
	}

	/**
	 * Get an action, store or widget registry.
	 *
	 * @param type The type of registry that is required.
	 * @return The registry.
	 */
	get(type: 'actions'): Registry<ActionLike>;
	get(type: 'stores'): Registry<StoreLike>;
	get(type: 'widgets'): Registry<WidgetLike>;
	get(type: string): Registry<any>;
	get(type: string): Registry<any> {
		switch (type) {
			case 'actions':
				return this.actionRegistry || (this.actionRegistry = {
					get: this.combinedRegistry.getAction
				});
			case 'stores':
				return this.storeRegistry || (this.storeRegistry = {
					get: this.combinedRegistry.getStore
				});
			case 'widgets':
				return this.widgetRegistry || (this.widgetRegistry = {
					get: this.combinedRegistry.getWidget
				});
			default:
				throw new Error(`No such store: ${type}`);
		}
	}
}
