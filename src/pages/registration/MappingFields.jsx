import React from 'react';
import { Row, Col, FormGroup, FormLabel } from 'react-bootstrap';
import { injectIntl, FormattedMessage } from 'react-intl';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { ReadOnlyText } from '../../components/App.styles';

const MappingFields = (props) => {
    return (
        <>
            <Row>
                {/* <Col md={6}>
                    <FormSelectSearch
                        name={"nexternalordertypecode"}
                        formLabel={props.intl.formatMessage({ id: "IDS_ORDERTYPE" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        options={props.orderTypeList || []}
                        value={props.selectedRecord && props.selectedRecord["nexternalordertypecode"] ? props.selectedRecord["nexternalordertypecode"] : ""}
                        defaultValue={props.selectedRecord && props.selectedRecord["nexternalordertypecode"] || {}}
                        isMulti={false}
                        isSearchable={true}
                        isMandatory={true}
                        isDisabled={false}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        onChange={(event) => props.onComboChange(event, "nexternalordertypecode")}
                    />
                </Col> */}
                <Col md={12}>
                    <FormSelectSearch
                        name={"nexternalordercode"}
                        formLabel={props.intl.formatMessage({ id: "IDS_ORDER" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        options={props.orderList || []}
                        value={props.selectedRecord && props.selectedRecord["nexternalordercode"] ? props.selectedRecord["nexternalordercode"] : ""}
                        defaultValue={props.selectedRecord && props.selectedRecord["nexternalordercode"] || {}}
                        isMulti={false}
                        isSearchable={true}
                        isMandatory={true}
                        isDisabled={false}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        onChange={(event) => props.onComboChange(event, "nexternalordercode")}
                    />
                </Col>

            </Row>
            <Row>
                <Col md={6}>
                    <FormGroup>
                        <FormLabel><FormattedMessage id="IDS_PATIENTID" /></FormLabel>
                        <ReadOnlyText>{props.selectedDetailField && Object.keys(props.selectedDetailField).length>0  ? props.selectedDetailField["spatientid"] : '-'}</ReadOnlyText>
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup>
                        <FormLabel><FormattedMessage id="IDS_PATIENTFIRSTNAME" /></FormLabel>
                        <ReadOnlyText>{props.selectedDetailField && Object.keys(props.selectedDetailField).length>0  ? props.selectedDetailField["spatientfirstname"] : '-'}</ReadOnlyText>
                    </FormGroup>
                </Col>
                <Col md={6}>
                    <FormGroup>
                        <FormLabel><FormattedMessage id="IDS_PATIENTLASTNAME" /></FormLabel>
                        <ReadOnlyText>{props.selectedDetailField && Object.keys(props.selectedDetailField).length>0  ? props.selectedDetailField["spatientlastname"] : '-'}</ReadOnlyText>
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup>
                        <FormLabel><FormattedMessage id="IDS_PATIENTFATHERNAME" /></FormLabel>
                        <ReadOnlyText>{props.selectedDetailField && Object.keys(props.selectedDetailField).length>0 ? props.selectedDetailField["spatientfathername"] : '-'}</ReadOnlyText>
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup>
                        <FormLabel><FormattedMessage id="IDS_INSTITUTION" /></FormLabel>
                        <ReadOnlyText>{props.selectedDetailField && Object.keys(props.selectedDetailField).length>0  ? props.selectedDetailField["sinstitutionname"] : '-'}</ReadOnlyText>
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup>
                        <FormLabel><FormattedMessage id="IDS_INSTITUTIONSITE" /></FormLabel>
                        <ReadOnlyText>{props.selectedDetailField && Object.keys(props.selectedDetailField).length>0  ? props.selectedDetailField["sinstitutionsitename"] : '-'}</ReadOnlyText>
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup>
                        <FormLabel><FormattedMessage id="IDS_SUBMITTERFIRSTNAME" /></FormLabel>
                        <ReadOnlyText>{props.selectedDetailField && Object.keys(props.selectedDetailField).length>0  ? props.selectedDetailField["ssubmitterfirstname"] : '-'}</ReadOnlyText>
                    </FormGroup>
                </Col>


                <Col md={6}>
                    <FormGroup>
                        <FormLabel><FormattedMessage id="IDS_SUBMITTERLASTNAME" /></FormLabel>
                        <ReadOnlyText>{props.selectedDetailField && Object.keys(props.selectedDetailField).length>0  ? props.selectedDetailField["ssubmitterlastname"] : '-'}</ReadOnlyText>
                    </FormGroup>
                </Col>

                <Col md={6}>
                    <FormGroup>
                        <FormLabel><FormattedMessage id="IDS_SUBMITTERID" /></FormLabel>
                        <ReadOnlyText>{props.selectedDetailField && Object.keys(props.selectedDetailField).length>0  ? props.selectedDetailField["ssubmitterid"] : '-'}</ReadOnlyText>
                    </FormGroup>
                </Col>
           

            <Col md={6}>
                <FormGroup>
                    <FormLabel><FormattedMessage id="IDS_DISTRICT" /></FormLabel>
                    <ReadOnlyText>{props.selectedDetailField && Object.keys(props.selectedDetailField).length>0  ? props.selectedDetailField["sdistrictname"] : '-'}</ReadOnlyText>
                </FormGroup>
            </Col>

            </Row>





            {/* <Row>
                <Col md={6}>
                    <FormInput
                        label={props.intl.formatMessage({ id: "IDS_PATIENTID" })}
                        name={"ssitename"}
                        type="text"
                        /// onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id: "IDS_PATIENTID" })}
                        value={props.selectedDetailField ? props.selectedDetailField["spatientid"] : ""}
                        isMandatory={true}
                        required={true}
                        maxLength={"100"}
                        disabled={true}
                    />
                    <FormInput
                        label={props.intl.formatMessage({ id: "IDS_PATIENTLASTNAME" })}
                        name={"ssitename"}
                        type="text"
                        // onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id: "IDS_PATIENTLASTNAME" })}
                        value={props.selectedDetailField ? props.selectedDetailField["spatientlastname"] : ""}
                        isMandatory={true}
                        required={true}
                        maxLength={"100"}
                        disabled={true}
                    />

                    <FormInput
                        label={props.intl.formatMessage({ id: "IDS_INSTITUTION" })}
                        name={"ssitename"}
                        type="text"
                        //  onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id: "IDS_INSTITUTION" })}
                        value={props.selectedDetailField ? props.selectedDetailField["sinstitutionname"] : ""}
                        isMandatory={true}
                        required={true}
                        maxLength={"100"}
                        disabled={true}
                    />

                    <FormInput
                        label={props.intl.formatMessage({ id: "IDS_SUBMITTERFIRSTNAME" })}
                        name={"ssitename"}
                        type="text"
                        //   onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id: "IDS_SUBMITTERFIRSTNAME" })}
                        value={props.selectedDetailField ? props.selectedDetailField["ssubmitterfirstname"] : ""}
                        isMandatory={true}
                        required={true}
                        maxLength={"100"}
                        disabled={true}
                    />
                    <FormInput
                        label={props.intl.formatMessage({ id: "IDS_SUBMITTERCODE" })}
                        name={"ssitename"}
                        type="text"
                        // onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id: "IDS_SUBMITTERCODE" })}
                        value={props.selectedDetailField ? props.selectedDetailField["ssubmittercode"] : ""}
                        isMandatory={true}
                        required={true}
                        maxLength={"100"}
                        disabled={true}
                    />
                </Col>
                <Col md={6}>
                    <FormInput
                        label={props.intl.formatMessage({ id: "IDS_PATIENTFIRSTNAME" })}
                        name={"ssitename"}
                        type="text"
                        //onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id: "IDS_PATIENTFIRSTNAME" })}
                        value={props.selectedDetailField ? props.selectedDetailField["spatientfirstname"] : ""}
                        isMandatory={true}
                        required={true}
                        maxLength={"100"}
                        disabled={true}
                    />
                    <FormInput
                        label={props.intl.formatMessage({ id: "IDS_PATIENTFATHERNAME" })}
                        name={"ssitename"}
                        type="text" p
                        // onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id: "IDS_PATIENTFATHERNAME" })}
                        value={props.selectedDetailField ? props.selectedDetailField["spatientfathername"] : ""}
                        isMandatory={true}
                        required={true}
                        maxLength={"100"}
                        disabled={true}
                    />

                    <FormInput
                        label={props.intl.formatMessage({ id: "IDS_INSTITUTIONSITE" })}
                        name={"ssitename"}
                        type="text"
                        //onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id: "IDS_INSTITUTIONSITE" })}
                        value={props.selectedDetailField ? props.selectedDetailField["sinstitutionsitename"] : ""}
                        isMandatory={true}
                        required={true}
                        maxLength={"100"}
                        disabled={true}
                    />
                    <FormInput
                        label={props.intl.formatMessage({ id: "IDS_SUBMITTERLASTNAME" })}
                        name={"ssitename"}
                        type="text"
                        ///  onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id: "IDS_SUBMITTERLASTNAME" })}
                        value={props.selectedDetailField ? props.selectedDetailField["ssubmitterlastname"] : ""}
                        isMandatory={true}
                        required={true}
                        maxLength={"100"}
                        disabled={true}

                    />
                    <FormInput
                        label={props.intl.formatMessage({ id: "IDS_SUBMITTERID" })}
                        name={"ssitename"}
                        type="text"
                        // onChange={(event) => props.onInputOnChange(event)}
                        placeholder={props.intl.formatMessage({ id: "IDS_SUBMITTERID" })}
                        value={props.selectedDetailField ? props.selectedDetailField["ssubmitterid"] : ""}
                        isMandatory={true}
                        required={true}
                        maxLength={"100"}
                        disabled={true}
                    />

                </Col>
            </Row> */}


        </>
    )
}
export default injectIntl(MappingFields);
