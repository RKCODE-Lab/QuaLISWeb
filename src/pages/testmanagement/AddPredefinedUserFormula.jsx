import React, { Component } from 'react';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { Col, Row } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import { injectIntl } from 'react-intl';


class AddPredefinedUserFormula extends Component {

    render() {
        
        return(
                <Row>
                    <Col md={12}>    
                   <FormInput
                        name={"sformulaname"}
                        label={this.props.intl.formatMessage({ id: "IDS_FORMULANAME" })}
                        type="text"
                        onChange={(event) => this.props.onInputOnChange(event, 1)}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_FORMULANAME" })}
                        value={this.props.selectedRecord? this.props.selectedRecord["sformulaname"]:""}
                        isMandatory="*"
                        required={true}
                        maxLength={100}
                    />
                   <FormSelectSearch
                        name={"npredefinedformulacode"}
                        formLabel={this.props.intl.formatMessage({ id:"IDS_PREDEFINEDFORMULA"})}                              
                        placeholder={this.props.intl.formatMessage({ id:"IDS_SELECTRECORD"})}                              
                        options={ this.props.preDefinedFormula || []}
                        value = { this.props.selectedRecord ? this.props.selectedRecord["npredefinedformulacode"]:""}
                        isMandatory={true}
                        isMulti={false}
                        isSearchable={true}                                
                        isDisabled={false}
                        closeMenuOnSelect={true}
                        onChange = {(event)=> this.props.onComboChange(event, 'npredefinedformulacode',1)}                               
                                />
                    </Col>
                        
                </Row>
            )   
        }

    }
    
    export default injectIntl(AddPredefinedUserFormula);