import classNames from 'classnames';
import { compact } from 'lodash';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import SectionHeader from 'calypso/components/section-header';
import PluginSite from 'calypso/my-sites/plugins/plugin-site/plugin-site';
import { siteObjectsToSiteIds } from 'calypso/my-sites/plugins/utils';
import {
	getPluginOnSites,
	getSiteObjectsWithPlugin,
} from 'calypso/state/plugins/installed/selectors';
import getNetworkSites from 'calypso/state/selectors/get-network-sites';
import isConnectedSecondaryNetworkSite from 'calypso/state/selectors/is-connected-secondary-network-site';

import './style.scss';

export class PluginSiteList extends Component {
	static propTypes = {
		plugin: PropTypes.object,
		sites: PropTypes.array,
		sitesWithSecondarySites: PropTypes.array,
		title: PropTypes.string,
	};

	getSecondaryPluginSites( site, secondarySites ) {
		const pluginsOnSites = this.props.pluginsOnSites?.sites[ site.ID ];
		const secondarySitesWithPlugin = this.props.sitesWithPlugin.filter(
			( siteWithPlugin ) =>
				secondarySites && secondarySites.some( ( secSite ) => secSite.ID === siteWithPlugin.ID )
		);
		const secondaryPluginSites = pluginsOnSites ? secondarySitesWithPlugin : secondarySites;
		return compact( secondaryPluginSites );
	}

	renderPluginSite( { site, secondarySites } ) {
		return (
			<PluginSite
				key={ 'pluginSite' + site.ID }
				site={ site }
				secondarySites={ this.getSecondaryPluginSites( site, secondarySites ) }
				plugin={ this.props.plugin }
				wporg={ this.props.wporg }
			/>
		);
	}

	render() {
		if ( ! this.props.sites || this.props.sites.length === 0 ) {
			return null;
		}
		const classes = classNames( 'plugin-site-list', this.props.className );
		const pluginSites = this.props.sitesWithSecondarySites.map( this.renderPluginSite, this );

		return (
			<div className={ classes }>
				<SectionHeader label={ this.props.title } />
				{ pluginSites }
			</div>
		);
	}
}

// TODO: make this memoized after sites-list is removed and `sites` comes from Redux
function getSitesWithSecondarySites( state, sites ) {
	return sites
		.filter( ( site ) => ! isConnectedSecondaryNetworkSite( state, site.ID ) )
		.map( ( site ) => ( {
			site,
			secondarySites: getNetworkSites( state, site.ID ),
		} ) );
}

export default connect( ( state, { plugin, sites } ) => {
	const siteIds = siteObjectsToSiteIds( sites );

	return {
		sitesWithPlugin: getSiteObjectsWithPlugin( state, siteIds, plugin.slug ),
		sitesWithSecondarySites: getSitesWithSecondarySites( state, sites ),
		pluginsOnSites: getPluginOnSites( state, siteIds, plugin.slug ),
	};
} )( PluginSiteList );
