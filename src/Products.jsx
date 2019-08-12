import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import styled from 'styled-components';

const StyledDiv = styled.div`
    display: grid;
    justify-content: center;
    grid-template-columns: auto auto auto auto;
    margin: 50px 125px 0 125px;

    & > * {
        margin: 10px;

        p {
            margin: 0;
        }

        img {
            height: 225px;
        }

        .title {
            margin-top: 10px;
        }

        .price {
            font-weight: bold;
            margin: 5px 0 20px 0;
        }
    }
`;

class Products extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount = () => {
        let updateProducts = async () => {
            let response = await fetch('/products');
            let body = await response.json();
            if (!body.success) {
                this.props.dispatch({ type: "logout-success" });
                this.props.history.push('/');
                return;
            }
            this.props.dispatch({ type: "login-success" });
            this.props.dispatch({ type: "update-products", products: body.products });
        };
        updateProducts();
    }
    render = () => {
        let productToElem = (productObj, idx) => {
            if (!productObj.title.toLowerCase().includes(this.props.query.toLowerCase())) {
                return <></>;
            }
            console.log('price', productObj.price);
            console.log('typeof price', typeof productObj.price);
            return (
                <Link to={'/itemSpecs/' + idx}>
                    <img src={productObj.images[0]} />
                    <p className="title">{productObj.title}</p>
                    <p className="price">{"$" + productObj.price.toFixed(2)}</p>
                </Link>
            )
        };
        if (this.props.lgin === null || this.props.products.length === 0 || !this.props.lgin) {
            return <></>;
        }
        return (
            <StyledDiv>{this.props.products.map(productToElem)}</StyledDiv>
        )
    }
}

let mapStateToProps = state => {
    return { lgin: state.loggedIn, products: state.products, query: state.searchQuery };
};
 
export default withRouter(connect(mapStateToProps)(Products));