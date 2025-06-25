import React from 'react'
import { Col, Row } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDoubleRight , faTimes } from '@fortawesome/free-solid-svg-icons';


class SampleCertificationFilter extends React.Component{
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
      console.log("response",this.props)
        return(
            <div className="side_more_filter_wrap">
                <Row>
            <Col md={6}>
                <DateTimePicker
                    name={"fromdate"}
                    label={this.props.formatMessage({ id: "IDS_FROM" })}
                    className='form-control'
                    placeholderText="Select date.."
                    selected={this.props.FromDate}
                    dateFormat={this.props.userInfo["ssitedate"]}
                    isClearable={false}
                    onChange={date => this.props.handleDateChange("fromDate", date)}
                    value={this.props.FromDate}

                />
            </Col>
            <Col md={6}>
                <DateTimePicker
                    name={"todate"}
                    label={this.props.formatMessage({ id: "IDS_TO" })}
                    className='form-control'
                    placeholderText="Select date.."
                    selected={this.props.ToDate}
                    dateFormat={this.props.userInfo["ssitedate"]}
                    isClearable={false}
                    onChange={date => this.props.handleDateChange("toDate", date)}
                    value={this.props.ToDate}

                />
            </Col>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={this.props.formatMessage({ id: "IDS_SAMPLETYPE" })}
                    isSearchable={true}
                    name={"nsampletypecode"}
                    isDisabled={false}
                    placeholder={this.props.formatMessage({ id: "IDS_PLEASESELECT" })}
                    isMandatory={true}
                    options={this.props.SampleType}
                    optionId="nsampletypecode"
                    optionValue="ssampletypename"
                    value={this.props.SampleTypeValue ? this.props.SampleTypeValue.nsampletypecode : ""}
                    //value={props.SampleTypeValue ? { "label": props.SampleTypeValue.ssampletypename, "value": props.SampleTypeValue.nsampletypecode } : ""}
                    showOption={true}
                    sortField="nsorter"
                    sortOrder="ascending"
                    //onChange={(event) => this.props.onSampleTypeChange(event, 'nsampletypecode', 'SampleTypeValue')}
                >
                </FormSelectSearch>
            </Col>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={this.props.formatMessage({ id: "IDS_REGISTRATIONTYPE" })}
                    isSearchable={true}
                    name={"nregtypecode"}
                    isDisabled={false}
                    placeholder={this.props.formatMessage({ id: "IDS_PLEASESELECT" })}
                    isMandatory={true}
                    options={this.props.RegistrationType}
                    optionId="nregtypecode"
                    optionValue="sregtypename"
                    // value = { props.RegTypeValue["nregtypecode"] }
                    value={this.props.RegTypeValue ? this.props.RegTypeValue.nregtypecode : ""}
                    showOption={true}
                    //sortField="nsorter"
                    //sortOrder="ascending"
                   // onChange={(event) => props.onRegTypeChange(event, 'nregtypecode', 'RegTypeValue')}
                >
                </FormSelectSearch>
            </Col>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={this.props.formatMessage({ id: "IDS_REGISTRATIONSUBTYPE" })}
                    isSearchable={true}
                    name={"nregsubtypecode"}
                    isDisabled={false}
                    placeholder={this.props.formatMessage({ id: "IDS_PLEASESELECT" })}
                    isMandatory={true}
                    options={this.props.RegistrationSubType}
                    optionId="nregsubtypecode"
                    optionValue="sregsubtypename"
                    value={this.props.regSubTypeValue ? this.props.regSubTypeValue.nregsubtypecode : ""}
                    showOption={true}
                    sortField="nsorter"
                    sortOrder="ascending"
                    onChange={(event) => this.props.onRegSubTypeChange(event, 'nregsubtypecode', 'RegSubTypeValue')}
                >
                </FormSelectSearch>
            </Col>
            <Col md={12}>
                <FormSelectSearch
                    formLabel={this.props.formatMessage({ id: "IDS_FILTERSTATUS" })}
                    isSearchable={true}
                    name={"ntransactionstatus"}
                    isDisabled={false}
                    placeholder={this.props.formatMessage({ id: "IDS_PLEASESELECT" })}
                    isMandatory={true}
                    options={this.props.FilterStatus}
                    optionId="ntransactionstatus"
                    optionValue="stransdisplaystatus"
                    value={this.props.FilterStatusValue ? this.props.FilterStatusValue.ntransactionstatus : ""}
                   // value={props.FilterStatusValue ? { "label": props.FilterStatusValue.stransdisplaystatus, "value": props.FilterStatusValue.napprovalstatuscode } : ""}
                    showOption={true}
                    sortField="stransdisplaystatus"
                    sortOrder="ascending"
                    onChange={(event) => this.props.onFilterChange(event, 'ntransactionstatus')}
                >
                </FormSelectSearch>
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
                                                //   value={this.props.ApprovalVersionValue? { "label": this.props.ApprovalVersionValue.sversionname, 
                                                //   "value": this.props.ApprovalVersionValue.napproveconfversioncode } : ""}
                                                  value={this.props.ApprovalVersionValue ? this.props.ApprovalVersionValue : ""}
                                                  isMandatory={false}
                                                  isMulti={false}
                                                  isSearchable={false}
                                                  isDisabled={false}
                                                  alphabeticalSort={false}
                                                  isClearable={false}
                                                  onChange={(event)=>this.props.onFilterComboChange(event,"napproveconfversioncode")}
                                              />
                                              {/* <FormSelectSearch
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
                                                  isSearchable={false}
                                                  isDisabled={false}
                                                  alphabeticalSort={false}
                                                  isClearable={false}
                                                  onChange={(event)=>this.props.onFilterComboChange(event,"nsectioncode")}
                                              /> */}
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
export default injectIntl(SampleCertificationFilter)