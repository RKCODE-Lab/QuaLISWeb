import React from 'react'
import { connect } from 'react-redux';
import { Row, Col, Card, Nav, FormGroup, FormLabel } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { MediaLabel } from '../../../components/add-client.styles';
import { FormattedMessage, injectIntl } from 'react-intl';
import { process } from '@progress/kendo-data-query';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import { toast } from 'react-toastify';
import AddParticipants from './AddParticipants';
import Esign from '../../audittrail/Esign';
import { callService, crudMaster, getTrainingParticipantsComboDataService, getSectionUsersDataService, updateStore, validateEsignCredential ,getTrainingParticipantsInvite,getTrainingParticipantsCancel} from '../../../actions';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import { showEsign } from '../../../components/CommonScript';
import DataGrid from '../../../components/data-grid/data-grid.component';
import { transactionStatus } from '../../../components/Enumeration';
import AddParticipantsStatus from './AddParticipantsStatus';
//import ReactTooltip from 'react-tooltip';
import { ReactComponent as Reject } from '../../../assets/image/reject.svg'

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class TrainingCertificateParticipantsTab extends React.Component {

    constructor(props) {
        super(props);
        const dataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5
        };
        this.state = {
            isOpen: false, selectedRecord: {}, dataResult: [],
            activeTab: 'TrainingParticipants-tab',
            dataState: dataState
        };


        // this.mandatoryColumnList =
        //     [{ "idsName": "IDS_SECTION", "dataField": "nsectioncode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "select" },
        //     { "idsName": "IDS_PARTICIPANTNAME", "dataField": "nusercode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
        //     ];
        // this.mandatoryStatusList=
        // [{ "idsName": "IDS_PARTICIPANTNAME", "dataField": "nusercode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }];


        this.participantsColumnList =
            [{ "idsName": "IDS_PARTICIPANTNAME", "dataField": "sfullname", "width": "150px" },
            { "idsName": "IDS_PARTICIPANTSTATUS", "dataField": "sdisplaystatus", "width": "150px" },
            // { "idsName": "IDS_DATE", "dataField": "smodifieddate", "width": "150px" }
            ];
    }

    participantDataStateChange = (event) => {
        this.setState({
            dataResult: process(this.props.masterData["TrainingParticipants"], event.dataState),
            dataState: event.dataState
        });
    }

    render() {
        const addParticipantsId = this.props.controlMap.has("AddparticipantsTrainingCertificate") && this.props.controlMap.get("AddparticipantsTrainingCertificate").ncontrolcode
        const iniviteParticipantsId = this.props.controlMap.has("InviteParticipant") && this.props.controlMap.get("InviteParticipant").ncontrolcode;
        const cancelParticipantsId = this.props.controlMap.has("CancelTrainingCertificate") && this.props.controlMap.get("CancelTrainingCertificate").ncontrolcode


        const ParticipantsAddParam = {
            screenName: "ParticipantsDetails", operation: "create", primaryKeyField: "nparticipantcode",
            masterData: this.props.masterData, userInfo: this.props.userInfo, ncontrolCode: addParticipantsId
        };

        const ParticipantsIniviteParam = {
            screenName: "ParticipantsDetails", operation: "invite", primaryKeyField: "nparticipantcode",
            masterData: this.props.masterData, userInfo: this.props.userInfo, ncontrolCode: iniviteParticipantsId
        };

        const ParticipantsCancelParam = { screenName: "ParticipantsDetails", methodUrl: "trainingcertificate", operation: "cancel", ncontrolCode: cancelParticipantsId ,userInfo: this.props.userInfo};
//         const mandatoryFields = [];
//         const mandatoryColumnList =this.props.Login.nFlag===2||this.props.Login.nFlag===3?
//                  [{ "idsName": "IDS_PARTICIPANTNAME", "dataField": "nusercode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }]
// :
//             [{ "idsName": "IDS_SECTION", "dataField": "nsectioncode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "select" },
//             { "idsName": "IDS_PARTICIPANTNAME", "dataField": "nusercode", "width": "150px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
//             ];
//         mandatoryColumnList.forEach(item => item.mandatory === true ?
//             mandatoryFields.push(item) : "");
    
            let mandatoryFields = [];
           
                if (this.props.Login.screenName==="IDS_PARTICIPANTSDETAILS") {
                    mandatoryFields.push(
                        {
                          mandatory: true,
                          idsName: "IDS_SECTION",
                          dataField: "nsectioncode",
                          mandatoryLabel: "IDS_SELECT",
                          controlType: "selectbox",
                        },
                       
                            {
                              mandatory: true,
                              idsName: "IDS_PARTICIPANTNAME",
                              dataField: "nusercode",
                              mandatoryLabel: "IDS_SELECT",
                              controlType: "selectbox",
                            });
                        }
                            else{
                                mandatoryFields.push(
                                    {
                                      mandatory: true,
                                      idsName: "IDS_PARTICIPANTNAME",
                                      dataField: "nusercode",
                                      mandatoryLabel: "IDS_SELECT",
                                      controlType: "selectbox",
                                    });
                            }
                
        return (
            <>
                <Row className="no-gutters">
                    <Col md={12}>
                        <Card //className="at-tabs border-0"
                        >
                            <Card.Header className="add-txt-btn">
                                <strong> <FormattedMessage id="IDS_PARTICIPANTSDETAILS" defaultMessage="Participants Details" /></strong>
                            </Card.Header>
                            <Card.Body style={{ paddingTop: 'unset' }}>
                                <Row className="no-gutters text-right border-bottom pt-2 pb-2" >
                                    <Col md={12}>
                                        <div className="d-flex justify-content-end">

                                            <Nav.Link className="btn btn-circle outline-grey mr-2"
                            data-tip={this.props.intl.formatMessage({ id: "IDS_ADDPARTICIPANTS" })}
                          //  data-for="tooltip_list_wrap"
                            hidden={this.props.userRoleControlRights.indexOf(addParticipantsId) === -1}
                            onClick={() => this.getTrainingCertificateData(ParticipantsAddParam, this.state.selectedRecord, this.props.Login.masterData, "Create")}>
                            
                        <FontAwesomeIcon icon={faPlus} />
                        </Nav.Link>
                        <Nav.Link className="btn btn-circle outline-grey mr-2"
                            data-tip={this.props.intl.formatMessage({ id: "IDS_INVITEPARTICIPANTS" })}
                        //    data-for="tooltip_list_wrap"
                            hidden={this.props.userRoleControlRights.indexOf(iniviteParticipantsId) === -1}
                            onClick={() => this.getTrainingCertificateData(ParticipantsIniviteParam,this.state.selectedRecord,this.props.Login.masterData,"Invite")}>
                           
                                <FontAwesomeIcon icon={faUserPlus} />
                           
                        </Nav.Link>
                        <Nav.Link className="btn btn-circle outline-grey mr-2"
                            data-tip={this.props.intl.formatMessage({ id: "IDS_CANCELPARTICIPANTS" })}
                          //  data-for="tooltip_list_wrap"
                            hidden={this.props.userRoleControlRights.indexOf(cancelParticipantsId) === -1}
                            onClick={() => this.getTrainingCertificateData(ParticipantsCancelParam,this.state.selectedRecord,this.props.Login.masterData,"Cancel")}>
                            <Reject className="custom_icons" width="20" height="20" />

                        </Nav.Link>
                                        </div>
                                    </Col>
                                </Row>

                                <Row className="no-gutters">
                                    <Col md={12}>
                                        <DataGrid
                                            primaryKeyField={"nparticipantcode"}
                                          //  expandField="expanded"
                                            detailedFieldList={this.detailedFieldList}
                                            data={this.props.masterData["TrainingParticipants"]}
                                            dataResult={process(this.props.masterData["TrainingParticipants"], this.state.dataState)}
                                            dataState={this.state.dataState}
                                            dataStateChange={this.participantDataStateChange}
                                            extractedColumnList={this.participantsColumnList}
                                            controlMap={this.props.controlMap}
                                            userRoleControlRights={this.props.userRoleControlRights}
                                            inputParam={this.props.inputParam}
                                            userInfo={this.props.userInfo}
                                            methodUrl="TrainingParticipants"
                                            addRecord={() => this.props.getTrainingParticipantsComboDataService(ParticipantsAddParam, this.props.Login.masterData)}
                                            fetchRecord={this.props.getTrainingParticipantsComboDataService}
                                            editParam={ParticipantsIniviteParam}
                                            deleteRecord={this.deleteRecord}
                                            deleteParam={ParticipantsCancelParam}
                                            pageable={true}
                                            scrollable={"scrollable"}
                                            isActionRequired={false}
                                            isToolBarRequired={false}
                                            selectedId={this.props.selectedId}
                                            oldActionRequired={false}
                                            hasDynamicColSize={true}
                                             actionIcons={false}
                                                
                                            //     [
                                            //         {
                                            //             title: this.props.intl.formatMessage({ id: "IDS_INVITE" }),
                                            //             controlname: "faUserPlus",
                                            //             objectName: "mastertoedit",
                                            //             hidden: this.props.userRoleControlRights.indexOf(iniviteParticipantsId) === -1,
                                            //             onClick: this.oninviteListClick,
                                            //             inputData: {}
                                            //         },{
                                            //             title: this.props.intl.formatMessage({ id: "IDS_TRAININGSCHEDULECANCEL" }),
                                            //             controlname: "reject",
                                            //             objectName: "mastertoedit",
                                            //             hidden: this.props.userRoleControlRights.indexOf(cancelParticipantsId) === -1,
                                            //             onClick: this.onCancelListClick,
                                            //             inputData: {}
                                            //         }
                                            //     ]
                                          //  }
                                        />

                                    </Col>
                                </Row>


                            </Card.Body>

                        </Card>
                    </Col>
                </Row>
                {this.props.openChildModal &&
                    <SlideOutModal show={this.props.openChildModal}
                        closeModal={this.closeModal}
                        operation={this.props.operation}
                        inputParam={this.props.inputParam}
                        screenName={this.props.screenName}
                        onSaveClick={this.onSaveClick}
                        updateStore={this.props.updateStore}
                        esign={this.props.loadEsign}
                        validateEsign={this.validateEsign}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={mandatoryFields}
                        addComponent={this.props.loadEsign ?


                            <Esign operation={this.props.operation}
                                formatMessage={this.props.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            /> :  this.props.screenName === "IDS_PARTICIPANTSDETAILS" ?
                            <AddParticipants

                                selectedRecord={this.state.selectedRecord || {}}
                                onInputOnChange={this.onInputOnChange}
                                handleChange={this.handleChange}
                                formatMessage={this.props.formatMessage}
                                section={this.props.Login.section || []}
                                sectionUsers={this.props.Login.sectionUsers || []}
                                nusercode={this.props.Login.nusercode || []}
                                nsectioncode={this.props.Login.nsectioncode || []}
                                selectedTrainingParticipants={this.props.masterData.SelectedTrainingParticipants || {}}
                                extractedColumnList={this.extractedColumnList}
                            />

                            :<AddParticipantsStatus 
                            selectedRecord={this.state.selectedRecord || {}}
                            onInputOnChange={this.onInputOnChange}
                            handleChange={this.handleChange}
                            formatMessage={this.props.formatMessage}
                            usersStatus={this.props.Login.usersStatus || []}
                            nusercode={this.props.Login.nusercode || []}
                            selectedTrainingParticipants={this.props.masterData.SelectedTrainingParticipants || {}}
                            extractedColumnList={this.extractedColumnList}
                            />
                            
                        }

                    />
                }
            </>
        )

    }

    expandChange = (event) => {
        const isExpanded =
            event.dataItem.expanded === undefined ?
                event.dataItem.aggregates : event.dataItem.expanded;
        event.dataItem.expanded = !isExpanded;
        this.setState({ ...this.props });
    }
    detailBand = (props) => {

        const Dataitem = props.dataItem
        const OptionalFieldList = [
            { datafield: "ssectionname", Column: "Section Name" },
            { datafield: "sfullname", Column: "Participants Details" },

        ];
        return (<Row>
            {OptionalFieldList.map((fields) => {
                return (
                    <Col md='6'>
                        <FormGroup>
                            <FormLabel><FormattedMessage id={fields.Column} message={fields.Column} /></FormLabel>
                            <MediaLabel className="readonly-text font-weight-normal">{Dataitem[fields.datafield]}</MediaLabel>
                        </FormGroup>
                    </Col>
                )
            })
            }
        </Row>)
    }

    closeModal = () => {
        let loadEsign = this.props.loadEsign;
        let openChildModal = this.props.openChildModal;
        let selectedRecord = this.props.selectedRecord;
        if (this.props.loadEsign) {
            if (this.props.operation === "delete" || this.props.operation === "cancel") {
                loadEsign = false;
                openChildModal = false;
                selectedRecord = {};
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = "";
                selectedRecord['esigncomments'] = "";
                selectedRecord['esignreason']="";
            }
        }
        else {
            openChildModal = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openChildModal, loadEsign, selectedRecord, selectedId: null }
        }
        this.props.updateStore(updateInfo);

    }

    getTabContent = (event) => {
        this.setState({ activeTab: event.currentTarget.name });
    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;;

        if (fieldName === "ndeputyusersitecode") {
            this.state.deputyUserList.map(item => {
                if (item.nusersitecode === comboData.value) {
                    selectedRecord["sdeputyname"] = item.sfirstname + " " + item.slastname
                }
                return null;
            })
        }
        this.setState({ selectedRecord });

    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            if (event.target.name === "ntransactionstatus")
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
            else
                selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
        }
        else {


            selectedRecord[event.target.name] = event.target.value;

        }
        this.setState({ selectedRecord });
    }

    handleChange = (value, valueParam, isSection) => {

        if (value !== null) {
            const selectedRecord = this.state.selectedRecord || {};

            selectedRecord[valueParam] = value;
            const SelectedTrainingCertificate = this.props.masterData.SelectedTrainingCertificate.ntrainingcode || {};

            if (isSection === "Section") {
                this.props.getSectionUsersDataService(value.value, selectedRecord, this.props.Login.userInfo, SelectedTrainingCertificate);

                selectedRecord["nusercode"] = undefined;

                this.setState({ selectedRecord });
            }
            else {
                this.setState({ selectedRecord });
            }

        }
    }


    componentDidUpdate(previousProps) {
        if (this.props.masterData !== previousProps.masterData) {

            let { dataState } = this.state;
            if (this.props.dataState === undefined) {
                dataState = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 }
            }

            let isOpen = false;
            if (this.props.errorCode !== undefined && (this.state.operation === "create" || this.state.operation === "update")) {
                isOpen = true;
            }
            this.setState({ isOpen, activeTab: 'TrainingParticipants-tab', dataState });
        }

        if (this.props.selectedRecord !== previousProps.selectedRecord) {
            this.setState({ selectedRecord: this.props.selectedRecord });
        }

    }





    onSaveClick = (saveType, formRef) => {

        //add / edit  
        let inputParam = {};

        if (this.props.screenName === "IDS_PARTICIPANTSDETAILS" ) {
            inputParam = this.saveParticipantDetails(saveType, formRef);
        }
if(this.props.screenName === "IDS_INVITEDPARTICIPANTSDETAILS"){
    inputParam = this.saveParticipantInvite(saveType, formRef);

}
if(this.props.screenName === "IDS_CANCELPARTICIPANTSDETAILS"){
    inputParam = this.saveParticipantCancel(saveType, formRef);

}

        if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, this.props.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData: this.props.masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");
        }
    }


    saveParticipantDetails(saveType, formRef) {
        let inputData = [];
        let dataState = undefined;
        inputData["userinfo"] = this.props.userInfo;

        let selectedId = null;

        let trainingparticipants = [];


        this.props.selectedRecord.nusercode && this.props.selectedRecord.nusercode.map(participants => {
            trainingparticipants.push({
                ntrainingcode: this.props.masterData.SelectedTrainingCertificate.ntrainingcode,
                ntrainingcategorycode: this.props.masterData.SelectedTrainingCertificate.ntrainingcategorycode,
                ntechniquecode: this.props.masterData.SelectedTrainingCertificate.ntechniquecode,
                nusercode: participants.item.nusercode,
                susername:participants.item.sfullname,
            ntransactionstatus:this.props.masterData.SelectedTrainingCertificate.ntransactionstatus
            })

        })



        inputData["trainingparticipants"] = trainingparticipants




        const inputParam = {
            classUrl: "trainingcertificate",
            methodUrl: "TrainingParticipants",
            inputData: inputData, selectedId,
            operation: this.props.operation, saveType, formRef, dataState
        }
        return inputParam;
    }


    saveParticipantInvite = (saveType, formRef) => {
        let inputData = [];
        let trainingparticipants = [];
        let dataState = undefined;
        let postParam = { inputListName: "TrainingCertificate", selectedObject: "SelectedTrainingCertificate", primaryKeyField: "ntrainingcode" };

        inputData["userinfo"] = this.props.userInfo;
            this.props.selectedRecord.nusercode && this.props.selectedRecord.nusercode.map(participants => {
                trainingparticipants.push({
                    ntrainingcode: this.props.masterData.SelectedTrainingCertificate.ntrainingcode,
            //        nparticipantcode: this.props.masterData.SelectedTrainingParticipants.nparticipantcode,
                    nusercode: participants.item.nusercode,
                    ntrainingcategorycode: this.props.masterData.SelectedTrainingCertificate.ntrainingcategorycode,
                ntechniquecode: this.props.masterData.SelectedTrainingCertificate.ntechniquecode,
                susername:participants.item.sfullname,
                })
    
            })
            inputData["trainingparticipants"] = trainingparticipants

            const inputParam = {
                classUrl: 'trainingcertificate',
                methodUrl: "TrainingParticipants",
                inputData: inputData,
                operation: "invite",saveType, formRef, dataState,
                postParam
            }
            return inputParam;

            
    }

    saveParticipantCancel = (saveType, formRef) => {
        let inputData = [];
        let trainingparticipants = [];
        let dataState = undefined;
        let postParam = { inputListName: "TrainingCertificate", selectedObject: "SelectedTrainingCertificate", primaryKeyField: "ntrainingcode" };

        inputData["userinfo"] = this.props.userInfo;
            this.props.selectedRecord.nusercode && this.props.selectedRecord.nusercode.map(participants => {
                trainingparticipants.push({
                    ntrainingcode: this.props.masterData.SelectedTrainingCertificate.ntrainingcode,
                //   nparticipantcode: this.props.masterData.selectedTrainingParticipants.nparticipantcode,
                    nusercode: participants.item.nusercode,
                    nparticipantcode: participants.item.nparticipantcode,
                    ntrainingcategorycode: this.props.masterData.SelectedTrainingCertificate.ntrainingcategorycode,
                ntechniquecode: this.props.masterData.SelectedTrainingCertificate.ntechniquecode
                })
    
            })
            inputData["trainingparticipants"] = trainingparticipants

            const inputParam = {
                classUrl: 'trainingcertificate',
                methodUrl: "TrainingParticipants",
                inputData: inputData,
                operation: "cancel",saveType, formRef, dataState,postParam
            }
            return inputParam;

        
            
    }
    // onCancelListClick = (row) => {
    //     //if (this.props.Login.masterData.SelectedTrainingCertificate.ntransactionstatus === transactionStatus.DRAFT) {
    //     const ncontrolCode = this.props.controlMap.has("CancelTrainingCertificate") && this.props.controlMap.get("CancelTrainingCertificate").ncontrolcode
    //     let inputData = [];
    //     inputData["userinfo"] = this.props.Login.userInfo;
    //     //add               
    //     let postParam = undefined;
    //     inputData["trainingparticipants"] = { "nparticipantcode": row.nparticipantcode };
    //     inputData["trainingparticipants"]["ntrainingcode"] = this.props.Login.masterData.TrainingParticipants[0].ntrainingcode;

    //     postParam = { inputListName: "TrainingParticipants", selectedObject: "TrainingParticipants", primaryKeyField: "nparticipantcode" };


    //     const inputParam = {
    //         classUrl: 'trainingcertificate',
    //         methodUrl: "TrainingParticipants",
    //         inputData: inputData,
    //         operation: "cancel", postParam,
    //         selectedId: row.nparticipantcode
    //     }
    //     let saveType;

    //     const masterData = this.props.Login.masterData;

    //     const esignNeeded = showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode);
    //     if (esignNeeded) {
    //         const updateInfo = {
    //             typeName: DEFAULT_RETURN,
    //             data: {
    //                 loadEsign: true, screenData: { inputParam, masterData }, saveType, openModal: true, operation: "cancel"
    //             }
    //         }
    //         this.props.updateStore(updateInfo);
    //     }
    //     else {
    //         this.props.crudMaster(inputParam, masterData, "openModal");
    //     }


    // }

    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason:this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,
               
                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.screenData
        }
        this.props.validateEsignCredential(inputParam, "openChildModal");
    }

    getTrainingCertificateData = (participantParam,selectedRecord, masterData, operation) => {

        if(masterData.SelectedTrainingCertificate.ntransactionstatus !== transactionStatus.CANCELLED && masterData.SelectedTrainingCertificate.ntransactionstatus !== transactionStatus.COMPLETED){
            if(masterData.SelectedTrainingCertificate.ntransactionstatus !== transactionStatus.CONDUCTED){
                if(participantParam.operation === "create"){
                    this.props.getTrainingParticipantsComboDataService(participantParam,masterData);
                }
                else if(participantParam.operation === "invite"){
                    this.props.getTrainingParticipantsInvite(participantParam,selectedRecord, masterData, operation);
                }
                else{
                    this.props.getTrainingParticipantsCancel(participantParam,selectedRecord, masterData, operation);
                }
            }
            else{
                toast.warn(this.props.intl.formatMessage({ id: "IDS_TESTTRAININGALREADYCONDUCTED"}));
            }
        }
        else{
                toast.warn(this.props.intl.formatMessage({ id: masterData.SelectedTrainingCertificate.ntransactionstatus === transactionStatus.CANCELLED? "IDS_TESTTRAININGALREADYCANCELLED" : "IDS_TESTTRAININGALREADYCOMPLETED"}));
        }
    }

    detailedFieldList = [
        { dataField: "ssectionname", idsName: "IDS_SECTIONNAME", columnSize: "4" },
        { dataField: "sfullname", idsName: "IDS_PARTICIPANTS", columnSize: "4" },
        // { dataField: "sfaxno", idsName: "IDS_FAXNO", columnSize:"4" },
        // //{ dataField: "sdisplaystatus", idsName: "IDS_DISPLAYSTATUS" },
        //{ "idsName": "IDS_DISPLAYSTATUS", "dataField": "sdisplaystatus", "width": "20%", "isIdsField": true, "controlName": "ndefaultstatus" }

    ];
}

export default connect(mapStateToProps, { callService, crudMaster,getTrainingParticipantsComboDataService, getSectionUsersDataService, updateStore, validateEsignCredential,getTrainingParticipantsInvite,getTrainingParticipantsCancel })(injectIntl(TrainingCertificateParticipantsTab));

