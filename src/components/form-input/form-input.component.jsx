import React, { useImperativeHandle, useRef } from 'react';
import './form-input.styles';
import { Form } from 'react-bootstrap';
import { whitespaceTrim } from '../CommonScript';

class  FormInput extends React.Component  {
//React.forwardRef((props, ref) => {
    // const inputRef = useRef();
                    // onFocus={props.onFocus}
    // const activate = () => {
    //     inputRef.current.focus();
    //     console.log('entered')
    // }

    // useImperativeHandle(ref, () => {
    //     return {

    //         focus: activate,

    //     }
    // })

    render(){
        return(
            <React.Fragment>
                <Form.Group className={`floating-label form-select w-100 floating-label react-select-wrap ${this.props.formGroupClassName? this.props.formGroupClassName: ""}`} controlId={this.props.name}>
                    <Form.Label htmlFor={this.props.name}>{this.props.label}{this.props.isMandatory && <sup>*</sup>}</Form.Label>
                    <Form.Control
                        id={this.props.name}
                        label={this.props.label}
                        onKeyDown={this.props.onKeyDown}
                        name={this.props.name}
                        type={this.props.type}
                        placeholder={this.props.placeholder}
                        onChange={this.props.onChange}
                        value={this.props.value}
                        isInvalid={this.props.isInvalid}
                        className={this.props.className}
                        defaultValue={this.props.defaultValue}
                        required={false}
                        maxLength={this.props.maxLength}
                        readOnly={this.props.readOnly}
                        disabled={this.props.isDisabled}
                        onBlur={this.props.onBlur}
                        onBlurCapture={this.props.onBlur?(e)=>{this.props.onChange(whitespaceTrim(e));this.props.onBlur(e)}:(e)=>{this.props.onChange&& this.props.onChange(whitespaceTrim(e))} }
                        onFocus={this.props.onFocus}
                        onKeyUp={this.props.onKeyUp}
                        onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}
                        autoComplete="off"
                        ref={this.props.inputRef}
                        min={this.props.minValue}
                        max={this.props.maxValue}
                        onPaste={this.props.onPaste === true?(e)=>{
                            e.preventDefault() 
                          } : this.props.value}
                          pattern={this.props.pattern}
                          style={this.props.style}
                    />
                    <Form.Control.Feedback type="invalid">
                    { this.props.errors }
                    </Form.Control.Feedback>
                </Form.Group>
            </React.Fragment>
        )
    }
 

}
FormInput.defaultProps = {
    type: "text",
    className: ""
}
// FormInput.propTypes = {
//     name: PropTypes.string.isRequired,
//     type: PropTypes.string,
//     placeholder: PropTypes.string.isRequired,
//     type: PropTypes.oneOf(['text', 'number', 'password']),
//     className: PropTypes.string,
//     value: PropTypes.any,
//     onChange: PropTypes.func.isRequired
//   }

export default FormInput;