import React from 'react';
import { connect } from 'react-redux';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { toast } from 'react-toastify';
import AddEmailConfig from './AddEmailConfig';
import EmailConfigTab from './EmailConfigTab';
import AddUsersEmailConfig from './AddUsersEmailConfig';
import Esign from '../../audittrail/Esign';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import { getEmailConfigDetail, callService, crudMaster, fetchEmailConfigById, getUserEmailConfig, filterColumnData, validateEsignCredential, openEmailConfigModal, getFormControls, updateStore } from '../../../actions';
import { constructOptionList, getControlMap, showEsign } from '../../../components/CommonScript';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import { transactionStatus } from '../../../components/Enumeration';
import { ContentPanel, ReadOnlyText, } from '../../../components/App.styles';
import { faPencilAlt, faTrashAlt, } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import ConfirmDialog from '../../../components/confirm-alert/confirm-alert.component';
import ListMaster from '../../../components/list-master/list-master.component';
// import { Tooltip } from '@progress/kendo-react-tooltip';
import ConfirmMessage from '../../../components/confirm-alert/confirm-message.component';
// import ReactTooltip from 'react-tooltip';
const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class EmailConfig extends React.Component {

    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        // this.closeModal = this.closeModal.bind(this);
        this.extractedColumnList = [];
        this.userColumnList = [];
        this.fieldList = [];



        this.state = {
            availableDatas: "",
            availableList: "",
            dataSource: [], masterStatus: "", error: "", selectedRecord: {},
            isOpen: false,
            EmailHost: [],
            EmailScreen: [],
            ActionType: [],
            EmailTemplate: [],
            userRoleControlRights: [],
            controlMap: new Map()
        };
        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
        this.searchFieldList = ["shostname", "sscreenname", "scontrolids", "sformname", "stemplatename"];

    }

    static getDerivedStateFromProps(props, state) {

        if (props.Login.masterStatus !== "" && props.Login.masterStatus !== state.masterStatus) {
            toast.warn(props.Login.masterStatus);
            props.Login.masterStatus = "";
        }

        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        return null;
    };

    ConfirmDelete = (screenname, SelectedEmailConfig, operation, ncontrolcode) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteRecord(//screenname, SelectedEmailConfig, 
                operation, ncontrolcode));
    };

    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete") {
                loadEsign = false;
                openModal = false;
                selectedRecord = {};
            } else {
                loadEsign = false;
            }
        } else {
            openModal = false;
            selectedRecord = {};
        
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign, selectedRecord, selectedId: null, EmailUserQuery:[] }
        }
        this.props.updateStore(updateInfo);
    }


    render() {
        this.extractedColumnList = [
                                    { "controlType": "textbox", "idsName": "IDS_USERS", "dataField": "susername", "width": "200px" },
                                    { "controlType": "textbox", "idsName": "IDS_EMAILID", "dataField": "semail", "width": "200px" },
                                ];

        const mandatoryFieldsEmailConfig = [
                                            { "mandatory": true, "idsName": "IDS_HOSTNAME", "dataField": "nemailhostcode"  , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
                                            { "mandatory": true, "idsName": "IDS_SCREENNAME", "dataField": "nemailscreencode"  , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
                                            { "mandatory": true, "idsName": "IDS_TEMPLATENAME", "dataField": "nemailtemplatecode"  , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"},
                                            { "mandatory": true, "idsName": "IDS_CONTROLNAME", "dataField": "ncontrolcode"  , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"}
                                        ];

        const mandatoryFieldsUsers = [{ "mandatory": true, "idsName": "IDS_USERS", "dataField": "nusercode"  , "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox"}];
        
        const addId = this.props.Login.inputParam && this.state.controlMap.has("AddEmailConfig")
            && this.state.controlMap.get("AddEmailConfig").ncontrolcode;

        const editID = this.props.Login.inputParam && this.state.controlMap.has("EditEmailConfig")
            && this.state.controlMap.get("EditEmailConfig").ncontrolcode;

        const deleteID = this.props.Login.inputParam && this.state.controlMap.has("DeleteEmailConfig")
            && this.state.controlMap.get("DeleteEmailConfig").ncontrolcode;


        const addUserId = this.props.Login.inputParam && this.state.controlMap.has("AddEmailConfigUsers")
            && this.state.controlMap.get("AddEmailConfigUsers").ncontrolcode;

        const editParam = {
            SelectedEmailConfig: this.props.Login.masterData.SelectedEmailConfig,
            screenName: "IDS_MAILCONFIG", primaryKeyField: "nemailconfigcode", operation: "update",
            inputParam: this.props.Login.inputParam, userInfo: this.props.Login.userInfo, ncontrolCode: editID
        };

        const deleteParam = { operation: "delete" };

        const filterParam = {  inputListName: "EmailConfig", selectedObject: "SelectedEmailConfig", primaryKeyField: "nemailconfigcode",
                                fetchUrl: "emailconfig/getEmailConfig", fecthInputObject: { userinfo: this.props.Login.userInfo },
                                masterData: this.props.Login.masterData, searchFieldList: this.searchFieldList
                            };
        return (<>
            {/* Start of get display*/}
            <div className="client-listing-wrap mtop-4">
                <Row noGutters={true}>
                    <Col md={4}>
                        <Row noGutters={true}><Col md={12}>
                            <div className="list-fixed-wrap">
                                <ListMaster
                                    screenName={this.props.intl.formatMessage({ id: "IDS_MAILCONFIG" })}
                                    masterData={this.props.Login.masterData}
                                    userInfo={this.props.Login.userInfo}
                                    masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.EmailConfig}
                                    getMasterDetail={(emailconfig) => this.props.getEmailConfigDetail(emailconfig, this.props.Login.userInfo, this.props.Login.masterData)}
                                    selectedMaster={this.props.Login.masterData.SelectedEmailConfig}
                                    primaryKeyField="nemailconfigcode"
                                    mainField="stemplatename"
                                    firstField= "sscreenname"
                                    secondField= "scontrolids"
                                    filterColumnData={this.props.filterColumnData}
                                    filterParam={filterParam}
                                    userRoleControlRights={this.state.userRoleControlRights}
                                    addId={addId}
                                    searchRef={this.searchRef}
                                    reloadData={this.reloadData}
                                    openModal={() => this.props.openEmailConfigModal("IDS_MAILCONFIG", "create", this.props.Login.userInfo, addId)}
                                    isMultiSelecct={false}
                                    hidePaging={true}
                                />
                            </div>
                        </Col></Row>
                    </Col>
                    <Col md={8}>
                        <Row><Col md={12}>
                            <ContentPanel className="panel-main-content">
                                <Card className="border-0">
                                    {this.props.Login.masterData.EmailConfig && this.props.Login.masterData.EmailConfig.length > 0 && this.props.Login.masterData.SelectedEmailConfig ?
                                        <>
                                            <Card.Header>
                                                {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                                                <Card.Title className="product-title-main">
                                                    {this.props.Login.masterData.SelectedEmailConfig.stemplatename}
                                                </Card.Title>
                                                <Card.Subtitle>
                                                    <div className="d-flex product-category title-grid-wrap-width-md">
                                                        <div>
                                                        <h6 className="title-grid-width-md product-title-sub flex-grow-1">
                                                            {this.props.Login.masterData.SelectedEmailConfig.shostname}{' | '}{this.props.Login.masterData.SelectedEmailConfig.senablestatus}
                                                            {/* <FormattedMessage id= {this.props.Login.masterData.SelectedUser.sactivestatus}/> */}
                                                        </h6>
                                                        </div>
                                                       
                                                        {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                        <div className="product-category" style={{ float: "right" }}>
                                                            <Nav.Link name="editUser"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                            //    data-for="tooltip_list_wrap"
                                                                hidden={this.state.userRoleControlRights.indexOf(editID) === -1}
                                                                className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                onClick={() => this.props.fetchEmailConfigById(editParam)}
                                                            >
                                                                <FontAwesomeIcon icon={faPencilAlt} />
                                                            </Nav.Link>
                                                            <Nav.Link name="deleteUser"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                             //   data-for="tooltip_list_wrap"
                                                                className="btn btn-circle outline-grey mr-2 action-icons-wrap"
                                                                hidden={this.state.userRoleControlRights.indexOf(deleteID) === -1}
                                                                onClick={() => this.ConfirmDelete("IDS_MAILCONFIG", this.props.Login.masterData.SelectedEmailConfig, "delete", deleteID)}>
                                                                <FontAwesomeIcon icon={faTrashAlt} />
                                                                {/* <ConfirmDialog 
                                                                name="deleteMessage" 
                                                                message={this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG"})}
                                                                doLabel={this.props.intl.formatMessage({ id: "IDS_OK" })}  
                                                                doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                                icon={faTrashAlt}
                                                               // title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                //hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                handleClickDelete={() => this.deleteRecord("IDS_MAILCONFIG", this.props.Login.masterData.SelectedEmailConfig, 
                                                                "delete", deleteID)} 
                                                            /> */}
                                                            </Nav.Link>
                                                        </div>
                                                        {/* </Tooltip> */}
                                                    </div>
                                                </Card.Subtitle>
                                            </Card.Header>
                                            <Card.Body>
                                                <Card.Text>
                                                    <Row>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_HOSTNAME" message="Host Name" /></FormLabel>
                                                                <ReadOnlyText>{this.props.Login.masterData.SelectedEmailConfig.shostname}</ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_SCREENNAME" message="Screen Name" /></FormLabel>
                                                                <ReadOnlyText>{this.props.Login.masterData.SelectedEmailConfig.sformname}</ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_MAILENABLE" message="Mail Enable" /></FormLabel>
                                                                <ReadOnlyText>
                                                                    {this.props.Login.masterData.SelectedEmailConfig.senablestatus}
                                                                </ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>
                                                        {/* <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_FORMNAME" message="Form Name" /></FormLabel>
                                                                <ReadOnlyText>{this.props.Login.masterData.SelectedEmailConfig.sformname}</ReadOnlyText>
                                                            </FormGroup>
                                                        </Col> */}
                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_CONTROLNAME" message="Control Name" /></FormLabel>
                                                                <ReadOnlyText>{this.props.Login.masterData.SelectedEmailConfig.scontrolids}</ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>

                                                        <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_EMAILQUERY" message="Email Query" /></FormLabel>
                                                                <ReadOnlyText>{this.props.Login.masterData.SelectedEmailConfig.sdisplayname === null || 
                                                                this.props.Login.masterData.SelectedEmailConfig.sdisplayname.length === 0 ||
                                                                this.props.Login.masterData.SelectedEmailConfig.sdisplayname === 'NA' ? '-' :
                                                                    this.props.Login.masterData.SelectedEmailConfig.sdisplayname}
                                                                </ReadOnlyText>
                                                            </FormGroup>
                                                        </Col>

                                                        {/* <Col md={4}>
                                                            <FormGroup>
                                                                <FormLabel><FormattedMessage id="IDS_ACTIONTYPE" message="Action Type" /></FormLabel>
                                                                <ReadOnlyText>{this.props.Login.masterData.SelectedEmailConfig.sactiontype}</ReadOnlyText>
                                                            </FormGroup>
                                                        </Col> */}
                                                    </Row>
                                                </Card.Text>
                                                <EmailConfigTab
                                                    getUserEmailConfig={this.props.getUserEmailConfig}
                                                    addUserId={addUserId}
                                                    userInfo={this.props.Login.userInfo}
                                                    inputParam={this.props.Login.inputParam}
                                                    userRoleControlRights={this.state.userRoleControlRights}
                                                    controlMap={this.state.controlMap}
                                                    masterData={{
                                                        "users": this.props.Login.masterData.users || [],
                                                    }}
                                                    //  crudMaster={this.props.crudMaster}
                                                    methodUrl="EmailConfigUsers"
                                                    deleteRecord={this.deleteUsersRecord}
                                                    deleteParam={deleteParam}
                                                    SelectedEmailConfig={this.props.Login.masterData.SelectedEmailConfig}
                                                    masterdata={this.props.Login.masterData}
                                                />
                                            </Card.Body>
                                        </>
                                        : ""
                                    }
                                </Card>
                            </ContentPanel>
                        </Col></Row>
                    </Col>
                </Row>
            </div>
            {this.props.Login.openModal &&
                <SlideOutModal
                    show={this.props.Login.openModal}
                    closeModal={this.closeModal}
                    operation={this.props.Login.operation}
                    inputParam={this.props.Login.inputParam}
                    screenName={this.props.Login.screenName}
                    onSaveClick={this.props.Login.screenName === "IDS_USERS" ? this.onUserSaveClick : this.onSaveClick}
                    esign={this.props.Login.loadEsign}
                    validateEsign={this.validateEsign}
                    selectedRecord={this.state.selectedRecord || {}}
                    mandatoryFields={this.props.Login.screenName === "IDS_USERS" ? mandatoryFieldsUsers : mandatoryFieldsEmailConfig}
                    masterStatus={this.props.Login.masterStatus}
                    updateStore={this.props.updateStore}
                    addComponent={this.props.Login.loadEsign ?
                        <Esign
                            operation={this.props.Login.operation}
                            formatMessage={this.props.intl.formatMessage}
                            onInputOnChange={this.onInputOnChange}
                            inputParam={this.props.Login.inputParam}
                            selectedRecord={this.state.selectedRecord || {}}
                        />
                        : this.props.Login.screenName === "IDS_MAILCONFIG" ? <AddEmailConfig
                            selectedRecord={this.state.selectedRecord || {}}
                            onInputOnChange={this.onInputOnChange}
                            onComboChange={this.onComboChange}
                            emailHost={this.state.EmailHost || []}
                            emailTemplate={this.state.EmailTemplate || []}
                            emailScreen={this.state.EmailScreen || []}
                            //actionType={this.state.ActionType || []}
                            formName={this.state.FormName}
                            formControls={this.state.FormControls}
                            emailQueryList={this.state.emailQueryList||[]}
                            users={this.props.Login.AvailableUsers || []}
                            operation={this.props.Login.operation}
                        /> : <AddUsersEmailConfig
                            selectedRecord={this.state.selectedRecord || {}}
                            onInputOnChange={this.onInputOnChange}
                            onComboChange={this.onComboChange}
                            users={this.props.Login.users || []}
                            operation={this.props.Login.operation}
                        />
                    }
                />
            }
        </>
        );
    }

    componentDidUpdate(previousProps) {
        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
                this.setState({userRoleControlRights, controlMap});
            }
        } 
        else if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }

        if (this.props.Login.EmailHost !== previousProps.Login.EmailHost
             || this.props.Login.EmailTemplate !== previousProps.Login.EmailTemplate 
             || this.props.Login.EmailScreen !== previousProps.Login.EmailScreen
            || this.props.Login.FormControls !== previousProps.Login.FormControls 
            || this.props.Login.FormName !== previousProps.Login.FormName
            || this.props.Login.EmailUserQuery  !== previousProps.Login.EmailUserQuery) {

            const EmailHost = constructOptionList(this.props.Login.EmailHost || [], "nemailhostcode",
                "shostname", undefined, undefined, undefined);
            const EmailHostList = EmailHost.get("OptionList");

            const EmailTemplate = constructOptionList(this.props.Login.EmailTemplate || [], "nemailtemplatecode",
                "stemplatename", undefined, undefined, undefined);
            const EmailTemplateList = EmailTemplate.get("OptionList");

            const EmailScreen = constructOptionList(this.props.Login.EmailScreen || [], "nemailscreencode",
                "sscreenname", undefined, undefined, undefined);
            const EmailScreenList = EmailScreen.get("OptionList");

            // const ActionType = constructOptionList(this.props.Login.ActionType || [], "nactiontype",
            //     "stransdisplaystatus", undefined, undefined, undefined);
            // const ActionTypeList = ActionType.get("OptionList");

            const FormName = constructOptionList(this.props.Login.FormName || [], "nformcode",
                "sformname", undefined, undefined, undefined);
            const FormNameList = FormName.get("OptionList");

            const FormControls = constructOptionList(this.props.Login.FormControls || [], "ncontrolcode",
                "scontrolids", undefined, undefined, undefined);
            const FormControlList = FormControls.get("OptionList");

            const EmailQuery = constructOptionList(this.props.Login.EmailUserQuery || [], "nemailuserquerycode",
                "sdisplayname", undefined, undefined, undefined);
            const EmailQueryList = EmailQuery.get("OptionList");

            this.setState({ EmailHost: EmailHostList, EmailTemplate: EmailTemplateList,
                 EmailScreen: EmailScreenList, FormName: FormNameList, FormControls: FormControlList,emailQueryList:EmailQueryList });
        }
    }

    onInputOnChange = (event) => {

        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};

        if (fieldName === 'nusercode') {

            selectedRecord["nusercode"] = comboData;
            let availableDatas = "";
            let availableList = [];
            this.state.selectedRecord.nusercode.map(data => {
                availableDatas = availableDatas + "," + data.value;
                availableList.push(data.item);
                return availableDatas;
            });
            this.setState({ selectedRecord, availableDatas, availableList });
        }
        else if (fieldName === 'nemailscreencode') {
            selectedRecord[fieldName] = comboData;
            this.props.getFormControls(selectedRecord, this.props.Login.userInfo);
        }
        else {
            //  const selectedRecord = this.state.selectedRecord || {};
            selectedRecord[fieldName] = comboData;
            this.setState({ selectedRecord });
        }
        //     //const selectedRecord = this.state.selectedRecord || {};
        //     selectedRecord["nusercode"] = comboData;
        //     let availableDatas ="";
        //     let availableList= [];
        //     this.state.selectedRecord.nusercode.map(data=> {
        //         availableDatas=availableDatas+","+data.value;
        //         availableList.push(data.item);
        //     return availableDatas;
        //      });
        //     this.setState({ selectedRecord,availableDatas,availableList });
        // }
        // else if(fieldName==='nuserrolecode'){
        //     selectedRecord["nuserrolecode"] = comboData;
        // }
        // else {
        //    // const selectedRecord = this.state.selectedRecord || {};
        //     selectedRecord[fieldName] = comboData;
        //     this.setState({ selectedRecord });

        // }
        // if(fieldName==='nuserrolecode'){
        //     this.props.onuseroleChange(this.props.Login.masterData,comboData.value,this.props.Login.userInfo,selectedRecord,this.state.availableList)

        // }

    }

    deleteUsersRecord = (inputData) => {
        const inputParam = {
                            classUrl: this.props.Login.inputParam.classUrl,
                            methodUrl: "Users",

                            inputData: {
                                "emailuserconfig": inputData.selectedRecord,
                                "userinfo": this.props.Login.userInfo
                            },
                            operation: 'delete',
                            displayName: this.props.Login.inputParam.displayName,
                            dataState: this.state.dataState, isChild:true,
                            postParam :{ inputListName: "EmailConfig", selectedObject: "SelectedEmailConfig", 
                                          primaryKeyField: "nemailconfigcode",
                                          fetchUrl:"emailconfig/getEmailConfig",
                                          fecthInputObject: { userinfo: this.props.Login.userInfo } }
                        }
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, inputData.ncontrolCode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: 'IDS_USERS',
                    operation: 'delete'
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }

    deleteRecord = (//screenname, SelectedEmailConfig, 
        operation, ncontrolcode) => {
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "EmailConfig",

            inputData: {
                "emailuserconfig": this.props.Login.masterData.SelectedEmailConfig,
                "userinfo": this.props.Login.userInfo
            },
            operation: operation,
            displayName: this.props.Login.inputParam.displayName,
            dataState: this.state.dataState,
            postParam :{ inputListName: "EmailConfig", selectedObject: "SelectedEmailConfig", 
                            primaryKeyField: "nemailconfigcode",
                            fetchUrl:"emailconfig/getEmailConfig",
                            fecthInputObject: { userinfo: this.props.Login.userInfo } }
        }
        const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolcode);
        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.Login.masterData },
                    openModal: true, screenName: this.props.intl.formatMessage({ id: this.props.Login.inputParam.displayName }),
                    operation: operation
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.Login.masterData, "openModal");
        }
    }

    reloadData = () => {

        this.searchRef.current.value = "";
        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },

            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "EmailConfig",
            userInfo: this.props.Login.userInfo,
            displayName: this.props.Login.inputParam.displayName
        };

        this.props.callService(inputParam);
    }

    onSaveClick = (saveType, formRef) => {
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        let postParam = undefined;

        const selectedRecord = this.state.selectedRecord;
        if (this.props.Login.operation === "update") {
            // edit
            postParam = { inputListName: "EmailConfig", selectedObject: "SelectedEmailConfig", 
                            primaryKeyField: "nemailconfigcode" }
            inputData["emailconfig"] = JSON.parse(JSON.stringify(selectedRecord));
            //inputData[this.props.Login.inputParam.methodUrl.toLowerCase()] = JSON.parse(JSON.stringify(this.state.selectedRecord));

        } else {
            inputData["emailconfig"] = { "nsitecode": this.props.Login.userInfo.nmastersitecode };
// ALPD-4077 (15-05-2024) Changed this.state.availableDatas to selectedRecord["nusercode"] to form nusercode as string by joining comma
            inputData["emailuserconfig"] = selectedRecord["nusercode"] && selectedRecord["nusercode"].length > 0 ? selectedRecord["nusercode"].map(item => item.value).join(",") : null;
        }
        //inputData["emailconfig"]["ntranscode"] = this.state.selectedRecord["ntranscode"] ? this.state.selectedRecord["ntranscode"] : 14;
        inputData["emailconfig"]["nneedattachment"] = selectedRecord["nneedattachment"] ? selectedRecord["nneedattachment"] : 4;
        inputData["emailconfig"]["nenableemail"] = selectedRecord["nenableemail"] ? selectedRecord["nenableemail"] : transactionStatus.NO;
        //inputData["emailconfig"]["nactiontype"] = selectedRecord["nactiontype"] ? selectedRecord["nactiontype"].value : -1;
        inputData["emailconfig"]["ncontrolcode"] = selectedRecord["ncontrolcode"] ? selectedRecord["ncontrolcode"].value : -1;
        inputData["emailconfig"]["nformcode"] = selectedRecord["nemailscreencode"] ? selectedRecord.nemailscreencode.item.nformcode  : -1;
        inputData["emailconfig"]["nemailtemplatecode"] = selectedRecord["nemailtemplatecode"] ? selectedRecord["nemailtemplatecode"].value : -1;
        inputData["emailconfig"]["nemailscreencode"] = selectedRecord["nemailscreencode"] ? selectedRecord["nemailscreencode"].value : -1;
        inputData["emailconfig"]["nemailhostcode"] = selectedRecord["nemailhostcode"] ? selectedRecord["nemailhostcode"].value : -1;
        inputData["emailconfig"]["nemailuserquerycode"] = selectedRecord["nemailuserquerycode"] ? selectedRecord["nemailuserquerycode"].value : -1;
        inputData["emailconfig"]["nstatus"] = transactionStatus.ACTIVE;

        if (inputData["emailconfig"]["nemailuserquerycode"] === undefined){
            inputData["emailconfig"]["nemailuserquerycode"] = -1;
        }

            const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "EmailConfig",
            displayName: this.props.Login.inputParam.displayName ? this.props.Login.inputParam.displayName : '',
            inputData: inputData,
            operation: this.props.Login.operation,
            saveType, formRef, postParam, searchRef: this.searchRef
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {

            this.props.crudMaster(inputParam, masterData, "openModal");
        }
        // this.props.crudMaster(inputParam, this.props.Login.masterData,"openModal");
    }

    onUserSaveClick = (saveType, formRef) => {
        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        let postParam = undefined;
        let selectedId = null;
        const selectedRecord = this.state.selectedRecord;
// ALPD-4077 (15-05-2024) Changed this.state.availableDatas to selectedRecord["nusercode"] to form nusercode as string by joining comma
        inputData["nusercode"] = selectedRecord["nusercode"] && selectedRecord["nusercode"].length > 0 ? selectedRecord["nusercode"].map(item => item.value).join(",") : null;
        inputData["nemailconfigcode"] = this.props.Login.masterData.SelectedEmailConfig.nemailconfigcode ? this.props.Login.masterData.SelectedEmailConfig.nemailconfigcode : -1;
        inputData["nstatus"] = transactionStatus.ACTIVE;
        const inputParam = {
            classUrl: this.props.Login.inputParam.classUrl,
            methodUrl: "Users",
            displayName: this.props.Login.inputParam.displayName ? this.props.Login.inputParam.displayName : '',
            inputData: inputData,
            operation: this.props.Login.operation,isChild:true,
            saveType, formRef, postParam, searchRef: this.searchRef, selectedId
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolcode)) {

            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {

            this.props.crudMaster(inputParam, masterData, "openModal");
        }
        // this.props.crudMaster(inputParam, this.props.Login.masterData,"openModal");
    }


    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined, operation: null, modalName: undefined
            }
        }
        this.props.updateStore(updateInfo);
    }

    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
               
                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
        }
        this.props.validateEsignCredential(inputParam, "openModal");
    }

}
export default connect(mapStateToProps, { getEmailConfigDetail, callService, filterColumnData, getUserEmailConfig, crudMaster, fetchEmailConfigById, validateEsignCredential, openEmailConfigModal, getFormControls, updateStore })(injectIntl(EmailConfig));