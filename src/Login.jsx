import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styled from 'styled-components';

const StyledDiv = styled.div`
    form {
        margin-left: 75px;
    }

    .secondHeading {
        margin: 200px 0 25px 0;
    }
`;

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: ""
        }
    }
    componentDidMount = () => {
        if (this.props.lgin) {
            this.props.history.push('/products');
        }
    }
    handleUsernameChange = event => {
        this.setState({ username: event.target.value });
    }
    handlePasswordChange = event => {
        this.setState({ password: event.target.value });
    }
    handleSubmit = async evt => {
        evt.preventDefault();
        let data = new FormData();
        data.append("username", this.state.username);
        data.append("password", this.state.password);
        let response = await fetch("/login", {
            method: "POST",
            body: data,
            credentials: "include"
        });
        let responseBody = await response.text();
        let body = JSON.parse(responseBody);
        if (!body.success) {
            alert("login failed");
            return;
        }
        this.props.dispatch({
            type: "login-success"
        });
        this.props.history.push('/products');
    }
    render = () => {
        if (this.props.lgin) {
            return <></>;
        }
        return (
            <StyledDiv className="homeLayout">
                <div className="left">
                    <form onSubmit={this.handleSubmit}>
                        <p className="secondHeading">Login</p>
                        <input type="text" onChange={this.handleUsernameChange} placeholder="Username" required/> <br />
                        <input type="password" onChange={this.handlePasswordChange} placeholder="Password" required/> <br />
                        <input type="submit" value="LOGIN" />
                    </form>
                </div>
                <div className="right">
                    <img src="/marketplace.png" className="market"/>
                </div>
            </StyledDiv>
        );
    }
}

let mapStateToProps = state => {
    return { lgin: state.loggedIn };
};

export default withRouter(connect(mapStateToProps)(Login));