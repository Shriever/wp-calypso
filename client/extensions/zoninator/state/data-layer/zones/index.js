import { translate } from 'i18n-calypso';
import page from 'page';
import {
	ZONINATOR_ADD_ZONE,
	ZONINATOR_DELETE_ZONE,
	ZONINATOR_REQUEST_ZONES,
	ZONINATOR_SAVE_ZONE,
} from 'zoninator/state/action-types';
import { http } from 'calypso/state/data-layer/wpcom-http/actions';
import { dispatchRequest } from 'calypso/state/data-layer/wpcom-http/utils';
import { errorNotice, removeNotice, successNotice } from 'calypso/state/notices/actions';
import { resetLock } from '../../locks/actions';
import {
	requestError,
	requestZones,
	updateZone,
	updateZoneError,
	updateZones,
} from '../../zones/actions';
import { zoneFromApi, zonesListFromApi } from './utils';

const settingsPath = '/extensions/zoninator';

const saveZoneNotice = 'zoninator-zone-create';
const deleteZoneNotice = 'zoninator-zone-delete';

export const requestZonesList = ( action ) =>
	http(
		{
			method: 'GET',
			path: `/jetpack-blogs/${ action.siteId }/rest-api/`,
			query: { path: '/zoninator/v1/zones' },
		},
		action
	);

export const requestZonesError = ( action ) => requestError( action.siteId );

export const updateZonesList = ( action, zonesList ) => updateZones( action.siteId, zonesList );

export const createZone = ( action ) => [
	removeNotice( saveZoneNotice ),
	http(
		{
			method: 'POST',
			path: `/jetpack-blogs/${ action.siteId }/rest-api/`,
			query: {
				body: JSON.stringify( action.data ),
				json: true,
				path: '/zoninator/v1/zones',
			},
		},
		action
	),
];

export const saveZone = ( action ) => [
	removeNotice( saveZoneNotice ),
	resetLock( action.siteId, action.zoneId ),
	http(
		{
			method: 'POST',
			path: `/jetpack-blogs/${ action.siteId }/rest-api/`,
			query: {
				body: JSON.stringify( action.data ),
				json: true,
				path: `/zoninator/v1/zones/${ action.zoneId }&_method=PUT`,
			},
		},
		action
	),
];

const announceZoneSaved = ( action, zone ) => [
	updateZone( action.siteId, zone.id, zone ),
	successNotice( translate( 'Zone saved!' ), { id: saveZoneNotice } ),
];

export const handleZoneCreated = ( action, zone ) => [
	() => page( `${ settingsPath }/zone/${ action.siteSlug }/${ zone.id }` ),
	...announceZoneSaved( action, zone ),
];

export const handleZoneSaved = ( action ) => [
	...announceZoneSaved( action, { id: action.zoneId, ...action.data } ),
];

export const announceSaveFailure = ( action ) => [
	updateZoneError( action.siteId ),
	errorNotice( translate( 'There was a problem saving the zone. Please try again.' ), {
		id: saveZoneNotice,
	} ),
];

export const deleteZone = ( action ) => [
	removeNotice( deleteZoneNotice ),
	http(
		{
			method: 'POST',
			path: `/jetpack-blogs/${ action.siteId }/rest-api/`,
			query: { path: `/zoninator/v1/zones/${ action.zoneId }&_method=DELETE` },
		},
		action
	),
];

export const announceZoneDeleted = ( action ) => [
	() => page( `${ settingsPath }/${ action.siteSlug }` ),
	requestZones( action.siteId ),
	successNotice( translate( 'The zone has been deleted.' ), { id: deleteZoneNotice } ),
];

export const announceDeleteFailure = () =>
	errorNotice( translate( 'The zone could not be deleted. Please try again.' ), {
		id: deleteZoneNotice,
	} );

const dispatchFetchZonesRequest = dispatchRequest( {
	fetch: requestZonesList,
	onSuccess: updateZonesList,
	onError: requestZonesError,
	fromApi: zonesListFromApi,
} );

const dispatchAddZoneRequest = dispatchRequest( {
	fetch: createZone,
	onSuccess: handleZoneCreated,
	onError: announceSaveFailure,
	fromApi: zoneFromApi,
} );

const dispatchSaveZoneRequest = dispatchRequest( {
	fetch: saveZone,
	onSuccess: handleZoneSaved,
	onError: announceSaveFailure,
} );

const dispatchDeleteZoneRequest = dispatchRequest( {
	fetch: deleteZone,
	onSuccess: announceZoneDeleted,
	onError: announceDeleteFailure,
} );

export default {
	[ ZONINATOR_REQUEST_ZONES ]: [ dispatchFetchZonesRequest ],
	[ ZONINATOR_ADD_ZONE ]: [ dispatchAddZoneRequest ],
	[ ZONINATOR_SAVE_ZONE ]: [ dispatchSaveZoneRequest ],
	[ ZONINATOR_DELETE_ZONE ]: [ dispatchDeleteZoneRequest ],
};
