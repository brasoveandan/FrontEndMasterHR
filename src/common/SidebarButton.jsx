import React, { Component } from 'react';
import {
    FaAddressCard,
    FaBars, FaCalculator, FaClock,
    FaFileInvoiceDollar,
    FaFolderPlus,
    FaHistory,
    FaIdCard,
    FaPlaneDeparture, FaRegCalendarTimes, FaSignOutAlt,
    FaUserClock, FaUserEdit, FaUserPlus, FaVoicemail
} from "react-icons/all";

export default class SidebarButton extends Component {

    //this function will identify what icon to render
    renderIcon = () => {
        switch(this.props.btnText) {
            case 'Detalii contract': return <FaIdCard className="mr-2"/>;
            case 'Fluturaș salariu': return <FaFileInvoiceDollar className="mr-2"/>;
            case 'Vizualizare concedii': return <FaPlaneDeparture className="mr-2"/>;
            case 'Vizualizare pontaj': return <FaUserClock className="mr-2"/>;
            case 'Înregistrare cerere': return <FaFolderPlus className="mr-2"/>;
            case 'Istoric cereri': return <FaHistory className="mr-2"/>;
            case 'Vizualizare conturi': return <FaAddressCard className="mr-2"/>;
            case 'Adaugă cont': return <FaUserPlus className="mr-2"/>;
            case 'Vizualizare cereri': return <FaVoicemail className="mr-2"/>;
            case 'Editare conturi': return <FaUserEdit className="mr-2"/>;
            case 'Inchidere luna': return <FaRegCalendarTimes className="mr-2"/>;
            case 'Calcul salar': return <FaCalculator className="mr-2"/>;
            case 'Adaugă pontaj': return <FaClock className="mr-2"/>;
            case 'Deconectare': return <FaSignOutAlt className="mr-2"/>;
            default: return <FaBars className="mr-2"/>;
        }
    }

    show = () => {
        switch(this.props.btnText){
            case 'Detalii contract': this.props.show("detalii_contract"); break;
            case 'Vizualizare pontaj': this.props.show("vizualizare_pontaj"); break;
            case 'Fluturaș salariu': this.props.show("fluturas_salariu"); break;
            case "vizualizare_concedii" : this.props.show("vizualizare_concedii"); break;
            case 'Înregistrare cerere' : this.props.show("inregistrare_cerere"); break;
            case 'Istoric cereri' : this.props.show("istoric_cereri"); break;
            case 'Vizualizare conturi':this.props.show("vizualizare_conturi"); break;
            case 'Adaugă cont':this.props.show("adauga_cont"); break;
            case 'Vizualizare cereri':this.props.show("vizualizare_cereri"); break;
            case 'Editare conturi':this.props.show("editare_angajat"); break;
            case 'Inchidere luna':this.props.show("inchide_luna"); break;
            case 'Calcul salar':this.props.show("calcul_salar"); break;
            case 'Adaugă pontaj':this.props.show("adauga_pontaj"); break;
            case 'Deconectare': this.props.show("logout"); break;
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