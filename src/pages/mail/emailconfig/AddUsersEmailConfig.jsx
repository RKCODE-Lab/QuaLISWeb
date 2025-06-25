import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import FormMultiSelect from '../../../components/form-multi-select/form-multi-select.component';




const AddUsersEmailConfig = (props) => {
    return (
        <Row>
           
            <Col md={12}>
                <FormMultiSelect
                     name={"nusercode"}
                     label={ props.intl.formatMessage({ id:"IDS_USERS" })}                              
                     options={ props.users || []}
                     optionId="nusercode"
                     optionValue="semail"
                     value = { props.selectedRecord["nusercode"] ? props.selectedRecord["nusercode"] || [] :[]}
                     isMandatory={true}                                               
                     isClearable={true}
                     disableSearch={false}                                
                     disabled={false}
                     closeMenuOnSelect={false}
                     alphabeticalSort={true}
                     onChange = {(event)=> props.onComboChange(event, "nusercode")}                               
                     
                            />
             </Col>
        </Row>
    );
};

export default injectIntl(AddUsersEmailConfig);