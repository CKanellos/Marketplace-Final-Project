import React, { Component } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

const StyledDiv = styled.div`
    
`;

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }
    componentDidMount = async () => {
        let response = await fetch('/session');
        let body = await response.json();
        if (body.success) {
            console.log('dispatching action to redux...');
            this.props.dispatch({
                type: 'login-success'
            });
            this.props.history.push('/products');
        }
        this.setState({ loading: false });
    }
    render = () => {
        if (this.state.loading || this.props.lgin) {
            return <></>;
        }
        return (
            <StyledDiv className="homeLayout">
                <div className="left">
                    <p className="firstHeading">Introducing <br /> Marketplace</p>
                    <p className="secondHeading">A New Platform to Buy and Sell <br /> With Your Local Community</p>
                    <Link to="/signup" className="signup">SIGNUP</Link>
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

export default withRouter(connect(mapStateToProps)(Home));
