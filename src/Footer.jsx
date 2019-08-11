import React, { Component } from 'react';
import styled from 'styled-components';

const StyledFooter = styled.footer`
    color: #004d8a;
    font-size: .8rem;
    margin: 0 125px;
    display: flex;
    align-items: center;
    width: calc(100vw - 250px);
    position: fixed;
    background-color: white;
    bottom: 0px;
    height: 40px;
    border-top: 1px solid rgba(112, 112, 112, 0.5);
`;

class Footer extends Component {
    render = () => {
        return (
            <StyledFooter>
                <span>&copy; Alibay Established 2019 by Costa Kanellos</span>
            </StyledFooter>
        );
    }
}
 
export default Footer;