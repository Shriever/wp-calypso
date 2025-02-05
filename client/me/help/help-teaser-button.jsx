import { Card } from '@automattic/components';
import { localize } from 'i18n-calypso';
import React from 'react';
import Gridicon from 'calypso/components/gridicon';

import './help-teaser-button.scss';

export default localize( ( { title, description, href, onClick, target } ) => {
	return (
		<div className="help__help-teaser-button">
			<Card href={ href } onClick={ onClick } target={ target }>
				<Gridicon className="help__help-teaser-button-icon" icon="help" size={ 36 } />
				<div className="help__help-teaser-text">
					<span className="help__help-teaser-button-title">{ title }</span>
					<span className="help__help-teaser-button-description">{ description }</span>
				</div>
			</Card>
		</div>
	);
} );
