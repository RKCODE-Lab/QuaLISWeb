import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col } from 'react-bootstrap';
import FormInput from '../../../components/form-input/form-input.component';
import FormTextarea from '../../../components/form-textarea/form-textarea.component';
import DateTimePicker from '../../../components/date-time-picker/date-time-picker.component';
import FormSelectSearch from '../../../components/form-select-search/form-select-search.component';
import { transactionStatus } from '../../../components/Enumeration';

const AddTrainingCertificate = (props) => {
    return (
        <Row>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={props.formatMessage({ id: "IDS_TRAININGCATEGORY" })}
                    isSearchable={true}
                    name={"ntrainingcategorycode"}
                    isDisabled={props.operation !== "reschedule" ? false : true}
                    placeholder={props.formatMessage({ id: "IDS_TRAININGCATEGORY" })}
                    isMandatory={true}
                    options={props.trainingcategoryList}
                    optionId='ntrainingcategorycode'
                    optionValue='strainingcategoryname'
                    value={props.selectedRecord["ntrainingcategorycode"]}
                    //defaultValue={props.selectedRecord["ncountrycode"]}

                    onChange={(event) => props.onComboChange(event, 'ntrainingcategorycode')}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                />

                <FormSelectSearch
                    formLabel={props.formatMessage({ id: "IDS_TECHNIQUE" })}
                    isSearchable={true}
                    name={"ntechniquecode"}
                    isDisabled={props.operation !== "reschedule" ? false : true}
                    placeholder={props.formatMessage({ id: "IDS_TECHNIQUE" })}
                    isMandatory={true}
                    options={props.techniqueList}
                    optionId='ntechniquecode'
                    optionValue='stechniquename'
                    value={props.selectedRecord["ntechniquecode"]}
                    //defaultValue={props.selectedRecord["ncountrycode"]}

                    onChange={(event) => props.onComboChange(event, 'ntechniquecode')}
                    closeMenuOnSelect={true}
                    alphabeticalSort={true}
                />

                <FormInput
                    label={props.formatMessage({ id: "IDS_TRAININGTOPIC" })}
                    name={"strainingtopic"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_TRAININGTOPIC" })}
                    value={props.selectedRecord["strainingtopic"]}
                    isMandatory={true}
                    required={true}
                    maxLength={100}
                    isDisabled={props.operation !== "reschedule" ? false : true}

                />
            </Col>

            <Col md={props.userInfo.istimezoneshow===transactionStatus.YES ? 6 : 12}>
                <DateTimePicker
                    name={"dtrainingdatetime"}
                    label={props.intl.formatMessage({ id: "IDS_TRAININGDATETIME" })}
                    className='form-control'
                    placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                    //dateFormat={props.userInfo["ssitedatetime"]}
                    dateFormat={props.userInfo.ssitedatetime}
                    timeInputLabel={props.intl.formatMessage({ id: "IDS_TRAININGDATETIME" })}
                    showTimeInput={true}
                    timeFormat={true}
                    isClearable={false}
                    isMandatory={true}
                    required={true}
                    // isDisabled={diableAllStatus === recordStatus}
                    minDate={props.currentTime}
                    minTime={props.currentTime}
                    onChange={date => props.handleDateChange("dtrainingdatetime", date)}
                    selected={props.selectedRecord ? props.selectedRecord["dtrainingdatetime"] : new Date()}
                    //value={props.selectedRecord ? props.selectedRecord["dtrainingdatetime"] : new Date()}
                />
            </Col>
            {props.userInfo.istimezoneshow===transactionStatus.YES &&
                <Col md={6}>
                    <FormSelectSearch
                        name={"ntztrainingdate"}
                        formLabel={props.intl.formatMessage({ id: "IDS_TIMEZONE" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        options={props.timeZoneList}
                        // optionId="ntimezonecode"
                        // optionValue="stimezoneid"
                        value={props.selectedRecord["ntztrainingdate"]}
                        isMandatory={true}
                        isMulti={false}
                        isSearchable={true}
                        isClearable={false}
                        isDisabled={props.operation !== "reschedule" ? false : true}
                        closeMenuOnSelect={true}
                        onChange={(event) => props.onComboChange(event, 'ntztrainingdate')}
                    />

                </Col>
            }
            <Col md={12}>
                <FormInput
                    label={props.formatMessage({ id: "IDS_TRAINERNAME" })}
                    name={"strainername"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_TRAINERNAME" })}
                    value={props.selectedRecord["strainername"]}
                    isMandatory={true}
                    required={true}
                    maxLength={100}
                    isDisabled={props.operation !== "reschedule" ? false : true}
                />

                <FormInput
                    label={props.formatMessage({ id: "IDS_TRAININGVENUE" })}
                    name={"strainingvenue"}
                    type="text"
                    onChange={(event) => props.onInputOnChange(event)}
                    placeholder={props.formatMessage({ id: "IDS_TRAININGVENUE" })}
                    value={props.selectedRecord["strainingvenue"]}
                    isMandatory={true}
                    required={true}
                    maxLength={100}
                />

                <FormTextarea
                    name={"scomments"}
                    label={props.intl.formatMessage({ id: "IDS_TRAININGCOMMENTS" })}
                    placeholder={props.intl.formatMessage({ id: "IDS_TRAININGCOMMENTS" })}
                    value={props.selectedRecord["scomments"]}
                    rows="2"
                    isMandatory={false}
                    required={false}
                    maxLength={255}
                    onChange={(event) => props.onInputOnChange(event)}
                />
            </Col>
        </Row>
    )
}
export default injectIntl(AddTrainingCertificate);
