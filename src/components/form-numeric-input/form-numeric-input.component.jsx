import React from 'react';
import NumericInput from 'react-numeric-input';
import { Form } from 'react-bootstrap';
// function handleFocus(e){
//     e.target.select();
// }

const FormNumericInput = ({
    name,
    type,
    placeholder,
    onChange,
    onKeyUp,
    className,
    value,
    isMandatory,
    children,
    label,
    // isInvalid,
    onBlur,
    errors,
    strict,
    step,
    min,
    max,
    noStyle,
    maxLength,
    precision,
    snap,
    isDisabled,
    required,
    ...props
}) => (
    <React.Fragment>
        {/* ALPD-4466 - condition added for addPadding props as border displayed in 
            other screens of this component usage */}
        <Form.Group className={`floating-label form-numeric-input ${props.addPadding  ? 'pt-2':""}`}>
       
            <NumericInput
                name={name}
                type={type}
                placeholder={placeholder}
                value={value}
                min={min}
                //onFocus={(e)=>handleFocus(e)}
                max={max}
                step={step}
                precision={precision}
                strict={strict}
                maxLength={maxLength}
                onChange={onChange}
                onKeyUp={onKeyUp}
                // isInvalid={isInvalid}
                onBlur={onBlur}
                snap={snap}
                noStyle={noStyle}
                className={className}
                disabled={isDisabled}
                required={false}
                autoComplete="off"
                onPaste={(e) => {
                    e.preventDefault()
                    return false;
                }}
            />
            <Form.Label htmlFor={name}>{label}{isMandatory && <sup>*</sup>}</Form.Label>

            {/* <Form.Control.Feedback type="invalid">
                { errors }
                </Form.Control.Feedback> */}
        </Form.Group>
    </React.Fragment>
);
FormNumericInput.defaultProps = {
    type: "number",
    className: ""
}
export default FormNumericInput;