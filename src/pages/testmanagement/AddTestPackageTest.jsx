import React from 'react';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';

const AddTestPackageTest = (props) => {
    return (
        //<Col md="12">
            <FormSelectSearch
                formLabel={props.intl.formatMessage({ id: "IDS_TESTPACKAGE" })}
                name={"ntestpackagecode"}
                isDisabled={false}
                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                isMandatory={props.isMulti}
                showOption={props.isMulti}
                options={props.package}
                optionId='ntestpackagecode'
                optionValue='stestpackagename'
                onChange={value => props.onComboChange(value, props.isMulti?"availableData":"ntestpackagecode", 1)}
                value={props.selectedRecord?props.selectedRecord[props.isMulti?"availableData":"stestpackagename"]:""}
                isMulti={props.isMulti}
                isSearchable={true}
                closeMenuOnSelect={!props.isMulti}
                alphabeticalSort={true}
                isClearable={true}
            >
            </FormSelectSearch>
       // </Col>
    );
};

export default injectIntl(AddTestPackageTest);