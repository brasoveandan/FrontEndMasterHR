import React from 'react'
import Joi from 'joi-browser';
import MySelect from "./MySelect";
import MyInput from "./MyInput";
import {Button} from "react-bootstrap";
import MyTextarea from "./MyTextarea";

export default class MyForm extends React.Component{
    state = {
        data: {},
        errors: {}
    };


    validate = () => {
        const options = {abortEarly: false};
        const {error} = Joi.validate(this.state.data, this.schema, options);

        if (!error) return null;

        const errors = {};

        for(let item of error.details)
            errors[item.path[0]] = item.message;
        return errors;
    }

    validateProperty = ({name, value}) => {
        const obj = {[name]: value};
        const schema = { [name]: this.schema[name] };
        const {error} = Joi.validate(obj, schema);

        return error ? error.details[0].message : null;
    }

    handleSubmit = (action, e) => {
        e.preventDefault();
        const errors = this.validate();
        this.setState({errors: errors || {} });
        if (errors) return;

        this.doSubmit(action);
    }

    handleChange = ({currentTarget: input }) => {
        const errors = { ...this.state.errors};
        const errorMessage = this.validateProperty(input);
        if(errorMessage) errors[input.name]=errorMessage;
        else delete errors[input.name];

        const data = {...this.state.data};
        data[input.name] = input.value;
        this.setState({data, errors});
    }

    renderButton(className, label, type) {
        return  (
            <Button className={className} type={type}>
                {label}
            </Button>
        )
    }

    renderSelect(className, name, label, options) {
        const { data, errors } = this.state;
        return (
            <MySelect
                className = {className}
                name={name}
                value={data[name]}
                label={label}
                options={options}
                onChange={this.handleChange}
                error={errors[name]}
            />
        );
    }

    renderInput(className, name, label, placeholder, type = 'text', readOnly = false) {
        const {data, errors} = this.state;
        return (
            <MyInput
            className={className}
            type={type}
            name={name}
            value={data[name]}
            label={label}
            placeholder = {placeholder}
            readOnly={readOnly}
            onChange={this.handleChange}
            error={errors[name]}
            />
        )
    }

    renderTextarea(className, name, label, placeholder, rows, readOnly = false) {
        const {data, errors} = this.state;
        return (
            <MyTextarea
                className={className}
                rows={rows}
                name={name}
                value={data[name]}
                label={label}
                placeholder = {placeholder}
                readOnly={readOnly}
                onChange={this.handleChange}
                error={errors[name]}
            />
        )
    }




}
