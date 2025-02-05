import classNames from 'classnames';
import debugFactory from 'debug';
import { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import DropZone from 'calypso/components/drop-zone';
import FilePicker from 'calypso/components/file-picker';
import Gridicon from 'calypso/components/gridicon';
import { MAX_UPLOAD_ZIP_SIZE } from 'calypso/lib/automated-transfer/constants';
import { errorNotice } from 'calypso/state/notices/actions';
import { getSelectedSiteId } from 'calypso/state/ui/selectors';

import './style.scss';

const debug = debugFactory( 'calypso:upload-drop-zone' );

class UploadDropZone extends Component {
	static propTypes = {
		doUpload: PropTypes.func.isRequired,
		disabled: PropTypes.bool,
		// Connected
		siteId: PropTypes.number,
	};

	onFileSelect = ( files ) => {
		const { translate, siteId, doUpload } = this.props;

		if ( files.length !== 1 ) {
			this.props.errorNotice( translate( 'Please drop a single zip file' ) );
			return;
		}

		// DropZone supplies an array, FilePicker supplies a FileList
		const file = files[ 0 ] || files.item( 0 );
		debug( 'zip file:', file );

		if ( file.size > MAX_UPLOAD_ZIP_SIZE ) {
			this.props.errorNotice(
				translate( 'Zip file is too large. Please upload a file under 50 MB.' )
			);
			return;
		}

		doUpload( siteId, file );
	};

	render() {
		const { translate, disabled } = this.props;
		const dropText = translate( 'Drop files or click here to install' );
		const uploadInstructionsText = translate( 'Only single .zip files are accepted.' );

		const className = classNames( 'upload-drop-zone', {
			'is-disabled': disabled,
		} );

		return (
			<div className={ className }>
				<div className="upload-drop-zone__dropzone">
					<DropZone onFilesDrop={ this.onFileSelect } />
					<FilePicker accept="application/zip" onPick={ this.onFileSelect }>
						<Gridicon className="upload-drop-zone__icon" icon="cloud-upload" size={ 48 } />
						{ dropText }
						<span className="upload-drop-zone__instructions">{ uploadInstructionsText }</span>
					</FilePicker>
				</div>
			</div>
		);
	}
}

export default connect(
	( state ) => ( {
		siteId: getSelectedSiteId( state ),
	} ),
	{
		errorNotice,
	}
)( localize( UploadDropZone ) );
