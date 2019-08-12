import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import styled from 'styled-components';

const StyledDiv = styled.div`
    form {
        margin-left: 100px;
    }

    .secondHeading {
        margin: 200px 0 25px 0;
    }
`;

class Signup extends Component {
    constructor(props) {
        super(props);
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
        this.setState({ password: event.target.value});
    }
    handleSubmit = async evt => {
        evt.preventDefault();
        let data = new FormData();
        data.append("username", this.state.username);
        data.append("password", this.state.password);
        let response = await fetch("/signup", { method: "POST", body: data });
        let body = await response.json();
        if (!body.success) {
            alert(body.msg);
            return;
        }
        this.props.dispatch({ 
            type: "login-success"
         });
         this.props.history.push('/items');
    }
    render = () => {
        if (this.props.lgin) {
            return <></>;
        }
        return (
            <StyledDiv className="homeLayout">
                <div className="left">
                    <form onSubmit={this.handleSubmit}>
                        <p className="secondHeading">Signup</p>
                        <input type="text" onChange={this.handleUsernameChange} placeholder="Username" required/> <br />
                        <input type="text" onChange={this.handlePasswordChange} placeholder="Password" required/> <br />
                        <input type="submit" value="SIGNUP"/>
                    </form>
                </div>
                <div className="right">
                    <img src="/marketplace.png" className="market"/>
                </div>
            </StyledDiv>
        )
    }
} 

let mapStateToProps = state => {
    return { lgin: state.loggedIn };
};

export default withRouter(connect(mapStateToProps)(Signup));