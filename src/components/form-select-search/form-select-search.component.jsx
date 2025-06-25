import React//, { useState } 
from 'react';
import Select , { createFilter }from 'react-select';
import { Form } from 'react-bootstrap';
import { injectIntl } from 'react-intl';

const FormSelectSearch = ({
    name,
    formLabel,
    label,
    placeholder,
    isMandatory,
    optionId,
    optionValue,
    options,
    value,
    defaultValue,
    isMulti,
    //isSearchable, //Gowtham R - ALPD-5179 - Make LIMS Application Dropdown Searchable
    isDisabled,
    onChange,
    onBlur,
    closeMenuOnSelect,
    className,
    classNamePrefix,
    minMenuHeight,
    maxMenuHeight,
    openMenuOnFocus,
    menuPlacement,
    menuPortalTarget,
    menuPosition,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    isInvalid,
    required,
    onKeyUp,
    formGroupClassName,
    ...props
}) => {
   // const [matchFromStart, setMatchFromStart] = useState(false);
    // const filterConfig = {
    //     ignoreCase,
    //     ignoreAccents,
    //     trim,
    //     matchFrom: matchFromStart ? ('start' as const) : ('any' as const),
    //   };
    
    return (
        <React.Fragment>
            <Form.Group onKeyUp={onKeyUp} className={`form-select w-100 floating-label react-select-wrap ${formGroupClassName? formGroupClassName: ""}`} controlId={name}>
                <Select
                    inputId={name}
                    id={name}
                    name={name}
                    placeholder={placeholder}
                    options={options}
                    value={value}
                    isInvalid={isInvalid}
                    required={required}
                    defaultValue={defaultValue}
                    isMulti={isMulti}
                    //isSearchable={isSearchable}
                    isSearchable={true} //Gowtham R - ALPD-5179 - Make LIMS Application Dropdown Searchable
                    isDisabled={isDisabled}
                    isClearable={props.isClearable}
                    onChange={onChange}
                    onBlur={onBlur}
                    closeMenuOnSelect={closeMenuOnSelect}
                    className={className}
                    classNamePrefix="react-select"
                    minMenuHeight={minMenuHeight}
                    maxMenuHeight={maxMenuHeight}
                    openMenuOnFocus={true}
                    menuPlacement={"auto"}
                    autoComplete="off"
                    menuPosition={menuPosition}
                    noOptionsMessage={()=>props.intl.formatMessage({ id: "IDS_NOOPTIONS" })}
                    filterOption={createFilter({matchFrom:props.matchFrom ? props.matchFrom : 'any' })}
                   // filterOption={createFilter({matchFrom:'start' })}
                // menuPortalTarget={document.querySelector('body')}
                // menuPosition="absolute"
                // styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}

                />
                <Form.Label htmlFor={name}>{formLabel}{isMandatory && <sup>*</sup>}</Form.Label>
                <Form.Control.Feedback type="invalid">
                    {errors}
                </Form.Control.Feedback>
            </Form.Group>
        </React.Fragment>
    )


};
export default injectIntl(FormSelectSearch);