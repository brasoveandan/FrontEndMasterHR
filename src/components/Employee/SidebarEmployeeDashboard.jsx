import React from 'react';

import {Sidebar, Item, Logo, LogoText} from 'react-sidebar-ui'
import 'react-sidebar-ui/dist/index.css';
import {Link} from "react-router-dom";
import logo from "../../img/logo/MasterHR-logos_transparent.png";
import {
    FaFileInvoiceDollar,
    FaFolderPlus,
    FaHistory,
    FaIdCard,
    FaPlaneDeparture,
    FaSignOutAlt,
    FaUserClock
} from "react-icons/all";

export default class SidebarEmployeeDashboard extends React.Component {

    constructor(){
        super();
        this.redirect = this.redirect.bind(this)
    }

    redirect = () => {
        this.props.history.push('/')
    }

    render() {

        return (
            <Sidebar bgColor='black' isCollapsed={false}>

                <Link to="/employeedashboard">
                    <Logo
                        image={logo}
                        imageName='logo'/>
                </Link>

                <LogoText>Salut, {localStorage.getItem('name')}!</LogoText>

                <Item bgColor='black' onClick={() => this.props.show("detalii_contract")}>
                    <FaIdCard style={{marginRight: "1rem"}}/>
                    Detalii contract
                </Item>

                <Item bgColor='black' onClick={() => this.props.show("fluturas_salariu")}>
                    <FaFileInvoiceDollar style={{marginRight: "1rem"}}/>
                    Fluturaș salariu
                </Item>

                <Item bgColor='black' onClick={() => this.props.show("vizualizare_concedii")}>
                    <FaPlaneDeparture style={{marginRight: "1rem"}}/>
                    Vizualizare concedii
                </Item>

                <Item bgColor='black' onClick={() => this.props.show("vizualizare_pontaj")}>
                    <FaUserClock style={{marginRight: "1rem"}}/>
                    Vizualizare pontaj
                </Item>

                <Item bgColor='black' onClick={() => this.props.show("inregistrare_cerere")}>
                    <FaFolderPlus style={{marginRight: "1rem"}}/>
                    Înregistrare cerere
                </Item>

                <Item bgColor='black' onClick={() => this.props.show("istoric_cereri")}>
                    <FaHistory style={{marginRight: "1rem"}}/>
                    Istoric cereri
                </Item>

                <div className="mt-5">
                    <Item verticalAlign="bottom" bgColor='black' onClick={() => this.props.show("logout")}>
                        <FaSignOutAlt style={{marginRight: "1rem"}}/>
                        Logout
                    </Item>
                </div>

            </Sidebar>
        )
    };
}
