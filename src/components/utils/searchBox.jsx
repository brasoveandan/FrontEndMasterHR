import MyInput from "./input";

const SearchBox = ({ value, onChange, placeholder }) => {
    return (
        <MyInput
            type="search"
            name="query"
            className="form-control mb-4 mt-2"
            placeholder={placeholder}
            value={value}
            onChange={e => onChange(e.currentTarget.value)}
        />
    );
};

export default SearchBox;
