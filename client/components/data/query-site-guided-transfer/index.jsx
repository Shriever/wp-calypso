import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { requestGuidedTransferStatus } from 'calypso/state/sites/guided-transfer/actions';
import { isRequestingGuidedTransferStatus } from 'calypso/state/sites/guided-transfer/selectors';

class QuerySiteGuidedTransfer extends Component {
	constructor( props ) {
		super( props );
		this.request = this.request.bind( this );
	}

	request( props = this.props ) {
		if ( ! props.isRequesting && props.siteId ) {
			props.requestGuidedTransferStatus( props.siteId );
		}
	}

	UNSAFE_componentWillMount() {
		this.request();
	}

	UNSAFE_componentWillReceiveProps( nextProps ) {
		if ( this.props.siteId !== nextProps.siteId ) {
			this.request( nextProps );
		}
	}

	render() {
		return null;
	}
}

QuerySiteGuidedTransfer.propTypes = {
	siteId: PropTypes.number,
	isRequesting: PropTypes.bool,
};

QuerySiteGuidedTransfer.defaultProps = {
	requestGuidedTransferStatus: () => {},
};

const mapStateToProps = ( state, ownProps ) => ( {
	isRequesting: isRequestingGuidedTransferStatus( state, ownProps.siteId ),
} );

export default connect( mapStateToProps, { requestGuidedTransferStatus } )(
	QuerySiteGuidedTransfer
);
