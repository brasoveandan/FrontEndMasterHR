import {FormGroup, FormLabel} from "react-bootstrap";

const MyInput = ({className, name, label, type, readOnly, error, ...rest}) => {
    return (
        <FormGroup>
            <FormLabel htmlFor={name}>{ label }</FormLabel>
            <input
                readOnly={readOnly}
                //value={value}
                //onChange={onChange}
                //type={typed
                {...rest}
                type={type}
                name={name}
                id={name}
                className={className}
            />
            {error && <div className="alert alert-danger">{error}</div>}
        </FormGroup>
    );
}

export default MyInput ;
