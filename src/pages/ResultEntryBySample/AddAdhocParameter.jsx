import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { injectIntl } from 'react-intl';
import { transactionStatus } from '../../components/Enumeration';

const AddAdhocParameter = (props) => {
    return (

        <Row>
            <Col md={12}>
                <FormMultiSelect
                    name={"ntestparametercode"}
                    label={ props.intl.formatMessage({ id:"IDS_ADHOCPARAMETER" })}                              
                    options={ props.adhocParamter || []}
                    optionId="value"
                    optionValue="label"
                    value = { props.selectedRecord && props.selectedRecord["nparamtercode"] ? props.selectedRecord["nparamtercode"] || [] :[]}
                    isMandatory={true}                                               
                    isClearable={true}
                    disableSearch={false}                                
                    disabled={false}
                    closeMenuOnSelect={false}
                    alphabeticalSort={true}
                    allItemSelectedLabel={props.intl.formatMessage({ id:"IDS_ALLITEMSAREMSELECTED" })}
                    noOptionsLabel={props.intl.formatMessage({ id:"IDS_NOOPTION" })}
                    searchLabel={props.intl.formatMessage({ id:"IDS_SEARCH" })}
                    selectAllLabel={props.intl.formatMessage({ id:"IDS_SELECTALL" })}
                    onChange = {(event)=> props.onComboChange(event, "nparamtercode")}
                />
            </Col>
            {/* <Col md={12}>
                <CustomSwitch
                    label={props.intl.formatMessage({ id: "IDS_INVISIBLEPARAMETERINTESTGROUP" })}
                    type="switch"
                    name={"nvisibleadhocparameter"}
                    onChange={(event) => this.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_INVISIBLEPARAMETERINTESTGROUP" })}
                    defaultValue={props.selectedRecord["nvisibleadhocparameter"] ===  transactionStatus.ACTIVE ? true : false}
                    isMandatory={false}
                    required={false}
                    checked={props.selectedRecord["nvisibleadhocparameter"] ===  transactionStatus.ACTIVE ? true : false}
                />
            </Col> */}
              
        </Row>



    )
}
export default injectIntl(AddAdhocParameter);
