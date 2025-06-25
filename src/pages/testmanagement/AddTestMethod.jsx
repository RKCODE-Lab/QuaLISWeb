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
                isMandatory={props.isMulti}
                showOption={props.isMulti}
                options={props.method}
                optionId='nmethodcode'
                optionValue='smethodname'
                onChange={value => props.onComboChange(value, props.isMulti?"availableData":"nmethodcode", 1)}
                value={props.selectedRecord?props.selectedRecord[props.isMulti?"availableData":"nmethodcode"]:""}
                isMulti={props.isMulti}
                isSearchable={true}
                closeMenuOnSelect={!props.isMulti}
                alphabeticalSort={true}
                isClearable={true}
            >
            </FormSelectSearch>
        //</Col>
    );
};

export default injectIntl(AddTestMethod);