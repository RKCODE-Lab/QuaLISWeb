import React, { version } from 'react'
import { Row, Col, Card } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import { process } from '@progress/kendo-data-query';
import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import { constructOptionList, onDropAttachFileList, deleteAttachmentDropZone, showEsign, create_UUID, Lims_JSON_stringify } from '../../../components/CommonScript';
import CustomTabs from '../../../components/custom-tabs/custom-tabs.component';
import { connect } from 'react-redux';
import TrainingParticipantsTab from './TrainingParticipantsTab';
import TrainingDocTab from './TrainingDocTab';
import AddTrainingDocFile from './AddTrainingDocFile';
import AddTraineeDocFile from './AddTraineeDocFile';
import Esign from '../../audittrail/Esign';
import { attachmentType, FORMULAFIELDTYPE, transactionStatus } from '../../../components/Enumeration';
import AddParticipantsStatus from '../trainingcertificate/AddParticipantsStatus';
import { addtraineedocfile, viewAttachment } from '../../../actions';


const mapStateToProps = state => {
    return ({ Login: state.Login })
}
class TrainingUpdateChildTab extends React.Component {

    constructor(props) {
        super(props);
        const dataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5
        };
        const dataStateParticipants = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5
        };
        this.state = {
            isOpen: false, selectedRecord: {}, dataResult: [],
            activeTab: 'Trainingdoc-tab',
            dataState: dataState,
            dataStateParticipants: dataStateParticipants, trainingDocument: [], participants: []
        };
        this.trainingDocumentFieldList = ['ntrainingdoccode', 'nparticipantcode', 'ntrainingcode', 'sfilename', 'ntechniquecode', 'sfullname',
            'nstatus', 'ntransactionstatus'];
        this.trainingDocumentColumnList = [{ "idsName": "IDS_TRAININGDOCUMENTNAME", "dataField": "sfilename", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }];
        this.participantsColumnList = [{ "idsName": "IDS_PARTICIPANTSNAME", "dataField": "sfullname", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_ENTER", "controlType": "textbox" }];
        // this.validationTrainingDocumentColumnList = [{ "idsName": "IDS_TRAININGDOCUMENTNAME", "dataField": "sfilename", "width": "200px", "mandatory": true, "mandatoryLabel":"IDS_SELECT", "controlType": "selectbox" }];
        this.validationParticipantsColumnList = [{ "idsName": "IDS_PARTICIPANTS", "dataField": "sfullname", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }];
    }
    TrainingDocumentDataStateChange = (event) => {
        this.setState({
            dataState: event.dataState
        });
    }
    ParticipantsDataStateChange = (event) => {
        this.setState({
            dataStateParticipants: event.dataState
        });
    }
    handleChange = (value, valueParam, isSection) => {

        if (value !== null) {
            const selectedRecord = this.state.selectedRecord || {};

            selectedRecord[valueParam] = value;

            this.setState({ selectedRecord });


        }
    }

    viewTraineeDocumentFile = (filedata) => {
        const inputParam = {
            inputData: {
                traineefile: filedata,
                userinfo: this.props.userInfo
            },
            classUrl: "trainingupdate",
            operation: "view",
            methodUrl: "AttachedTraineeFile",
            screenName: "IDS_TRAINEEDOCUMENT"
        }
        this.props.viewAttachment(inputParam);
    }

    viewTrainingDocumentFile = (filedata) => {
        const inputParam = {
            inputData: {
                trainingfile: filedata,
                userinfo: this.props.userInfo
            },
            classUrl: "trainingupdate",
            operation: "view",
            methodUrl: "AttachedTrainingFile",
            screenName: "IDS_TRAININGDOCUMENT"
        }
        this.props.viewAttachment(inputParam);
    }

    render() {
        // const mandatoryFields = [];
        // this.validationTrainingDocumentColumnList.forEach(item => item.mandatory === true ?
        //    mandatoryFields.push(item) : ""
        //  );
        let mandatoryFields = [];
        if (this.props.screenName === "IDS_TRAININGDOCUMENTS" || this.props.screenName === "IDS_TRAINEEDOCUMENTS") {
            if (this.state.selectedRecord && this.state.selectedRecord.nattachmenttypecode === attachmentType.LINK) {
                mandatoryFields.push(
                    { "idsName": "IDS_FILENAME", "dataField": "slinkfilename", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
                    { "idsName": "IDS_LINKNAME", "dataField": "nlinkcode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
                );
            } else {
                mandatoryFields.push(
                    { "idsName": "IDS_FILE", "dataField": "sfilename", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" }
                );
            }
        }
        else {
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
                        <Card className="at-tabs">
                            <CustomTabs tabDetail={this.tabDetail()} onTabChange={this.onTabChange} />
                        </Card>
                    </Col>
                </Row>
                {this.props.Login.openChildModal &&
                    <SlideOutModal show={this.props.Login.openChildModal}
                        closeModal={this.closeModal}
                        operation={this.props.Login.operation}
                        inputParam={this.props.Login.inputParam}
                        screenName={this.props.Login.screenName}
                        onSaveClick={this.onSaveClick}
                        esign={this.props.Login.loadEsign}
                        validateEsign={this.validateEsign}
                        masterStatus={this.props.Login.masterStatus}
                        updateStore={this.props.updateStore}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={mandatoryFields}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign operation={this.props.Login.operation}
                                formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            />
                            : this.props.screenName === "IDS_TRAININGDOCUMENTS" ?
                                <AddTrainingDocFile
                                    selectedRecord={this.state.selectedRecord || {}}
                                    onDrop={this.onDropTrainingDoc}
                                    onInputOnChange={this.onInputOnChange}
                                    deleteAttachment={this.deleteAttachment}
                                    formatMessage={this.props.intl.formatMessage}
                                    label={this.props.intl.formatMessage({ id: "IDS_FILENAME" })}
                                    operation={this.props.Login.operation}
                                    userLogged={this.props.Login.userLogged}
                                    inputParam={this.props.Login.inputParam}
                                    selectedId={this.props.Login.selectedId}
                                    maxSize={20}
                                    maxFiles={1}
                                    linkMaster={this.props.Login.linkMaster}
                                    onComboChange={this.props.onComboChange}
                                />
                                : this.props.screenName === "IDS_TRAINEEDOCUMENTS" ?
                                    <AddTraineeDocFile
                                        selectedRecord={this.state.selectedRecord || {}}
                                        onDrop={this.onDropTrainieeDoc}
                                        onInputOnChange={this.onInputOnChange}
                                        deleteAttachment={this.deleteAttachment}
                                        formatMessage={this.props.intl.formatMessage}
                                        label={this.props.intl.formatMessage({ id: "IDS_FILENAME" })}
                                        operation={this.props.Login.operation}
                                        userLogged={this.props.Login.userLogged}
                                        inputParam={this.props.Login.inputParam}
                                        selectedId={this.props.Login.selectedId}
                                        linkMaster={this.props.Login.linkMaster}
                                        onComboChange={this.props.onComboChange}
                                    />
                                    : <AddParticipantsStatus
                                        selectedRecord={this.props.selectedRecord || {}}
                                        onInputOnChange={this.onInputOnChange}
                                        handleChange={this.handleChange}
                                        formatMessage={this.props.formatMessage}
                                        usersStatus={this.props.usersStatus || []}
                                        nusercode={this.props.nusercode || []}
                                        selectedTrainingParticipants={this.props.masterData.SelectedTrainingParticipants || {}}
                                        extractedColumnList={this.extractedColumnList}
                                    />
                        }
                    />
                }
            </>

        )

    }


    tabDetail = () => {

        const tabMap = new Map();

        tabMap.set("IDS_PARTICIPANTS", <TrainingParticipantsTab

            userRoleControlRights={this.props.userRoleControlRights}
            controlMap={this.props.controlMap}
            inputParam={this.props.inputParam}
            userInfo={this.props.userInfo}
            screenName={" TrainieeDocuments"}
            updateStore={this.props.updateStore}
            primaryKeyField={"nparticipantcode"}
            masterData={this.props.masterData}
            primaryList={"Participants"}
            dataResult={process(this.props.Login.masterData["Participants", "TraineeDocuments"] || [], this.state.dataStateParticipants)}
            dataState={(this.props.screenName === undefined || this.props.screenName === "Participants") ? this.state.dataStateParticipants : { skip: 0 }}
            dataStateChange={(event) => this.setState({ dataStateParticipants: event.data })}
            columnList={this.participantsColumnList}
            methodUrl={"TrainingParticipants"}
            fetchParticipantsRecordByID={this.fetchParticipantsRecordByID}
            deleteRecord={this.deleteRecord}
            getAvailableData={this.props.getAvailableData}
            addtraineedoc={this.addtraineedoc}
            selectedRecord={this.state.selectedRecord || {}}
            getTrainingParticipantsAttended={this.props.getTrainingParticipantsAttended}
            getTrainingParticipantsCompetent={this.props.getTrainingParticipantsCompetent}
            getTrainingParticipantsCertified={this.props.getTrainingParticipantsCertified}
            viewTraineeDocumentFile={this.viewTraineeDocumentFile}

        />)
        tabMap.set("IDS_TRAININGDOCUMENTS", <TrainingDocTab
            screenName={"TrainingDocuments"}
            onInputOnChange={this.onInputOnChange}
            controlMap={this.props.controlMap}
            updateStore={this.props.updateStore}
            userRoleControlRights={this.props.userRoleControlRights}
            userInfo={this.props.userInfo}
            inputParam={this.props.inputParam}
            deleteRecord={this.deleteRecord}
            TrainingDocument={this.props.masterData.TrainingDocument || []}
            getAvailableData={this.props.getAvailableData}
            settings={this.props.settings}
            selectedRecord={this.state.selectedRecord || {}}
            viewTrainingDocumentFile={this.viewTrainingDocumentFile}
        />)

        return tabMap;
    }


    onInputOnChange = (event, optional) => {
        const selectedRecord = this.state.selectedRecord || {};


        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? optional[0] : optional[1];
        } else if (event.target.type === 'radio') {
            selectedRecord[event.target.name] = optional;
        } else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });


    }

    addtraineedoc = (ncontrolcode) => {
        let openChildModal = this.props.Login.openChildModal;
        let operation = "create";
        let screenName = this.props.Login.screenName;
        screenName = "IDS_TRAINEEDOCUMENTS";
        openChildModal = true;
        const selectedRecord = this.props.selectedRecord;
        const updateInfo = {
            userInfo: this.props.Login.userInfo, operation, selectedRecord, ncontrolcode, screenName
        };
        this.props.addtraineedocfile(updateInfo);
        // const updateInfo = {
        //     typeName: DEFAULT_RETURN,
        //     data: {
        //         openModal: true,
        //         operation: "create",
        //         selectedRecord: {},
        //         ncontrolcode: ncontrolcode,
        //         screenName : "IDS_TRAINEEDOCUMENTS" 

        //     }
        // }
        // this.props.updateStore(updateInfo);
    }
    closeModal = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openChildModal = this.props.Login.openChildModal;
        let selectedRecord = this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" ||
                //this.props.Login.operation === "certify" ||
                //this.props.Login.operation === "attend" ||
                //this.props.Login.operation === "competent" ||
                this.props.Login.operation === "complete") {
                loadEsign = false;
                // if (this.props.Login.operation === "delete" || this.props.Login.operation === "complete") {
                openChildModal = false;
                selectedRecord = {};
                //}                 
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = "";
                selectedRecord['esigncomments'] = "";
                selectedRecord['esignreason'] = "";
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
    onDropTrainingDoc = (attachedFiles, fieldName) => {

        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles)
        this.setState({ selectedRecord, actionType: "new" });
    }
    onDropTrainieeDoc = (attachedFiles, fieldName) => {

        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = onDropAttachFileList(selectedRecord[fieldName], attachedFiles)
        this.setState({ selectedRecord, actionType: "new" });
    }
    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.Login.userInfo,
                    sreason: this.state.selectedRecord["esigncomments"],
                    nreasoncode: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].value,
                    spredefinedreason: this.state.selectedRecord["esignreason"] && this.state.selectedRecord["esignreason"].label,

                },
                password: this.state.selectedRecord["esignpassword"]
            },
            screenData: this.props.Login.screenData
        }

        this.props.validateEsignCredential(inputParam, "openChildModal");
    }
    deleteAttachment = (event, file, fieldName) => {
        let selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = deleteAttachmentDropZone(selectedRecord[fieldName], file)

        this.setState({
            selectedRecord, actionType: "delete"
        });
    }


    deleteRecord = (deleteParam) => {
        const methodUrl = deleteParam.methodUrl;
        const selected = deleteParam.selectedRecord;
        let dataState = undefined;
        const inputParam =
        {
            inputData: {

                [methodUrl.toLowerCase()]: selected,
                userinfo: this.props.userInfo
            },
            classUrl: "trainingupdate",
            operation: deleteParam.operation,
            methodUrl: methodUrl,
            dataState
        }

        const masterData = this.props.masterData;
        if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, deleteParam.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData },
                    openChildModal: true, operation: deleteParam.operation, selectedRecord: {}
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.crudMaster(inputParam, masterData, "openChildModal", {});
        }
    }

    onSaveClick = (saveType, formRef) => {
        let inputParam = {};
        let defaultInput = {};
        let isValidRequest = true;
        let openModal = "openChildModal";
        if (this.props.screenName === "IDS_TRAININGDOCUMENTS") {
            inputParam = this.onSaveTrainingDoc(saveType, formRef);

        }
        if (this.props.screenName === "IDS_TRAINEEDOCUMENTS") {
            inputParam = this.onSaveTrainieeDoc(saveType, formRef);

        }
        if (this.props.screenName === "IDS_ATTENDPARTICIPANTSDETAILS") {
            inputParam = this.onSaveAttended(saveType, formRef);
        }
        if (this.props.screenName === "IDS_CERTIFYPARTICIPANTSDETAILS") {
            inputParam = this.onSaveCertified(saveType, formRef);
        }
        if (this.props.screenName === "IDS_COMPETENTPARTICIPANTSDETAILS") {
            inputParam = this.onSaveCompetent(saveType, formRef);
        }
        if (isValidRequest) {
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
                this.props.crudMaster(inputParam, this.props.masterData, openModal, defaultInput);
            }
        }
    }
    onSaveAttended = (saveType, formRef) => {
        let inputData = [];
        let trainingupdate = [];
        let dataState = undefined;
        let postParam = { inputListName: "TechniqueList", selectedObject: "SelectedTrainingUpdate", primaryKeyField: "ntrainingcode" };

        inputData["userinfo"] = this.props.userInfo;
        this.props.selectedRecord.nusercode && this.props.selectedRecord.nusercode.map(participants => {
            trainingupdate.push({
                ntrainingcode: this.props.masterData.SelectedTrainingUpdate.ntrainingcode,
                // nparticipantcode: this.props.masterData.selectedParticipants.nparticipantcode,
                nparticipantcode: participants.item.nparticipantcode,
                ntransactionstatus: transactionStatus.ATTENDED,
                ncertifiedstatus: transactionStatus.NO,
                ncompetencystatus: transactionStatus.NO,
                nusercode: participants.item.nusercode,
                ntechniquecode: this.props.masterData.selectedTechinque.ntechniquecode
            })

        })
        inputData["trainingupdate"] = trainingupdate

        const inputParam = {
            classUrl: 'trainingupdate',
            methodUrl: "TrainingParticipants",
            inputData: inputData,
            operation: "attend", saveType, formRef, dataState,
            postParam
        }
        return inputParam;

    }
    onSaveCertified = (saveType, formRef) => {
        let inputData = [];
        let trainingupdate = [];
        let dataState = undefined;
        let postParam = { inputListName: "TechniqueList", selectedObject: "SelectedTrainingUpdate", primaryKeyField: "ntrainingcode" };

        inputData["userinfo"] = this.props.userInfo;
        this.props.selectedRecord.nusercode && this.props.selectedRecord.nusercode.map(participants => {
            trainingupdate.push({
                ntrainingcode: this.props.masterData.SelectedTrainingUpdate.ntrainingcode,
                // nparticipantcode: this.props.masterData.selectedParticipants.nparticipantcode,
                nparticipantcode: participants.item.nparticipantcode,
                ntransactionstatus: transactionStatus.ATTENDED,
                ncertifiedstatus: transactionStatus.YES,
                ncompetencystatus: transactionStatus.NO,
                nusercode: participants.item.nusercode,
                ntechniquecode: this.props.masterData.selectedTechinque.ntechniquecode

            })

        })
        inputData["trainingupdate"] = trainingupdate

        const inputParam = {
            classUrl: 'trainingupdate',
            methodUrl: "TrainingParticipants",
            inputData: inputData,
            operation: "certify", saveType, formRef, dataState, postParam
        }
        return inputParam;
    }
    onSaveCompetent = (saveType, formRef) => {
        let inputData = [];
        let trainingupdate = [];
        let dataState = undefined;
        let postParam = { inputListName: "TechniqueList", selectedObject: "SelectedTrainingUpdate", primaryKeyField: "ntrainingcode" };

        inputData["userinfo"] = this.props.userInfo;
        this.props.selectedRecord.nusercode && this.props.selectedRecord.nusercode.map(participants => {
            trainingupdate.push({
                ntrainingcode: this.props.masterData.SelectedTrainingUpdate.ntrainingcode,
                // nparticipantcode: this.props.masterData.selectedParticipants.nparticipantcode,
                nparticipantcode: participants.item.nparticipantcode,
                ntransactionstatus: transactionStatus.ATTENDED,
                ncertifiedstatus: transactionStatus.YES,
                ncompetencystatus: transactionStatus.YES,
                nusercode: participants.item.nusercode,
                ntechniquecode: this.props.masterData.selectedTechinque.ntechniquecode

            })

        })
        inputData["trainingupdate"] = trainingupdate

        const inputParam = {
            classUrl: 'trainingupdate',
            methodUrl: "TrainingParticipants",
            inputData: inputData,
            operation: "competent", saveType, formRef, dataState, postParam
        }
        return inputParam;
    }
    onSaveTrainingDoc = (saveType, formRef) => {
        const selectedRecord = this.state.selectedRecord;
        const acceptedFiles = selectedRecord.sfilename;
        const nattachmenttypecode = selectedRecord.nattachmenttypecode;
        let isFileEdited = transactionStatus.NO;
        let trainingdocArray = [];
        let trainingdoc = {
            ntrainingcode: this.props.masterData.SelectedTrainingUpdate.ntrainingcode,
            ntrainingdoccode: selectedRecord.ntrainingdoccode ? selectedRecord.ntrainingdoccode : 0,
            nstatus: transactionStatus.ACTIVE,

        };
        let postParam = { inputListName: "TechniqueList", selectedObject: "SelectedTrainingUpdate", primaryKeyField: "ntrainingcode" };

        const formData = new FormData();
        if (nattachmenttypecode === attachmentType.FTP) {
            if (acceptedFiles && Array.isArray(acceptedFiles) && acceptedFiles.length > 0) {
                acceptedFiles.forEach((file, index) => {
                    const tempData = Object.assign({}, trainingdoc);
                    const splittedFileName = file.name.split('.');
                    const fileExtension = file.name.split('.')[splittedFileName.length - 1];
                    const ssystemfilename = selectedRecord.ssystemfilename ? selectedRecord.ssystemfilename.split('.') : "";
                    const filesystemfileext = selectedRecord.ssystemfilename ? file.name.split('.')[ssystemfilename.length - 1] : "";
                    const uniquefilename = nattachmenttypecode === attachmentType.FTP ? selectedRecord.ntrainingdoccode && selectedRecord.ntrainingdoccode > 0
                        && selectedRecord.ssystemfilename !== "" && selectedRecord.ssystemfilename !== undefined ? ssystemfilename[0] + '.' + filesystemfileext : create_UUID() + '.' + fileExtension : "";
                    tempData["sfilename"] = Lims_JSON_stringify(file.name.trim(), false);
                    tempData["sfiledesc"] = Lims_JSON_stringify(selectedRecord.sfiledesc ? selectedRecord.sfiledesc.trim() : "", false);
                    tempData["ssystemfilename"] = uniquefilename;
                    tempData["nfilesize"] = file.size;
                    tempData["nlinkcode"] = transactionStatus.NA;
                    tempData["nattachmenttypecode"] = 1;
                    // tempData["dcreateddate"] = this.props.Login.userInfo;
                    formData.append("uploadedFile" + index, file);
                    formData.append("uniquefilename" + index, uniquefilename);
                    trainingdocArray.push(tempData);
                });
                formData.append("filecount", acceptedFiles.length);
                isFileEdited = transactionStatus.YES;
            } else {
                trainingdoc["sfilename"] = Lims_JSON_stringify(selectedRecord.sfilename, false);
                trainingdoc["sfiledesc"] = Lims_JSON_stringify(selectedRecord.sfiledesc ? selectedRecord.sfiledesc.trim() : "", false);
                trainingdoc["ssystemfilename"] = selectedRecord.ssystemfilename;
                trainingdoc["nlinkcode"] = transactionStatus.NA;
                trainingdoc["nfilesize"] = selectedRecord.nfilesize;
                //trainingdoc["dcreateddate"] = this.props.Login.userInfo;
                trainingdoc["nattachmenttypecode"] = 1;
                trainingdocArray.push(trainingdoc);
            }
        } else {
            trainingdoc["ssystemfilename"] = "";
            trainingdoc["nattachmenttypecode"] = 2;
            trainingdoc["sfilename"] = Lims_JSON_stringify(selectedRecord.slinkfilename, false);
            trainingdoc["sfiledesc"] = Lims_JSON_stringify(selectedRecord.slinkdescription ? selectedRecord.slinkdescription.trim() : "", false);
            trainingdoc["nlinkcode"] = selectedRecord.nlinkcode.value ? selectedRecord.nlinkcode.value : -1;
            trainingdoc["nfilesize"] = 0;
            trainingdocArray.push(trainingdoc);
        }

        formData.append("isFileEdited", isFileEdited);
        formData.append("trainingdoc", JSON.stringify(trainingdocArray));
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.userInfo,
                    sformname: Lims_JSON_stringify(this.props.userInfo.sformname),
                    smodulename: Lims_JSON_stringify(this.props.userInfo.smodulename),

					//ALPD-1708(while saving the file,audit trail is not captured respective language..)
                    slanguagename: Lims_JSON_stringify(this.props.Login.userInfo.slanguagename)

                }
            },
            formData: formData,
            isFileupload: true,
            operation: this.props.operation,
            classUrl: "trainingupdate",
            saveType, formRef, methodUrl: "TrainingDoc",
            postParam
        }
        return inputParam;
    }

    onSaveTrainieeDoc = (saveType, formRef) => {
        const selectedRecord = this.state.selectedRecord;
        const acceptedFiles = selectedRecord.sfilename;
        const nattachmenttypecode = selectedRecord.nattachmenttypecode;
        let isFileEdited = transactionStatus.NO;
        let trainieedocArray = [];
        let postParam = { inputListName: "TechniqueList", selectedObject: "SelectedTrainingUpdate", primaryKeyField: "ntrainingcode" };
        let trainieedoc = {
            nparticipantcode: this.props.masterData.selectedParticipants.nparticipantcode,
            ntraineedoccode: selectedRecord.ntraineedoccode ? selectedRecord.ntraineedoccode : 0,
            nstatus: transactionStatus.ACTIVE,
            ntrainingcode: this.props.masterData.selectedParticipants.ntrainingcode
        };
        const formData = new FormData();
        if (nattachmenttypecode === attachmentType.FTP) {
            if (acceptedFiles && Array.isArray(acceptedFiles) && acceptedFiles.length > 0) {
                acceptedFiles.forEach((file, index) => {
                    const tempData = Object.assign({}, trainieedoc);
                    const splittedFileName = file.name.split('.');
                    const fileExtension = file.name.split('.')[splittedFileName.length - 1];
                    const ssystemfilename = selectedRecord.ssystemfilename ? selectedRecord.ssystemfilename.split('.') : "";
                    const filesystemfileext = selectedRecord.ssystemfilename ? file.name.split('.')[ssystemfilename.length - 1] : "";
                    const uniquefilename = nattachmenttypecode === attachmentType.FTP ? selectedRecord.ntraineedoccode && selectedRecord.ntraineedoccode > 0
                        && selectedRecord.ssystemfilename !== "" && selectedRecord.ssystemfilename !== undefined ? ssystemfilename[0] + '.' + filesystemfileext : create_UUID() + '.' + fileExtension : "";
                    tempData["sfilename"] = Lims_JSON_stringify(file.name, false);
                    tempData["sfiledesc"] = Lims_JSON_stringify(selectedRecord.sfiledesc ? selectedRecord.sfiledesc.trim() : "", false);
                    tempData["ssystemfilename"] = uniquefilename;
                    tempData["nfilesize"] = file.size;
                    tempData["nlinkcode"] = transactionStatus.NA;
                    tempData["nattachmenttypecode"] = 1;
                    // tempData["dcreateddate"] = this.props.Login.userInfo;
                    formData.append("uploadedFile" + index, file);
                    formData.append("uniquefilename" + index, uniquefilename);
                    trainieedocArray.push(tempData);
                });
                formData.append("filecount", acceptedFiles.length);
                isFileEdited = transactionStatus.YES;
            } else {
                trainieedoc["sfilename"] = Lims_JSON_stringify(selectedRecord.sfilename, false);
                trainieedoc["sfiledesc"] = Lims_JSON_stringify(selectedRecord.sfiledesc ? selectedRecord.sfiledesc.trim() : "", false);
                trainieedoc["ssystemfilename"] = selectedRecord.ssystemfilename;
                trainieedoc["nlinkcode"] = transactionStatus.NA;
                trainieedoc["nfilesize"] = selectedRecord.nfilesize;
                //  trainieedoc["dcreateddate"] = this.props.Login.userInfo;
                trainieedoc["nattachmenttypecode"] = 1;
                trainieedocArray.push(trainieedoc);
            }
        } else {
            trainieedoc["ssystemfilename"] = "";
            trainieedoc["nattachmenttypecode"] = 2;
            trainieedoc["sfilename"] = Lims_JSON_stringify(selectedRecord.slinkfilename, false);
            trainieedoc["sfiledesc"] = Lims_JSON_stringify(selectedRecord.slinkdescription ? selectedRecord.slinkdescription.trim() : "", false);
            trainieedoc["nlinkcode"] = selectedRecord.nlinkcode.value ? selectedRecord.nlinkcode.value : -1;
            trainieedoc["nfilesize"] = 0;
            trainieedocArray.push(trainieedoc);
        }
        formData.append("isFileEdited", isFileEdited);
        formData.append("trainieedoc", JSON.stringify(trainieedocArray));
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.userInfo,
                    sformname: Lims_JSON_stringify(this.props.userInfo.sformname),
                    smodulename: Lims_JSON_stringify(this.props.userInfo.smodulename),
					//ALPD-1708(while saving the file,audit trail is not captured respective language..)
                    slanguagename: Lims_JSON_stringify(this.props.Login.userInfo.slanguagename)
                }
            },
            formData: formData,
            isFileupload: true,
            operation: this.props.operation,
            classUrl: "trainingupdate",
            saveType, formRef, methodUrl: "TrainieeDoc",
            postParam
        }
        return inputParam;
    }

    // fetchParticipantsRecordByID = (operation,version,ncontrolCode) => {

    //     let inputData = [];
    //     inputData["userinfo"] = this.props.Login.userInfo;
    //     inputData["trainingparticipants"] = {
    //         "nusercode": version.nusercode,
    //         "nparticipantcode": version.nparticipantcode,
    //         "ntrainingcode": version.ntrainingcode,
    //         "ncertifiedstatus" : version.ncertifiedstatus,
    //         "ncompetencystatus" : version.ncompetencystatus,
    //         "ntransactionstatus" : version.ntransactionstatus

    //     }
    //     const postParam = {
    //         inputListName: "TechniqueList", 
    //         selectedObject: "SelectedTrainingUpdate",
    //         primaryKeyField: "ntrainingcode",
    //         primaryKeyValue: this.props.Login.masterData.TechniqueList.ntrainingcode,
    //         fetchUrl: "trainingupdate/getTraningUpdateByTechnique",
    //         fecthInputObject: { userinfo: this.props.Login.userInfo },
    //     }
    //     const inputParam = {
    //         methodUrl: "TrainingParticipants",
    //         classUrl: this.props.Login.inputParam.classUrl,
    //         inputData: inputData, postParam,
    //         operation
    //     }
    //     const masterData = this.props.Login.masterData;

    //     if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
    //         const updateInfo = {
    //             typeName: DEFAULT_RETURN,
    //             data: {
    //                 loadEsign: true, 
    //                 screenData: { inputParam, masterData }, 
    //                 openModal: true, 
    //                 operation, 
    //                 screenName: '', 
    //                 id: 'ParticipantsStatus'
    //             }
    //         }
    //         this.props.updateStore(updateInfo);
    //     }
    //     else {
    //         this.props.crudMaster(inputParam, masterData, "openModal");
    //     }
    // }

    fetchParticipantsRecordByID = (operation, version, ncontrolCode) => {

        let inputData = [];
        inputData["userinfo"] = this.props.Login.userInfo;
        inputData["trainingparticipants"] = {
            "nusercode": version.nusercode,
            "nparticipantcode": version.nparticipantcode,
            "ntrainingcode": version.ntrainingcode,
            "ncertifiedstatus": version.ncertifiedstatus,
            "ncompetencystatus": version.ncompetencystatus,
            "ntransactionstatus": version.ntransactionstatus

        }
        const postParam = {
            inputListName: "TechniqueList",
            selectedObject: "SelectedTrainingUpdate",
            primaryKeyField: "ntrainingcode",
            primaryKeyValue: this.props.Login.masterData.TechniqueList.ntrainingcode,
            fetchUrl: "trainingupdate/getTraningUpdateByTechnique",
            fecthInputObject: { userinfo: this.props.Login.userInfo },
        }
        const inputParam = {
            methodUrl: "TrainingParticipants",
            classUrl: this.props.Login.inputParam.classUrl,
            inputData: inputData, postParam,
            operation
        }
        const masterData = this.props.Login.masterData;

        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true,
                    screenData: { inputParam, masterData },
                    openChildModal: true,
                    operation,
                    screenName: '',
                    id: 'ParticipantsStatus'
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openChildModal");
        }
    }


    componentDidUpdate(previousProps) {
        if (this.props.masterData !== previousProps.masterData) {

            let isOpen = false;
            if (this.props.errorCode !== undefined && (this.state.operation === "create" || this.state.operation === "update")) {
                isOpen = true;
            }
            let { dataState, dataStateParticipants } = this.state;
            if (this.props.dataState === undefined) {
                dataState = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5, filter: undefined, sort: undefined }
                dataStateParticipants = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5, filter: undefined, sort: undefined }
            }
            this.setState({ isOpen, activeTab: 'Trainingdocument-tab', dataState, dataStateParticipants });
        }

        if (this.props.selectedRecord !== previousProps.selectedRecord) {
            this.setState({ selectedRecord: this.props.selectedRecord });
        }
        let { dataState, dataStateParticipants } = this.state;
        if (this.props.dataState !== previousProps.dataState && this.props.dataState !== dataState) {
            dataState = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 }
            dataStateParticipants = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 }
            this.setState({ dataState, dataStateParticipants });
        }


        if (this.props.trainingDocument !== previousProps.trainingDocument || this.props.participants !== previousProps.participants) {


            const participants = constructOptionList(this.props.participants || [], "nparticipantcode",
                "sfullname", undefined, undefined, undefined);
            const participantsList = participants.get("OptionList");

            this.setState({
                participants: participantsList
            });
        }
    }

    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        }
        this.props.updateStore(updateInfo);
    }

}

export default connect(mapStateToProps, { addtraineedocfile, viewAttachment })(injectIntl(TrainingUpdateChildTab));

