import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';

const ProjectMasterFilter = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormSelectSearch
                    name={"nprojecttypecode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_PROJECTTYPE" })}
                    //menuPosition="fixed"
                    isSearchable={true}
                    // placeholder="Please Select..."
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    options={props.filterProjectType}
                    optionId='nprojecttypecode'
                    optionValue='sprojecttypename'
                    //     value={props.nfilterProjectType ? props.nfilterProjectType.nprojecttypecode: ""}
                    value={props.selectedRecord ? props.selectedRecord.nprojecttypecodevalue : ""}
                    //    value={props.filterProjectType ? props.filterProjectType[props.filterProjectType.length-1] : ""}
                    onChange={event => props.onComboChange(event, "nprojecttypecodevalue", 2)}
                >
                </FormSelectSearch>
            </Col>
        </Row>
    );
};

export default injectIntl(ProjectMasterFilter);