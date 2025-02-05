import { Dialog } from '@automattic/components';
import { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';
import React from 'react';
import { emailManagementForwarding } from 'calypso/my-sites/email/paths';

class DeleteEmailForwardsDialog extends React.Component {
	static propTypes = {
		onClose: PropTypes.func,
		visible: PropTypes.bool.isRequired,
		selectedSite: PropTypes.oneOfType( [ PropTypes.object, PropTypes.bool ] ).isRequired,
		selectedDomainName: PropTypes.string.isRequired,
	};

	closeDeleteForwards = () => {
		this.props.onClose( { shouldDeleteEmailForwards: true } );
	};

	close = () => {
		this.props.onClose( { shouldDeleteEmailForwards: false } );
	};

	render() {
		const { translate, visible } = this.props;

		const buttons = [
			{
				action: 'delete',
				label: translate( 'Deactivate Email Forwards and Remove Records' ),
				isPrimary: true,
				onClick: this.closeDeleteForwards,
			},
			{
				action: 'keep',
				label: translate( 'Keep Records and Email Forwards' ),
			},
		];

		return (
			<Dialog isVisible={ visible } buttons={ buttons } onClose={ this.close }>
				<h1>{ translate( 'Are you sure?' ) }</h1>
				<p>
					{ translate( 'Removing this record will delete your current {{a}}Email Forwards{{/a}}.', {
						components: {
							a: (
								<a
									target="_blank"
									rel="noopener noreferrer"
									href={ this.getEmailForwardingPath() }
								/>
							),
						},
					} ) }
				</p>
			</Dialog>
		);
	}

	getEmailForwardingPath() {
		return emailManagementForwarding( this.props.selectedSite.slug, this.props.selectedDomainName );
	}
}

export default localize( DeleteEmailForwardsDialog );
