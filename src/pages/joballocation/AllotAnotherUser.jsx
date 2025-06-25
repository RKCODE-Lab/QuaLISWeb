import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import {injectIntl } from 'react-intl';
import { transactionStatus } from '../../components/Enumeration';

const AllotAnotherUser = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_TECHNIQUE" })}
                    name={"ntechniquecode"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    value={props.Technique}
                    isDisabled={true}
                    required={true}
                    maxLength={"100"}
                />
            </Col>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_USERS" })}
                    isSearchable={true}
                    name={"nusercode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    isClearable={false}
                    options={props.Users}
                    value = { props.selectedRecord["nusercode"] || "" }
                    defaultValue={props.selectedRecord["nusercode"]}
                    onChange={(event)=>props.onComboChange(event, "nusercode")}
                    closeMenuOnSelect={true}
                >
                </FormSelectSearch>
            </Col> 

            <Col md={props.userInfo.istimezoneshow === transactionStatus.YES  ? 6 : 12}>
                <DateTimePicker
                    name={"duserblockfromdatetime"}
                    label={props.intl.formatMessage({ id: "IDS_STARTDATETIME" })}
                    className='form-control'
                    placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                    dateFormat={props.userInfo ? props.userInfo.ssitedatetime || [] : []}
                    timeInputLabel={props.intl.formatMessage({ id: "IDS_STARTTIME" })}
                    showTimeInput={true}
                    isClearable={false}
                    isMandatory={true}
                    required={true}
                    minDate={props.currentTime}
                    maxTime={props.currentTime}
                    onChange={date => props.handleDateChange("duserblockfromdatetime", date)}         
                    selected={props.selectedRecord && props.selectedRecord["duserblockfromdatetime"] ? props.selectedRecord["duserblockfromdatetime"] : new Date()}

                />
             </Col>

                    
            <Col md={6}>
                <FormInput
                    label={props.intl.formatMessage({ id: "IDS_HOLDDURATION" })}
                    name={"suserholdduration"}
                    type="numeric"
                    onChange={(event) => props.onNumericInputOnChange(event,'suserholdduration')}
                    placeholder={props.intl.formatMessage({ id: "IDS_HOLDDURATION" })}
                    value={props.selectedRecord ? props.selectedRecord["suserholdduration"] : ""}
                    isMandatory={true}
                    required={false}
                    maxLength={"4"}
                />
            </Col>
            <Col md={6}>
                <FormSelectSearch
                    formLabel={props.intl.formatMessage({ id: "IDS_PERIOD" })}
                    isSearchable={true}
                    name={"nuserperiodcode"}
                    isDisabled={false}
                    placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    isClearable={false}
                    options={props.UsersPeriod}
                    value = { props.selectedRecord["nuserperiodcode"] || "" }
                    defaultValue={props.selectedRecord["nuserperiodcode"]}
                    onChange={(event)=>props.onComboChange(event, "nuserperiodcode")}
                    closeMenuOnSelect={true}
                >
                </FormSelectSearch>
            </Col>
            <Col md={12}>
                <FormTextarea
                    label={props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                    name={"scomments"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                    value={props.selectedRecord ? props.selectedRecord["scomments"] : ""}
                    isMandatory={false}
                    required={false}
                    maxLength={"255"}
                />
            </Col>
        </Row>
    );
}
export default injectIntl(AllotAnotherUser);