//import { faPlus } from '@fortawesome/free-solid-svg-icons';
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { Component } from 'react';
import { Col, Nav, Row } from 'react-bootstrap';
import { FormattedMessage, injectIntl } from 'react-intl';
//import FormInput from '../../components/form-input/form-input.component';
import FormMultiSelect from '../../components/form-multi-select/form-multi-select.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import DynamicSlideout from '../dynamicpreregdesign/DynamicSlideout';
import { HeaderSpan } from '../registration/registration.styled';
import { formCode } from '../../components/Enumeration';

class AddSubSampleConfiguration extends Component {

    render() {
        // console.log("spec jsx:", this.props);
        return (
            <Row>
                {this.props.specBasedComponent &&
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id: "IDS_COMPONENT" })}
                            isSearchable={true}
                            name={"ncomponentcode"}
                            // isDisabled={false}
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            options={this.props.Component}
                            alphabeticalSort="true"
                            optionId="ncomponentcode"
                            optionValue="scomponentname"
                            // value={this.props.selectComponent ? this.props.selectComponent["ncomponentcode"] : ""}
                            //Added by Dhanushya for jira ETICA-22
                            value={this.props.selectComponent && this.props.selectComponent["ncomponentcode"]!==undefined ? this.props.selectComponent["ncomponentcode"] : ""}
                           // defaultValue={this.props.selectComponent ? this.props.selectComponent["ncomponentcode"] : ""}
                            closeMenuOnSelect={true}
                            isDisabled={this.props.childoperation === "update" ? true : false}
                            onChange={(event) => this.props.onComponentChange(event, 'ncomponentcode')}>
                        </FormSelectSearch>
                    </Col>
                }

                <Col md={12}>
                    <DynamicSlideout
                        editfield={this.props.childoperation === "update" ?
                            this.props.editfield ? this.props.editfield['subsampleeditable'] : undefined : undefined}
                        selectedRecord={this.props.selectComponent}
                        selectedSample={this.props.selectComponent}
                        templateData={this.props.templateData}
                        handleChange={this.props.handleChange}
                        handleDateChange={this.props.handleDateChange}
                        onInputOnChange={this.props.onInputOnChange}
                        onNumericInputChange={this.props.onNumericInputChange}
                        comboData={this.props.comboData}
                        onComboChange={this.props.onComboChange}
                        userInfo={this.props.userInfo}
                        timeZoneList={this.props.timeZoneList}
                        defaultTimeZone={this.props.defaultTimeZone}
                        onNumericBlur={this.props.onNumericBlur}
                        addMasterRecord={this.props.addMasterRecord}
                        userRoleControlRights={this.props.userRoleControlRights}
                        onDropFile={this.props.onDropFile}
                        deleteAttachment={this.props.deleteAttachment}
                    />
                </Col>

                {/* <Col md={12}> */}
                {this.props.childoperation === "create" ?
                    <Col md={12}>

                        <Row noGutters={true}>
                            {/* <Row noGutters={true}> */}
                            <Col md={12} className="p-0">
                                <div className="actions-stripe">
                                    <div className="d-flex justify-content-end">
                                        <HeaderSpan style={{ "bottom": "18px" }}>
                                            <FormattedMessage id='IDS_ADDTEST' defaultMessage='Add Test' />
                                        </HeaderSpan>
                                        <Nav.Link className="add-txt-btn text-left"
                                        //onClick={(e) => this.props.AddSpec(e)}
                                        >
                                            {/* <FontAwesomeIcon icon={faPlus} /> { }{ } */}
                                            {/* <FormattedMessage id='IDS_TEST' defaultMessage='Test' /> */}
                                        </Nav.Link>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        {/* </Col> */}
                        {/* <Col md={12}> */}
                        {//this.props.userRoleControlRights && this.props.userRoleControlRights[QUALISFORMS.TESTPACKAGE] !== undefined &&
                            this.props.hideQualisForms && this.props.hideQualisForms.findIndex(item => item.nformcode === formCode.TESTPACKAGE) === -1 &&
                            <FormSelectSearch
                                name={"ntestpackagecode"}
                                formLabel={this.props.intl.formatMessage({ id: "IDS_TESTPACKAGE" })}
                                options={this.props.TestPackage || []}
                                optionId={"ntestpackagecode"}
                                optionValue="stestpackagename"
                                isSearchable={true}
                                isClearable={true}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                isMandatory={false}
                                alphabeticalSort="true"
                                value={this.props.selectPackage && this.props.selectPackage["ntestpackagecode"] ?
                                    this.props.selectPackage["ntestpackagecode"] : []}

                                defaultValue={this.props.selectPackage ? this.props.selectPackage["ntestpackagecode"] : ""}
                                closeMenuOnSelect={true}
                                onChange={(event) => this.props.onTestPackageChange(event, "ntestpackagecode", "", "AddSubSample")}
                            />
                        }

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
                            onChange={(event) => this.props.onTestSectionChange(event, "nsectioncode", "", "AddSubSample")}
                        />

                        <FormMultiSelect
                            name={"ntestgrouptestcode"}
                            label={this.props.intl.formatMessage({ id: "IDS_TESTNAME" })}
                            options={this.props.TestCombined || []}
                            optionId={"ntestgrouptestcode"}
                            optionValue="stestsynonym"
                            value={this.props.selectedTestData && this.props.selectedTestData["ntestgrouptestcode"] ?
                                this.props.selectedTestData["ntestgrouptestcode"] : []}
                            isMandatory={this.props.hasTest ? true : false}
                            isClearable={true}
                            disableSearch={false}
                            disabled={false}
                            closeMenuOnSelect={false}
                            alphabeticalSort={true}
                            onChange={(event) => this.props.TestChange(event, "ntestgrouptestcode")}

                        />
                    </Col>
                    : ""}
                {/* </Col> */}


            </Row>
        );
    }
}

export default injectIntl(AddSubSampleConfiguration);