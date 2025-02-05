import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Gridicon from 'calypso/components/gridicon';

import './style.scss';

const PluginIcon = ( { className, image, isPlaceholder } ) => {
	const classes = classNames(
		{
			'plugin-icon': true,
			'is-placeholder': isPlaceholder,
			'is-fallback': ! image,
		},
		className
	);

	return (
		<div className={ classes }>
			{ isPlaceholder || ! image ? (
				<Gridicon icon="plugins" />
			) : (
				<img className="plugin-icon__img" src={ image } />
			) }
		</div>
	);
};

PluginIcon.propTypes = {
	image: PropTypes.string,
	isPlaceholder: PropTypes.bool,
};

export default PluginIcon;
