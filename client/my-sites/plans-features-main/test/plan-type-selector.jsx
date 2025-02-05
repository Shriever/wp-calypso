jest.mock( 'i18n-calypso', () => ( {
	localize: ( Component ) => ( props ) => <Component { ...props } translate={ ( x ) => x } />,
	numberFormat: ( x ) => x,
	translate: ( x ) => x,
	useTranslate: jest.fn( () => ( x ) => x ),
} ) );

import { PLAN_FREE } from '@automattic/calypso-products';
import { shallow } from 'enzyme';
import React from 'react';
import PlanTypeSelector, { CustomerTypeToggle } from '../plan-type-selector';

describe( '<PlanTypeSelector />', () => {
	const myProps = {
		selectedPlan: PLAN_FREE,
		hideFreePlan: true,
		withWPPlanTabs: true,
	};

	test( 'Should show CustomerTypeToggle when kind is set to `customer`', () => {
		const comp = shallow(
			<PlanTypeSelector { ...myProps } kind="customer" customerType="personal" />
		);

		expect( comp.find( 'CustomerTypeToggle' ).length ).toBe( 1 );

		// customerType prop is passed to the child component
		expect( comp.find( 'CustomerTypeToggle[customerType="personal"]' ).length ).toBe( 1 );
	} );

	test( 'Should show IntervalTypeToggle when kind is set to `interval`', () => {
		const comp = shallow(
			<PlanTypeSelector { ...myProps } kind="interval" intervalType="monthly" />
		);

		expect( comp.find( 'IntervalTypeToggle' ).length ).toBe( 1 );

		// customerType prop is passed to the child component
		expect( comp.find( 'IntervalTypeToggle[intervalType="monthly"]' ).length ).toBe( 1 );
	} );
} );

describe( '<CustomerTypeToggle />', () => {
	const myProps = {
		selectedPlan: PLAN_FREE,
		hideFreePlan: true,
		withWPPlanTabs: true,
	};

	beforeEach( () => {
		global.document = {
			location: {
				search: '',
			},
		};
	} );

	test( "Should select personal tab when it's requested", () => {
		const props = { ...myProps, customerType: 'personal' };
		const comp = shallow( <CustomerTypeToggle { ...props } /> );
		expect( comp.find( 'SegmentedControl' ).length ).toBe( 1 );
		expect(
			comp.find( 'SegmentedControlItem[path="?customerType=personal&plan=free_plan"]' ).length
		).toBe( 1 );
		expect(
			comp.find( 'SegmentedControlItem[path="?customerType=personal&plan=free_plan"]' ).props()
				.selected
		).toBe( true );
		expect(
			comp.find( 'SegmentedControlItem[path="?customerType=business&plan=free_plan"]' ).length
		).toBe( 1 );
		expect(
			comp.find( 'SegmentedControlItem[path="?customerType=business&plan=free_plan"]' ).props()
				.selected
		).toBe( false );
	} );

	test( "Should select business tab when it's requested", () => {
		const props = { ...myProps, customerType: 'business' };
		const comp = shallow( <CustomerTypeToggle { ...props } /> );
		expect( comp.find( 'SegmentedControl' ).length ).toBe( 1 );
		expect(
			comp.find( 'SegmentedControlItem[path="?customerType=personal&plan=free_plan"]' ).length
		).toBe( 1 );
		expect(
			comp.find( 'SegmentedControlItem[path="?customerType=personal&plan=free_plan"]' ).props()
				.selected
		).toBe( false );
		expect(
			comp.find( 'SegmentedControlItem[path="?customerType=business&plan=free_plan"]' ).length
		).toBe( 1 );
		expect(
			comp.find( 'SegmentedControlItem[path="?customerType=business&plan=free_plan"]' ).props()
				.selected
		).toBe( true );
	} );

	test( 'Should generate tabs links based on the current search parameters', () => {
		global.document.location.search = '?fake=1';

		const props = { ...myProps, customerType: 'business' };
		const comp = shallow( <CustomerTypeToggle { ...props } /> );

		expect( comp.find( 'SegmentedControl' ).length ).toBe( 1 );
		expect(
			comp.find( 'SegmentedControlItem[path="?fake=1&customerType=personal&plan=free_plan"]' )
				.length
		).toBe( 1 );
		expect(
			comp.find( 'SegmentedControlItem[path="?fake=1&customerType=business&plan=free_plan"]' )
				.length
		).toBe( 1 );
	} );
} );
