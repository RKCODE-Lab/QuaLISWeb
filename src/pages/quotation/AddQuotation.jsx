import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import FormInput from '../../components/form-input/form-input.component';
// import FormNumericInput from '../../components/form-numeric-input/form-numeric-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { injectIntl } from 'react-intl';


const AddQuotation = (props) => {
    return (
        <Row>
            <Col md={6}>

                <Row>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_CLIENTCATEGORY" })}
                            isSearchable={true}
                            name={"nclientcatcode"}
                            isDisabled={false}
                            //     placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.ClientCategory}
                            value={props.selectedRecord["nclientcatcode"] || ""}
                            defaultValue={props.selectedRecord["nclientcatcode"]}
                            onChange={(event) => props.onComboChange(event, "nclientcatcode", 1)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>

                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_CLIENT" })}
                            isSearchable={true}
                            name={"nclientcode"}
                            isDisabled={false}
                     //     placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.Client}
                            value={props.selectedRecord["nclientcode"] || ""}
                            // value={props.selectedRecord ? { "label": props.selectedRecord.sclientname, "value": props.selectedRecord.nclientcode } : ""}
                            defaultValue={props.selectedRecord["nclientcode"]}
                            onChange={(event) => props.onComboChange(event, "nclientcode", 1)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>

                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_CLIENTSITE" })}
                            isSearchable={true}
                            name={"nclientsitecode"}
                            isDisabled={false}
                     //     placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.ClientSite}
                            value={props.selectedRecord["nclientsitecode"] || ""}
                            // value={props.selectedRecord ? { "label": props.selectedRecord.sclientname, "value": props.selectedRecord.nclientcode } : ""}
                            defaultValue={props.selectedRecord["nclientsitecode"]}
                            onChange={(event) => props.onComboChange(event, "nclientsitecode", 1)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>

                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_CONTACTNAME" })}
                            isSearchable={true}
                            name={"nclientcontactcode"}
                            isDisabled={false}
                     //     placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.ClientContact}
                            value={props.selectedRecord["nclientcontactcode"] || ""}
                            // value={props.selectedRecord ? { "label": props.selectedRecord.sclientname, "value": props.selectedRecord.nclientcode } : ""}
                            defaultValue={props.selectedRecord["nclientcontactcode"]}
                            onChange={(event) => props.onComboChange(event, "nclientcontactcode", 2)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>


                    {/* <Col md={12}>
                        <FormTextarea
                            name={"sclientsiteaddress"}
                            label={props.intl.formatMessage({ id: "IDS_CLIENTADDRESS" })}
                            onChange={(event) => props.onInputOnChange(event, 1)}
                            placeholder={props.intl.formatMessage({ id: "IDS_CLIENTADDRESS" })}
                            value={props.selectedRecord.sclientsiteaddress ? props.selectedRecord.sclientsiteaddress : ""}
                            rows="2"
                            required={false}
                            maxLength={255}
                            isMandatory={false}
                            isDisabled={true}
                        >
                        </FormTextarea>
                    </Col> */}
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_OEM" })}
                            isSearchable={true}
                            name={"noemcode"}
                            isDisabled={false}
                            //     placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={false}
                            isClearable={true}
                            options={props.OEM}
                            value={props.selectedRecord["noemcode"] || ""}
                            defaultValue={props.selectedRecord["noemcode"]}
                            onChange={(event) => props.onComboChange(event, "noemcode", 2)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>

                    <Col md={12}>
                        <FormSelectSearch
                         // formLabel={props.intl.formatMessage({ id: "IDS_SAMPLECATEGORY" })}
                            formLabel={props.genericlabel["ProductCategory"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode]}
                            isSearchable={true}
                            name={"nproductcatcode"}
                            isDisabled={false}
                            //     placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.ProductCategory}
                            value={props.selectedRecord["nproductcatcode"] || ""}
                            defaultValue={props.selectedRecord["nproductcatcode"]}
                            onChange={(event) => props.onComboChange(event, "nproductcatcode", 1)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>
                    {/* <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_OEM" })}
                            name={"soem"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_OEM" })}
                            value={props.selectedRecord ? props.selectedRecord["soem"] === "-" ? "" : props.selectedRecord["soem"] : ""}
                            isMandatory={false}
                            required={true}
                            maxLength={"50"}
                        />
                     </Col> */}

                    {/* <Col md={12}>
                        <FormTextarea
                            name={"sinvoiceaddress"}
                            label={props.intl.formatMessage({ id: "IDS_INVOICEADDRESS" })}
                            onChange={(event) => props.onInputOnChange(event, 1)}
                            placeholder={props.intl.formatMessage({ id: "IDS_INVOICEADDRESS" })}
                            value={props.selectedRecord ? props.selectedRecord["sinvoiceaddress"] : ""}
                            rows="2"
                            required={false}
                            maxLength={500}
                            isMandatory={true}
                        >
                        </FormTextarea>
                    </Col> */}

                    {/* <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_QUOTATIONTYPE" })}
                            isSearchable={true}
                            name={"nquotationtypecode"}
                            isDisabled={false}
                            //     placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.QuotationType}
                            value={props.selectedRecord["nquotationtypecode"] || ""}
                            defaultValue={props.selectedRecord["nquotationtypecode"]}
                            onChange={(event) => props.onComboChange(event, "nquotationtypecode", 3)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col> */}

                </Row>
            </Col>


            <Col md={6}>
                <Row>


                <Col md={12}>
                        <FormSelectSearch
                         // formLabel={props.intl.formatMessage({ id: "IDS_SAMPLETYPE" })}
                            formLabel={props.genericlabel["Product"]["jsondata"]["sdisplayname"][props.userInfo.slanguagetypecode]}
                            isSearchable={true}
                            name={"nproductcode"}
                            isDisabled={false}
                     //     placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.Product}
                            value={props.selectedRecord["nproductcode"] || ""}
                            defaultValue={props.selectedRecord["nproductcode"]}
                            onChange={(event) => props.onComboChange(event, "nproductcode", 2)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>



                  <Col md={12}>
                        <DateTimePicker
                            name={"dquotationdate"}
                            label={props.intl.formatMessage({ id: "IDS_QUOTATIONDATE" })}
                            className='form-control'
                            placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                            dateFormat={props.userInfo ? props.userInfo.ssitedate || [] : []}
                            timeInputLabel={props.intl.formatMessage({ id: "IDS_TIME" })}
                            showTimeInput={false}
                            isClearable={false}
                            isMandatory={true}
                            required={true}
                            maxTime={props.currentTime}
                            onChange={date => props.handleDateChange("dquotationdate", date)}
                     //     value={props.selectedRecord["dquotationdate"]}
                    //      selected={props.selectedRecord["dquotationdate"]}
                            selected={props.selectedRecord && props.selectedRecord["dquotationdate"] ?
                            props.selectedRecord["dquotationdate"] : new Date()}


                        />
                   </Col>

                    {/* <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_QUOTATIONLEADTIME" })}
                            name={"squotationleadtime"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_QUOTATIONLEADTIME" })}
                            value={props.selectedRecord ? props.selectedRecord["squotationleadtime"] === "-" ? "" : props.selectedRecord["squotationleadtime"] : ""}
                            isMandatory={false}
                            required={true}
                            maxLength={"55"}
                        />
                    </Col> */}

                 <Col md={12}>
                        <FormTextarea
                            name={"sdescription"}
                            label={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                            onChange={(event) => props.onInputOnChange(event, 1)}
                            placeholder={props.intl.formatMessage({ id: "IDS_DESCRIPTION" })}
                            value={props.selectedRecord ? props.selectedRecord["sdescription"] === "-" ? "" : props.selectedRecord["sdescription"] : ""}
                            rows="2"
                            required={false}
                            maxLength={500}
                        >
                        </FormTextarea>
                    </Col>

                    <Col md={12}>
                        <FormTextarea
                            name={"sdeviationremarks"}
                            label={props.intl.formatMessage({ id: "IDS_REMARKS" })}
                            onChange={(event) => props.onInputOnChange(event, 1)}
                            placeholder={props.intl.formatMessage({ id: "IDS_REMARKS" })}
                            value={props.selectedRecord ? props.selectedRecord["sdeviationremarks"] === "-" ? "" : props.selectedRecord["sdeviationremarks"] : ""}
                            rows="2"
                            required={false}
                            maxLength={1000}
                        >
                        </FormTextarea>
                    </Col>

                {/* <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_PROJECTTYPE" })}
                            isSearchable={true}
                            name={"nprojecttypecode"}
                            isDisabled={false}
                            //     placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.ProjectType}
                            value={props.selectedRecord["nprojecttypecode"] || ""}
                            defaultValue={props.selectedRecord["nprojecttypecode"]}
                            onChange={(event) => props.onComboChange(event, "nprojecttypecode", 4)}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>

                    <Col md={12}>

                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_PROJECTCODE" })}
                            isSearchable={true}
                            name={"nprojectmastercode"}
                            isDisabled={false}
                     //     placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.ProjectCode}
                            value={props.selectedRecord["nprojectmastercode"] || ""}
                            // value={props.ProjectCode? { "label": props.ProjectCode[0].label, "value": props.ProjectCode[0].value } : ""}
                            defaultValue={props.selectedRecord["nprojectmastercode"]}
                            onChange={(event) => props.onComboChange(event, "nprojectmastercode", 4)}
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
                   //       value={props.ProjectMaster ? props.ProjectMaster["sprojecttitle"] : ""}
                            value={props.selectedRecord ? props.selectedRecord["sprojecttitle"] : ""}
                            rows="2"
                            required={false}
                            maxLength={255}
                            isMandatory={false}
                            isDisabled={true}
                        >
                        </FormTextarea>
                    </Col>  

                <Col md={12}>
                        <DateTimePicker
                            name={"srfwdate"}
                            label={props.intl.formatMessage({ id: "IDS_RFWDATE" })}
                            className='form-control'
                            placeholderText={props.intl.formatMessage({ id: "IDS_SELECTDATE" })}
                           // value={props.selectedRecord["srfwdate"]}
                            dateFormat={props.userInfo ? props.userInfo.ssitedate || [] : []}
                            timeInputLabel={props.intl.formatMessage({ id: "IDS_TIME" })}
                            showTimeInput={false}
                            isClearable={false}
                            isMandatory={false}
                            required={true}
                            //maxDate={props.currentTime}
                            maxTime={props.currentTime}
                            onChange={date => props.handleDateChange("srfwdate", date)}
                       //     selected={props.ProjectMaster ? props.ProjectMaster["srfwdate"] : ""}
                            selected={props.selectedRecord ? props.selectedRecord["srfwdate"] : ""}
                            isDisabled={true}

                        />
                    </Col>

                    <Col md={12}>
                        <FormInput
                            label={props.intl.formatMessage({ id: "IDS_INCHARGE" })}
                            name={"susername"}
                            type="text"
                            onChange={(event) => props.onInputOnChange(event)}
                            placeholder={props.intl.formatMessage({ id: "IDS_INCHARGE" })}
                      //    value={props.ProjectMaster ? props.ProjectMaster["susername"] : ""}
                            value={props.selectedRecord ? props.selectedRecord["susername"] : ""}
                            isMandatory={false}
                            required={true}
                            maxLength={"100"}
                            isDisabled={true}
                        />
                    </Col> */}


                </Row>
            </Col>

        </Row>

    );

}




export default injectIntl(AddQuotation);