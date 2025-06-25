import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormInput from '../../components/form-input/form-input.component';
// import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { injectIntl } from 'react-intl';
import { transactionStatus } from "../../components/Enumeration";

//ALPD-3566
const AddProjectMaster = (props) => {
    //console.log('12', props.selectedRecord);
    return (
        <Row>
            <Col md={6}>

                <Row>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_PROJECTTYPE" })}
                            isSearchable={true}
                            name={"nprojecttypecode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.ProjectType}
                            value={props.selectedRecord["nprojecttypecode"] || ""}
                            defaultValue={props.selectedRecord["nprojecttypecode"]}
                            onChange={(event) => props.onComboChange(event, "nprojecttypecode", 3)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>



                    <Col md={12}>
                        <FormTextarea
                            name={"sprojecttitle"}
                            label={props.intl.formatMessage({ id: "IDS_PROJECTTITLE" })}
                            onChange={(event) => props.onInputOnChange(event, 1)}
                            placeholder={props.intl.formatMessage({ id: "IDS_PROJECTTITLE" })}
                            value={props.selectedRecord ? props.selectedRecord["sprojecttitle"] : ""}
                            rows="2"
                            required={false}
                            maxLength={255}
                            isMandatory={true}
                        >
                        </FormTextarea>
                    </Col>


                    <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_PROJECTCODE" })}
                            name={"sprojectcode"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_PROJECTCODE" })}
                            value={props.selectedRecord ? props.selectedRecord["sprojectcode"] : ""}
                            isMandatory={parseInt(props.settings[31])!=3?true:false}
                            required={true}
                            maxLength={"100"}
                            readOnly={parseInt(props.settings[31])===transactionStatus.YES?true:false}
                            isDisabled={parseInt(props.settings[31])===transactionStatus.YES?true:false}
                        />
                    </Col>
                    <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_PROJECTNAME" })}
                            name={"sprojectname"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_PROJECTNAME" })}
                            value={props.selectedRecord ? props.selectedRecord["sprojectname"] : ""}
                            isMandatory={true}
                            required={true}
                            maxLength={"100"}
                        />
                    </Col>

                    <Col md={12}>
                        <FormTextarea
                            name={"sprojectdescription"}
                            label={props.intl.formatMessage({ id: "IDS_PROJECTDESCRIPTION" })}
                            onChange={(event) => props.onInputOnChange(event, 1)}
                            placeholder={props.intl.formatMessage({ id: "IDS_PROJECTDESCRIPTION" })}
                            value={props.selectedRecord ? props.selectedRecord["sprojectdescription"] === "-" ? "" : props.selectedRecord["sprojectdescription"] : ""}
                            rows="2"
                            required={false}
                            maxLength={255}
                        >
                        </FormTextarea>
                    </Col>


                    <Col md={12}>
                        <FormSelectSearch
                            //  formLabel={props.intl.formatMessage({ id: ""+props.StudyDirector.suserrolename })}
                            formLabel={props.intl.formatMessage({ id: "IDS_ROLE" })}
                            isSearchable={true}
                            name={"nuserrolecode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.Userrole}
                            value={props.selectedRecord["nuserrolecode"] || ""}
                            defaultValue={props.selectedRecord["nuserrolecode"]}
                            onChange={(event) => props.onComboChange(event, "nuserrolecode", 1)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>

                    <Col md={12}>
                        <FormSelectSearch
                            // formLabel={props.intl.formatMessage({ id: ""+props.StudyDirector.suserrolename })}
                            formLabel={props.intl.formatMessage({ id: "IDS_INCHARGE" })}
                            isSearchable={true}
                            name={"nusercode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.Users}
                            value={props.selectedRecord["nusercode"] || ""}
                            defaultValue={props.selectedRecord["nusercode"]}
                            onChange={(event) => props.onComboChange(event, "nusercode", 3)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>
                    <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_RFWID" })}
                            name={"srfwid"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_RFWID" })}
                            value={props.selectedRecord ? props.selectedRecord["srfwid"] === "-" ? "" : props.selectedRecord["srfwid"] : ""}
                            isMandatory={false}
                            required={false}
                            maxLength={"100"}
                
                        />
                    </Col>

                    <Col md={12}>
                        <DateTimePicker
                            name={"drfwdate"}
                            label={props.intl.formatMessage({ id: "IDS_RFWDATE" })}
                            className='form-control'
                            placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                            selected={props.selectedRecord["drfwdate"]}
                            //    dateFormat={props.userInfo.ssitedate}
                            dateFormat={props.userInfo ? props.userInfo.ssitedate || [] : []}
                            timeInputLabel={props.intl.formatMessage({ id: "IDS_TIME" })}
                            showTimeInput={false}
                            isClearable={true}
                            isMandatory={false}
                            required={true}
                            //maxDate={props.currentTime}
                            maxTime={props.currentTime}
                            onChange={date => props.handleDateChange("drfwdate", date)}
                      //    value={props.selectedRecord["drfwdate"]}


                        />
                    </Col>



                </Row>
            </Col>


            <Col md={6}>
                <Row>
                <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_CLIENTCATEGORY" })}
                            isSearchable={true}
                            name={"nprojecttypecode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.ClientCategory}
                            value={props.selectedRecord["nclientcatcode"] || ""}
                            defaultValue={props.selectedRecord["nclientcatcode"]}
                            onChange={(event) => props.onComboChange(event, "nclientcatcode", 4)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>

                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_CLIENT" })}
                            isSearchable={true}
                            name={"nprojecttypecode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.Client}
                            value={props.selectedRecord["nclientcode"] || ""}
                            defaultValue={props.selectedRecord["nclientcode"]}
                            onChange={(event) => props.onComboChange(event, "nclientcode", 5)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>

                    {/* <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_QUOTATIONNO" })}
                            isSearchable={true}
                            name={"nprojecttypecode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={false}
                            isClearable={true}
                            options={props.QuotationNo}
                            value={props.selectedRecord["nquotationcode"] || ""}
                            defaultValue={props.selectedRecord["nquotationcode"]}
                            onChange={(event) => props.onComboChange(event, "nquotationcode", 3)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col> */}

                  

                    {/* <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_TEAMMEMBERS" })}
                            isSearchable={true}
                            name={"nteammembercode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.TeamMembers}
                            value={props.selectedRecord["nteammembercode"] || ""}
                            defaultValue={props.selectedRecord["nteammembercode"]}
                            onChange={(event) => props.onComboChange(event, "nteammembercode", 1)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col> */}

                    


                    <Col md={12}>
                        <DateTimePicker
                            name={"dprojectstartdate"}
                            label={props.intl.formatMessage({ id: "IDS_STARTDATE" })}
                            className='form-control'
                            placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                            selected={props.selectedRecord["dprojectstartdate"]}
                            //      dateFormat={props.userInfo.ssitedate}
                            dateFormat={props.userInfo ? props.userInfo.ssitedate || [] : []}
                            timeInputLabel={props.intl.formatMessage({ id: "IDS_TIME" })}
                            showTimeInput={false}
                            isClearable={true}
                            isMandatory={true}
                            required={true}
                            //maxDate={props.currentTime}
                            maxTime={props.currentTime}
                            onChange={date => props.handleDateChange("dprojectstartdate", date)}
                            value={props.selectedRecord["dprojectstartdate"]}

                        />
                    </Col>


                    
                    

                    <Col md={12}>
                        <FormInput

                            name={"nprojectduration"}
                            type="text"
                            label={props.intl.formatMessage({ id: "IDS_PROJECTDURATION" })}
                            placeholder={props.intl.formatMessage({ id: "IDS_PROJECTDURATION" })}
                            className="form-control"
                            value={props.selectedRecord["nprojectduration"] && typeof props.selectedRecord["nprojectduration"] === "number" ?
                            props.selectedRecord["nprojectduration"].toString() : props.selectedRecord["nprojectduration"]}
                            onChange={value => props.onNumericInputChange(value, "nprojectduration")}
                            maxLength={2}
                            isMandatory={true}

                        />
                    </Col>


                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_DURATIONPERIOD" })}
                            isSearchable={true}
                            name={"nperiodcode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.PeriodByControl}
                            value={props.selectedRecord["nperiodcode"] || ""}
                            defaultValue={props.selectedRecord["nperiodcode"]}
                            onChange={(event) => props.onComboChange(event, "nperiodcode", 3)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>


                    <Col md={12}>
                        <DateTimePicker
                            name={"dexpectcompletiondate"}
                            label={props.intl.formatMessage({ id: "IDS_EXPECTEDPROJECTCOMPLETIONDATE" })}
                            className='form-control'
                            placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                            selected={props.selectedRecord["dexpectcompletiondate"]}
                            //    dateFormat={props.userInfo.ssitedate}
                            dateFormat={props.userInfo ? props.userInfo.ssitedate || [] : []}
                            timeInputLabel={props.intl.formatMessage({ id: "IDS_TIME" })}
                            showTimeInput={false}
                            isClearable={true}
                            isMandatory={false}
                            required={true}
                            //maxDate={props.currentTime}
                            maxTime={props.currentTime}
                            onChange={date => props.handleDateChange("dexpectcompletiondate", date)}
                      //    value={props.selectedRecord["drfwdate"]}


                        />
                    </Col>



                </Row>
            </Col>

        </Row>

    );

}




export default injectIntl(AddProjectMaster);