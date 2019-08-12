import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import styled from 'styled-components';
import StripeCheckout from 'react-stripe-checkout';

const StyledDiv = styled.div`
    margin: 60px 125px 0 125px;

    p {
        font-size: 1.75rem;
        
    }

    .grid {
        display: grid;
        grid-template-columns: auto 170px auto 300px;
        align-items: stretch;

        & > * {
            border-top: 1px solid rgba(112, 112, 112, 0.5);
            display: flex;
            align-items: center;
            padding: 20px 0; 
        }

        .column1 {
            justify-content: center;
        }

        .column2 {
            img {
                width: 50px;
            }
        }

        .column3 {
        }

        .column4 {
            justify-content: flex-end;
            padding-right: 100px;
        }

        .checkout {
            grid-column-start: 1;
            grid-column-end: span 4;
            padding-right: 100px;
            display: flex;
            flex-direction: column;
            align-items: flex-end;

            & > * {
                line-height: 1.5rem;
            }

            .total {
                font-size: 1.75rem;
                margin: 20px 0;
            }

            button {
                background-color: #2196f3;
                color: white;
                padding: 15px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                font-size: 1rem;
                outline: none;
            }
        }
        
    }
`;

class Cart extends Component {
    componentDidMount = () => {
        let updateCartData = async () => {
            let response = await fetch('/cartdata');
            let body = await response.json();
            if (!body.success) {
                this.props.dispatch({ type: "logout-success" });
                this.props.history.push('/');
                return;
            }
            this.props.dispatch({ type: "login-success" });
            this.props.dispatch({ type: "update-products", products: body.products });
            this.props.dispatch({ type: "set-cart-items", cartItems: body.cartItems });
        };
        updateCartData();
    }
    getCartRows = () => {
        let cartRows = [];
        this.props.cartItems.forEach(itemId => {
            let productObj = this.props.products[itemId];
            let row = cartRows.find(cartRow => cartRow.itemId === itemId);
            if (typeof row === 'undefined') {
                cartRows.push({
                    itemId: itemId,
                    qty: 1,
                    images: productObj.images,
                    title: productObj.title,
                    sum: productObj.price
                });
            }
            else {
                row.qty++;
                row.sum = row.qty * productObj.price;
            }
        });
        return cartRows;
    }
    onToken = (token) => {
        fetch('/save-stripe-token', {
            method: 'POST',
            body: JSON.stringify(token),
        }).then(response => {
            response.json().then(data => {
                alert(`We are in business, ${data.email}`);
            });
        });
    }
    render = () => {
        if (this.props.lgin === null || this.props.products.length === 0 || !this.props.lgin) {
            return <></>;
        }
        let cartRowToElem = (row) => {
            return (
                <>
                    <div className="column1">{row.qty}x</div>
                    <div className="column2"><img src={row.images[0]}/></div>
                    <div className="column3">{row.title}</div>
                    <div className="column4">{"$" + row.sum.toFixed(2)}</div>
                </>
            );
        }
        let cartRows = this.getCartRows();
        let subtotal = 0;
        cartRows.forEach(row => {
            subtotal += row.sum;
        });
        let tax = subtotal * 0.15;
        let total = subtotal + tax;
        return (
            <StyledDiv>
                <p>Items in Your Cart</p>
                <div className="grid">
                    {cartRows.map(cartRowToElem)}
                    <div className="checkout">
                        <div>{"Subtotal: $" + subtotal.toFixed(2)}</div>
                        <div>{"Tax: $" + tax.toFixed(2)}</div>
                        <div className="total">{"Total: $" + total.toFixed(2)}</div>
                        <div>
                            <StripeCheckout
                                token={this.onToken}
                                stripeKey="pk_test_CbChalMirIckpyK58YocKE0V00RO7dyhuZ"
                            >
                                <button>Checkout</button>
                            </StripeCheckout>
                        </div>
                    </div>
                </div>
            </StyledDiv>
        )
    }
}

let mapStateToProps = state => {
    return { lgin: state.loggedIn, products: state.products, cartItems: state.cartItems };
};
 
export default withRouter(connect(mapStateToProps)(Cart));