import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import { injectIntl } from 'react-intl';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
//import { transactionStatus } from "../../components/Enumeration";


const ReportInfoProject = (props) => {
    return (
        <Row> 
            
 <Col md={12}>
   
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_REPORTTEMPLATE" })}
                            isSearchable={true}
                            name={"nreporttemplatecode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={false}
                            isClearable={true}
                            options={props.reportTemplateList}
                            value={props.selectedRecord["nreporttemplatecode"] || ""}
                            defaultValue={props.selectedRecord["nreporttemplatecode"]}
                            onChange={(event) => props.onComboChange(event, "nreporttemplatecode", 3)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>


  


            <Col md={12}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_REPORTTEMPLATEVERSION" })}
                    name={"sreporttemplateversion"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_REPORTTEMPLATEVERSION" })}
                    value={props.selectedRecord ? props.selectedRecord["sreporttemplateversion"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={50}
                />
            </Col>
            <Col md={12}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_REVISION" })}
                    name={"srevision"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_REVISION" })}
                    value={props.selectedRecord ? props.selectedRecord["srevision"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={5}
                />
            </Col>
            <Col md={12}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_REVISIONAUTHOR" })}
                    name={"srevisionauthor"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_REVISIONAUTHOR" })}
                    value={props.selectedRecord ? props.selectedRecord["srevisionauthor"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={100}
                />
            </Col>
            <Col md={12}>
                <FormTextarea
                    name={"sintroduction"}
                    label={props.intl.formatMessage({ id: "IDS_INTRODUCTION" })}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_INTRODUCTION" })}
                    value={props.selectedRecord ? props.selectedRecord["sintroduction"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={500}
                />
            </Col>
            <Col md={12}>
                <FormTextarea
                    name={"stestproductheadercomments"}
                    label={props.intl.formatMessage({ id: "IDS_TESTPRODUCTHEADERCOMMENTS" })}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_TESTPRODUCTHEADERCOMMENTS" })}
                    value={props.selectedRecord ? props.selectedRecord["stestproductheadercomments"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={255}
                />
            </Col>
            <Col md={12}>
                <FormTextarea
                    name={"stestproductfootercomments1"}
                    label={props.intl.formatMessage({ id: "IDS_TESTPRODUCTFOOTERCOMMENTS1" })}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_TESTPRODUCTFOOTERCOMMENTS1" })}
                    value={props.selectedRecord ? props.selectedRecord["stestproductfootercomments1"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={500}
                />
            </Col>
            <Col md={12}>
                <FormTextarea
                    name={"stestproductfootercomments2"}
                    label={props.intl.formatMessage({ id: "IDS_TESTPRODUCTFOOTERCOMMENTS2" })}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_TESTPRODUCTFOOTERCOMMENTS2" })}
                    value={props.selectedRecord ? props.selectedRecord["stestproductfootercomments2"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={500}
                />
            </Col>
            <Col md={12}>
                <FormTextarea
                    name={"stestproductfootercomments3"}
                    label={props.intl.formatMessage({ id: "IDS_TESTPRODUCTFOOTERCOMMENTS3" })}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_TESTPRODUCTFOOTERCOMMENTS3" })}
                    value={props.selectedRecord ? props.selectedRecord["stestproductfootercomments3"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={500}
                />
            </Col>
            <Col md={12}>
                <FormTextarea
                    name={"stestproductfootercomments4"}
                    label={props.intl.formatMessage({ id: "IDS_TESTPRODUCTFOOTERCOMMENTS4" })}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_TESTPRODUCTFOOTERCOMMENTS4" })}
                    value={props.selectedRecord ? props.selectedRecord["stestproductfootercomments4"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={500}
                />
            </Col>
            <Col md={12}>
                <FormTextarea
                    name={"ssamplingdetails"}
                    label={props.intl.formatMessage({ id: "IDS_SAMPLINGDETAILS" })}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_SAMPLINGDETAILS" })}
                    value={props.selectedRecord ? props.selectedRecord["ssamplingdetails"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={500}
                />
            </Col>
            <Col md={12}>
                <FormTextarea
                    name={"suncertainitymeasurement"}
                    label={props.intl.formatMessage({ id: "IDS_UNCERTAINITYOFMEASUREMENT" })}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_UNCERTAINITYOFMEASUREMENT" })}
                    value={props.selectedRecord ? props.selectedRecord["suncertainitymeasurement"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={500}
                />
            </Col>
            
        </Row>  
    );

}
export default injectIntl(ReportInfoProject);