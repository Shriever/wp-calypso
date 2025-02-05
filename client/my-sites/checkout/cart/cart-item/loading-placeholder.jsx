import { Button } from '@automattic/components';
import React from 'react';

const CartItemLoadingPlaceholder = () => (
	<div className="cart-item__loading-placeholder cart-item">
		<div className="primary-details">
			<span className="product-name" />
			<span className="product-domain" />
		</div>
		<div className="secondary-details">
			<span className="product-price" />
			<Button className="cart-item__loading-placeholder-remove-item remove-item" />
		</div>
	</div>
);

export default CartItemLoadingPlaceholder;
