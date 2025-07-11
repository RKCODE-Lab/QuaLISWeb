import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { transactionStatus } from '../../components/Enumeration';

const AddCompletionDate = (props) => {
    return (
        <Row>
                
            <Col md={props.userInfo.istimezoneshow === transactionStatus.YES ? 6 : 12}>
            <DateTimePicker
                            name={"dprojectretiredate"}
                            label={props.intl.formatMessage({ id: "IDS_RETIREDPROJECT" })}
                            className='form-control'
                            placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                            selected={props.selectedRecord["dprojectretiredate"]}
                            //    dateFormat={props.userInfo.ssitedate}
                            dateFormat={props.userInfo ? props.userInfo.ssitedate || [] : []}
                            timeInputLabel={props.intl.formatMessage({ id: "IDS_TIME" })}
                            showTimeInput={false}
                            isClearable={false}
                            isMandatory={true}
                            required={true}
                            value={props.selectedRecord["dprojectretiredate"]}
                            //maxDate={props.currentTime}
                           // maxTime={props.currentTime}
                            onChange={date => props.handleDateChange("dprojectretiredate", date)}/>
            </Col>
            {props.userInfo.istimezoneshow  === transactionStatus.YES &&
                <Col md={6}>
                    <FormSelectSearch
                        name={"ntzprojectretiredate"}
                        formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        options={props.TimeZoneList}
                        // optionId="ntimezonecode"
                        // optionValue="stimezoneid"
                        value={props.selectedRecord["ntzprojectretiredate"]}
                        defaultValue={props.selectedRecord["ntzprojectretiredate"]}
                        isMandatory={false}
                        isMulti={false}
                        isSearchable={true}
                        // isClearable={false}                               
                        isDisabled={false}
                        closeMenuOnSelect={true}
                        alphabeticalSort={true}
                        onChange={(event) => props.onComboChange(event, 'ntzprojectretiredate', 1)}
                    />

                </Col>
            }
            <Col md={12}>
            
                <FormTextarea
                    label={props.intl.formatMessage({ id: "IDS_REMARKS" })}
                    name={"sretiredremarks"}
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.intl.formatMessage({ id: "IDS_REMARKS" })}
                    value={props.selectedRecord ? props.selectedRecord["sretiredremarks"] : ""}
                    rows="2"
                    isMandatory={false}
                    required={false}
                    maxLength={"255"}
                >
                </FormTextarea>
            </Col>
        </Row>
    )
}
export default injectIntl(AddCompletionDate);