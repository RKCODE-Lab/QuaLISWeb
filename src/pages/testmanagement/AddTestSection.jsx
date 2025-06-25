import React from 'react';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';

const AddTestSection = (props) => {
    return (
        //  <Col md="12">
            <FormSelectSearch
                formLabel={props.intl.formatMessage({ id: "IDS_SECTION" })}
                name={"nsectioncode"}
                isDisabled={false}
                placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                isMandatory={true}
                showOption={props.isMulti}
                options={props.section}
                optionId='nsectioncode'
                optionValue='ssectionname'
                onChange={value => props.onComboChange(value, props.isMulti?"availableData":"nsectioncode", 1)}
                isMulti={props.isMulti}
                value={props.selectedRecord?props.selectedRecord[props.isMulti?"availableData":"nsectioncode"]:-1}
                isSearchable={true}
                closeMenuOnSelect={!props.isMulti}
                alphabeticalSort={true}
            >
            </FormSelectSearch>
        //  </Col>
    );
};

export default injectIntl(AddTestSection);