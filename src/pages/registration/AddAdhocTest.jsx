import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { transactionStatus } from '../../components/Enumeration';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { MediaHeader } from '../product/product.styled';
	//ALPD-3615--Start
class AddTest extends Component {

    render() {

        return (
            <>
                <Row>
                    <div>
                        <Row className="mb-4">
                            <Col md={12}>
                                <MediaHeader className={`labelfont`}>
                                    {
                                        `${this.props.intl.formatMessage({ id: "IDS_SPECWITHVERSION" })}: ${this.props.selectedAdhocTestData ? this.props.selectedAdhocTestData["specName"] : ""}`
                                    }
                                </MediaHeader>
                            </Col>
                        </Row>
                    </div>
                </Row>
                < Row >
                    <Col md={12}>
                        <FormSelectSearch
                            name={"ntestcode"}
                            formLabel={this.props.intl.formatMessage({ id: "IDS_TESTNAME" })}
                            options={this.props.availableAdhocTest || []}
                            optionId={"ntestcode"}
                            optionValue="stestsynonym"
                            value={this.props.selectedAdhocTestData && this.props.selectedAdhocTestData["ntestcode"] ? this.props.selectedAdhocTestData["ntestcode"] : []}
                            defaultValue={this.props.selectedAdhocTestData ? this.props.selectedAdhocTestData["ntestcode"] : ""}
                            isMandatory={true}
                            isClearable={true}
                            isSearchable={true}
                            disabled={false}
                            closeMenuOnSelect={true}
                            alphabeticalSort={true}
                            onChange={(event) => this.props.TestChange(event, "ntestcode")}

                        />
                    </Col>
                    <Col md={12}>
                        <CustomSwitch
                            label={this.props.intl.formatMessage({ id: "IDS_VISIBLETESTINTESTGROUP" })}
                            type="switch"
                            name={"visibleadhoctest"}
                            onChange={(event) => this.props.onInputOnChange(event, '', '')}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_VISIBLETESTINTESTGROUP" })}
                            defaultValue={this.props.selectedAdhocTestData ? this.props.selectedAdhocTestData["visibleadhoctest"] === transactionStatus.YES ? true : false : ""}
                            isMandatory={false}
                            required={false}
                            checked={this.props.selectedAdhocTestData ? this.props.selectedAdhocTestData["visibleadhoctest"] === transactionStatus.YES ? true : false : false}
                        //disabled={props.specBasedComponent && props.specBasedComponent === true ? true : false }

                        />
                    </Col>
                </Row>
            </>
        );
    }
}
	//ALPD-3615--End

export default injectIntl(AddTest);