import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styled from 'styled-components';

const StyledForm = styled.form`
    margin: 60px 125px 0 125px;
    display: flex;

    & > * {
        &.back {
            margin-left: 25px;
            margin-right: 58px;
            width: 32px;
        }

        &.img {
            margin-right: 63px;
            width: 350px;
            padding-left: 100px;

            img {
                height: 225px;
            }
        }

        &.text {
            flex: 1;
            margin-right: 100px;

            input[type="text"] {
                width: 100%;
            }

            input[type="submit"] {
                background-color: #2196f3;
                color: white;
                padding: 15px;
                border-radius: 5px;
                cursor: pointer;
                font-weight: bold;
                font-size: 1rem;
                outline: none;
                margin-top: 50px;
            }
        }
    }
`;

class Sell extends Component {
    constructor (props) {
        super(props)
        this.state = {
            title: '',
            location: '',
            description: '',
            price: '',
            image: null
        }
    }
    componentDidMount = async () => {
        let response = await fetch('/session');
        let body = await response.json();
        if (body.success) {
            this.props.dispatch({
                type: 'login-success'
            });
        }
        else {
            this.props.dispatch({
                type: 'logout-success'
            });
            this.props.history.push('/');
        }
    }
    handleSubmit = async (evt) => {
        evt.preventDefault();
        let data = new FormData();
        data.append("image", this.state.image);
        data.append("title", this.state.title);
        data.append("location", this.state.location);
        data.append("description", this.state.description);
        data.append("price", this.state.price);
        let response = await fetch("/addProduct", {
            method: "POST",
            body: data,
            credentials: "include"
        });
        let body = await response.json();
        if (!body.success) {
            this.props.dispatch({
                type: 'logout-success'
            });
            this.props.history.push('/');
            return;
        }
        this.props.dispatch({ type: "update-products", products: body.products });
        this.props.history.push('/items');
    }
    handleFileChange = evt => {
        this.setState({ image: evt.target.files[0] });
    }
    handleTitleChange = evt => {
        this.setState({ title: evt.target.value });
    }
    handleLocationChange = evt => {
        this.setState({ location: evt.target.value });
    }
    handleDescriptionChange = evt => {
        this.setState({ description: evt.target.value });
    }
    handlePriceChange = evt => {
        this.setState({ price: Number(evt.target.value) });
    }
    render = () => {;
        if (this.props.lgin === null || !this.props.lgin) {
            return <></>;
        }
        return (
            <StyledForm onSubmit={this.handleSubmit}>
                <div className="back"></div>
                <div className="img">
                    <img src="/pic.png" />
                    <input type="file" onChange={this.handleFileChange} />
                </div>
                <div className="text">
                    <input type="text" onChange={this.handleTitleChange} placeholder="Title"/><br />
                    <input type="text" onChange={this.handleLocationChange} placeholder="Location" /><br />
                    <input type="text" onChange={this.handleDescriptionChange} placeholder="Description" /><br />
                    <input type="text" onChange={this.handlePriceChange} placeholder="Price" /><br />
                    <input type="submit" />
                </div>
            </StyledForm>
        )
    }
}

let mapStateToProps = state => {
    return { lgin: state.loggedIn };
};
 
export default withRouter(connect(mapStateToProps)(Sell));