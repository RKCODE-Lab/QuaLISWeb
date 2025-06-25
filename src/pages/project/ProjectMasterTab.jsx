import React from 'react'
import { Row, Col, Card } from 'react-bootstrap';
import { injectIntl } from 'react-intl';  //FormattedMessage,
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { toast } from 'react-toastify';
import Esign from '../audittrail/Esign';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { showEsign, create_UUID, Lims_JSON_stringify,replaceBackSlash } from '../../components/CommonScript';
import ProjectMasterMemberTabs from './ProjectMasterMemberTabs';
import ProjectMasterFileTab from './ProjectMasterFileTab';
import { transactionStatus, attachmentType } from '../../components/Enumeration';
import CustomTabs from '../../components/custom-tabs/custom-tabs.component';
import AddProjectMember from "../../pages/project/AddProjectMember";
import AddProjectMasterFile from './AddProjectMasterFile';
import { formatInputDate } from "../../components/CommonScript";
import ProjectMasterHistory from "../../pages/project/ProjectMasterHistory";
import ProjectMasterQuotation from "../../pages/project/ProjectMasterQuotation";
import AddProjectQuotation from './AddProjectQuotation';

class ProjectMasterTab extends React.Component {

    constructor(props) {
        super(props);
        const dataState = {
            skip: 0,
            take: this.props.settings ? parseInt(this.props.settings[14]) : 5
        };

        this.state = {
            isOpen: false, selectedRecord: {}, dataResult: [],
            activeTab: 'ProjectMembers-tab',
            dataState: dataState

        };

        this.projectmemberColumnList = [

            { "idsName": "IDS_LOGINID", "dataField": "sloginid", "width": "200px" },
            { "idsName": "IDS_USER", "dataField": "steammembername", "width": "200px" }

        ]

    }

    findMandatoryFields(screenName) {
        let mandatoryFields = [];
        if (screenName === 'IDS_FILE') {

            if (this.props.selectedRecord.nattachmenttypecode === attachmentType.LINK) {
                mandatoryFields = [
                    { "idsName": "IDS_FILENAME", "dataField": "slinkfilename", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
                    { "idsName": "IDS_LINKNAME", "dataField": "nlinkcode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
                ];
            } else {

                mandatoryFields = [{ "idsName": "IDS_FILE", "dataField": "sfilename", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" }];

            }
            mandatoryFields.forEach(item => item.mandatory === true && mandatoryFields.push(item));
            return mandatoryFields;
        } else if (screenName === 'IDS_MEMBERS') {

            mandatoryFields = [{ "idsName": "IDS_USER", "dataField": "nusercode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }];

            mandatoryFields.forEach(item => item.mandatory === true && mandatoryFields.push(item));
            return mandatoryFields;
        }else if (screenName === 'IDS_QUOTATION') {

            mandatoryFields = [{ "idsName": "IDS_QUOTATION", "dataField": "nquotationcode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }];

            mandatoryFields.forEach(item => item.mandatory === true && mandatoryFields.push(item));
            return mandatoryFields;
        }
        else {
            return [];
          }

      }

    render() {

        // const mandatoryFields = [];
        // let mandatoryFields = [];

        if (this.props.openChildModal) {
            this.mandatoryFields = this.findMandatoryFields(this.props.screenName)
          }

        // if (this.props.screenName === 'IDS_FILE') {

        //     if (this.state.selectedRecord && this.state.selectedRecord.nattachmenttypecode === attachmentType.LINK) {
        //         mandatoryFields = [
        //             { "idsName": "IDS_FILENAME", "dataField": "slinkfilename", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" },
        //             { "idsName": "IDS_LINKNAME", "dataField": "nlinkcode", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }
        //         ];
        //     } else {

        //         mandatoryFields = [{ "idsName": "IDS_FILE", "dataField": "sfilename", "mandatory": true, "mandatoryLabel": "IDS_CHOOSE", "controlType": "file" }];

        //     }
        // } else if (this.props.screenName === 'IDS_MEMBERS') {

        //     mandatoryFields = [{ "idsName": "IDS_USER", "dataField": "nusercode", "width": "200px", "mandatory": true, "mandatoryLabel": "IDS_SELECT", "controlType": "selectbox" }];
        // }

        return (
            <>
                <Row className="no-gutters">
                    <Col md={12}>
                        <Card className="at-tabs">
                            <CustomTabs tabDetail={this.tabDetail()} onTabChange={this.onTabChange} />
                        </Card>
                    </Col>
                </Row>

                {this.props.openChildModal &&
                    <SlideOutModal show={this.props.openChildModal} 
                        closeModal={this.closeModal}
                        operation={this.props.operation}
                        inputParam={this.props.inputParam}
                        screenName={this.props.screenName}
                        showSaveContinue={this.props.screenName === "IDS_FILE" || this.props.screenName === "IDS_QUOTATION"?true:false}
                        onSaveClick={this.onSaveClick}
                        updateStore={this.props.updateStore}
                        esign={this.props.loadEsign}
                        validateEsign={this.validateEsign}
                        selectedRecord={this.props.selectedRecord || {}}
                          // mandatoryFields={this.props.screenName === "IDS_MEMBERS" ? mandatoryFields : mandatoryFields || []}
                        mandatoryFields={this.mandatoryFields|| []}
                        addComponent={this.props.loadEsign ?
                            <Esign operation={this.props.operation}
                                onInputOnChange={this.props.onInputOnChange}
                                inputParam={this.props.inputParam}
                                selectedRecord={this.props.selectedRecord || {}}
                            /> :
                            this.props.screenName === "IDS_MEMBERS" ?
                                <AddProjectMember
                                    MembersList={this.props.MembersList}
                                    // selectedRecord={this.state.selectedRecord || {}}
                                    selectedRecord={this.props.selectedRecord || {}}
                                    //  onComboChange={this.onComboChange}
                                    onComboChange={this.props.onComboChange}

                                /> :
                                this.props.screenName === "IDS_FILE" ?
                                    <AddProjectMasterFile
                                        selectedRecord={this.props.selectedRecord || {}}
                                        onInputOnChange={this.props.onInputOnChange}
                                        onDrop={this.props.onDropProjectMasterFile}
                                        onDropAccepted={this.onDropAccepted}
                                        deleteAttachment={this.props.deleteAttachment}
                                        actionType={this.state.actionType}
                                        // onComboChange={this.onComboChange}
                                        onComboChange={this.props.onComboChange}
                                        linkMaster={this.props.linkMaster}
                                        editFiles={this.props.editFiles}
                                        maxSize={20}
                                        maxFiles={1}
                                        multiple={false}
                                        label={this.props.intl.formatMessage({ id: "IDS_FILENAME" })}
                                        name="projectmasterfilename"
                                    /> : 
                                    //ALPD-3566 Start
                                    this.props.screenName === "IDS_QUOTATION" ?
                                                        
                                    <AddProjectQuotation
                                    selectedRecord={this.props.selectedRecord || {}}
                                    ProjectQuotationList={this.props.ProjectQuotationList}
                                    onComboChange={this.props.onComboChange}
                                    isMulti={false}
                                    onInputOnChange={this.props.onInputOnChange}
                                    operation={this.props.operation || ""}
                                    />
                                       :""
                                    //ALPD-3566 End
                        }

                    />
                }
            </>

        )

    }

    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { screenName }
        }
        this.props.updateStore(updateInfo);
    }


    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
        this.setState({ selectedRecord });
    }

    tabDetail = () => {

        const addteammembersId = this.props.controlMap.has("AddTeammembers") && this.props.controlMap.get("AddTeammembers").ncontrolcode;
        const deleteteammembersId = this.props.controlMap.has("DeleteTeammembers") && this.props.controlMap.get("DeleteTeammembers").ncontrolcode;

        const projectmasterAddParam = {
            screenName: "IDS_MEMBERS", operation: "create", primaryKeyField: "nprojectmembercode",
            masterData: this.props.masterData, userInfo: this.props.userInfo, ncontrolCode: addteammembersId
        };

        const projectmasterDeleteParam = {

            //    screenName: "IDS_MEMBERS", methodUrl: "ProjectMember", operation: "delete", ncontrolCode: deleteteammembersId 

            screenName: "IDS_MEMBERS", operation: "delete", primaryKeyField: "nprojectmembercode",
            masterData: this.props.masterData, userInfo: this.props.userInfo, ncontrolCode: deleteteammembersId
        };



        const tabMap = new Map();

        tabMap.set("IDS_MEMBERS", <ProjectMasterMemberTabs
            userRoleControlRights={this.props.userRoleControlRights}
            controlMap={this.props.controlMap}
            inputParam={this.props.inputParam}
            userInfo={this.props.userInfo}
            addId={addteammembersId}
            addParam={projectmasterAddParam}
            comboDataService={this.props.getProjectmasterAddMemberService}
            addTitleIDS={"IDS_PROJECTMEMBER"}
            addTitleDefaultMsg={'ProjectMember'}
            primaryKeyField={"nprojectmembercode"}
            masterData={this.props.masterData}
            primaryList={"ProjectMember"}
            dataResult={this.props.dataResult}
            dataState={this.props.dataState}
            dataStateChange={this.props.dataStateChange}
            columnList={this.projectmemberColumnList}
            methodUrl={this.props.methodUrl}
            deleteRecord={this.props.deleteRecord}
            deleteParam={projectmasterDeleteParam}
            settings={this.props.settings}
        // deleteParam={deleteteammembersId}
        />)


        tabMap.set("IDS_FILE", <ProjectMasterFileTab
            controlMap={this.props.controlMap}
            userRoleControlRights={this.props.userRoleControlRights}
            userInfo={this.props.userInfo}
            inputParam={this.props.inputParam}
            deleteRecord={this.deleteRecord}
            projectmasterfile={this.props.masterData.projectmasterFile || []}
            getAvailableData={this.props.getAvailableData}
            addProjectMasterFile={this.props.addProjectMasterFile}
            viewProjectMasterFile={this.viewProjectMasterFile}
            defaultRecord={this.defaultRecord}
            // screenName="ProjectMaster File"
            screenName="IDS_FILE"
            settings={this.props.settings}
            ntransactionstatus={this.props.ntransactionstatus}
        />);
        //ALPD-3566 Start
        tabMap.set("IDS_QUOTATION",
        <ProjectMasterQuotation
        controlMap={this.props.controlMap}
        userRoleControlRights={this.props.userRoleControlRights}
        projectQuotationdataResult={this.props.projectQuotationdataResult}
        projectQuotationDataState={this.props.projectQuotationDataState}
        projectQuotationDataStateChange={this.props.projectQuotationDataStateChange}
        SelectedProjectMaster={this.props.masterData.SelectedProjectMaster}
        userInfo={this.props.userInfo}
        inputParam={this.props.inputParam}
        deleteProjectQuotation={this.props.deleteProjectQuotation}
        defaultRecord={this.defaultRecord}
        getAvailableQuotation={this.props.getAvailableQuotation}
        getActiveProjectQuotationById={this.props.getActiveProjectQuotationById}
        screenName="IDS_QUOTATION"
    />
);
        //ALPD-3566 End
        tabMap.set("IDS_HISTORY", <ProjectMasterHistory
        controlMap={this.props.controlMap}
        userRoleControlRights={this.props.userRoleControlRights}
        userInfo={this.props.userInfo}
        inputParam={this.props.inputParam}
        projectMasterdataResult={this.props.projectMasterdataResult}
        projectMasterHistorydata={this.props.projectMasterHistorydata}
        historydataStateChange={this.props.historydataStateChange}
        dataState={this.props.dataState}

        // screenName="ProjectMaster File"
        screenName="IDS_HISTORY"
        settings={this.props.settings}
        ntransactionstatus={this.props.ntransactionstatus}
        />);
       
        
        return tabMap;
    }


    closeModal = () => {
        let loadEsign = this.props.loadEsign;
        let openChildModal = this.props.openChildModal;
        let selectedRecord = this.props.selectedRecord;
        //    let selectedRecord = this.state.selectedRecord;
        if (this.props.loadEsign) {
            if (this.props.operation === "delete") {
                loadEsign = false;
                openChildModal = false;
                selectedRecord = {};
            }
            else {
                loadEsign = false;
                selectedRecord['esignpassword'] = '';
                selectedRecord['esigncomments'] = '';
                selectedRecord['esignreason'] = '';
            }
        }
        else {
            openChildModal = false;
            selectedRecord = {};
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openChildModal, loadEsign, selectedRecord }
        }
        this.props.updateStore(updateInfo);

    }


    viewProjectMasterFile = (filedata) => {
        const inputParam = {
            inputData: {
                projectmasterfile: filedata,
                userinfo: this.props.userInfo
            },
            classUrl: "projectmaster",
            operation: "view",
            methodUrl: "AttachedProjectMasterFile",
            screenName: "ProjectMaster File"
        }
        this.props.viewAttachment(inputParam);
    }




    onSaveClick = (saveType, formRef) => {

        let projectMasterData = [];
        let inputParam = {};
        projectMasterData["userinfo"] = this.props.userInfo;
        let clearSelectedRecordField=[];
        let postParam = {
            inputListName: "ProjectMasterList",
            selectedObject: "SelectedProjectMaster",
            primaryKeyField: "nprojectmastercode",
        };

        if ((this.props.operation === "update") && (this.props.screenName === "IDS_ADDPROJECTMASTER")) {

            postParam["primaryKeyValue"] =
                this.props.masterData.SelectedProjectMaster.nprojectmastercode;

            projectMasterData["projectMaster"] = {
                nprojectmastercode: this.props.masterData.SelectedProjectMaster.nprojectmastercode,
                //     nprojecttypecode:this.state.selectedRecord.nprojecttypecode.value,
                sprojecttitle: this.state.selectedRecord.sprojecttitle,
                sprojectcode: this.state.selectedRecord.sprojectcode,
                sprojectdescription: this.state.selectedRecord.sprojectdescription,
                // drfwdate: formatInputDate(this.state.selectedRecord["drfwdate"],false),
                // dprojectstartdate: formatInputDate(this.state.selectedRecord["dprojectstartdate"],false),
                //     nstudydirectorcode:this.state.selectedRecord.nstudydirectorcode.value,
                //     nteammembercode: this.state.selectedRecord.nteammembercode.value,
                //     nperiodcode: this.state.selectedRecord.nperiodcode.value,
                nprojectduration: this.state.selectedRecord.nprojectduration,

            };

        } else if ((this.props.operation === "create") && (this.props.screenName === "IDS_ADDPROJECTMASTER")) {

            projectMasterData["projectMaster"] = {

                nsitecode: this.props.userInfo.nmastersitecode,
                sprojecttitle: this.state.selectedRecord.sprojecttitle,
                sprojectcode: this.state.selectedRecord.sprojectcode,
                sprojectdescription: this.state.selectedRecord.sprojectdescription,
                nprojectduration: parseInt(this.state.selectedRecord.nprojectduration)
            };

            /*     this.projectMasterFieldList.map((item) => {
                   return (projectMasterData["projectMaster"][item] = this.state.selectedRecord[item] == "" || this.state.selectedRecord[item] == undefined ?
                   undefined :this.state.selectedRecord[item]);
                 }); */

        } else if (((this.props.operation === "create") || (this.props.operation === "update")) && (this.props.screenName === "IDS_FILE")) {

            inputParam = this.onSaveProjectMasterFile(saveType, formRef);

            clearSelectedRecordField =[
                { "idsName": "IDS_FILENAME", "dataField": "slinkfilename", "width": "200px" ,"controlType": "textbox","isClearField":true},
                { "idsName": "IDS_DESCRIPTION", "dataField": "sdescription", "width": "200px","controlType": "textbox","isClearField":true },
                { "idsName": "IDS_DESCRIPTION", "dataField": "slinkdescription", "width": "200px","controlType": "textbox","isClearField":true },
                
                
                //{ "idsName": "IDS_DEFAULT", "dataField": "ndefaultstatus", "width": "100px","isClearField":true,"preSetValue":4},
                
            ]
        }

        if (((this.props.operation === "create") || (this.props.operation === "update")) && (this.props.screenName === "IDS_ADDPROJECTMASTER")) {

            projectMasterData["projectMaster"]["nprojecttypecode"] = this.state.selectedRecord["nprojecttypecode"] ? this.state.selectedRecord["nprojecttypecode"].value
                : transactionStatus.NA;

            projectMasterData["projectMaster"]["nstudydirectorcode"] = this.state.selectedRecord["nstudydirectorcode"] ? this.state.selectedRecord["nstudydirectorcode"].value
                : transactionStatus.NA;

            projectMasterData["projectMaster"]["nteammembercode"] = this.state.selectedRecord["nteammembercode"] ? this.state.selectedRecord["nteammembercode"].value
                : transactionStatus.NA;

            projectMasterData["projectMaster"]["nperiodcode"] = this.state.selectedRecord["nperiodcode"] ? this.state.selectedRecord["nperiodcode"].value
                : transactionStatus.NA;


            // if (this.state.selectedRecord["drfwdate"] || this.state.selectedRecord["dprojectstartdate"]) {
            //   if (this.props.Login.operation === "create") {

            projectMasterData["projectMaster"]["drfwdate"] = formatInputDate(this.state.selectedRecord["drfwdate"], false);
            projectMasterData["projectMaster"]["dprojectstartdate"] = formatInputDate(this.state.selectedRecord["dprojectstartdate"], false);

            //   }
            //   else {

            //     projectMasterData["projectMaster"]["drfwdate"] = formatInputDate(this.state.selectedRecord["drfwdate"],false);
            //     projectMasterData["projectMaster"]["dprojectstartdate"] = formatInputDate(this.state.selectedRecord["dprojectstartdate"],false);

            //   }
            // }
        }

        if ((this.props.operation === "create") && (this.props.screenName === "IDS_MEMBERS")) {

            /*        projectMasterData["ProjectMember"] = {};
                      projectMasterData["ProjectMember"]["nusercode"] = this.state.selectedRecord["nusercode"][0] ? this.state.selectedRecord["nusercode"][0].value
                      : transactionStatus.NA;
                      projectMasterData["ProjectMember"]["nprojectmastercode"] =this.props.masterData.SelectedProjectMaster.nprojectmastercode; */

            inputParam = this.onSaveProjectMasterMember(saveType, formRef);
        }

        if (((this.props.operation === "create") || (this.props.operation === "update")) && (this.props.screenName === "IDS_ADDPROJECTMASTER")) {

            inputParam = {
                classUrl: "projectmaster",
                methodUrl: "ProjectMaster",
                inputData: projectMasterData,
                operation: this.props.operation,
                saveType,
                formRef,
                postParam,
                searchRef: this.searchRef,
                isClearSearch: this.props.isClearSearch,
            };
        }/*else if ((this.props.operation === "create")  &&  (this.props.screenName === "IDS_MEMBERS")) {
    
          inputParam = {
            classUrl: "projectmaster",
            methodUrl: "ProjectMember",
            inputData: projectMasterData,
            operation: this.props.operation,
            saveType,
            formRef,
            postParam,
            searchRef: this.searchRef,
            isClearSearch: this.props.isClearSearch,
          }
        } */
        //ALPD-3566 Start
        if (this.props.screenName === "IDS_QUOTATION") {
            inputParam = this.onSaveProjectQuotation(saveType, formRef,this.props.operation);

            clearSelectedRecordField =[
                { "idsName": "IDS_REMARKS", "dataField": "sremarks", "width": "200px" ,"controlType": "textbox","isClearField":true},
                { "idsName": "IDS_DEFAULTSTATUS", "dataField": "ndefaultstatus", "width": "100px","isClearField":true,"preSetValue":4},
                
            ]
        }

        const masterData = this.props.masterData;

        if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, this.props.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true,
                    screenData: { inputParam, masterData },
                    saveType,
                },
            };
            this.props.updateStore(updateInfo);
        } else {
            if((this.props.operation === "create" && this.props.screenName === "IDS_FILE") || 
            (this.props.operation === "create" && this.props.screenName === "IDS_QUOTATION"))
            {
                this.props.crudMaster(inputParam, masterData, "openChildModal","","",clearSelectedRecordField);
            }
            else
            {
               this.props.crudMaster(inputParam, masterData, "openChildModal");
            }
        }

    };

    onSaveProjectMasterFile = (saveType, formRef) => {
        const selectedRecord = this.props.selectedRecord;
        const acceptedFiles = selectedRecord.sfilename;
        const nattachmenttypecode = selectedRecord.nattachmenttypecode;
        let isFileEdited = transactionStatus.NO;
        let projectmasterFileArray = [];
        let projectmasterFile = {
            nprojectmastercode: this.props.masterData.SelectedProjectMaster.nprojectmastercode,
            nprojecttypecode: this.props.masterData.SelectedProjectMaster.nprojecttypecode,
            nprojectmasterfilecode: selectedRecord.nprojectmasterfilecode ? selectedRecord.nprojectmasterfilecode : 0,
            nstatus: transactionStatus.ACTIVE,
            nattachmenttypecode,
            // ndefaultstatus: selectedRecord[nattachmenttypecode === attachmentType.LINK ? "nlinkdefaultstatus" : "ndefaultstatus"] ? selectedRecord[nattachmenttypecode === attachmentType.LINK ? "nlinkdefaultstatus" : "ndefaultstatus"] : 4
        };
        const formData = new FormData();
        if (nattachmenttypecode === attachmentType.FTP) {
            if (acceptedFiles && Array.isArray(acceptedFiles) && acceptedFiles.length > 0) {
                acceptedFiles.forEach((file, index) => {
                    const tempData = Object.assign({}, projectmasterFile);
                    const splittedFileName = file.name.split('.');
                    const fileExtension = file.name.split('.')[splittedFileName.length - 1];
                    const ssystemfilename = selectedRecord.ssystemfilename ? selectedRecord.ssystemfilename.split('.') : "";
                    const filesystemfileext = selectedRecord.ssystemfilename ? file.name.split('.')[ssystemfilename.length - 1] : "";
                    const uniquefilename = nattachmenttypecode === attachmentType.FTP ? selectedRecord.nsupplierfilecode && selectedRecord.nsupplierfilecode > 0
                        && selectedRecord.ssystemfilename !== "" ? ssystemfilename[0] + '.' + filesystemfileext : create_UUID() + '.' + fileExtension : "";
                    tempData["sfilename"] = Lims_JSON_stringify(file.name, false);
                    tempData["sdescription"] = Lims_JSON_stringify(replaceBackSlash(selectedRecord.sdescription ? selectedRecord.sdescription.trim() : ""), false);
                    tempData["nlinkcode"] = transactionStatus.NA;
                    tempData["ssystemfilename"] = uniquefilename;
                    tempData["nfilesize"] = file.size;
                    formData.append("uploadedFile" + index, file);
                    formData.append("uniquefilename" + index, uniquefilename);
                    projectmasterFileArray.push(tempData);
                });
                formData.append("filecount", acceptedFiles.length);
                isFileEdited = transactionStatus.YES;
            } else {
                projectmasterFile["sfilename"] = Lims_JSON_stringify(selectedRecord.sfilename, false);
                projectmasterFile["sdescription"] = Lims_JSON_stringify(replaceBackSlash(selectedRecord.sdescription ? selectedRecord.sdescription.trim() : ""), false);
                projectmasterFile["nlinkcode"] = transactionStatus.NA;
                projectmasterFile["ssystemfilename"] = selectedRecord.ssystemfilename;
                projectmasterFile["nfilesize"] = selectedRecord.nfilesize;
                projectmasterFileArray.push(projectmasterFile);
            }
        } else {
            projectmasterFile["sfilename"] = Lims_JSON_stringify(replaceBackSlash(selectedRecord.slinkfilename.trim()), false);
            projectmasterFile["sdescription"] = Lims_JSON_stringify(replaceBackSlash(selectedRecord.slinkdescription ? selectedRecord.slinkdescription.trim() : ""), false);
            projectmasterFile["nlinkcode"] = selectedRecord.nlinkcode.value ? selectedRecord.nlinkcode.value : -1;
            projectmasterFile["ssystemfilename"] = "";
            projectmasterFile["nfilesize"] = 0;
            projectmasterFileArray.push(projectmasterFile);
        }
        formData.append("isFileEdited", isFileEdited);
        formData.append("projectmasterfile", JSON.stringify(projectmasterFileArray));
        // formData.append("userinfo", JSON.stringify(this.props.userInfo));

        //let selectedId = null;
        let postParam = undefined;
        if (this.props.operation === "update") {
            // edit
            postParam = { inputListName: "ProjectMaster", selectedObject: "SelectedProjectMaster", primaryKeyField: "nprojectmastercode" };
           // selectedId = selectedRecord["nprojectmasterfilecode"];
        }
        const inputParam = {
            // inputData: { userinfo: this.props.userInfo },
            inputData: {
                "userinfo": {
                    ...this.props.userInfo,
                    sformname: Lims_JSON_stringify(this.props.userInfo.sformname),
                    smodulename: Lims_JSON_stringify(this.props.userInfo.smodulename),
                         //ALPD-1826(while saving the file and link,audit trail is not captured the respective language)
                        slanguagename: Lims_JSON_stringify(this.props.userInfo.slanguagename)
                }
            },
            formData: formData,
            isFileupload: true,
            operation: this.props.operation,
            classUrl: "projectmaster",
            saveType, formRef, methodUrl: "ProjectMasterFile", postParam,
            selectedRecord: { ...selectedRecord }
        }
        return inputParam;
    }



    onSaveProjectQuotation(saveType, formRef, operation) {
        let inputData = [];
        inputData["userinfo"] = this.props.userInfo;
        inputData["ProjectQuotation"] = {};

       // let projectQuotationArray = []
        if (operation === "create"){
           // projectQuotationArray = this.props.selectedRecord.nquotationcode.map(item => {
                let projectQuotationData = {};

            projectQuotationData["nquotationcode"] = this.props.selectedRecord && this.props.selectedRecord.nquotationcode && this.props.selectedRecord.nquotationcode.value;
                projectQuotationData["nprojectmastercode"] = this.props.masterData.SelectedProjectMaster.nprojectmastercode;
                projectQuotationData['sremarks'] = this.props.selectedRecord && this.props.selectedRecord.sremarks ? this.props.selectedRecord.sremarks : "";
                projectQuotationData['ndefaultstatus'] = this.props.selectedRecord && this.props.selectedRecord.ndefaultstatus ? this.props.selectedRecord.ndefaultstatus : transactionStatus.NO;


           //     return projectQuotationData;
          //  });
        inputData['ProjectQuotation'] = projectQuotationData;
    }
    else{
            inputData["ProjectQuotation"]["nquotationcode"] = this.props.selectedRecord && this.props.selectedRecord.nquotationcode && this.props.selectedRecord.nquotationcode.value;
    inputData["ProjectQuotation"]["nprojectmastercode"]=this.props.masterData.SelectedProjectMaster.nprojectmastercode;
    inputData["ProjectQuotation"]["sremarks"]=this.props.selectedRecord && this.props.selectedRecord.sremarks ? this.props.selectedRecord.sremarks : "";
    inputData["ProjectQuotation"]["ndefaultstatus"]=this.props.selectedRecord && this.props.selectedRecord.ndefaultstatus ? this.props.selectedRecord.ndefaultstatus : transactionStatus.NO;
    inputData["ProjectQuotation"]["nprojectquotationcode"]=this.props.selectedRecord && this.props.selectedRecord.nprojectquotationcode;
    }

        const inputParam = {
            classUrl: "projectmaster",
            methodUrl: "ProjectQuotation",
            inputData: inputData,
            operation: operation, saveType, formRef,
            selectedRecord: { ...this.props.selectedRecord }
        }
        return inputParam;
    }
//ALPD-3566 End
    onSaveProjectMasterMember(saveType, formRef) {
        let inputData = [];
        inputData["userinfo"] = this.props.userInfo;
        // inputData["supplier"] = this.props.masterData.SelectedSupplier;
        inputData["ProjectMember"] = {};


        let projectmemberArray = []
        projectmemberArray = this.props.selectedRecord.nusercode.map(item => {
            let projectMasterData = {}

            projectMasterData["nusercode"] = item.value
            projectMasterData["nprojectmastercode"] = this.props.masterData.SelectedProjectMaster.nprojectmastercode;


            return projectMasterData;
        });
        inputData['ProjectMember'] = projectmemberArray;

        const inputParam = {
            classUrl: "projectmaster",
            methodUrl: "ProjectMember",
            inputData: inputData,
            operation: this.props.operation, saveType, formRef
        }
        return inputParam;
    }

    deleteRecord = (projectmasterfileparam) => {

        if (this.props.masterData.SelectedProjectMaster.ntransactionstatus === transactionStatus.DRAFT) {

            let inputParam = {};
           // let inputData = {};
            // if (this.props.screenName === 'ProjectMaster File') { 
            let selectedRecord = projectmasterfileparam.selectedRecord

            selectedRecord = { ...selectedRecord, ntransactionstatus: this.props.masterData.SelectedProjectMaster.ntransactionstatus }

            // inputData["projectmasterfile"]={
            //     selectedRecord                    
            //     };

            //        if (this.props.screenName === 'IDS_FILE') {
            inputParam = {
                classUrl: "projectmaster",
                methodUrl: projectmasterfileparam.methodUrl,
                inputData: {

                    "projectmasterfile": selectedRecord,
                    "userinfo": this.props.userInfo
                },

                operation: projectmasterfileparam.operation,
                //dataState: this.state.dataState,
                //dataStateMaterial: this.state.dataStateMaterial
                dataState: this.state.dataState
            }
            //          }
            if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, projectmasterfileparam.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.masterData },
                        openChildModal: true, screenName: projectmasterfileparam.screenName, operation: projectmasterfileparam.operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");
            }

        }
        else {

            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTVERSION" }));
        }
    }
   
    /*   deleteAttachment = (event, file, fieldName) => {
           let selectedRecord = this.state.selectedRecord || {};
           selectedRecord[fieldName] = deleteAttachmentDropZone(selectedRecord[fieldName], file)
   
           this.setState({
               selectedRecord, actionType: "delete" //fileToDelete:file.name 
           });
       } */

    validateEsign = () => {
        const inputParam = {
            inputData: {
                "userinfo": {
                    ...this.props.userInfo,
                    sreason: this.props.selectedRecord["esigncomments"],
                    nreasoncode: this.props.selectedRecord["esignreason"] && this.props.selectedRecord["esignreason"].value,
                    spredefinedreason: this.props.selectedRecord["esignreason"] && this.props.selectedRecord["esignreason"].label,

                },
                password: this.props.selectedRecord["esignpassword"]
            },
            screenData: this.props.screenData
        }
        this.props.validateEsignCredential(inputParam, "openChildModal");
    }
}


export default injectIntl(ProjectMasterTab);

