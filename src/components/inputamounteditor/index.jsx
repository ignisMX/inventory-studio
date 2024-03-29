import { InputNumber } from 'primereact/inputnumber';

export const InputAmountEditor = (props) => {
    const { row, field, updateField, disable } = { ...props };
    return (
        <InputNumber
            value={row[field]}
            onChange={(event) => updateField(field, event)}
            mode="currency"
            currency="USD"
            locale="en-US"
            disabled={disable}
        />
    );
};
