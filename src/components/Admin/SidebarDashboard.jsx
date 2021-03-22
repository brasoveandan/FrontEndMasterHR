import React from 'react';

import {Sidebar, Item, Logo, LogoText} from 'react-sidebar-ui'
import {Link} from "react-router-dom";
import logo from "../../img/logo/MasterHR-logos_transparent.png";
import {
    FaAddressCard,
    FaSignOutAlt,
    FaUserPlus
} from "react-icons/all";


const mql = window.matchMedia(`(min-width: 830px)`);

export default class SidebarDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sidebarDocked: mql.matches,
            sidebarOpen: false
        };

        this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
        this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
        this.redirect = this.redirect.bind(this)
    }

    onSetSidebarOpen(open) {
        this.setState({ sidebarOpen: open });
    }

    mediaQueryChanged() {
        this.setState({ sidebarDocked: mql.matches, sidebarOpen: false });
    }

    redirect = () => {
        this.props.history.push('/')
    }

    render() {
        return (
            <div>
                <Sidebar bgColor="aqua" isCollapse={false}>
                    <Link to="/employeedashboard">
                        <Logo
                            image={logo}
                            imageName='logo'/>
                    </Link>
                    <LogoText>{localStorage.getItem('name')}</LogoText>
                    <Item bgColor='aqua' onClick={() => this.props.show("vizualizare_concedii")}>
                        <FaAddressCard style={{marginRight: "1rem"}}/>
                        Vizualizare conturi
                    </Item>
                    <Item bgColor='aqua' onClick={() => this.props.show("vizualizare_pontaj")}>
                        <FaUserPlus style={{marginRight: "1rem"}}/>
                        Adauga cont
                    </Item>
                    <div className="mt-5">
                        <Item verticalAlign="bottom" bgColor='aqua'  onClick={() => this.props.show("logout")}>
                            <FaSignOutAlt style={{marginRight: "1rem"}}/>
                            Deconectare
                        </Item>
                    </div>
                </Sidebar>
            </div>
        )
    };
}
