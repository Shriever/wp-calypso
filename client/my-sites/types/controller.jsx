import React from 'react';
import { mapPostStatus } from 'calypso/lib/route';
import { POST_STATUSES } from 'calypso/state/posts/constants';
import Types from './main';

export function list( context, next ) {
	const search = context.query.s;
	// When searching, search across all statuses so the user can always find
	// what they are looking for, regardless of what tab the search was
	// initiated from. Use POST_STATUSES rather than "any" to do this, since
	// the latter excludes trashed posts.
	const status = search ? POST_STATUSES.join( ',' ) : mapPostStatus( context.params.status );
	// Since searches are across all statuses, the status needs to be shown
	// next to each post.
	const showPublishedStatus = Boolean( search );

	context.primary = (
		<Types
			query={ {
				type: context.params.type,
				status,
				search,
			} }
			statusSlug={ context.params.status }
			showPublishedStatus={ showPublishedStatus }
		/>
	);

	next();
}
