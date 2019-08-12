import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import styled from 'styled-components';

const StyledDiv = styled.div`
    margin: 60px 125px 0 125px;
    display: flex;

    & > * {
        &.back {
            margin-left: 25px;
            margin-right: 58px;
            width: 32px;

            a {
                color: rgba(0, 0, 0, 0.5);
                font-size: 2.5rem;

                &:hover {
                    color: #01967b;
                }
            }
        }

        &.img {
            margin-right: 63px;
            width: 450px;

            img {
                width: 450px;
            }

            button {
                font-size: 1rem;
                background-color: transparent;
                border: none;
                cursor: pointer;
                color: rgba(0, 0, 0, 0.5);
                outline: none;

                &.disabled {
                    pointer-events: none;
                }

                &:hover {
                    color: #01967b;
                }
            }
        }

        &.text {
            margin-right: 100px;

            .title {
                margin-top: 0;

                font-size: 1.75rem;
            }

            .location {
                font-style: italic;
            }

            .description {
                line-height: 1.5rem;
            }

            .price {
                font-weight: bold;
                font-size: 1.20rem;
                margin-bottom: 50px;
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

            .note {
                color: rgba(0, 0, 0, 0.5);
                font-style: italic;
                margin-top: 20px;
            }
        }
    }

    .flipH {
        transform: scaleX(-1);
    }
`;

class ProductSpecs extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgIdx: 0
        };
    }
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
    handlePrevImg = (evt) => {
        if (this.state.imgIdx > 0) {
            this.setState({ imgIdx: this.state.imgIdx - 1 });
        }
    }
    handleNextImg = (evt) => {
        if (this.state.imgIdx < this.props.products[this.props.itemId].images.length - 1) {
            this.setState({ imgIdx: this.state.imgIdx + 1 });
        }
    }
    handleAddToCart = async (evt) => {
        let data = new FormData();
        data.append("itemId", this.props.itemId);
        let response = await fetch("/addtocart", {
            method: "POST",
            body: data,
            credentials: "include"
        });
        let body = await response.json();
        if (!body.success) {
            this.props.dispatch({ type: "logout-success" });
            this.props.history.push('/');
            return;
        }
        this.props.dispatch({ type: "set-cart-items", cartItems: body.cartItems });
    }
    render = () => {
        if (this.props.lgin === null || this.props.products.length === 0 || !this.props.lgin) {
            return <></>;
        }
        let productObj = this.props.products[this.props.itemId];
        let qtyInCart = 0;
        this.props.cartItems.forEach(itemId => {
            if (itemId === this.props.itemId) {
                qtyInCart++;
            }
        });
        return (
            <StyledDiv>
                <div className="back"><Link to="/items">&#9665;</Link></div>
                <div className="img">
                    <img src={productObj.images[this.state.imgIdx]} /><br />
                    <button className={this.state.imgIdx > 0 ? '' : 'disabled'} onClick={this.handlePrevImg}>&#9665;</button>
                    <button className={this.state.imgIdx < productObj.images.length - 1 ? 'flipH' : 'flipH disabled'} onClick={this.handleNextImg}>&#9665;</button>
                </div>
                <div className="text">
                    <p className="title">{productObj.title}</p>
                    <p className="location">{productObj.location}</p>
                    <p className="description">{productObj.description}</p>
                    <p className="price">{"$" + productObj.price.toFixed(2)}</p>
                    <button onClick={this.handleAddToCart}>Add to Cart</button>
                    <p className="note">{qtyInCart > 0 ? 'Qty in Cart: ' + qtyInCart : ''}</p>
                </div>
            </StyledDiv>
        )
    }
}

let mapStateToProps = state => {
    return { lgin: state.loggedIn, products: state.products, cartItems: state.cartItems };
};
 
export default withRouter(connect(mapStateToProps)(ProductSpecs));