import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../../components/form-input/form-input.component';


const AddEmailHost = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_DISPLAYNAME" })}
                    name= "sprofilename"
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_DISPLAYNAME" })}
                    value={props.selectedRecord["sprofilename"] ? props.selectedRecord["sprofilename"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={100}
                />
            </Col>
            <Col md={12}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_HOSTNAME" })}
                    name= "shostname"
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_HOSTNAME" })}
                    value={props.selectedRecord["shostname"] ? props.selectedRecord["shostname"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={100}
                />
            </Col>
            <Col md={12}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_EMAILID" })}
                    name= "semail"
                    type="email"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_EMAILID" })}
                    value={props.selectedRecord["semail"] ? props.selectedRecord["semail"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={100}
                />
            </Col>
            <Col md={12}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_PASSWORD" })}
                    name= "spassword"
                    type="password"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_PASSWORD" })}
                    value={props.selectedRecord["spassword"] ? props.selectedRecord["spassword"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={50}
                />
            </Col>
            <Col md={12}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_PORTNO" })}
                    name= "nportno"
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_PORTNO" })}
                    value={props.selectedRecord["nportno"] ? props.selectedRecord["nportno"] : ""}
                    isMandatory={true}
                    required={true}
                    maxLength={4}
                />
            </Col>
           
        </Row>
    );
};

export default injectIntl(AddEmailHost);