import {
	SIGNUP_DEPENDENCY_STORE_UPDATE,
	SIGNUP_DEPENDENCY_STORE_REMOVE_SITE_SLUG,
	SIGNUP_PROGRESS_SUBMIT_STEP,
	SIGNUP_PROGRESS_COMPLETE_STEP,
	SIGNUP_COMPLETE_RESET,
} from 'calypso/state/action-types';
import { withSchemaValidation } from 'calypso/state/utils';
import { dependencyStoreSchema } from './schema';

const EMPTY = {};

function reducer( state = EMPTY, action ) {
	switch ( action.type ) {
		case SIGNUP_DEPENDENCY_STORE_UPDATE:
			return { ...state, ...action.dependencies };

		case SIGNUP_DEPENDENCY_STORE_REMOVE_SITE_SLUG: {
			const { siteSlug, ...dependenciesWithoutSiteSlug } = state;
			return dependenciesWithoutSiteSlug;
		}

		case SIGNUP_PROGRESS_SUBMIT_STEP:
		case SIGNUP_PROGRESS_COMPLETE_STEP: {
			const { providedDependencies } = action.step;
			if ( ! providedDependencies ) {
				return state;
			}
			return { ...state, ...providedDependencies };
		}

		case SIGNUP_COMPLETE_RESET:
			return EMPTY;

		default:
			return state;
	}
}

export default withSchemaValidation( dependencyStoreSchema, reducer );
