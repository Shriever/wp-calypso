import page from 'page';
import { makeLayout, render as clientRender } from 'calypso/controller';
import { navigation, siteSelection, sites, p2RedirectToHub } from 'calypso/my-sites/controller';
import peopleController from './controller';

export default function () {
	page(
		'/people/:filter(team|followers|email-followers|viewers)',
		siteSelection,
		sites,
		p2RedirectToHub,
		makeLayout,
		clientRender
	);

	page(
		'/people/:filter(team|followers|email-followers|viewers)/:site_id',
		peopleController.enforceSiteEnding,
		siteSelection,
		navigation,
		p2RedirectToHub,
		peopleController.people,
		makeLayout,
		clientRender
	);

	page( '/people/invites', siteSelection, sites, p2RedirectToHub, makeLayout, clientRender );

	page(
		'/people/invites/:site_id',
		peopleController.enforceSiteEnding,
		siteSelection,
		p2RedirectToHub,
		navigation,
		peopleController.peopleInvites,
		makeLayout,
		clientRender
	);

	page(
		'/people/invites/:site_id/:invite_key',
		peopleController.enforceSiteEnding,
		siteSelection,
		p2RedirectToHub,
		navigation,
		peopleController.peopleInviteDetails,
		makeLayout,
		clientRender
	);

	page(
		'/people/new/:site_id',
		peopleController.enforceSiteEnding,
		siteSelection,
		p2RedirectToHub,
		navigation,
		peopleController.invitePeople,
		makeLayout,
		clientRender
	);

	page(
		'/people/new/:site_id/sent',
		peopleController.enforceSiteEnding,
		siteSelection,
		p2RedirectToHub,
		navigation,
		peopleController.invitePeople,
		makeLayout,
		clientRender
	);

	page(
		'/people/edit/:site_id/:user_login',
		peopleController.enforceSiteEnding,
		siteSelection,
		p2RedirectToHub,
		navigation,
		peopleController.person,
		makeLayout,
		clientRender
	);

	// Anything else is unexpected and should be redirected to the default people management URL: /people/team
	page( '/people/(.*)?', siteSelection, peopleController.redirectToTeam, makeLayout, clientRender );
}
