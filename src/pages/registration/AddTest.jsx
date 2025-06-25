import React, { Component } from 'react';
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { formCode } from '../../components/Enumeration';

class AddTest extends Component {
    render() {
        return (
            <Row>
                <Col md={12}>
                    {(this.props.hideQualisForms &&
                        this.props.hideQualisForms.findIndex(item => item.nformcode === formCode.TESTPACKAGE) === -1)
                        &&
                        <FormSelectSearch
                            name={"ntestpackagecode"}
                            formLabel={this.props.intl.formatMessage({ id: "IDS_TESTPACKAGE" })}
                            options={this.props.TestPackage || []}
                            optionId={"ntestpackagecode"}
                            optionValue="stestpackagename"
                            isSearchable={true}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={false}
                            alphabeticalSort="true"
                            value={this.props.selectPackage && this.props.selectPackage["ntestpackagecode"] ?
                                this.props.selectPackage["ntestpackagecode"] : []}
                            isClearable={true}
                            defaultValue={this.props.selectPackage ? this.props.selectPackage["ntestpackagecode"] : ""}
                            closeMenuOnSelect={true}
                            onChange={(event) => this.props.onTestPackageChange(event, "ntestpackagecode", "", true)}
                        />
                    }
                    {/* ALPD-3404 */}
                    <FormSelectSearch
                        name={"nsectioncode"}
                        formLabel={this.props.intl.formatMessage({ id: "IDS_TESTSELECTION" })}
                        options={this.props.TestSection || []}
                        optionId={"nsectioncode"}
                        optionValue="ssectionname"
                        isSearchable={true}
                        isClearable={true}
                        placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={false}
                        alphabeticalSort="true"
                        value={this.props.selectSection && this.props.selectSection["nsectioncode"] ?
                            this.props.selectSection["nsectioncode"] : []}

                        defaultValue={this.props.selectSection ? this.props.selectSection["nsectioncode"] : ""}
                        closeMenuOnSelect={true}
                        onChange={(event) => this.props.onTestSectionChange(event, "nsectioncode", "", true)}
                    />

                    <FormMultiSelect
                        name={"ntestgrouptestcode"}
                        label={this.props.intl.formatMessage({ id: "IDS_TESTNAME" })}
                        options={this.props.TestCombined || []}
                        optionId={"ntestgrouptestcode"}
                        optionValue="stestsynonym"
                        value={this.props.selectedTestData && this.props.selectedTestData["ntestgrouptestcode"] ? this.props.selectedTestData["ntestgrouptestcode"] : []}
                        isMandatory={true}
                        isClearable={true}
                        disableSearch={false}
                        disabled={false}
                        closeMenuOnSelect={false}
                        alphabeticalSort={true}
                        onChange={(event) => this.props.TestChange(event, "ntestgrouptestcode")}
                        customArrow={true}

                    />
                </Col>

            </Row>
        );
    }
}

export default injectIntl(AddTest);