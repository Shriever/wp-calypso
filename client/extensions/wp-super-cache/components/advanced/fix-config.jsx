import { Button, Card } from '@automattic/components';
import { localize } from 'i18n-calypso';
import { flowRight } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import SectionHeader from 'calypso/components/section-header';
import { getSelectedSiteId } from 'calypso/state/ui/selectors';
import { restoreSettings } from '../../state/settings/actions';
import { isRestoringSettings } from '../../state/settings/selectors';

class FixConfig extends Component {
	static propTypes = {
		isReadOnly: PropTypes.bool.isRequired,
		isRestoring: PropTypes.bool.isRequired,
		restoreSettings: PropTypes.func.isRequired,
		siteId: PropTypes.number,
		translate: PropTypes.func.isRequired,
	};

	restoreSettings = () => this.props.restoreSettings( this.props.siteId );

	render() {
		const { isReadOnly, isRestoring, translate } = this.props;

		return (
			<div>
				<SectionHeader label={ translate( 'Fix Configuration' ) } />
				<Card>
					<Button
						compact
						busy={ isRestoring }
						disabled={ isRestoring || isReadOnly }
						onClick={ this.restoreSettings }
					>
						{ translate( 'Restore Default Configuration' ) }
					</Button>
				</Card>
			</div>
		);
	}
}

const connectComponent = connect(
	( state ) => {
		const siteId = getSelectedSiteId( state );
		const isRestoring = isRestoringSettings( state, siteId );

		return {
			isRestoring,
			siteId,
		};
	},
	{ restoreSettings }
);

export default flowRight( connectComponent, localize )( FixConfig );
