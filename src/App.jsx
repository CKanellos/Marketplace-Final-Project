import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import Home from './Home.jsx';
import Login from './Login.jsx'
import Signup from './Signup.jsx';
import Products from './Products.jsx';
import ProductSpecs from './ProductSpecs.jsx';
import Sell from './Sell.jsx';
import Footer from './Footer.jsx';

const renderHome = () => {
    return <Home />;
}

const renderLogin = () => {
    return <Login />;
}

const renderSignup = () => {
    return <Signup />;
}

const renderItems = () => {
    return <Products />;
}

const renderItemSpecs = (routerData) => {
    let itemId = Number(routerData.match.params.id);
    return <ProductSpecs itemId={itemId} />;
}

const renderSell = () => {
    return <Sell />;
}

class App extends Component {
    render = () => {
        return (
            <BrowserRouter>
                <Navbar />
                <Route exact={true} path="/" render={renderHome} />
                <Route exact={true} path="/login" render={renderLogin} />
                <Route exact={true} path="/signup" render={renderSignup} />
                <Route exact={true} path="/items" render={renderItems} />
                <Route exact={true} path="/itemSpecs/:id" render={renderItemSpecs} />
                <Route exact={true} path="/sell" render={renderSell} />
                <Footer />
            </BrowserRouter>
        );
    }
}

export default App;
