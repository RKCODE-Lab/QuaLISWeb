import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import FormInput from '../../components/form-input/form-input.component';
import { injectIntl } from 'react-intl';

class ValidateFormula extends Component {
    render() {
        return (
            <>
                <Row>
                    { this.props.DynamicFormulaFields && this.props.DynamicFormulaFields.map((fields, index)=>{
                            return (
                                <Col md="12" key={index}>
                                    <FormInput
                                        name={`dynamicformulafield_${index}`}
                                        label={fields.sdynamicfieldname}
                                        type="text"
                                        required={true}
                                        isMandatory={true}
                                        value={this.props.selectedRecord["formulainput"]?this.props.selectedRecord["formulainput"][`dynamicformulafield_${index}`]:""}
                                        placeholder={fields.sdynamicfieldname} 
                                        onChange = { (event) => this.props.onInputOnChange(event, 5, fields) }
                                        maxLength={10}
                                    />
                                </Col>
                            )
                        })
                    }
                    <Col md="12">
                        <FormTextarea
                            name={"sformulacalculationdetail"}
                            label={this.props.intl.formatMessage({ id: "IDS_FORMULA" })}
                            type="text"
                            placeholder={this.props.intl.formatMessage({ id: "IDS_FORMULA" })}
                            value={this.props.selectedRecord["sformulacalculationdetail"]?this.props.selectedRecord["sformulacalculationdetail"]:""}
                            required={false}
                            isDisabled={true}
                        /> 
                    </Col>
                </Row>
            </>
        );
    }
}

export default injectIntl(ValidateFormula);