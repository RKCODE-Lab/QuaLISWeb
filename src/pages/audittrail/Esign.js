import React from 'react';
import { connect } from 'react-redux';
import {Row, Col} from 'react-bootstrap';
import FormInput from '../../components/form-input/form-input.component';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import CustomSwitch from '../../components/custom-switch/custom-switch.component';
import { FormattedMessage, injectIntl } from 'react-intl';
import DateTimePicker from '../../components/date-time-picker/date-time-picker.component';
import { TagLine} from "../../components/login/login.styles";
import { transactionStatus } from '../../components/Enumeration';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import { updateStore } from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class Esign extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            agree : transactionStatus.YES
        }
    }
    static getDerivedStateFromProps(props, state) {
        state.agree = props.selectedRecord.agree === transactionStatus.NO ? false : true
    }
       render (){
      
           return(
           <Row>                                
                <Col md={12}>
                    <FormInput
                        name={"sloginid"}
                        type="text"
                        label={ this.props.intl.formatMessage({ id:"IDS_LOGINID"})}                  
                        placeholder={ this.props.intl.formatMessage({ id:"IDS_LOGINID"})}
                        defaultValue ={this.props.inputParam && this.props.inputParam.inputData 
                                        && (this.props.inputParam.inputData.userinfo["sdeputyid"] || "")}
                        isMandatory={false}
                        required={false}
                        maxLength={20}
                        readOnly = {true}
                        onChange={(event)=> this.props.onInputOnChange(event)}
                    />     

                    <FormInput
                            name={"esignpassword"}
                            type="password"
                            label={ this.props.intl.formatMessage({ id:"IDS_PASSWORD"})}                            
                            placeholder={ this.props.intl.formatMessage({ id:"IDS_PASSWORD"})}
                            isMandatory={true}
                            required={true}
                            maxLength={50}
                            onChange={(event)=> this.props.onInputOnChange(event)}                            
                    />

                    <FormSelectSearch
                            name={"esignreason"}
                            formLabel={ this.props.intl.formatMessage({ id:"IDS_REASON"})}                              
                            placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}                           
                            options={this.props.esignReasonList || this.props.Login.esignReasonList || []}
                           // value = {this.props.selectedRecord["esignreason"] ? this.props.selectedRecord["esignreason"] : ""}
                            isMandatory={true}
                            isMulti={false}
                            isClearable={false}
                            isSearchable={true}                                
                            isDisabled={false}
                            closeMenuOnSelect={true}
                            onChange = {(event)=> this.onComboChange(event, "esignreason")}                               
                        />  
                       
                    <FormTextarea
                            name={"esigncomments"}
                            label={ this.props.intl.formatMessage({ id:"IDS_COMMENTS"})}                    
                            placeholder={ this.props.intl.formatMessage({ id:"IDS_COMMENTS"})}
                            rows="2"
                            isMandatory={true}
                            required={true}
                            maxLength={255}
                            onChange={(event)=> this.props.onInputOnChange(event)}
                    />
                                     
                    <DateTimePicker
                                    name={"esigndate"} 
                                    label={ this.props.intl.formatMessage({ id:"IDS_ESIGNDATE"})}                     
                                    className='form-control'
                                    placeholderText="Select date.."
                                    //selected={this.props.Login.serverTime}
									/* ALPD-5120 : Added by rukshana this.state.serverTime for Sample Retrieval and Disposal screen : E-signature's date and time not displayed in popup   */
									selected={this.props.Login.serverTime || this.props.serverTime}
                                    dateFormat={this.props.Login.userInfo.ssitedatetime}
                                    isClearable={false}
                                    readOnly={true}                                                                                                  
                            />
                   
                    <TagLine>
                            <FormattedMessage id="IDS_ELECTRONICSIGN"></FormattedMessage><br/>                    
                            <FormattedMessage id="IDS_ESIGNTEXT"></FormattedMessage>
                    </TagLine>
                   
                    <CustomSwitch
                            name={"agree"}
                            type="switch"
                            label={ this.props.intl.formatMessage({ id:"IDS_AGREE"})}
                            placeholder={ this.props.intl.formatMessage({ id:"IDS_AGREE"})}                            
                            // defaultValue ={ this.props.selectedRecord["agree"] === transactionStatus.NO ? false :true }
                            isMandatory={true}
                            required={true}
                            checked={ this.state.agree}
                            onChange={(event)=> this.toggleChange(event)}
                         />
                   </Col>                          
               </Row>   
            )
        }

        onComboChange = (comboData, fieldName) => {
            const selectedRecord = this.props.selectedRecord || {};
            selectedRecord[fieldName] = comboData;
           // this.setState({ selectedRecord });  
           const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: { selectedRecord }
            }
            this.props.updateStore(updateInfo);
        }

        toggleChange =(event)=>{
            let agree = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
            this.setState({agree})
            this.props.onInputOnChange(event);
        }
   }
   //export default injectIntl(Esign);
   export default connect(mapStateToProps, {updateStore})(injectIntl(Esign));