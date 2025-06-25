import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { intl } from '../../components/App';
import { injectIntl } from 'react-intl';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { MediaHeader } from '../../components/App.styles';
import rsapi from '../../rsapi';
import { constructOptionList } from '../../components/CommonScript';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { toast } from 'react-toastify';
import Preloader from '../../components/preloader/preloader.component';
import {
    updateStore
} from '../../actions';
import { connect } from 'react-redux';
//const ResultEntryInstrumentForm = (this.props) => {
class ResultEntryInstrumentForm extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            selectedRecordInstrumentForm: this.props.selectedRecordInstrumentForm,
            instrumentcatValue: this.props.instrumentcatValue,
            instrumentnameValue: this.props.instrumentNameValue,
            instrumentIdValue: this.props.instrumentIdValue,
            loading: false
        }

    }
    onComboChange = (comboData, comboName) => {
        let selectedRecordInstrumentForm = this.state.selectedRecordInstrumentForm || {};
        if (comboData) {
            selectedRecordInstrumentForm['ninstrumentcode'] = comboData;
        } else {
            selectedRecordInstrumentForm['ninstrumentcode'] = []
        }
        //Sync Child Component data with Parent Component     
        this.props.onChildDataChange(selectedRecordInstrumentForm);
        this.setState({ selectedRecordInstrumentForm });
    }
    onDateChange = (dateName, dateValue) => {
        let selectedRecordInstrumentForm = this.state.selectedRecordInstrumentForm || {};
        selectedRecordInstrumentForm[dateName] = dateValue;
        if (dateName === "dfromdate" || dateName === "dtodate") {

              //Sync Child Component data with Parent Component     
              this.props.onChildDataChange(selectedRecordInstrumentForm);
            this.setState({ selectedRecordInstrumentForm });
        }

    }

    onComboCategoryChange = (event, fieldname) => {
        if (event !== null) {
            let uRL = "";
            let inputData = [];
            if (fieldname === "ninstrumentcatcode") {
                inputData = {
                    userinfo: this.props.userInfo,
                    nflag: 2,
                    ninstrumentcatcode: event.value,
                    ncalibrationRequired: event.item.ncalibrationreq
                }
            }
            this.setState({ loading: true })
            rsapi.post("resultentrybysample/getResultUsedInstrumentNameCombo", {
                userinfo: this.props.userInfo,
                nflag: 2,
                ninstrumentcatcode: event.value,
                ncalibrationRequired: event.item.ncalibrationreq
            }).then(response => {
                let TagInstrumentName = constructOptionList(response.data.InstrumentName || [], "ninstrumentnamecode",
                    "sinstrumentname", undefined, undefined, undefined);
                let TagListInstrumentName = TagInstrumentName.get("OptionList")

                // const updateInfo = {
                //     typeName: DEFAULT_RETURN,
                //     data: 

                //Sync Child Component data with Parent Component     
                const selectedRecordInstrumentForm = this.state.selectedRecordInstrumentForm || {};
                selectedRecordInstrumentForm['ninstrumentcatcode'] = event
                selectedRecordInstrumentForm['ninstrumentnamecode'] = TagInstrumentName.has('DefaultValue')
                    && TagInstrumentName.get("DefaultValue") ?
                    TagInstrumentName.get("DefaultValue") : [];
                selectedRecordInstrumentForm['ninstrumentcode'] = [];
                if (selectedRecordInstrumentForm && selectedRecordInstrumentForm['ninstrumentnamecode'].length!==0) {
                        rsapi.post("resultentrybysample/getResultUsedInstrumentIdCombo", {
                        userinfo: this.props.userInfo,
                        nflag: 3,
                        ninstrumentcatcode: event.value,
                        ninstrumentnamecode: selectedRecordInstrumentForm['ninstrumentnamecode'].value,
                        ncalibrationRequired: selectedRecordInstrumentForm['ninstrumentnamecode'].item.ncalibrationreq
                
                    }).then(response => {
                        let TagInstrumentId = constructOptionList(response.data.InstrumentId || [], "ninstrumentcode",
                            "sinstrumentid", undefined, undefined, undefined);
                        let TagListInstrumentId = TagInstrumentId.get("OptionList")
                
                                  
                
                        //Sync Child Component data with Parent Component     
                        const selectedRecordInstrumentForm = this.state.selectedRecordInstrumentForm || {};
                        selectedRecordInstrumentForm['ninstrumentnamecode'] = event
                        selectedRecordInstrumentForm['ninstrumentcode'] = TagInstrumentId.has('DefaultValue')
                            && TagInstrumentId.get("DefaultValue")
                            ? TagInstrumentId.get("DefaultValue") : []
                        this.props.onChildDataChange(selectedRecordInstrumentForm);
                
                        this.setState({
                            instrumentIdValue: TagListInstrumentId,
                            loading: false,
                            instrumentnameValue: TagListInstrumentName,
                            // selectedRecordInstrumentForm: {
                            //     ...this.state.selectedRecordInstrumentForm,
                            //     ninstrumentnamecode: event,
                            //     ninstrumentcode: TagInstrumentId.has('DefaultValue')
                            //         && TagInstrumentId.get("DefaultValue")
                            //         ? TagInstrumentId.get("DefaultValue") : [],
                            // }
                            selectedRecordInstrumentForm: {
                                ...this.state.selectedRecordInstrumentForm,
                                ninstrumentcatcode: event,
                                ninstrumentnamecode: TagInstrumentName.has('DefaultValue')
                                    && TagInstrumentName.get("DefaultValue") ?
                                    TagInstrumentName.get("DefaultValue") : [],
                                    ninstrumentcode: TagInstrumentId.has('DefaultValue')
                                    && TagInstrumentId.get("DefaultValue")
                                    ? TagInstrumentId.get("DefaultValue") : [],
                               // ninstrumentcode: [],
                            }
                        })
                                    
                    })
                        
                    
                }
                else {
                    this.props.onChildDataChange(selectedRecordInstrumentForm);

                    this.setState({
                        // masterData: { ...this.props.Login.masterData, 
                        instrumentIdValue: [],
                        instrumentnameValue: TagListInstrumentName
                        // }
                        ,
                        loading: false,
                        selectedRecordInstrumentForm: {
                            ...this.state.selectedRecordInstrumentForm,
                            ninstrumentcatcode: event,
                            ninstrumentnamecode: TagInstrumentName.has('DefaultValue')
                                && TagInstrumentName.get("DefaultValue") ?
                                TagInstrumentName.get("DefaultValue") : [],
                            ninstrumentcode: [],
                        }
                    })
                }
                //}
                // this.props.updateStore(updateInfo); 
            })
        
                // .catch(error => {
                //     if (error.response.status === 500) {
                //         toast.error(error.message);
                //     }
                //     else {
                //         toast.warn(error.response.data);
                //     }
                // })
        }
    }

    onComboNameChange = (event, fieldname) => {
        if (event !== null) {
            let uRL = "";
            let inputData = []; 
            if (fieldname === "ninstrumentnamecode") {
                inputData = {
                    userinfo: this.props.userInfo,
                    nflag: 3,
                    ninstrumentcatcode: this.state.selectedRecordInstrumentForm.ninstrumentcatcode.value,
                    ninstrumentnamecode: event.value,
                    ncalibrationRequired:  event.item.ncalibrationreq

                }
            }
            this.setState({ loading: true })
            rsapi.post("resultentrybysample/getResultUsedInstrumentIdCombo", {
                userinfo: this.props.userInfo,
                nflag: 3,
                ninstrumentcatcode: this.state.selectedRecordInstrumentForm.ninstrumentcatcode.value,
                ninstrumentnamecode: event.value,
                ncalibrationRequired: event.item.ncalibrationreq

            }).then(response => {
                    let TagInstrumentId = constructOptionList(response.data.InstrumentId || [], "ninstrumentcode",
                        "sinstrumentid", undefined, undefined, undefined);
                        let TagListInstrumentId = TagInstrumentId.get("OptionList")

                  

                    //Sync Child Component data with Parent Component     
                    const selectedRecordInstrumentForm = this.state.selectedRecordInstrumentForm || {};
                    selectedRecordInstrumentForm['ninstrumentnamecode']=event
                    selectedRecordInstrumentForm['ninstrumentcode']=TagInstrumentId.has('DefaultValue')
                                                                    &&TagInstrumentId.get("DefaultValue") 
                                                                    ? TagInstrumentId.get("DefaultValue") : []
                    this.props.onChildDataChange(selectedRecordInstrumentForm);

                    this.setState({
                        instrumentIdValue: TagListInstrumentId,
                        loading: false,
                        selectedRecordInstrumentForm: {
                            ...this.state.selectedRecordInstrumentForm,
                            ninstrumentnamecode: event,
                            ninstrumentcode: TagInstrumentId.has('DefaultValue')
                                             &&TagInstrumentId.get("DefaultValue") 
                                             ? TagInstrumentId.get("DefaultValue") : [],
                        }
                    })
                    
                })               
        }
    }
    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { isInstrumentInitialRender: false }
        }
        this.props.updateStore(updateInfo);
    }

    componentDidUpdate(previousProps) {
        if (this.props.selectedRecordInstrumentForm !== previousProps.selectedRecordInstrumentForm) {
            this.setState({ selectedRecordInstrumentForm: this.props.selectedRecordInstrumentForm });
        }
        if (this.props.instrumentValue !== previousProps.instrumentValue) {
            this.setState({ Instrument: this.props.instrumentValue });
        }
        if (this.props.instrumentcatValue !== previousProps.instrumentcatValue) {
            this.setState({ instrumentcatValue: this.props.instrumentcatValue });
        } 
    }

    render() {

        return (
            <>
                <Preloader loading={this.state.loading} />
                {Object.values(this.state.selectedRecordInstrumentForm).length > 0 ?
                    <Row className="mb-4">
                        {this.props.needSubSample ?

                            <Col md={12}>
                                <MediaHeader className={`labelfont`}>{intl.formatMessage({ id: "IDS_SAMPLEARNO" })}: {" " + this.state.selectedRecordInstrumentForm.ssamplearno}</MediaHeader>
                            </Col>
                            :
                            <Col md={12}>
                                <MediaHeader className={`labelfont`}>{intl.formatMessage({ id: "IDS_ARNO" })}: {" " + this.state.selectedRecordInstrumentForm.sarno}</MediaHeader>
                            </Col>
                        }
                        <Col md={12}>
                            <MediaHeader className={`labelfont`}>{intl.formatMessage({ id: "IDS_TEST" })}: {" " + this.state.selectedRecordInstrumentForm.stestsynonym}</MediaHeader>
                        </Col>
                    </Row>
                    : ""}

                <Row>
                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={intl.formatMessage({ id: "IDS_INSTRUMENTCATEGORY" })}
                            placeholder={intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isSearchable={false}
                            name={"ninstrumentcatcode"}
                            isDisabled={false}
                            isMandatory={true}
                            options={this.state.instrumentcatValue || []}
                            optionId='ninstrumentcatcode'
                            optionValue='sinstrumentcatname'
                            value={this.state.selectedRecordInstrumentForm ? this.state.selectedRecordInstrumentForm.ninstrumentcatcode : ""}
                            showOption={true}
                            required={true}
                            onChange={(event) => this.onComboCategoryChange(event, 'ninstrumentcatcode')}
                            isMulti={false}
                            closeMenuOnSelect={true}
                        />
                    </Col>

                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={intl.formatMessage({ id: "IDS_INSTRUMENTNAME" })}
                            placeholder={intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isSearchable={false}
                            name={"ninstrumentnamecode"}
                            isDisabled={false}
                            isMandatory={true}
                            options={this.state.instrumentnameValue || []}
                            optionId='ninstrumentnamecode'
                            optionValue='sinstrumentname'
                            value={this.state.selectedRecordInstrumentForm ? this.state.selectedRecordInstrumentForm.ninstrumentnamecode : ""}
                            showOption={true}
                            required={true}
                            onChange={(event) => this.onComboNameChange(event, 'ninstrumentnamecode')}
                            isMulti={false}
                            closeMenuOnSelect={true}
                        />
                    </Col>

                    <Col md={12}>
                        <FormSelectSearch
                            formLabel={intl.formatMessage({ id: "IDS_INSTRUMENTID" })}
                            placeholder={intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isSearchable={false}
                            name={"ninstrumentcode"}
                            isDisabled={false}
                            isMandatory={true}
                            options={this.state.instrumentIdValue || []}
                            optionId='ninstrumentcode'
                            optionValue='sinstrumentid'
                            value={this.state.selectedRecordInstrumentForm ? this.state.selectedRecordInstrumentForm.ninstrumentcode : ""}
                            showOption={true}
                            required={true}
                            onChange={(event) => this.onComboChange(event, 'ninstrumentcode')}
                            isMulti={false}
                            closeMenuOnSelect={true}
                        />
                    </Col>

                    <Col md={6}>
                        <DateTimePicker
                            name={"dfromdate"}
                            label={intl.formatMessage({ id: "IDS_FROM" })}
                            className='form-control'
                            placeholderText="Select date.."
                            selected={this.state.selectedRecordInstrumentForm["dfromdate"]}
                            value={this.state.selectedRecordInstrumentForm["dfromdate"]}
                            //dateFormat={"dd/MM/yyyy HH:mm:ss"}
                            dateFormat={this.props.userInfo.ssitedatetime}
                            timeInputLabel={this.props.intl.formatMessage({ id: "IDS_TIME" })}
                            showTimeInput={true}
                            isClearable={false}
                            isMandatory={true}
                            required={true}
                            onChange={date => this.onDateChange("dfromdate", date)}

                        />
                    </Col>
                    {/* <Col md={6}>
                        <FormSelectSearch
                            name={"ntzfromdate"}
                            formLabel={intl.formatMessage({ id: "IDS_TIMEZONE" })}
                            placeholder={intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            options={this.props.timeZoneListData}
                            optionId="ntimezonecode"
                            optionValue="stimezoneid"
                            value={this.props.selectedRecordInstrumentForm.ntzfromdate}
                            defaultValue={this.props.selectedRecordInstrumentForm.ntzfromdate}
                            isMandatory={true}
                            isMulti={false}
                            isSearchable={true}
                            isClearable={false}
                            isDisabled={false}
                            closeMenuOnSelect={true}
                            alphabeticalSort={true}
                            onChange={(event) => this.props.onComboChange(event, 'ntzfromdate')}
                        />
                    </Col> */}
                    <Col md={6}>
                        <DateTimePicker
                            name={"dtodate"}
                            label={intl.formatMessage({ id: "IDS_TO" })}
                            className='form-control'
                            placeholderText="Select date.."
                            selected={this.state.selectedRecordInstrumentForm["dtodate"]}
                            value={this.state.selectedRecordInstrumentForm["dtodate"]}
                            //  dateFormat={"dd/MM/yyyy HH:mm:ss"}
                            dateFormat={this.props.userInfo.ssitedatetime}
                            timeInputLabel={this.props.intl.formatMessage({ id: "IDS_TIME" })}
                            showTimeInput={true}
                            isClearable={false}
                            isMandatory={true}
                            required={true}
                            onChange={date => this.onDateChange("dtodate", date)}

                        />
                    </Col>
                    {/* <Col md={6}>
                        <FormSelectSearch
                            name={"ntztodate"}
                            formLabel={intl.formatMessage({ id: "IDS_TIMEZONE" })}
                            placeholder={intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            options={this.props.timeZoneListData}
                            optionId="ntimezonecode"
                            optionValue="stimezoneid"
                            value={this.props.selectedRecordInstrumentForm.ntztodate}
                            defaultValue={this.props.selectedRecordInstrumentForm.ntztodate}
                            isMandatory={true}
                            isMulti={false}
                            isSearchable={true}
                            isClearable={false}
                            isDisabled={false}
                            closeMenuOnSelect={true}
                            alphabeticalSort={true}
                            onChange={(event) => this.props.onComboChange(event, 'ntztodate')}
                        />
                    </Col> */}
                </Row>
            </>
        )
    }

}
// export default injectIntl(ResultEntryInstrumentForm);
export default connect(null, {
    updateStore

})(injectIntl(ResultEntryInstrumentForm));
