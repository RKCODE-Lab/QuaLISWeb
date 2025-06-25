import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { injectIntl } from 'react-intl';

const TestCategoryFilter = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormSelectSearch
                    name={"ntestcategorycode"}
                    formLabel={props.intl.formatMessage({ id: "IDS_TESTCATEGORY" })}
                    //menuPosition="fixed"
                    isSearchable={true}
                    placeholder="Please Select..."
                    options={props.filterTestCategory}
                    optionId='ntestcategorycode'
                    optionValue='stestcategoryname'
                    value={props.nfilterTestCategory? props.nfilterTestCategory: ""}
                    onChange={value => props.onComboChange(value, "ntestcategorycode", 3)}
                >
                </FormSelectSearch>
            </Col>
        </Row>
    );
};

export default injectIntl(TestCategoryFilter);