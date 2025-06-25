import React from 'react'
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

import FormTextarea from '../../components/form-textarea/form-textarea.component';
import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';

import {injectIntl } from 'react-intl';


const AddTestGroupTestMaterial = (props) => {
    return (
        <Row>
           
            <Col md={12}>
            <FormSelectSearch
                                   name={"nmaterialtypecode"}
                                   formLabel={ props.intl.formatMessage({ id:"IDS_MATERIALTYPE"})}                                
                                   placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}                                
                                   options={props.materialType}
                                   value={props.selectedRecord["nmaterialtypecode"] ? props.selectedRecord["nmaterialtypecode"] : ""}
                                   defaultValue={props.selectedRecord["nmaterialtypecode"]}
                                   isMandatory={true}
                                   isMulti={false}
                                   isSearchable={true}
                                   isDisabled={false}
                                   closeMenuOnSelect={true}
                                   alphabeticalSort={true}
                                   onChange = {(event)=> props.onComboChange(event, 'nmaterialtypecode',4)}                               
                              />
            </Col>
            <Col md={12}>
            <FormSelectSearch
                                   name={"nmaterialcatcode"}
                                   formLabel={ props.intl.formatMessage({ id:"IDS_MATERIALCATEGORY"})}                                
                                   placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}                                
                                   options={ props.materialCategoryList}
                                   value={props.selectedRecord["nmaterialcatcode"] ? props.selectedRecord["nmaterialcatcode"] : ""}
                                   defaultValue={props.selectedRecord["nmaterialcatcode"]}
                                   isMandatory={true}
                                   isMulti={false}
                                   isSearchable={true}
                                   isDisabled={false}
                                   closeMenuOnSelect={true}
                                   alphabeticalSort={true}
                                   onChange = {(event)=> props.onComboChange(event, 'nmaterialcatcode',5)}                               
                              />
            </Col>
            <Col md={12}>
            <FormSelectSearch
                                   name={"nmaterialcode"}
                                   formLabel={ props.intl.formatMessage({ id:"IDS_MATERIALNAME"})}                                
                                   placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}                                
                                   options={ props.materialList}
                                   value={props.selectedRecord["nmaterialcode"] ? props.selectedRecord["nmaterialcode"] : ""}
                                   defaultValue={props.selectedRecord["nmaterialcode"]}
                                   isMandatory={true}
                                   isMulti={false}
                                   isSearchable={true}
                                   isDisabled={false}
                                   closeMenuOnSelect={true}
                                   alphabeticalSort={true}
                                   onChange = {(event)=> props.onComboChange(event, 'nmaterialcode',1)}                               
                              />
                   
            
            </Col>
            
            <Col md={12}>
                <FormTextarea
                    label={props.intl.formatMessage({ id: "IDS_REMARKS" })}
                    name={"sremarks"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event,1)}
                    placeholder={props.intl.formatMessage({ id: "IDS_REMARKS" })}
                    value ={ props.selectedRecord["sremarks"]}
                    rows="2"                  
                    isMandatory={false}
                    required={true}
                    maxLength={"255"}
                />
            </Col>
        </Row>
    )
}
export default injectIntl(AddTestGroupTestMaterial);