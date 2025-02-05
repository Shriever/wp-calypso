import { translate } from 'i18n-calypso';
import { get, includes, map } from 'lodash';
import page from 'page';
import React from 'react';
import DocumentHead from 'calypso/components/data/document-head';
import ConnectDomainStep from 'calypso/components/domains/connect-domain-step';
import TransferDomainStep from 'calypso/components/domains/transfer-domain-step';
import UseMyDomain from 'calypso/components/domains/use-my-domain';
import UseYourDomainStep from 'calypso/components/domains/use-your-domain-step';
import EmptyContent from 'calypso/components/empty-content';
import Main from 'calypso/components/main';
import GSuiteUpgrade from 'calypso/components/upgrades/gsuite';
import { makeLayout, render as clientRender } from 'calypso/controller';
import PageViewTracker from 'calypso/lib/analytics/page-view-tracker';
import { isATEnabled } from 'calypso/lib/automated-transfer';
import { sectionify } from 'calypso/lib/route';
import CalypsoShoppingCartProvider from 'calypso/my-sites/checkout/calypso-shopping-cart-provider';
import MapDomain from 'calypso/my-sites/domains/map-domain';
import {
	domainManagementTransferIn,
	domainManagementTransferInPrecheck,
	domainMapping,
	domainMappingSetup,
	domainTransferIn,
	domainUseMyDomain,
	domainUseYourDomain,
} from 'calypso/my-sites/domains/paths';
import TransferDomain from 'calypso/my-sites/domains/transfer-domain';
import { getCurrentUser } from 'calypso/state/current-user/selectors';
import canUserPurchaseGSuite from 'calypso/state/selectors/can-user-purchase-gsuite';
import getSites from 'calypso/state/selectors/get-sites';
import {
	getSelectedSiteId,
	getSelectedSite,
	getSelectedSiteSlug,
} from 'calypso/state/ui/selectors';
import DomainSearch from './domain-search';
import SiteRedirect from './domain-search/site-redirect';
import EmailProvidersUpsell from './email-providers-upsell';

const noop = () => {};
const domainsAddHeader = ( context, next ) => {
	context.getSiteSelectionHeaderText = () => {
		return translate( 'Select a site to add a domain' );
	};

	next();
};

const domainsAddRedirectHeader = ( context, next ) => {
	context.getSiteSelectionHeaderText = () => {
		return translate( 'Select a site to add Site Redirect' );
	};

	next();
};

const redirectToDomainSearchSuggestion = ( context ) => {
	return page.redirect(
		`/domains/add/${ context.params.domain }?suggestion=${ context.params.suggestion }`
	);
};

const domainSearch = ( context, next ) => {
	// Scroll to the top
	if ( typeof window !== 'undefined' ) {
		window.scrollTo( 0, 0 );
	}

	context.primary = (
		<Main wideLayout>
			<PageViewTracker path="/domains/add/:site" title="Domain Search > Domain Registration" />
			<DocumentHead title={ translate( 'Domain Search' ) } />
			<CalypsoShoppingCartProvider>
				<DomainSearch basePath={ sectionify( context.path ) } context={ context } />
			</CalypsoShoppingCartProvider>
		</Main>
	);
	next();
};

const siteRedirect = ( context, next ) => {
	context.primary = (
		<Main>
			<PageViewTracker
				path="/domains/add/site-redirect/:site"
				title="Domain Search > Site Redirect"
			/>
			<DocumentHead title={ translate( 'Redirect a Site' ) } />
			<CalypsoShoppingCartProvider>
				<SiteRedirect />
			</CalypsoShoppingCartProvider>
		</Main>
	);
	next();
};

const mapDomain = ( context, next ) => {
	context.primary = (
		<Main wideLayout>
			<PageViewTracker path={ domainMapping( ':site' ) } title="Domain Search > Domain Mapping" />
			<DocumentHead title={ translate( 'Map a Domain' ) } />
			<CalypsoShoppingCartProvider>
				<MapDomain initialQuery={ context.query.initialQuery } />
			</CalypsoShoppingCartProvider>
		</Main>
	);
	next();
};

const mapDomainSetup = ( context, next ) => {
	const showErrors = context.query?.showErrors === 'true' || context.query?.showErrors === '1';

	context.primary = (
		<Main wideLayout>
			<PageViewTracker
				path={ domainMappingSetup( ':site', ':domain' ) }
				title="Domain Search > Connect A Domain > Domain Connection Setup"
			/>
			<DocumentHead title={ translate( 'Connect a Domain Setup' ) } />
			<CalypsoShoppingCartProvider>
				<ConnectDomainStep
					domain={ context.params.domain }
					initialStep={ context.query.step }
					showErrors={ showErrors }
				/>
			</CalypsoShoppingCartProvider>
		</Main>
	);
	next();
};

const transferDomain = ( context, next ) => {
	const useStandardBack =
		context.query.useStandardBack === 'true' || context.query.useStandardBack === '1';

	context.primary = (
		<Main wideLayout>
			<PageViewTracker
				path={ domainTransferIn( ':site' ) }
				title="Domain Search > Domain Transfer"
			/>
			<DocumentHead title={ translate( 'Transfer a Domain' ) } />
			<CalypsoShoppingCartProvider>
				<TransferDomain
					basePath={ sectionify( context.path ) }
					initialQuery={ context.query.initialQuery }
					useStandardBack={ useStandardBack }
				/>
			</CalypsoShoppingCartProvider>
		</Main>
	);
	next();
};

const useYourDomain = ( context, next ) => {
	const handleGoBack = () => {
		let path = `/domains/add/${ context.params.site }`;
		if ( context.query.initialQuery ) {
			path += `?suggestion=${ context.query.initialQuery }`;
		}

		page( path );
	};
	context.primary = (
		<Main>
			<PageViewTracker
				path={ domainUseYourDomain( ':site' ) }
				title="Domain Search > Use Your Own Domain"
			/>
			<DocumentHead title={ translate( 'Use Your Own Domain' ) } />
			<CalypsoShoppingCartProvider>
				<UseYourDomainStep
					basePath={ sectionify( context.path ) }
					initialQuery={ context.query.initialQuery }
					goBack={ handleGoBack }
				/>
			</CalypsoShoppingCartProvider>
		</Main>
	);
	next();
};

const useMyDomain = ( context, next ) => {
	const handleGoBack = () => {
		let path = `/domains/add/${ context.params.site }`;
		if ( context.query.initialQuery ) {
			path += `?suggestion=${ context.query.initialQuery }`;
		}

		page( path );
	};
	context.primary = (
		<Main wideLayout>
			<PageViewTracker
				path={ domainUseMyDomain( ':site' ) }
				title="Domain Search > Use A Domain I Own"
			/>
			<DocumentHead title={ translate( 'Use A Domain I Own' ) } />
			<CalypsoShoppingCartProvider>
				<UseMyDomain
					basePath={ sectionify( context.path ) }
					initialQuery={ context.query.initialQuery }
					goBack={ handleGoBack }
				/>
			</CalypsoShoppingCartProvider>
		</Main>
	);
	next();
};

const transferDomainPrecheck = ( context, next ) => {
	const state = context.store.getState();
	const siteSlug = getSelectedSiteSlug( state ) || '';
	const domain = get( context, 'params.domain', '' );

	const handleGoBack = () => {
		page( domainManagementTransferIn( siteSlug, domain ) );
	};
	context.primary = (
		<Main>
			<PageViewTracker
				path={ domainManagementTransferInPrecheck( ':site', ':domain' ) }
				title="My Sites > Domains > Selected Domain"
			/>
			<CalypsoShoppingCartProvider>
				<div>
					<TransferDomainStep
						forcePrecheck={ true }
						initialQuery={ domain }
						goBack={ handleGoBack }
					/>
				</div>
			</CalypsoShoppingCartProvider>
		</Main>
	);
	next();
};

const googleAppsWithRegistration = ( context, next ) => {
	if ( canUserPurchaseGSuite( context.store.getState() ) ) {
		context.primary = (
			<Main>
				<PageViewTracker
					path="/domains/add/:domain/google-apps/:site"
					title="Domain Search > Domain Registration > Google Apps"
				/>
				<DocumentHead
					title={ translate( 'Register %(domain)s', {
						args: { domain: context.params.registerDomain },
					} ) }
				/>
				<CalypsoShoppingCartProvider>
					<GSuiteUpgrade domain={ context.params.registerDomain } />
				</CalypsoShoppingCartProvider>
			</Main>
		);
	}

	next();
};

const emailUpsellForDomainRegistration = ( context, next ) => {
	context.primary = (
		<Main wideLayout>
			<PageViewTracker
				path="/domains/add/:domain/email/:site"
				title="Domain Search > Domain Registration > Email"
			/>
			<DocumentHead
				title={ translate( 'Register %(domain)s', {
					args: { domain: context.params.domain },
				} ) }
			/>
			<EmailProvidersUpsell domain={ context.params.domain } />
		</Main>
	);

	next();
};

const redirectIfNoSite = ( redirectTo ) => {
	return ( context, next ) => {
		const state = context.store.getState();
		const siteId = getSelectedSiteId( state );
		const sites = getSites( state );
		const siteIds = map( sites, 'ID' );

		if ( ! includes( siteIds, siteId ) ) {
			const user = getCurrentUser( state );
			const visibleSiteCount = get( user, 'visible_site_count', 0 );
			//if only one site navigate to stats to avoid redirect loop
			const redirect = visibleSiteCount > 1 ? redirectTo : '/stats';
			return page.redirect( redirect );
		}
		next();
	};
};

const redirectToUseYourDomainIfVipSite = () => {
	return ( context, next ) => {
		const state = context.store.getState();
		const selectedSite = getSelectedSite( state );

		if ( selectedSite && selectedSite.is_vip ) {
			return page.redirect(
				domainUseYourDomain( selectedSite.slug, get( context, 'params.suggestion', '' ) )
			);
		}

		next();
	};
};

const jetpackNoDomainsWarning = ( context, next ) => {
	const state = context.store.getState();
	const selectedSite = getSelectedSite( state );

	if ( selectedSite && selectedSite.jetpack && ! isATEnabled( selectedSite ) ) {
		context.primary = (
			<Main>
				<PageViewTracker
					path={ context.path.indexOf( '/domains/add' ) === 0 ? '/domains/add' : '/domains/manage' }
					title="My Sites > Domains > No Domains On Jetpack"
				/>
				<EmptyContent
					title={ translate( 'Domains are not available for this site.' ) }
					line={ translate(
						'You can only purchase domains for sites hosted on WordPress.com at this time.'
					) }
					action={ translate( 'View Plans' ) }
					actionURL={ '/plans/' + ( selectedSite.slug || '' ) }
				/>
			</Main>
		);

		makeLayout( context, noop );
		clientRender( context );
	} else {
		next();
	}
};

export default {
	domainsAddHeader,
	domainsAddRedirectHeader,
	domainSearch,
	emailUpsellForDomainRegistration,
	jetpackNoDomainsWarning,
	siteRedirect,
	mapDomain,
	mapDomainSetup,
	googleAppsWithRegistration,
	redirectToDomainSearchSuggestion,
	redirectIfNoSite,
	redirectToUseYourDomainIfVipSite,
	transferDomain,
	transferDomainPrecheck,
	useMyDomain,
	useYourDomain,
};
