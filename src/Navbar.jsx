import React, { Component } from 'react';
import styled from 'styled-components';
import { Link, withRouter } from 'react-router-dom';
import { connect } from "react-redux";
 
const StyledNav = styled.nav`
    display: flex;
    align-items: center;
    justify-content: space-between;

    & > *:first-child {
        margin-left: 125px;
    }

    & > *:last-child {
        margin-right: 125px;
    }

    .logo {
        width: 70px;
    }

    .login {
        text-decoration: none;
        color: #004d8a;
        margin-right: 50px;
    }

    input[type="text"] {
        background-color: white;
        border: 1px solid rgba(112, 112, 112, 0.5);
        border-radius: 25px;
    }
`;

class Navbar extends Component {
    handleLogout = async evt => {
        let response = await fetch('/logout', { method: "POST", credentials: "include" });
        let body = await response.json();
        if (body.success) {
            this.props.dispatch({
                type: 'logout-success'
            })
            this.props.history.push('/');
        }
    }
    render = () => {
        if (this.props.lgin) {
            return (
                <StyledNav>
                    <div>
                        <Link to="/"><img src="/alibay.png" className="logo" /></Link>
                    </div>
                    <div>
                        <input type="text" />
                    </div>
                    <div>
                        <Link to="/products">Buy</Link>
                        <Link to="/sell">Sell</Link>
                        <button onClick={this.handleLogout} className="logout">LOGOUT</button>
                    </div>
                </StyledNav>
            )
        }
        return (
            <StyledNav>
                <div>
                    <Link to="/"><img src="/alibay.png" className="logo" /></Link>
                </div>
                <div>
                    <Link to="/login" className="login">LOGIN</Link>
                    <Link to="/signup" className="signup">SIGNUP</Link>
                </div>
            </StyledNav>
        );
    }
}

let mapStateToProps = state => {
    return { lgin: state.loggedIn };
};
 
export default withRouter(connect(mapStateToProps)(Navbar));
