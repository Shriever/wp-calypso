import PropTypes from 'prop-types';
import { Component } from 'react';
import { connect } from 'react-redux';
import { requestWhois } from 'calypso/state/domains/management/actions';
import isRequestingWhois from 'calypso/state/selectors/is-requesting-whois';

class QueryWhois extends Component {
	UNSAFE_componentWillMount() {
		if ( this.props.isRequesting ) {
			return;
		}
		this.props.requestWhois( this.props.domain );
	}

	render() {
		return null;
	}
}

QueryWhois.propTypes = {
	domain: PropTypes.string.isRequired,
	isRequesting: PropTypes.bool.isRequired,
	requestWhois: PropTypes.func.isRequired,
};

export default connect(
	( state, { domain } ) => ( { isRequesting: isRequestingWhois( state, domain ) } ),
	{ requestWhois }
)( QueryWhois );
