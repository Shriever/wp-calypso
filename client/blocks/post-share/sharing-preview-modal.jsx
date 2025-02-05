import { Dialog } from '@automattic/components';
import PropTypes from 'prop-types';
import React from 'react';
import SharingPreviewPane from 'calypso/blocks/sharing-preview-pane';
import Gridicon from 'calypso/components/gridicon';

const SharingPreviewModal = ( props ) => {
	const { isVisible, onClose, ...previewProps } = props;

	return (
		<Dialog isVisible={ isVisible } additionalClassNames="post-share__sharing-preview-modal">
			<header className="post-share__sharing-preview-modal-header">
				<button onClick={ onClose } className="post-share__sharing-preview-modal-close">
					<Gridicon icon="cross" />
				</button>
			</header>
			<SharingPreviewPane { ...previewProps } />
		</Dialog>
	);
};

SharingPreviewModal.propTypes = {
	isVisible: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,

	// SharingPreviewPane props
	siteId: PropTypes.number,
	postId: PropTypes.number,
	message: PropTypes.string,
	selectedService: PropTypes.string,
};

export default SharingPreviewModal;
