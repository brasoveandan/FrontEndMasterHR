import MyInput from "./input";

const SearchBox = ({ value, onChange, placeholder, disable }) => {
    return (
        <MyInput
            type="search"
            name="query"
            className="form-control"
            placeholder={placeholder}
            value={value}
            disable={disable}
            onChange={e => onChange(e.currentTarget.value)}
        />
    );
};

export default SearchBox;
