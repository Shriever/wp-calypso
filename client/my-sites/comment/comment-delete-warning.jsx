import { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import Notice from 'calypso/components/notice';
import NoticeAction from 'calypso/components/notice/notice-action';
import {
	bumpStat,
	composeAnalytics,
	recordTracksEvent,
	withAnalytics,
} from 'calypso/state/analytics/actions';
import { deleteComment } from 'calypso/state/comments/actions';
import { getSiteComment } from 'calypso/state/comments/selectors';

const CommentDeleteWarning = ( { isLoading, destroyComment, translate } ) =>
	! isLoading && (
		<Notice
			status="is-warning"
			showDismiss={ false }
			text={ translate( 'Delete this comment permanently?' ) }
		>
			<NoticeAction icon="trash" onClick={ destroyComment }>
				{ 'Delete Permanently' }
			</NoticeAction>
		</Notice>
	);

CommentDeleteWarning.propTypes = {
	siteId: PropTypes.number,
	postId: PropTypes.number,
	commentId: PropTypes.number.isRequired,
	destroyComment: PropTypes.func.isRequired,
	redirectToPostView: PropTypes.func.isRequired,
	translate: PropTypes.func.isRequired,
};

const mapStateToProps = ( state, { siteId, commentId } ) => {
	const comment = getSiteComment( state, siteId, commentId );

	return {
		isLoading: typeof comment === 'undefined',
	};
};

const mapDispatchToProps = ( dispatch, { siteId, postId, commentId, redirectToPostView } ) => ( {
	destroyComment: () => {
		dispatch(
			withAnalytics(
				composeAnalytics(
					recordTracksEvent( 'calypso_comment_management_delete' ),
					bumpStat( 'calypso_comment_management', 'comment_deleted' )
				),
				deleteComment( siteId, postId, commentId )
			)
		);

		redirectToPostView();
	},
} );

export default connect( mapStateToProps, mapDispatchToProps )( localize( CommentDeleteWarning ) );
