import { localize } from 'i18n-calypso';
import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import customDomainBloggerImage from 'calypso/assets/images/illustrations/custom-domain-blogger.svg';
import customDomainImage from 'calypso/assets/images/illustrations/custom-domain.svg';
import PurchaseDetail from 'calypso/components/purchase-detail';
import { getRegisteredDomains } from 'calypso/lib/domains';
import { NON_PRIMARY_DOMAINS_TO_FREE_USERS } from 'calypso/state/current-user/constants';
import { currentUserHasFlag, getCurrentUser } from 'calypso/state/current-user/selectors';
import { getDomainsBySiteId } from 'calypso/state/sites/domains/selectors';
import { getSelectedSiteId } from 'calypso/state/ui/selectors';

const CustomDomainPurchaseDetail = ( {
	selectedSite,
	hasDomainCredit,
	hasNonPrimaryDomainsFlag,
	onlyBlogDomain,
	registeredDomain,
	translate,
} ) => {
	const customDomainIcon = onlyBlogDomain ? customDomainBloggerImage : customDomainImage;
	if ( hasDomainCredit ) {
		return (
			<PurchaseDetail
				icon={ <img alt="" src={ customDomainIcon } /> }
				title={
					onlyBlogDomain
						? translate( 'Select your .blog domain' )
						: translate( 'Select your custom domain' )
				}
				description={
					onlyBlogDomain
						? translate(
								'Your plan includes a free .blog domain for one year, which gives your site a more professional, branded feel.'
						  )
						: translate(
								'Your plan includes a free custom domain for one year, which gives your site a more professional, branded feel.'
						  )
				}
				buttonText={ translate( 'Claim your free domain' ) }
				href={ `/domains/add/${ selectedSite.slug }` }
			/>
		);
	} else if ( hasNonPrimaryDomainsFlag && registeredDomain ) {
		const actionButton = {};
		actionButton.buttonText = translate( 'Change primary domain' );
		actionButton.href = `/domains/manage/${ selectedSite.slug }`;
		return (
			<PurchaseDetail
				icon={ <img alt="" src={ customDomainIcon } /> }
				title={ translate( 'Make your domain your primary address' ) }
				description={ translate(
					'Make {{em}}%(domain)s{{/em}} the primary address that your visitors see when they come to your site.',
					{
						args: { domain: registeredDomain.name },
						components: { em: <em /> },
					}
				) }
				{ ...actionButton }
			/>
		);
	}
	return null;
};

CustomDomainPurchaseDetail.propTypes = {
	onlyBlogDomain: PropTypes.bool,
	selectedSite: PropTypes.oneOfType( [ PropTypes.bool, PropTypes.object ] ).isRequired,
	hasDomainCredit: PropTypes.bool,
	hasNonPrimaryDomainsFlag: PropTypes.bool,
	siteDomains: PropTypes.array,
};

export default connect( ( state ) => {
	const siteId = getSelectedSiteId( state );
	const siteDomains = getDomainsBySiteId( state, siteId );
	const registeredDomains = getRegisteredDomains( siteDomains );

	return {
		hasNonPrimaryDomainsFlag: getCurrentUser( state )
			? currentUserHasFlag( state, NON_PRIMARY_DOMAINS_TO_FREE_USERS )
			: false,
		registeredDomain: registeredDomains[ 0 ],
	};
} )( localize( CustomDomainPurchaseDetail ) );
