import { localize } from 'i18n-calypso';
import React from 'react';
import FormSectionHeading from 'calypso/components/forms/form-section-heading';
import HappinessEngineersTray from 'calypso/components/happiness-engineers-tray';

import './style.scss';

function HelpHappinessEngineers( { translate } ) {
	return (
		<div className="help-happiness-engineers">
			{ translate(
				'{{headline}}We care about your happiness!{{/headline}}' +
					"{{p}}They don't call us Happiness Engineers for nothing. " +
					"If you need help, we're here for you!{{/p}}",
				{
					components: {
						headline: <FormSectionHeading />,
						p: <p className="help-happiness-engineers__description" />,
					},
				}
			) }
			<HappinessEngineersTray />
		</div>
	);
}

export default localize( HelpHappinessEngineers );
