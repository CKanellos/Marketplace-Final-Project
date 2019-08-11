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
        display: flex;
        align-items: center;

        .search {
            margin-left: 50px;

            input[type="text"] {
                background-color: white;
                border: 1px solid rgba(112, 112, 112, 0.5);
                border-radius: 25px;
                width: 300px;
                padding: 5px;
            }
        }
    }

    & > *:last-child {
        margin-right: 125px;
        display: flex;
        align-items: center;
    }

    .logo {
        width: 70px;
    }

    .cart {
        width: 40px;
    }

    button {
        background-color: transparent;
        border: none;
        cursor: pointer;
    }

    .login,
    .buy,
    .sell,
    .logout {
        font-size: 1rem;
        color: rgba(0, 0, 0, 0.5);
        margin-right: 50px;

        &:hover {
            color: black;
        }

        &.active {
            color: black;
            pointer-events: none;
        }
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
        let path = this.props.location.pathname;
        if (this.props.lgin) {
            return (
                <StyledNav>
                    <div>
                        <Link to="/"><img src="/alibay.png" className="logo" /></Link>
                        <div className="search">
                            <input type="text" />
                        </div>
                    </div>
                    <div>
                        <Link to="/items" className={path === '/items' ? 'buy active' : 'buy'}> BUY</Link>
                        <Link to="/sell" className={path === '/sell' ? 'sell active' : 'sell'}>SELL</Link>
                        <button onClick={this.handleLogout} className="logout">LOGOUT</button>
                        <Link to="/cart"><img src="/cart.png" className="cart"/></Link>
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
                    <Link to="/login" className={path === '/login' ? 'login active' : 'login'}>LOGIN</Link>
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
