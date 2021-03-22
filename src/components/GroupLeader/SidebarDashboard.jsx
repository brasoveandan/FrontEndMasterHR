import React from 'react';

import {Sidebar, Item, Logo, LogoText} from 'react-sidebar-ui'
import {Link} from "react-router-dom";
import logo from "../../img/logo/MasterHR-logos_transparent.png";
import {
    FaFileInvoiceDollar,
    FaFolderPlus,
    FaHistory,
    FaIdCard,
    FaPlaneDeparture,
    FaSignOutAlt,
    FaUserClock, FaVoicemail
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
                    <Link to="/groupleaderdashboard">
                        <Logo
                            image={logo}
                            imageName='logo'/>
                    </Link>
                    <LogoText>{localStorage.getItem('name')}</LogoText>
                    <Item bgColor='aqua' onClick={() => this.props.show("detalii_contract")}>
                        <FaIdCard style={{marginRight: "1rem"}}/>
                        Detalii contract
                    </Item>
                    <Item bgColor='aqua' onClick={() => this.props.show("fluturas_salariu")}>
                        <FaFileInvoiceDollar style={{marginRight: "1rem"}}/>
                        Fluturaș salariu
                    </Item>
                    <Item bgColor='aqua' onClick={() => this.props.show("vizualizare_concedii")}>
                        <FaPlaneDeparture style={{marginRight: "1rem"}}/>
                        Vizualizare concedii
                    </Item>
                    <Item bgColor='aqua' onClick={() => this.props.show("vizualizare_pontaj")}>
                        <FaUserClock style={{marginRight: "1rem"}}/>
                        Vizualizare pontaj
                    </Item>
                    <Item bgColor='aqua' onClick={() => this.props.show("vizualizare_pontaj")}>
                        <FaVoicemail style={{marginRight: "1rem"}}/>
                        Vizualizare cereri
                    </Item>
                    <Item bgColor='aqua' onClick={() => this.props.show("inregistrare_cerere")}>
                        <FaFolderPlus style={{marginRight: "1rem"}}/>
                        Înregistrare cerere
                    </Item>
                    <Item bgColor='aqua' onClick={() => this.props.show("istoric_cereri")}>
                        <FaHistory style={{marginRight: "1rem"}}/>
                        Istoric cereri
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
