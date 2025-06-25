import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { transactionStatus } from '../../components/Enumeration';

import {injectIntl } from 'react-intl';

const AddJobAllocation = (props) => {
    return (
        <>        
        <Row>
            <Col md={6}>
                <Row>
                    {
                        props.operation==="Reschedule"&&
                        <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_SECTION" })}
                            isSearchable={true}
                            name={"nsectioncode"}
                            isDisabled={props.hiddenSectionChange}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.RescheduleSection}
                            value = { props.selectedRecord["nsectioncode"] || "" }
                            defaultValue={props.selectedRecord["nsectioncode"]}
                            onChange={(event)=>props.onComboChange(event, "nsectionuser")}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>
                    }
         

                 <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_TECHNIQUE" })}
                            isSearchable={true}
                            name={"ntechniquecode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={false}
                            isClearable={true}
                            options={props.Technique}
                            value = { props.selectedRecord["ntechniquecode"] || "" }
                            defaultValue={props.selectedRecord["ntechniquecode"]}
                            onChange={(event)=>props.onComboChange(event, "ntechniquecode")}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
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
                            //options={props.Users}   
                            //value = {props.selectedRecord["nusercode"] || "" }
                            defaultValue={props.selectedRecord["nusercode"]}
                            options={ props.operation==="Reschedule"?props.selectedRecord["nsectioncode"] !==undefined? props.selectedRecord["ntechniquecode"] !==null ? props.Users :[]:[] :props.selectedRecord["ntechniquecode"] !==null ? props.Users :[]}
                            value = {props.selectedRecord["ntechniquecode"] !==null ?
                            props.selectedRecord["nusercode"] || "" : ""}                           
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
                </Row>
            </Col>
            <Col md={6}>
                <Row>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_INSTRUMENTCATEGORY" })}
                            isSearchable={true}
                            name={"ninstrumentcatcode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                           // isMandatory={props.selectedRecord.ninstrumentcatcode && props.selectedRecord.ninstrumentcatcode.value===transactionStatus.NA ? false :true}
                            isClearable={false}
                            options={props.InstrumentCategory}
                            value = { props.selectedRecord["ninstrumentcatcode"] || "" }
                            defaultValue={props.selectedRecord["ninstrumentcatcode"]}
                            onChange={(event)=>props.onComboChange(event, "ninstrumentcatcode")}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_INSTRUMENTNAME" })}
                            isSearchable={true}
                            name={"ninstrumentnamecode"}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={props.selectedRecord.ninstrumentcatcode && props.selectedRecord.ninstrumentcatcode.value===transactionStatus.NA ? false :true}
                            isClearable={false}
                            options={props.InstrumentName}
                            isDisabled ={props.selectedRecord.ninstrumentcatcode && props.selectedRecord.ninstrumentcatcode.value===transactionStatus.NA}
                            value = { props.selectedRecord["ninstrumentnamecode"] || "" }
                            defaultValue={props.selectedRecord["ninstrumentnamecode"]}
                            onChange={(event)=>props.onComboChange(event, "ninstrumentnamecode")}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_INSTRUMENTID" })}
                            isSearchable={true}
                            name={"ninstrumentcode"}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={ false}
                            isClearable={true}
                            options={props.InstrumentId}
                            isDisabled ={props.selectedRecord.ninstrumentcatcode && props.selectedRecord.ninstrumentcatcode.value===transactionStatus.NA}
                            value = { props.selectedRecord["ninstrumentcode"] || "" }
                            defaultValue={props.selectedRecord["ninstrumentcode"]}
                            onChange={(event)=>props.onComboChange(event, "ninstrumentcode")}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>
                    <Col md={props.userInfo.istimezoneshow === transactionStatus.YES  ? 6 : 12}>
                        <DateTimePicker
                            name={"dinstblockfromdatetime"}
                            label={props.intl.formatMessage({ id: "IDS_STARTDATETIME" })}
                            className='form-control'
                            placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                            selected={props.selectedRecord ? props.selectedRecord["dinstblockfromdatetime"] : new Date()}
                            dateFormat={props.userInfo["ssitedatetime"]}
                            timeInputLabel={props.intl.formatMessage({ id: "IDS_STARTTIME" })}
                            showTimeInput={true}
                            isClearable={false}
                            isMandatory={props.selectedRecord.ninstrumentcatcode && props.selectedRecord.ninstrumentcatcode.value===transactionStatus.NA? false :true}
                            required={true}
                            isDisabled ={props.selectedRecord.ninstrumentcatcode && props.selectedRecord.ninstrumentcatcode.value===transactionStatus.NA}
                            minDate={props.currentTime}
                            minTime={props.currentTime}
                            onChange={date => props.handleDateChange("dinstblockfromdatetime", date)}
                            value={props.selectedRecord ? props.selectedRecord["dinstblockfromdatetime"] : new Date()}
                        />
                    </Col>

                    <Col md={6}>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_HOLDDURATION" })}
                            name={"sinstrumentholdduration"}
                            type="numeric"
                            onChange={(event) => props.onNumericInputOnChange(event,'sinstrumentholdduration')}
                            placeholder={props.intl.formatMessage({ id: "IDS_HOLDDURATION" })}
                            value={props.selectedRecord ? props.selectedRecord["sinstrumentholdduration"] : ""}
                            isMandatory={props.selectedRecord.ninstrumentcatcode && props.selectedRecord.ninstrumentcatcode.value===transactionStatus.NA ? false :true}
                            isDisabled ={props.selectedRecord.ninstrumentcatcode && props.selectedRecord.ninstrumentcatcode.value===transactionStatus.NA}
                            required={false}
                            maxLength={"4"}
                        />
                    </Col>
                    <Col md={6}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_PERIOD" })}
                            isSearchable={true}
                            name={"ninstrumentperiodcode"}
                            placeholder={props.intl.formatMessage({ id: "IDS_PERIOD" })}
                            isMandatory={props.selectedRecord.ninstrumentcatcode && props.selectedRecord.ninstrumentcatcode.value===transactionStatus.NA ? false :true}
                            isClearable={false}
                            isDisabled ={props.selectedRecord.ninstrumentcatcode && props.selectedRecord.ninstrumentcatcode.value===transactionStatus.NA}
                            options={props.InstrumentPeriod}
                            value = { props.selectedRecord["ninstrumentperiodcode"] || "" }
                            defaultValue={props.selectedRecord["ninstrumentperiodcode"]}
                            onChange={(event)=>props.onComboChange(event, "ninstrumentperiodcode")}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>
                </Row>
            </Col>             
        </Row>
        <Row>
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

            </>

            
    

    );
}
export default injectIntl(AddJobAllocation);