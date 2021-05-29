import {FormGroup, FormLabel} from "react-bootstrap";

const MyTextarea = ({className, name, label, rows, readOnly, disable, error, ...rest}) => {
    return (
        <FormGroup>
            <FormLabel htmlFor={name}>{ label }</FormLabel>
            <textarea
                readOnly={readOnly}
                //value={value}
                //onChange={onChange}
                //type={typed
                {...rest}
                rows={rows}
                name={name}
                id={name}
                className={className}
                disabled={disable}
            />
            {error && <div className="alert alert-danger">{error}</div>}
        </FormGroup>
    );
}

export default MyTextarea ;
