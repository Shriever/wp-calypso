import { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import HeaderCake from 'calypso/components/header-cake';
import { getMimePrefix, filterItemsByMimePrefix, url } from 'calypso/lib/media/utils';
import { setEditorMediaModalView } from 'calypso/state/editor/actions';
import { ModalViews } from 'calypso/state/ui/media-modal/constants';
import preloadImage from '../preload-image';
import DetailItem from './detail-item';

import './style.scss';

const noop = () => {};

class EditorMediaModalDetailBase extends React.Component {
	static propTypes = {
		site: PropTypes.object,
		items: PropTypes.array,
		selectedIndex: PropTypes.number,
		onSelectedIndexChange: PropTypes.func,
		onReturnToList: PropTypes.func,
		onEdit: PropTypes.func,
		onRestoreItem: PropTypes.func,
		onUpdateItem: PropTypes.func,
	};

	static defaultProps = {
		selectedIndex: 0,
		onSelectedIndexChange: noop,
		onUpdateItem: noop,
	};

	componentDidMount() {
		this.preloadImages();
	}

	componentDidUpdate() {
		this.preloadImages();
	}

	preloadImages = () => {
		filterItemsByMimePrefix( this.props.items, 'image' ).forEach( function ( image ) {
			const src = url( image, {
				photon: this.props.site && ! this.props.site.is_private,
			} );

			preloadImage( src );
		}, this );
	};

	incrementIndex = ( increment ) => {
		this.props.onSelectedIndexChange( this.props.selectedIndex + increment );
	};

	render() {
		const {
			items,
			selectedIndex,
			site,
			backButtonText,
			onEditImageItem,
			onEditVideoItem,
			onRestoreItem,
			onUpdateItem,
			onReturnToList,
			translate,
		} = this.props;

		const item = items[ selectedIndex ];
		const mimePrefix = getMimePrefix( item );

		/* eslint-disable wpcalypso/jsx-classname-namespace */
		return (
			<div className="editor-media-modal-detail">
				<HeaderCake
					onClick={ onReturnToList }
					backText={ backButtonText ? backButtonText : translate( 'Media Library' ) }
				/>
				<DetailItem
					site={ site }
					item={ item }
					hasPreviousItem={ selectedIndex - 1 >= 0 }
					hasNextItem={ selectedIndex + 1 < items.length }
					onShowPreviousItem={ this.incrementIndex.bind( this, -1 ) }
					onShowNextItem={ this.incrementIndex.bind( this, 1 ) }
					onRestore={ onRestoreItem }
					onEdit={ 'video' === mimePrefix ? onEditVideoItem : onEditImageItem }
					onUpdate={ onUpdateItem }
				/>
			</div>
		);
		/* eslint-enable wpcalypso/jsx-classname-namespace */
	}
}

// Don't move `localize()` to the default export (below)! See comment there.
export const EditorMediaModalDetail = localize( EditorMediaModalDetailBase );

// The default export is only used by the post editor, which displays the image or
// video editor depending on Redux state, which is set by the actions below.
// In the Media library (i.e. `/media`) OTOH, we're explicitly passing `onEditImageItem`
// and `onEditVideoItem` as props to the _named_ export (above), and use them to set
// component state there to conditionally display the image/video editor.
// (This is also the reason why we're `localize()`ing the named export.)
// TODO: Fix this mess, rely on Redux state everywhere.
export default connect( null, {
	onReturnToList: () => setEditorMediaModalView( ModalViews.LIST ),
	onEditImageItem: () => setEditorMediaModalView( ModalViews.IMAGE_EDITOR ),
	onEditVideoItem: () => setEditorMediaModalView( ModalViews.VIDEO_EDITOR ),
} )( EditorMediaModalDetail );
