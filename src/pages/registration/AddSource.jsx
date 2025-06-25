import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';

class AddSource extends Component {
    render() {
        return (
            <Row>
                <Col md={12}>
                    <FormMultiSelect
                        name={"ncountrycode"}
                        label={this.props.intl.formatMessage({ id: "IDS_SOURCENAME" })}
                        options={this.props.SourceCombined}
                        optionId={"ncountrycode"}
                        optionValue="scountryname"
                        value={this.props.selectedSourceData ? this.props.selectedSourceData["ncountrycode"] : ""}
                        isMandatory={true}
                        isClearable={true}
                        disableSearch={false}
                        disabled={false}
                        closeMenuOnSelect={false}
                        alphabeticalSort={true}
                        onChange={(event) => this.props.SourceChange(event, "ncountrycode")}
                    />
                </Col>

            </Row>
        );
    }
}

export default injectIntl(AddSource);