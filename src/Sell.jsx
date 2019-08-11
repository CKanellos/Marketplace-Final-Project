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
            width: 450px;
        }

        &.text {
            flex: 1;
            margin-right: 100px;

            input[type="text"] {
                width: 100%;
            }

            input[type="submit"] {
                background-color: #004d8a;
                color: white;
                padding: 20px;
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
    handleSubmit = (evt) => {
        evt.preventDefault();
        // TODO
    }
    render = () => {
        if (this.props.lgin === null || !this.props.lgin) {
            return <></>;
        }
        return (
            <StyledForm onSubmit={this.handleSubmit}>
                <div className="back"></div>
                <div className="img">
                    <img src="/pic.png" />
                    <input type="file" />
                </div>
                <div className="text">
                    <input type="text" placeholder="Title"/><br />
                    <input type="text" placeholder="Location" /><br />
                    <input type="text" placeholder="Description" /><br />
                    <input type="text" placeholder="Price" /><br />
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