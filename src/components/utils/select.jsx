import {FormGroup, FormLabel} from "react-bootstrap";

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
