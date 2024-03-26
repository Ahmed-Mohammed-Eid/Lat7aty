import React from "react";
import { InputText } from "primereact/inputtext";

const CustomInputMask = ({ id, value, onChange, placeholder }) => {
    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        const cleanedValue = inputValue.replace(/-/g, "").substring(0, 8);
        let formattedValue = "";

        if (cleanedValue.length > 4) {
            formattedValue = cleanedValue.substring(0, 4) + "-" + cleanedValue.substring(4);
        } else {
            formattedValue = cleanedValue;
        }

        onChange(formattedValue);
    };

    return (
        <InputText
            id={id}
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
        />
    );
};

export default CustomInputMask;
