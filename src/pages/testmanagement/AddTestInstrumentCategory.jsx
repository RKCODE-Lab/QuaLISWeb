import React from 'react';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';

const AddTestInstrumentCategory = (props) => {
    return (
        //<Col md="12">
            <FormSelectSearch
                formLabel={props.intl.formatMessage({ id: "IDS_INSTRUMENTCATEGORY" })}
                name={"ninstrumentcatcode"}
                isDisabled={false}
                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                isMandatory={props.isMulti}
                showOption={props.isMulti}
                options={props.instrumentcategory}
                optionId='ninstrumentcatcode'
                optionValue='sinstrumentcatname'
                onChange={value => props.onComboChange(value, props.isMulti?"availableData":"ninstrumentcatcode", 1)}
                value={props.selectedRecord?props.selectedRecord[props.isMulti?"availableData":"ninstrumentcatcode"]:""}
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

export default injectIntl(AddTestInstrumentCategory);