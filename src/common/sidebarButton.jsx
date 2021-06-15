import React, { Component } from 'react';
import {
    FaAddressCard,
    FaBars,
    FaFileInvoiceDollar, FaHistory,
    FaIdCard, FaInbox, FaNotesMedical,
    FaPlaneDeparture, FaSignOutAlt,
    FaUserClock, FaUserCog, FaUserPlus
} from "react-icons/all";

export default class SidebarButton extends Component {

    //this function will identify what icon to render
    renderIcon = () => {
        switch(this.props.btnText) {
            case 'Detalii contract': return <FaIdCard className="mr-2"/>;
            case 'Fluturaș salariu': return <FaFileInvoiceDollar className="mr-2"/>;
            case 'Vizualizare concedii': return <FaPlaneDeparture className="mr-2"/>;
            case 'Vizualizare pontaj': return <FaUserClock className="mr-2"/>;
            case 'Vizualizare conturi': return <FaAddressCard className="mr-2"/>;
            case 'Adaugă cont': return <FaUserPlus className="mr-2"/>;
            case 'Cereri angajați': return <FaInbox className="mr-2"/>;
            case 'Contracte angajați': return <FaUserCog className="mr-2"/>;
            case 'Pontaje angajați': return <FaHistory className="mr-2"/>;
            case 'Concediu medical': return <FaNotesMedical className="mr-2"/>;
            case 'Deconectare': return <FaSignOutAlt className="mr-2"/>;
            default: return <FaBars className="mr-2"/>;
        }
    }

    show = () => {
        switch(this.props.btnText){
            case 'Detalii contract': this.props.show("detalii_contract"); break;
            case 'Vizualizare pontaj': this.props.show("vizualizare_pontaj"); break;
            case 'Fluturaș salariu': this.props.show("fluturas_salariu"); break;
            case "Vizualizare concedii" : this.props.show("vizualizare_concedii"); break;
            case 'Vizualizare conturi':this.props.show("vizualizare_conturi"); break;
            case 'Adaugă cont':this.props.show("adauga_cont"); break;
            case 'Cereri angajați' : this.props.show("cereri_angajati"); break;
            case 'Contracte angajați':this.props.show("contracte_angajati"); break;
            case 'Pontaje angajați':this.props.show("pontaje_angajati"); break;
            case 'Concediu medical':this.props.show("adaugare_concediu_medical"); break;
            case 'Deconectare': this.props.show("logout"); break;
            case '': break;
            default: this.props.show();
        }
    }

    render() {
        let ok;
        if (this.props.btnText === "Deconectare")
            ok = true
        return(
            <div className={ok ? this.props.className :  this.props.className + " sidebar-button list-group-item d-inline-block collapsed"} onClick={() => this.show()}>
                {this.renderIcon()}
                <span className={this.props.isCollapsed ? 'active' : "d-none d-md-inline"}>{this.props.btnText}</span>
            </div>
        )
    }
}
