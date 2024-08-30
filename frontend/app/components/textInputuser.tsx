import React from 'react';

interface TextInputProps {
    id: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
    placeholder: string;
    isLarge?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ 
    id, 
    name, 
    value, 
    placeholder, 
    onChange, 
    type = "text", 
    required = false,
    isLarge = false,
}) => {
    return (
        <div className="mb-4">
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                required={required}
                className={`border border-gray-300 rounded-md shadow-sm 
                            focus:ring-blue-500 focus:border-blue-500 
                            ${isLarge ? 'h-12 text-lg' : 'h-10 text-base'} 
                            w-full p-2`}
            />
        </div>
    );
};

export default TextInput;
