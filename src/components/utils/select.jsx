import {FormGroup, FormLabel} from "react-bootstrap";

export const currencyOptions = ["RON", "EURO", "USD"];
export const contractTypeOptions = ["Norma 8 ore / zi", "Norma 6 ore / zi", "Norma 4 ore / zi"];
export const departmentOptions = ["Resurse Umane", "Controlling", "Productie", "IT"]
export const positionOptions = ["Head of Department", "Group Leader", "Employee", "Student"]
export const taxExemptOptions = ["Da", "Nu"]


const MySelect = ({className, name, label, options, error, ...rest }) => {
    return (
        <FormGroup>
            <FormLabel htmlFor={name}>{label}</FormLabel>
            <select name={name} id={name} {...rest} className={className}>
                <option value="">Selectează...</option>
                {options.map((option, index) => (
                    <option key={index} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            {error && <div className="alert alert-danger">{error}</div>}
        </FormGroup>
    );
};

export default MySelect;
