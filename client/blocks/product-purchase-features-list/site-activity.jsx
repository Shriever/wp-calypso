import { localize } from 'i18n-calypso';
import React from 'react';
import { connect } from 'react-redux';
import siteActivity from 'calypso/assets/images/illustrations/site-activity.svg';
import PurchaseDetail from 'calypso/components/purchase-detail';
import { getSelectedSiteSlug } from 'calypso/state/ui/selectors';

const SiteActivity = ( { siteSlug, translate } ) => (
	<div className="product-purchase-features-list__item">
		<PurchaseDetail
			icon={ <img alt="" src={ siteActivity } /> }
			title={ translate( 'Activity' ) }
			description={ translate(
				'The at-a-glance and activity list makes it easy to track changes and updates to your site.'
			) }
			buttonText={ translate( 'View your site activity' ) }
			href={ `/activity-log/${ siteSlug }` }
		/>
	</div>
);

export default connect( ( state ) => ( {
	siteSlug: getSelectedSiteSlug( state ),
} ) )( localize( SiteActivity ) );
