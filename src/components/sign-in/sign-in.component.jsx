/* eslint-disable no-undef */
import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import FormInput from '../form-input/form-input.component';
import CustomButtom from '../custom-button/custom-button.component';
import { changeLanguage, getLoginDetails, getUserSiteAndRole, updateStore, createPassword,validateADSPassword, changepassword, getUsersiteRole, checkPassword } from '../../actions';
import CreatePassword from '../../pages/Login/CreatePassWord';
import CreateADSPassword from '../../pages/Login/CreateADSPassWord';
import { clickOnLoginButton } from '../../actions'
import { toast } from 'react-toastify';
import FormSelectSearch from '../form-select-search/form-select-search.component';
import { validateLoginId } from '../CommonScript';
import SlideOutModal from '../slide-out-modal/SlideOutModal';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import ChangePassword from '../../pages/Login/ChangePassWord';
import { changePasswordValidation, fnPassMessage, fnValidatePassword } from '../../pages/Login/LoginCommonFunction';
import { LOGINTYPE, transactionStatus } from '../Enumeration'
import { Form } from 'react-bootstrap';
import { loadCaptchaEnginge, LoadCanvasTemplate, validateCaptcha } from 'react-simple-captcha';


const mapStateToProps = (state) => {
    return {
        Login: state.Login
    }
}

class SignIn extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            PasswordPolicy: {},
            selectedRecord: {},
            captchaKey:false, //Added for sonia on 16th June 2025 for jira id:ALPD-6028 (Captcha Validation)
           
        }
        this.loginRef = React.createRef();
    }

    render() {       

        const { loginTypeList, languageList, loginUserSite, count=0,
             loginUserRole } = this.props.Login;

              
             
        return (
            <Form ref={this.loginRef}>
                <FormInput
                    name="sloginid"
                    label={this.props.intl.formatMessage({ id: "IDS_LOGINID" })}
                    type="text"
                    // placeholder={this.props.intl.formatMessage({ id: "IDS_LOGINID" })}
                    required={true}
                    isMandatory={"*"}
                    onChange={(event) => this.onLoginInputChange(event)}
                    onBlur={(event) => this.onFocusOutEvent(event)}
                    //ALPD-1926
                    // onKeyUp={this.AutoLogin} 
                    value={this.state.selectedRecord.sloginid}
                />
                <FormInput
                    name="spassword"
                    label={this.props.intl.formatMessage({ id: "IDS_PASSWORD" })}
                    type="password"
                    required={true}
                    isMandatory={"*"}
                    // placeholder={this.props.intl.formatMessage({ id: "IDS_PASSWORD" })}
                    onChange={(event) => this.selectInputOnChange(event)}
                    onKeyUp={this.onLoginEvent}
                    value={this.state.selectedRecord.spassword}
                />
                {/* Don't Remove the Commented line commented for NIBSC */}
                { (loginUserSite !== undefined && loginUserSite.length > 1) ?
                <FormSelectSearch
                    name={"nusersitecode"}
                    formLabel={this.props.intl.formatMessage({ id: "IDS_SITE" })}
                    isSearchable={false}
                    isDisabled={false}
                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    options={loginUserSite || []}
                    optionId='nusersitecode'
                    optionValue='ssitename'
                    value={this.state.selectedRecord.nusersitecode ? this.state.selectedRecord.nusersitecode : ""}
                    onChange={value => this.onUsersiteChange(value, "nusersitecode")}
                >
                </FormSelectSearch>:""}
                <FormSelectSearch
                    name={"nusermultirolecode"}
                    formLabel={this.props.intl.formatMessage({ id: "IDS_USERROLE" })}
                    isSearchable={false}
                    isDisabled={false}
                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    options={loginUserRole || []}
                    optionId='nusermultirolecode'
                    optionValue='suserrolename'
                    value={this.state.selectedRecord.nusermultirolecode ? this.state.selectedRecord.nusermultirolecode : ""}
                    onChange={value => this.onSelectChange(value, "nusermultirolecode")}
                >
                </FormSelectSearch>
               {/* ALPD-3816 */}
               { (loginTypeList !== undefined && loginTypeList.length > 1) ?
                 <FormSelectSearch
                    name={"nlogintypecode"}
                    formLabel={this.props.intl.formatMessage({ id: "IDS_LOGINTYPE" })}
                    isSearchable={false}
                    isDisabled={false}
                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    options={loginTypeList || []}
                    optionId='nlogintypecode'
                    optionValue='sdisplayname'
                    value={this.state.selectedRecord.nlogintypecode ? this.state.selectedRecord.nlogintypecode : ""}
                    onChange={value => this.onSelectChange(value, "nlogintypecode")}
                >
                </FormSelectSearch> 
                : ""
                } 
                {/* Don't Remove the Commented line commented for NIBSC */}
                {/* ALPD-3816 */}
                { (languageList !== undefined && languageList.length > 1) ?
                <FormSelectSearch
                    name={"nlanguagecode"}
                    formLabel={this.props.intl.formatMessage({ id: "IDS_LANGUAGE" })}
                    isSearchable={false}
                    isDisabled={false}
                    placeholder={this.props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                    isMandatory={true}
                    options={languageList || []}
                    optionId='nlanguagecode'
                    optionValue='slanguagename'
                    value={this.state.selectedRecord.nlanguagecode ? this.state.selectedRecord.nlanguagecode : ""}
                    onChange={value => this.onChangeLanguage(value, "nlanguagecode")}
                >
                </FormSelectSearch> : ""
                }
                {/* Added for sonia on 16th June 2025 for jira id:ALPD-6028 (Captcha Validation) */}
                {parseInt(this.props.Login.captchaNeeded)===transactionStatus.YES ? 
                    <div className='canvas'>                            
                        <LoadCanvasTemplate />
                        <div
                            style={{
                                position: 'absolute',
                                top: '15px',
                                right: '25px',
                                width: '100%',
                                height: '2px',
                                backgroundColor: 'black',
                                transform: 'translateY(-50%)',
                                pointerEvents: 'none',
                                maxWidth:"150px"
                            }}
                            ></div>

                        <FormInput
                            name="scaptcha"
                            label={this.props.intl.formatMessage({ id: "IDS_CAPTCHA" })}
                            type="text"
                            required={true}
                            isMandatory={"*"}
                            onChange={(event) => this.onLoginInputChange(event)}                   
                            value={this.state.selectedRecord.scaptcha}
                            style={{marginTop:"15px", maxWidth:"310px"}}

                        />
                    </div>                        
                :""} 
                    
               



                <CustomButtom name="loginbutton" label={this.props.intl.formatMessage({id:"IDS_LOGIN"})} color="primary" className="btn-user btn-primary-blue"
                    handleClick={() => this.onLoginSubmit()}></CustomButtom>
                { this.props.Login.openCPModal &&
                    this.props.Login.userInfo.nlogintypecode === LOGINTYPE.INTERNAL &&
                    <SlideOutModal
                        show={this.props.Login.openCPModal}
                        closeModal={this.closeModal}
                        loginoperation={true}
                        inputParam={{}}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.props.Login.PassFlag === 6 ? this.onCreatePassWord : this.onChangePassword}
                        selectedRecord={this.state.createPwdRecord || {}}
                        mandatoryFields={this.mandatoryFieldFunction(this.props.Login.PassFlag)}
                        addComponent={this.props.Login.PassFlag === 6 ?
                            <CreatePassword
                                sloginid={this.state.selectedRecord.sloginid}
                                createPwdRecord={this.state.createPwdRecord}
                                msg={fnPassMessage(this.props.Login.passwordPolicy)}
                                onInputChange={(event) => this.onInputChange(event)}
                            /> : this.props.Login.PassFlag === transactionStatus.EXPIRED ?
                                <ChangePassword
                                    sloginid={this.state.selectedRecord.sloginid}
                                    createPwdRecord={this.state.createPwdRecord}
                                    msg={fnPassMessage(this.props.Login.passwordPolicy)}
                                    onInputChange={(event) => this.onInputChange(event)}
                                /> : ""
                        }
                    />}
                     {/* Start ALPD-4393 17/06/2024 Abdul Gaffoor.A To validate ads password of login User and to get ads user details and update it */}
                    { this.props.Login.openADSModal &&
                    this.props.Login.userInfo.nlogintypecode === LOGINTYPE.ADS &&
                    <SlideOutModal
                        show={this.props.Login.openADSModal}
                        closeModal={this.closeADSModal}
                        loginoperation={true}
                        inputParam={{}}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.onCreateADSPassWord}
                        selectedRecord={this.state.createPwdRecord || {}}
                        mandatoryFields={this.mandatoryFieldFunction("ADS")}
                        addComponent={
                            <CreateADSPassword
                                sloginid={this.state.selectedRecord.sloginid}
                                createPwdRecord={this.state.createPwdRecord}
                                onInputChange={(event) => this.onInputChange(event)}
                            /> 
                        }
                    />}
                    {/*End  ALPD-4393 17/06/2024 Abdul Gaffoor.A To validate ads password of login User and to get ads user details and update it */}
            </Form>
        );
    }


    onUsersiteChange(ComboVal, fieldName) {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = ComboVal;
        const inputParam = {
            selectedRecord
        };
        this.props.getUsersiteRole(inputParam);
    }

    componentDidMount() {
        this.loginRef.current[0].focus();
        this.props.getLoginDetails();            
    }

    mandatoryFieldFunction(passFlag) {
        let mandatoryField = [];
        if (passFlag === 6) {
            mandatoryField = [
                { "idsName": "IDS_NEWPASSWORD", "dataField": "snewpassword", "mandatory": false },
                { "idsName": "IDS_CONFIRMPASSWORD", "dataField": "sconfirmpassword", "mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"}
            ]
        } else if (passFlag === "ADS") {
            mandatoryField = [
            { "idsName": "IDS_ADSPASSWORD", "dataField": "sadspassword", "mandatory": true, "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"},
            ]
        }
        else {
            mandatoryField = [
                { "idsName": "IDS_OLDPASSWORD", "dataField": "soldpassword", "mandatory": false},
                { "idsName": "IDS_NEWPASSWORD", "dataField": "snewpassword", "mandatory": false },
                { "idsName": "IDS_CONFIRMPASSWORD", "dataField": "sconfirmpassword", "mandatory": true , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"}
            ]
        }
        return mandatoryField;
    }

    closeModal = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openCPModal: false }
        }
        this.props.updateStore(updateInfo);
    }
//Start	ALPD-4393 17/06/2024 Abdul Gaffoor.A To validate ads password of login User and to get ads user details and update it
    closeADSModal = () => {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openADSModal: false }
        }
        this.props.updateStore(updateInfo);
    }
//End	ALPD-4393 17/06/2024 Abdul Gaffoor.A To validate ads password of login User and to get ads user details and update it

    onCreatePassWord = () => {
        const selectedRecord = this.state.selectedRecord;
        const createPwdRecord = this.state.createPwdRecord;
        const snewpassword = createPwdRecord.snewpassword.trim();
        const sconfirmpassword = createPwdRecord.sconfirmpassword.trim();
        if (selectedRecord.sloginid === snewpassword) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_PASSWORDSHOULDNOTSAMEASLOGINID" }));
        } else if (sconfirmpassword !== snewpassword) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_PASSWORDNOTMATCHED" }));
        } else {

// Added by Ragul.C for Double alert shows for Invaliduser
            //selectedRecord["nusermultirolecode"]=this.props.Login.nusermultirolecode;
            selectedRecord["nusermultirolecode"]=this.state.selectedRecord.nusermultirolecode!==undefined && this.state.selectedRecord.nusermultirolecode!=="" ?this.state.selectedRecord.nusermultirolecode:this.props.Login.nusermultirolecode;
            selectedRecord["nusersitecode"]=this.state.selectedRecord.nusersitecode!==undefined && this.state.selectedRecord.nusersitecode!=="" ?this.state.selectedRecord.nusersitecode:this.props.Login.nusersitecode;
            // selectedRecord["nusersitecode"]=this.props.Login.nusersitecode;
            selectedRecord["nusercode"]=this.props.Login.nusercode;
            selectedRecord["nlogintypecode"]=this.props.Login.nlogintypecode;
            selectedRecord["nlanguagecode"]=this.props.Login.nlanguagecode;
            this.setState({ selectedRecord });
// 
            const returnString = fnValidatePassword(this.props.Login.passwordPolicy, snewpassword)
            if (returnString === 0) {
                const inputParam = {
                    spassword: snewpassword,
                    nusersitecode: selectedRecord.nusersitecode.value,
                    nusermultirolecode: selectedRecord.nusermultirolecode.value
                };
                this.props.createPassword(inputParam);
            } else {
                toast.info(returnString);
            }
        }
    }

    //Start	ALPD-4393 17/06/2024 Abdul Gaffoor.A To validate ads password of login User and to get ads user details and update it
    onCreateADSPassWord = () => {
        const selectedRecord = {...this.state.selectedRecord};
        const createPwdRecord = this.state.createPwdRecord;
        const sadspassword = createPwdRecord.sadspassword && createPwdRecord.sadspassword.trim();
                const inputParam = {
                    spassword: sadspassword,
                    sloginid: selectedRecord.sloginid,
                    slanguagefilename: this.props.Login.nlanguagecode && this.props.Login.nlanguagecode.item && this.props.Login.nlanguagecode.item.sfilename,
                    selectedRecord: selectedRecord,
                    nlogintypecode: (this.props.Login.userInfo && this.props.Login.userInfo.nlogintypecode) || LOGINTYPE.ADS,
                };
                this.props.validateADSPassword(inputParam);
        
    }
    //End	ALPD-4393 17/06/2024 Abdul Gaffoor.A To validate ads password of login User and to get ads user details and update it


    onChangePassword = () => {
        const selectedRecord = this.state.selectedRecord;
        const createPwdRecord = this.state.createPwdRecord;
        const returnMsg = changePasswordValidation(createPwdRecord, this.props.Login.passwordPolicy, this.state.selectedRecord.sloginid);
        if (returnMsg === 0) {
            const inputParam = {
                spassword: createPwdRecord.snewpassword.trim(),
                sOldPassword: createPwdRecord.soldpassword.trim(),
                nusersitecode: selectedRecord.nusersitecode.value,
                isPasswordExpiry: true,
                userInfo: { ...this.props.Login.userInfo, slanguagefilename: selectedRecord.nlanguagecode.item.sfilename,
                            sloginid:selectedRecord.sloginid, suserrolename:selectedRecord.nusermultirolecode.label },
                slanguagetypecode: selectedRecord.nlanguagecode.item.slanguagetypecode
            };

            this.props.changepassword(inputParam);
        } else {
            toast.info(returnMsg);
        }
    }

    onLoginInputChange(event) {
        // Gowtham R -- 14/12/2024 -- for Vacuum ALPD-5190
        if(this.state.selectedRecord.nlanguagecode === undefined && event.target.value !== "")
            this.props.getLoginDetails();

        const selectedRecord = this.state.selectedRecord || {};
        const loginid = validateLoginId(event.target.value);
        if (loginid) {
            selectedRecord[event.target.name] = event.target.value;
        } else {
            selectedRecord[event.target.name] = this.state.selectedRecord[event.target.name] ? this.state.selectedRecord[event.target.name] : "";
        }
        this.setState({ selectedRecord });
    }

    selectInputOnChange(event) {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[event.target.name] = event.target.value;
        this.setState({ selectedRecord });
    }

    onInputChange(event) {
        const createPwdRecord = this.state.createPwdRecord || {};
        createPwdRecord[event.target.name] = event.target.value;
        this.setState({ createPwdRecord });
    }

    onSelectChange = (ComboVal, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = ComboVal;
        if (fieldName === "nlogintypecode" && ComboVal.value === LOGINTYPE.INTERNAL
            && selectedRecord.sloginid && selectedRecord.sloginid !== "" 
            && selectedRecord.nusermultirolecode && selectedRecord.nusermultirolecode !== ""
            && selectedRecord.nusersitecode && selectedRecord.nusersitecode !== "") {
            const inputParam = {
                sloginid: this.state.selectedRecord.sloginid,
                Language: selectedRecord.nlanguagecode.item,
                nusermultisitecode: selectedRecord.nusersitecode.value,
                nusermultirolecode: selectedRecord.nusermultirolecode.value,
                nuserrolecode: selectedRecord.nusermultirolecode.item.nuserrolecode,
                nlogintypecode: ComboVal.value
            };
            this.props.checkPassword(inputParam, selectedRecord);
        } else {
            this.setState({ selectedRecord });
        }
    }

    onChangeLanguage = (ComboVal, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = ComboVal;
        this.props.changeLanguage(ComboVal.item.slanguagetypecode, selectedRecord,this.props.Login.loginTypes);
    }


    onFocusOutEvent(event) {

        // event.stopPropagation();
      //  Added by Ragul.C for Double alert shows for Invaliduser
        if(event.target.name === "sloginid"){ 
            
            event.stopPropagation();
        }
        const sloginid = event.target.value;
        if (sloginid !== "") {
            const selectedRecord = this.state.selectedRecord || {};
            const inputParam = {
                sloginid, Language: selectedRecord.nlanguagecode && selectedRecord.nlanguagecode.item,
                 logintype: this.props.Login.loginTypeList,
                 nlogintypecode: selectedRecord.nlogintypecode && selectedRecord.nlogintypecode.value || -1,
            };            
            this.props.getUserSiteAndRole(inputParam, selectedRecord);
        }       
    }

    onLoginEvent = (event) => {
        if (event.keyCode === 13) {
            const inputValue = event.target.value;
            this.setState({
                show: this.props.Login.open
            })
            if (inputValue !== "") {
                this.onLoginSubmit(inputValue);
            }
        }
    }
    AutoLogin = (event) => {
        if (event.keyCode === 118) {
            let nlogintypecode = 1;
            const inputParam = {
                nusermultisitecode: parseInt(-1),
                nusermultirolecode: parseInt(-1),
                slanguagetypecode: "en-US",
                spassword: "123",
                nusercode: -1,
                nlogintypecode: 1,
                nuserrolecode: -1,
                url: nlogintypecode === 1 ? "/login/internallogin" : "/login/adslogin",
                navigation: "home",
                nsitecode:-1,
                languageList: this.props.Login.languageList
            }
            this.setState({
                nusermultisitecode: parseInt(-1),
                nusermultirolecode: parseInt(-1),
                slanguagetypecode: 1,
                spassword: "123",
                nusercode: -1,
                nlogintypecode: 1,
                nuserrolecode: -1
            })
            this.props.clickOnLoginButton(inputParam,this.props.Login.languageList);
        }
    }
    onLoginSubmit() {
        const selectedRecord = this.state.selectedRecord;
        const mandatoryField = [
            { "idsName": "IDS_LOGINID", "dataField": "sloginid", "mandatory": false },
            { "idsName": "IDS_PASSWORD", "dataField": "spassword", "mandatory": true },
            //Don't Remove the Commented line commented for NIBSC
            { "idsName": "IDS_SITE", "dataField": "nusersitecode", "mandatory": true },
            { "idsName": "IDS_ROLE", "dataField": "nusermultirolecode", "mandatory": true },
            { "idsName": "IDS_LOGINTYPE", "dataField": "nlogintypecode", "mandatory": true },
            //Don't Remove the Commented line commented for NIBSC
            { "idsName": "IDS_LANGUAGE", "dataField": "nlanguagecode", "mandatory": true }
        ];  
        //Added for sonia on 16th June 2025 for jira id:ALPD-6028 (Captcha Validation)         
        if (parseInt(this.props.Login.captchaNeeded) === transactionStatus.YES) {
            mandatoryField.push({  idsName: "IDS_CAPTCHA",  dataField: "scaptcha",  mandatory: true });
        }
            

        
        const failedControls = [];
        mandatoryField.map(item => {
            if (selectedRecord[item.dataField] === undefined) {
                failedControls.push(this.props.intl.formatMessage({ id: item.idsName }));
            } else if (typeof selectedRecord[item.dataField] === "object") {
                //to validate FormSelectSearch component
                if (selectedRecord[item.dataField].length === 0) {
                    failedControls.push(this.props.intl.formatMessage({ id: item.idsName }));
                }
            } else if (typeof selectedRecord[item.dataField] === "string") {
                //to handle string field -- added trim function
                if (selectedRecord[item.dataField].trim().length === 0) {
                    failedControls.push(this.props.intl.formatMessage({ id: item.idsName }));
                }
            }
            return null;
        });
        if (failedControls.length === 0) {
            let nlogintypecode = selectedRecord.nlogintypecode.value;
            if (selectedRecord.nusercode === -1) {
                nlogintypecode = LOGINTYPE.INTERNAL;
            }
            //Added for sonia on 16th June 2025 for jira id:ALPD-6028 (Captcha Validation)
            if(parseInt(this.props.Login.captchaNeeded)=== transactionStatus.YES){
                let userCaptcha = this.state.selectedRecord.scaptcha;
                if(validateCaptcha(userCaptcha) !== true){
                    toast.warn(this.props.intl.formatMessage({ id: "IDS_INVALIDCAPTCHA" })); 
                    //6 numberOfCharacters, backgroundColor = '#D3D3D3', fontColor = '#000000', charMap = 'upper/lower/numbers'
                    loadCaptchaEnginge(6,'#D3D3D3');
                }else{
                    const inputParam = {
                        nusermultisitecode: selectedRecord.nusersitecode.value,
                        nusermultirolecode: selectedRecord.nusermultirolecode.value,
                        slanguagetypecode: selectedRecord.nlanguagecode.item.slanguagetypecode,
                        slanguagefilename: selectedRecord.nlanguagecode.item.sfilename,
                        spassword: selectedRecord.spassword,
                        // nusercode: selectedRecord.nusercode,
                        nusercode: selectedRecord.nusercode ? selectedRecord.nusercode : this.props.Login.nusercode,
                        nuserrolecode: selectedRecord.nusermultirolecode.item.nuserrolecode,
                        sloginid: selectedRecord.sloginid,
                        nlogintypecode: nlogintypecode,
                        //nlogintypecode: 1,
                        url: nlogintypecode === 1 ? "/login/internallogin" : "/login/adsLogin",
                        // url: "/login/internallogin" ,
                        navigation: "home",
                        languageList: this.props.Login.languageList,
                        nsitecode:selectedRecord.nusersitecode.item.nsitecode
                    }
                    this.props.clickOnLoginButton(inputParam,this.props.Login.languageList);    
                }
            }else{
                const inputParam = {
                        nusermultisitecode: selectedRecord.nusersitecode.value,
                        nusermultirolecode: selectedRecord.nusermultirolecode.value,
                        slanguagetypecode: selectedRecord.nlanguagecode.item.slanguagetypecode,
                        slanguagefilename: selectedRecord.nlanguagecode.item.sfilename,
                        spassword: selectedRecord.spassword,
                        // nusercode: selectedRecord.nusercode,
                        nusercode: selectedRecord.nusercode ? selectedRecord.nusercode : this.props.Login.nusercode,
                        nuserrolecode: selectedRecord.nusermultirolecode.item.nuserrolecode,
                        sloginid: selectedRecord.sloginid,
                        nlogintypecode: nlogintypecode,
                        //nlogintypecode: 1,
                        url: nlogintypecode === 1 ? "/login/internallogin" : "/login/adsLogin",
                        // url: "/login/internallogin" ,
                        navigation: "home",
                        languageList: this.props.Login.languageList,
                        nsitecode:selectedRecord.nusersitecode.item.nsitecode
                }
                this.props.clickOnLoginButton(inputParam,this.props.Login.languageList);   
            }
           


            
        } else {
            toast.info(`${this.props.intl.formatMessage({ id: "IDS_ENTER" })} ${failedControls[0]}`);
        }
    }

    componentDidUpdate(previousProps) {
        if (this.props.Login.navigation === "home"||this.props.Login.navigation === "dashboard"
        ||this.props.Login.navigation === "alert") {
            this.props.history.push('/'+this.props.Login.navigation);
        }
        
        //Added for sonia on 16th June 2025 for jira id:ALPD-6028 (Captcha Validation)
        if(!this.state.captchaKey && parseInt(this.props.Login.captchaNeeded) === transactionStatus.YES) {
            //6 numberOfCharacters, backgroundColor = '#D3D3D3', fontColor = '#000000', charMap = 'upper/lower/numbers'
            loadCaptchaEnginge(6,'#D3D3D3');
            this.setState({captchaKey:true})
       }
        
        let selectedRecord = this.state.selectedRecord || {};
        let createPwdRecord = this.state.createPwdRecord || {};
        let isStateChanged = false;
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
           selectedRecord = { ...selectedRecord, ...this.props.Login.selectedRecord }; // Gowtham --ALPD-5190
            isStateChanged = true;
        }

        if (this.props.Login.createPwdRecord !== previousProps.Login.createPwdRecord) {
            createPwdRecord = this.props.Login.createPwdRecord;
            isStateChanged = true;
        }

   //     Added by Ragul.C for Double alert shows for Invaliduser
   
//         if (this.props.Login !== previousProps.Login) {
//           //  selectedRecord["nusermultirolecode"]=this.props.Login.selectedRecord && this.props.Login.selectedRecord.nusermultirolecode;
//             selectedRecord["nusermultirolecode"]=this.props.Login.selectedRecord && this.props.Login.selectedRecord.nusermultirolecode !== undefined ?this.props.Login.selectedRecord.nusermultirolecode:this.props.Login.nusermultirolecode;
//             //this.props.Login.nusermultirolecode;
//             selectedRecord["nusersitecode"]=this.state.selectedRecord.nusersitecode!==undefined?this.state.selectedRecord.nusersitecode:this.props.Login.nusersitecode;
// //            selectedRecord["nusersitecode"]=this.props.Login.nusersitecode;
//             selectedRecord["nusercode"]=this.props.Login.nusercode;
//             selectedRecord["nlogintypecode"]=this.props.Login.nlogintypecode;
//             // selectedRecord["nlanguagecode"]=this.props.Login.nlanguagecode;
//             isStateChanged = true;
//         }


        if (isStateChanged) {
            this.setState({ selectedRecord, createPwdRecord });
        }
    }

}

export default connect(mapStateToProps, {
    clickOnLoginButton, changeLanguage,
    getLoginDetails, getUserSiteAndRole, updateStore, createPassword, changepassword, getUsersiteRole, checkPassword, validateADSPassword
})(injectIntl(SignIn));
