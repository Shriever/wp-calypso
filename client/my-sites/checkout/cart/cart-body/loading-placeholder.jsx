import React from 'react';
import CartItemLoadingPlaceholder from 'calypso/my-sites/checkout/cart/cart-item/loading-placeholder';

const CartBodyLoadingPlaceholder = () => (
	<div className="cart-body__loading-placeholder cart-body">
		<ul className="cart-items">
			<CartItemLoadingPlaceholder />
			<CartItemLoadingPlaceholder />
		</ul>
	</div>
);

export default CartBodyLoadingPlaceholder;
