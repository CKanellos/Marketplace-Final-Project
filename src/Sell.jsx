import React, { Component } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

class Sell extends Component {
    componentDidMount = () => {
        if (!this.props.lgin) {
            this.props.history.push('/');
        }
    }
    render = () => {
        if (!this.props.lgin) {
            return <></>;
        }
        return (
            'Sell component'
        )
    }
}

let mapStateToProps = state => {
    return { lgin: state.loggedIn };
};
 
export default withRouter(connect(mapStateToProps)(Sell));