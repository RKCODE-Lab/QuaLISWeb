import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';

const ScheduleTypeFilter = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormSelectSearch
                    name={"nschedulertypecode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_SCHEDULERTYPE" })}
                    //menuPosition="fixed"
                    isSearchable={true}
                    placeholder="Please Select..."
                    options={props.filterScheduleType}
                    optionId='nschedulertypecode'
                    optionValue='sschedulertypename'
                    value={props.nfilterScheduleType? props.nfilterScheduleType: ""}
                    onChange={value => props.onComboChange(value, "nschedulertypecode")}
                >
                </FormSelectSearch>
            </Col>
        </Row>
    );
};

export default injectIntl(ScheduleTypeFilter);