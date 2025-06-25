import React from 'react'
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleRight , faTimes } from '@fortawesome/free-solid-svg-icons';


class ApprovalFilter extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            showMore:false
        }
    }
    showMoreToggle =() =>{
        this.setState({
            showMore : !this.state.showMore
           
        })
    }
    render(){

        return(
            <div className="side_more_filter_wrap">
                <Row>
                    <Col md={6}>
                        <DateTimePicker
                            name={"fromdate"}
                            label={this.props.intl.formatMessage({ id:"IDS_FROM"})}
                            className='form-control'
                            placeholderText={this.props.intl.formatMessage({ id:"IDS_FROM"})}
                            selected={this.props.fromDate}
                            value={this.props.fromDate}
                            dateFormat={this.props.userInfo.ssitedate}
                            onChange={date => this.props.handleDateChange("fromDate", date)}
                            isClearable={false}
                        />
                    </Col>
                    <Col md={6}>
                        <DateTimePicker
                            name={"todate"}
                            label={this.props.intl.formatMessage({ id:"IDS_TO"})}
                            className='form-control'
                            placeholderText={this.props.intl.formatMessage({ id:"IDS_TO"})}
                            selected={this.props.toDate}
                            value={this.props.toDate}
                            dateFormat={this.props.userInfo.ssitedate}
                            onChange={date => this.props.handleDateChange("toDate", date)}
                            isClearable={false}
                        />
                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id:"IDS_SAMPLETYPE"})}
                            placeholder={this.props.intl.formatMessage({ id:"IDS_SAMPLETYPE"})}
                            name="nsampletypecode"
                            optionId="nsampletypecode"
                            optionValue="ssampletypename"
                            className='form-control'
                            options={this.props.SampleType}
                            value={this.props.SampleTypeValue? { "label": this.props.SampleTypeValue.ssampletypename, "value": this.props.SampleTypeValue.nsampletypecode } : ""}
                            isMandatory={false}
                            isMulti={false}
                            isSearchable={false}
                            isDisabled={false}
                            alphabeticalSort={false}
                            isClearable={false}
                            onChange={(event)=>this.props.onFilterComboChange(event,"nsampletypecode")}
                        />
                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id:"IDS_REGISTRATIONTYPE"})}
                            placeholder={this.props.intl.formatMessage({ id:"IDS_REGISTRATIONTYPE"})}
                            name="nregtypecode"
                            className='form-control'
                            options={this.props.RegType}
                            value={this.props.RegTypeValue? { "label": this.props.RegTypeValue.sregtypename, "value": this.props.RegTypeValue.nregtypecode } : ""}
                            optionId="nregtypecode"
                            optionValue="sregtypename"
                            isMandatory={false}
                            isMulti={false}
                            isSearchable={false}
                            isDisabled={false}
                            alphabeticalSort={false}
                            isClearable={false}
                            onChange={(event)=>this.props.onFilterComboChange(event,"nregtypecode")}
                        />
                    </Col>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id:"IDS_REGISTRATIONSUBTYPE"})}
                            placeholder={this.props.intl.formatMessage({ id:"IDS_REGISTRATIONSUBTYPE"})}
                            name="nregsubtypecode"
                            optionId="nregsubtypecode"
                            optionValue="sregsubtypename"
                            className='form-control'
                            options={this.props.RegSubType}
                            value={this.props.RegSubTypeValue? { "label": this.props.RegSubTypeValue.sregsubtypename, "value": this.props.RegSubTypeValue.nregsubtypecode } : ""}
                            isMandatory={false}
                            isMulti={false}
                            isSearchable={false}
                            isDisabled={false}
                            alphabeticalSort={false}
                            isClearable={false}
                            onChange={(event)=>this.props.onFilterComboChange(event,"nregsubtypecode")}
                        />
                    </Col>
                    
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={this.props.intl.formatMessage({ id:"IDS_TESTSTATUS"})}
                            placeholder={this.props.intl.formatMessage({ id:"IDS_TESTSTATUS"})}
                            name="ntransactionstatus"
                            optionId="ntransactionstatus"
                            optionValue="sfilterstatus"
                            className='form-control'
                            options={this.props.FilterStatus}
                            value={this.props.FilterStatusValue? { "label": this.props.FilterStatusValue.sfilterstatus, "value": this.props.FilterStatusValue.ntransactionstatus } : ""}
                            isMandatory={false}
                            isMulti={false}
                            isSearchable={false}
                            isDisabled={false}
                            alphabeticalSort={false}
                            isClearable={false}
                            onChange={(event)=>this.props.onFilterComboChange(event,"ntransactionstatus")}
                        />
                    </Col>
                </Row>
                {!this.state.showMore ? <button className="btn_sidebar_open" onClick={this.showMoreToggle}> <FontAwesomeIcon icon={faAngleDoubleRight} /> </button> : ''}    
                       <div className={`side_more_filter ${this.state.showMore ? 'active' : ''} `} >
                                      <button className="btn_sidebar_close" onClick={this.showMoreToggle}> <FontAwesomeIcon icon={faTimes} /> </button>    
                                      <Row>
                                          <Col md={12}>
                                              <FormSelectSearch
                                                  formLabel={this.props.intl.formatMessage({ id:"IDS_CONFIGVERSION"})}
                                                  placeholder={this.props.intl.formatMessage({ id:"IDS_CONFIGVERSION"})}
                                                  name="napproveconfversioncode"
                                                  optionId="napprovalconfigversioncode"
                                                  optionValue="sversionname"
                                                  className='form-control'
                                                  options={this.props.ApprovalVersion}
                                                  value={this.props.ApprovalVersionValue? { "label": this.props.ApprovalVersionValue.sversionname, "value": this.props.ApprovalVersionValue.napproveconfversioncode } : ""}
                                                  isMandatory={false}
                                                  isMulti={false}
                                                  isSearchable={false}
                                                  isDisabled={false}
                                                  alphabeticalSort={false}
                                                  isClearable={false}
                                                  onChange={(event)=>this.props.onFilterComboChange(event,"napproveconfversioncode")}
                                              />
                                                {/* <Col md={12}> */}
                                            {//this.props.RegSubTypeValue.nneedtemplatebasedflow ? 
                                             <FormSelectSearch
                                                formLabel={this.props.intl.formatMessage({ id: "IDS_DESIGNTEMPLATE" })}
                                                isSearchable={true}
                                                name={"ndesigntemplatemappingcode"}
                                                isDisabled={false}
                                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                isMandatory={true}
                                                options={this.props.ApprovalVersionValue.sversionname?this.props.DynamicDesignMapping:[]}
                                                optionId="ndesigntemplatemappingcode"
                                                optionValue="sregtemplatename"
                                                value={this.props.DesignTemplateMappingValue&&this.props.ApprovalVersionValue.sversionname ? { "label": this.props.DesignTemplateMappingValue.sregtemplatename, "value": this.props.DesignTemplateMappingValue.ndesigntemplatemappingcode } : ""}
                                                showOption={true}
                                                sortField="ndesigntemplatemappingcode"
                                                sortOrder="ascending"
                                                onChange={(event) => this.props.onFilterComboChange(event, 'ndesigntemplatemappingcode')}
                                             />
                                      //      :""
                                            }
                                    {/* </Col> */}
                                              <FormSelectSearch
                                                  formLabel={this.props.intl.formatMessage({ id:"IDS_SECTION"})}
                                                  placeholder={this.props.intl.formatMessage({ id:"IDS_SECTION"})}
                                                  name="nsectioncode"
                                                  optionId="nsectioncode"
                                                  optionValue="ssectionname"
                                                  className='form-control'
                                                  options={this.props.UserSection||[]}
                                                  value={this.props.UserSectionValue? { "label": this.props.UserSectionValue.ssectionname, "value": this.props.UserSectionValue.nsectioncode } : ""}
                                                  isMandatory={false}
                                                  isMulti={false}
                                                  isSearchable={true}
                                                  isDisabled={false}
                                                  alphabeticalSort={false}
                                                  isClearable={false}
                                                  onChange={(event)=>this.props.onFilterComboChange(event,"nsectioncode")}
                                              />
                                               <FormSelectSearch
                                                    formLabel={this.props.intl.formatMessage({ id: "IDS_TEST" })}
                                                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                                    name="ntestcode"
                                                    optionId="ntestcode"
                                                    optionValue="stestsynonym"
                                                    className='form-control'
                                                    options={this.props.Test||[]}
                                                    value={this.props.TestValue ? { "label": this.props.TestValue.stestsynonym, "value": this.props.TestValue.ntestcode } : ""}
                                                    isMandatory={false}
                                                    isMulti={false}
                                                    isSearchable={true}
                                                    isDisabled={false}
                                                    alphabeticalSort={false}
                                                    isClearable={false}
                                                    onChange={(event) => this.props.onFilterComboChange(event, "ntestcode")}
                                                />

{this.props.RegSubTypeValue.nneedbatch == true && this.props.Batch.length > 0 &&
                            <FormSelectSearch
                                formLabel={this.props.intl.formatMessage({ id: "IDS_BATCH" })}
                                placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                                name="nbatchmastercode"
                                optionId="nbatchmastercode"
                                optionValue="sbatcharno"
                                className='form-control'
                                options={this.props.Batch}
                                value={this.props.BatchValue ? { "label": this.props.BatchValue.sbatcharno, "value": this.props.BatchValue.nbatchmastercode } : ""}
                                isMandatory={false}
                                isMulti={false}
                                isSearchable={true}
                                isDisabled={false}
                                alphabeticalSort={false}
                                isClearable={true}
                                onChange={(event) => this.props.onFilterComboChange(event, "nbatchmastercode")}
                            />
                         }
                                              {/* <FormSelectSearch
                                                  formLabel={this.props.intl.formatMessage({ id:"IDS_JOBSTATUS"})}
                                                  placeholder={this.props.intl.formatMessage({ id:"IDS_JOBSTATUS"})}
                                                  name="njobstatuscode"
                                                  optionId="njobstatuscode"
                                                  optionValue="sidsjobstatusname"
                                                  className='form-control'
                                                  options={this.props.JobStatus}
                                                  value={this.props.JobStatusValue? { "label": this.props.JobStatusValue.sidsjobstatusname, "value": this.props.JobStatusValue.njobstatuscode } : ""}
                                                  isMandatory={false}
                                                  isMulti={false}
                                                  isSearchable={false}
                                                  isDisabled={false}
                                                  alphabeticalSort={false}
                                                  isClearable={false}
                                                  onChange={(event)=>this.props.onFilterComboChange(event,"njobstatuscode")}
                                              /> */}
                                               
                                          </Col>
                                      </Row>
                                  </div>  
            </div> 
        );
    }
}
export default injectIntl(ApprovalFilter)