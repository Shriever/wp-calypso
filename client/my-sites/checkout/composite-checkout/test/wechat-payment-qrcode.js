/**
 * @jest-environment jsdom
 */

import { shallow } from 'enzyme';
import page from 'page';
import QRCode from 'qrcode.react';
import React from 'react';
import { ORDER_TRANSACTION_STATUS } from 'calypso/state/order-transactions/constants';
import { WechatPaymentQRCode } from '../payment-methods/wechat/wechat-payment-qrcode';

jest.mock( 'page', () => jest.fn() );

const defaultProps = {
	orderId: 1,
	redirectUrl: 'wexin://redirect',
	cart: {},
	slug: 'example.com',
	showErrorNotice: jest.fn(),
	transactionReceiptId: null,
	transactionStatus: null,
	transactionError: null,
	reset: jest.fn(),
	translate: ( x ) => x,
};

describe( 'WechatPaymentQRCode', () => {
	test( 'has correct components and css', () => {
		const wrapper = shallow( <WechatPaymentQRCode { ...defaultProps } /> );
		expect( wrapper.find( '.checkout__wechat-qrcode-instruction' ) ).toHaveLength( 1 );
		expect( wrapper.find( '.checkout__wechat-qrcode-spinner' ) ).toHaveLength( 1 );
		expect( wrapper.find( '.checkout__wechat-qrcode-redirect' ) ).toHaveLength( 1 );
		expect( wrapper.find( '.checkout__wechat-qrcode' ) ).toHaveLength( 1 );
		expect( wrapper.find( 'Connect(QueryOrderTransaction)' ) ).toHaveLength( 1 );
		expect(
			wrapper.containsMatchingElement( <QRCode value={ defaultProps.redirect_url } /> )
		).toBe( true );
	} );

	test( 'transaction success triggers page change', () => {
		const reset = jest.fn();

		const instance = shallow(
			<WechatPaymentQRCode
				{ ...defaultProps }
				transactionStatus={ ORDER_TRANSACTION_STATUS.SUCCESS }
				transactionReceiptId={ 1 }
				reset={ reset }
			/>
		).instance();

		instance.componentDidUpdate();

		expect( page ).toHaveBeenCalledWith( `/checkout/thank-you/${ defaultProps.slug }/1` );
		expect( reset ).toHaveBeenCalled();
	} );

	test( 'transaction failure triggers page change', () => {
		const reset = jest.fn();

		const instance = shallow(
			<WechatPaymentQRCode
				{ ...defaultProps }
				transactionStatus={ ORDER_TRANSACTION_STATUS.FAILURE }
				reset={ reset }
			/>
		).instance();

		instance.componentDidUpdate();

		expect( page ).toHaveBeenCalledWith( `/checkout/${ defaultProps.slug }` );
		expect( reset ).toHaveBeenCalled();
	} );

	test( 'transaction unknown triggers page change', () => {
		const reset = jest.fn();

		const instance = shallow(
			<WechatPaymentQRCode
				{ ...defaultProps }
				transactionError={ new Error( 'Example' ) }
				reset={ reset }
			/>
		).instance();

		instance.componentDidUpdate();

		expect( page ).toHaveBeenCalledWith( `/checkout/${ defaultProps.slug }` );
		expect( reset ).toHaveBeenCalled();
	} );
} );
