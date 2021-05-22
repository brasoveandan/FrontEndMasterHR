import MyInput from "./input";

const SearchBox = ({ value, onChange, placeholder }) => {
    return (
        <MyInput
            type="search"
            name="query"
            className="form-control"
            placeholder={placeholder}
            value={value}
            onChange={e => onChange(e.currentTarget.value)}
        />
    );
};

export default SearchBox;
