import React from 'react';
import { Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';

const AddTestMethod = (props) => {
    return (
        //<Col md="12">
            <FormSelectSearch
                formLabel={props.intl.formatMessage({ id: "IDS_METHOD" })}
                name={"nmethodcode"}
                isDisabled={false}
                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                isMandatory={false}
                options={props.testMethodList}
                optionId='nmethodcode'
                optionValue='smethodname'
                onChange={value => props.onComboChange(value, "nmethodcode")}
                value={props.selectedRecord && props.selectedRecord["nmethodcode"] ?
                props.selectedRecord["nmethodcode"] : []}    
                isSearchable={true}
                alphabeticalSort={true}
                isClearable={true}
            >
            </FormSelectSearch>
        //</Col>
    );
};

export default injectIntl(AddTestMethod);