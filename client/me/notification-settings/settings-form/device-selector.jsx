import { size, map } from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import FormSelect from 'calypso/components/forms/form-select';
import getUserDevices from 'calypso/state/selectors/get-user-devices';
import StreamHeader from './stream-header';

class NotificationSettingsFormDeviceSelector extends PureComponent {
	static propTypes = {
		devices: PropTypes.array.isRequired,
		selectedDeviceId: PropTypes.number.isRequired,
		onChange: PropTypes.func.isRequired,
	};

	render() {
		const { devices } = this.props;
		if ( size( devices ) === 1 ) {
			return <StreamHeader title={ devices[ 0 ].name } />;
		}

		return (
			<div className="notification-settings-form-header">
				<div className="notification-settings-form-header__title">
					<FormSelect value={ this.props.selectedDeviceId } onChange={ this.props.onChange }>
						{ map( devices, ( { id, name } ) => (
							<option key={ id } value={ id }>
								{ name }
							</option>
						) ) }
					</FormSelect>
				</div>
			</div>
		);
	}
}

export default connect( ( state ) => ( {
	devices: getUserDevices( state ),
} ) )( NotificationSettingsFormDeviceSelector );
