import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import { injectIntl } from 'react-intl';
import DateTimePicker from "../../components/date-time-picker/date-time-picker.component";
import { transactionStatus } from '../../components/Enumeration';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

const RetireQuotation = (props) => {
    return (
        <Row>
            <Col md={12}>

                <Row>

                <Col md={props.userInfo.istimezoneshow === transactionStatus.YES ? 6 : 12}>
                    <DateTimePicker
                    name={"dretiredatetime"}
                    label={props.intl.formatMessage({ id: "IDS_RETIREDATE" })}
                    className='form-control'
                    selected={props.selectedRecord["dretiredatetime"]}
                    dateFormat={props.userInfo.ssitedate}
                    minDate={props.currentTime}
                    isClearable={false}
                    required={true}
                    isMandatory={true}
                    onChange={date => props.handleDateChange("dretiredatetime", date)}
                    value={props.selectedRecord["dretiredatetime"]}
                    />
                </Col>
                {props.userInfo.istimezoneshow === transactionStatus.YES &&
                <Col md={6}>
                    <FormSelectSearch
                        name={"ntransdatetimezonecode"}
                        formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        options={props.TimeZoneList}
                        // optionId="ntimezonecode"
                        // optionValue="stimezoneid"
                        value={props.selectedRecord["ntransdatetimezonecode"]}
                        defaultValue={props.selectedRecord["ntransdatetimezonecode"]}
                        isMandatory={false}
                        isMulti={false}
                        isSearchable={true}
                        // isClearable={false}                               
                        isDisabled={false}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        onChange={(event) => props.onComboChange(event, 'ntransdatetimezonecode', 1)}
                    />

                </Col>
            }

                <Col md={12}>
                    <FormTextarea
                    label={props.intl.formatMessage({ id: "IDS_REMARKS" })}
                    name={"sretireremarks"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_RETIREREMARKS" })}
                    value={props.selectedRecord ? props.selectedRecord["sretireremarks"] : ""}
                    rows="2"
                    isMandatory={false}
                    required={false}
                    maxLength={"255"}
                    >
                    </FormTextarea>
                </Col>

                </Row>
            </Col>


        </Row>

    );
}




export default injectIntl(RetireQuotation);