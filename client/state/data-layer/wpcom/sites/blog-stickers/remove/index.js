import { translate } from 'i18n-calypso';
import React from 'react';
import { SITES_BLOG_STICKER_REMOVE } from 'calypso/state/action-types';
import { registerHandlers } from 'calypso/state/data-layer/handler-registry';
import { bypassDataLayer } from 'calypso/state/data-layer/utils';
import { http } from 'calypso/state/data-layer/wpcom-http/actions';
import { dispatchRequest } from 'calypso/state/data-layer/wpcom-http/utils';
import { errorNotice, plainNotice } from 'calypso/state/notices/actions';
import { addBlogSticker } from 'calypso/state/sites/blog-stickers/actions';

export const requestBlogStickerRemove = ( action ) =>
	http(
		{
			method: 'POST',
			path: `/sites/${ action.payload.blogId }/blog-stickers/remove/${ action.payload.stickerName }`,
			body: {}, // have to have an empty body to make wpcom-http happy
			apiVersion: '1.1',
		},
		action
	);

export const receiveBlogStickerRemoveError = ( action ) => [
	errorNotice( translate( 'Sorry, we had a problem removing that sticker. Please try again.' ) ),
	bypassDataLayer( addBlogSticker( action.payload.blogId, action.payload.stickerName ) ),
];

export const receiveBlogStickerRemove = ( action ) =>
	plainNotice(
		translate( 'The sticker {{i}}%s{{/i}} has been removed.', {
			args: action.payload.stickerName,
			components: {
				i: <i />,
			},
		} ),
		{
			duration: 5000,
		}
	);

export const fromApi = ( response ) => {
	if ( ! response.success ) {
		throw new Error( 'Blog sticker removal was unsuccessful on the server' );
	}

	return response;
};

registerHandlers( 'state/data-layer/wpcom/sites/blog-stickers/remove/index.js', {
	[ SITES_BLOG_STICKER_REMOVE ]: [
		dispatchRequest( {
			fetch: requestBlogStickerRemove,
			onSuccess: receiveBlogStickerRemove,
			onError: receiveBlogStickerRemoveError,
			fromApi,
		} ),
	],
} );
