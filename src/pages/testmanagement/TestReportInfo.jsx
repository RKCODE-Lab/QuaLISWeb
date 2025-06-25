import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import { injectIntl } from 'react-intl';

const TestReportInfo = (props) => {
    return (
        <Row>         
            <Col md={12}>
                <FormTextarea
                    name={"sconfirmstatement"}
                    label={props.intl.formatMessage({ id: "IDS_CONFIRMSTATEMENT" })}
                    onChange={(event) => props.onInputOnChange(event,1)}
                    placeholder={props.intl.formatMessage({ id: "IDS_CONFIRMSTATEMENT" })}
                    value={props.selectedRecord ? props.selectedRecord["sconfirmstatement"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={500}
                />
            </Col>
            <Col md={12}>
                <FormTextarea
                    name={"sdecisionrule"}
                    label={props.intl.formatMessage({ id: "IDS_DECISIONRULE" })}
                    onChange={(event) => props.onInputOnChange(event,1)}
                    placeholder={props.intl.formatMessage({ id: "IDS_DECISIONRULE" })}
                    value={props.selectedRecord ? props.selectedRecord["sdecisionrule"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={255}
                />
            </Col>
            <Col md={12}>
                <FormTextarea
                    name={"ssopdescription"}
                    label={props.intl.formatMessage({ id: "IDS_SOPDESCRIPTION" })}
                    onChange={(event) => props.onInputOnChange(event,1)}
                    placeholder={props.intl.formatMessage({ id: "IDS_SOPDESCRIPTION" })}
                    value={props.selectedRecord ? props.selectedRecord["ssopdescription"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={500}
                />
            </Col>
            <Col md={12}>
                <FormTextarea
                    name={"stestcondition"}
                    label={props.intl.formatMessage({ id: "IDS_TESTCONDITION" })}
                    onChange={(event) => props.onInputOnChange(event,1)}
                    placeholder={props.intl.formatMessage({ id: "IDS_TESTCONDITION" })}
                    value={props.selectedRecord ? props.selectedRecord["stestcondition"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={500}
                />
            </Col>
            <Col md={12}>
                <FormTextarea
                    name={"sdeviationcomments"}
                    label={props.intl.formatMessage({ id: "IDS_DEVIATIONCOMMENTS" })}
                    onChange={(event) => props.onInputOnChange(event,1)}
                    placeholder={props.intl.formatMessage({ id: "IDS_DEVIATIONCOMMENTS" })}
                    value={props.selectedRecord ? props.selectedRecord["sdeviationcomments"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={500}
                />
            </Col>    
            <Col md={12}>
                <FormTextarea
                    name={"smethodstandard"}
                    label={props.intl.formatMessage({ id: "IDS_METHODSTANDARD" })}
                    onChange={(event) => props.onInputOnChange(event,1)}
                    placeholder={props.intl.formatMessage({ id: "IDS_METHODSTANDARD" })}
                    value={props.selectedRecord ? props.selectedRecord["smethodstandard"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={255}
                />
            </Col>  
            <Col md={12}>
                <FormTextarea
                    name={"sreference"}
                    label={props.intl.formatMessage({ id: "IDS_REFERENCE" })}
                    onChange={(event) => props.onInputOnChange(event,1)}
                    placeholder={props.intl.formatMessage({ id: "IDS_REFERENCE" })}
                    value={props.selectedRecord ? props.selectedRecord["sreference"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={255}
                />
            </Col>              
        </Row>  
    );

}
export default injectIntl(TestReportInfo);