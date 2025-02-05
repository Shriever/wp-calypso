import { translate } from 'i18n-calypso';
import React from 'react';
import 'moment-timezone'; // monkey patches the existing moment.js

import { useLocalizedMoment } from 'calypso/components/localized-moment';
import ContactFormNotice from 'calypso/me/help/contact-form-notice/index';

const DATE_FORMAT = 'LLL';

const ChatHolidayClosureNotice = ( { closesAt, compact, displayAt, holidayName, reopensAt } ) => {
	const moment = useLocalizedMoment();

	const currentDate = moment();
	const guessedTimezone = moment.tz.guess();

	let heading;
	let message;

	if ( currentDate.isBefore( closesAt ) ) {
		heading = translate( 'Live chat will be closed for %(holidayName)s', {
			args: { holidayName },
		} );

		message = translate(
			'Live chat will be closed for %(holidayName)s from %(closesAt)s until %(reopensAt)s. ' +
				'You’ll be able to reach us by email and we’ll get back to you as fast as we can. Thank you!',
			{
				args: {
					closesAt: moment.tz( closesAt, guessedTimezone ).format( DATE_FORMAT ),
					reopensAt: moment.tz( reopensAt, guessedTimezone ).format( DATE_FORMAT ),
					holidayName,
				},
			}
		);
	} else {
		heading = translate( 'Live chat closed for %(holidayName)s', {
			args: { holidayName },
		} );

		message = translate(
			'Live chat is closed for %(holidayName)s and will reopen %(reopensAt)s. ' +
				'You can reach us by email below and we’ll get back to you as fast as we can. Thank you!',
			{
				args: {
					reopensAt: moment.tz( reopensAt, guessedTimezone ).format( DATE_FORMAT ),
					holidayName,
				},
			}
		);
	}

	return (
		<ContactFormNotice
			showAt={ displayAt }
			hideAt={ reopensAt }
			heading={ heading }
			message={ <p>{ message }</p> }
			compact={ compact }
		/>
	);
};

export default ChatHolidayClosureNotice;
