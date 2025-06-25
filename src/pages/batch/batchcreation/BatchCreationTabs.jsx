import React from 'react';
import { injectIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import { Row, Col, Card } from 'react-bootstrap';

import SlideOutModal from '../../../components/slide-out-modal/SlideOutModal';
import Esign from '../../audittrail/Esign';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import { showEsign, formatInputDate } from '../../../components/CommonScript';
import { transactionStatus, designProperties } from '../../../components/Enumeration';

import CustomTabs from '../../../components/custom-tabs/custom-tabs.component';
import AddBatchComponent from './AddBatchComponent';
import RemoveBatchComponent from './RemoveBatchComponent';
import BatchComponentTab from './BatchComponentTab';
import Attachments from '../../attachmentscomments/attachments/Attachments';
import { onSaveBatchAttachment } from '../../attachmentscomments/attachments/AttachmentFunctions';
import BatchApprovalHistory from '../batchapproval/BatchApprovalHistory';
import Comments from '../../attachmentscomments/comments/Comments';
import CerGenTabs from '../../certificategeneration/CerGenTabs';

class BatchCreationTabs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedRecord: {}, dataResult: [],
            // sahDataState: { skip: 0, take: 5 },
            // bahDataState: { skip: 0, take: 5 },
            // chDataState: { skip: 0, take: 5 },
            // testCommentDataState: { skip: 0, take: 5, group: [{ field: 'sarno' }] },
            // dataState: { skip: 0, take: 5 },
        };

        this.testParameterColumnList = [{ "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "250px" },
        { "idsName": "IDS_PARAMETERNAME", "dataField": "sparametersynonym", "width": "250px" },
        { "idsName": "IDS_RESULT", "dataField": "sresult", "width": "150px" },
        { "idsName": "IDS_RESULTFLAG", "dataField": "sgradename", "width": "100px" },
        { "idsName": "IDS_RESULTDATE", "dataField": "sentereddate", "width": "100px" },
        { "idsName": "IDS_STATUS", "dataField": "stransdisplaystatus", "width": "100px" },
        ];
    }

    render() {

        return (
            <>
                <Row noGutters>
                    <Col md={12}>
                        <Card className="at-tabs border-0">
                            <Row noGutters>
                                <Col md={12}>
                                    <CustomTabs activeKey={this.props.activeBCTab || "IDS_COMPONENT"} tabDetail={this.tabDetail()} onTabChange={this.onTabChange} />
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>

                {/* Below Condition Added to avoid unwanted rendering of SlideOut */}
                {this.props.openChildModal ?
                    <SlideOutModal show={this.props.openChildModal}
                        size={this.props.loadEsign ? "lg" : "xl"}
                        closeModal={this.closeModal}
                        operation={this.props.operation}
                        inputParam={this.props.inputParam}
                        screenName={this.props.screenName}
                        onSaveClick={this.onSaveClick}
                        updateStore={this.props.updateStore}
                        esign={this.props.loadEsign}
                        validateEsign={this.validateEsign}
                        selectedRecord={this.state.selectedRecord || {}}
                        mandatoryFields={[]}
                        ignoreFormValidation={true}
                        addComponent={this.props.loadEsign ?
                            <Esign operation={this.props.operation}
                                onInputOnChange={this.onInputOnChange}
                                inputParam={this.props.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            /> :
                            this.props.screenName === "IDS_COMPONENT" ?
                                this.props.operation === "create" ?
                                    <AddBatchComponent selectedRecord={this.state.selectedRecord || {}}
                                        onInputOnChange={this.onInputOnChange}
                                        getProductByCategory={this.getProductByCategory}
                                        onComboChange={this.onComboChange}
                                        handleDateChange={this.handleDateChange}
                                        userInfo={this.props.userInfo}
                                        productCategoryList={this.props.productCategoryList}
                                        productList={this.props.productList}
                                        componentList={this.props.componentList}
                                        getDataForAddComponent={this.getDataForAddComponent}
                                        clearComponentInput={this.props.clearComponentInput}
                                        addComponentDataList={this.state.addComponentDataList || []}
                                        headerSelectionChange={this.headerSelectionChange}
                                        selectionChange={this.selectionChange}

                                        addedComponentList={this.state.addedComponentList || []}
                                        addedHeaderSelectionChange={this.addedHeaderSelectionChange}
                                        addedSelectionChange={this.addedSelectionChange}
                                        //dataStateChange={this.dataStateChange} 
                                        userRoleControlRights={this.props.userRoleControlRights}
                                        controlMap={this.props.controlMap}
                                        inputParam={this.props.inputParam}
                                        screenName={this.props.screenName}

                                        addSelectAll={this.state.addSelectAll}
                                        deleteSelectAll={this.state.deleteSelectAll}

                                        onDeleteSelectedComponent={this.onDeleteSelectedComponent}

                                    // dataResult={process(this.props.addComponentDataList ||[], {skip:0, take:10})}
                                    // dataState={{skip:0, take:10}}
                                    // dataStateChange={(event)=> this.setState({dataState: event.dataState})}

                                    />
                                    : this.props.operation === "delete" ?
                                        <RemoveBatchComponent selectedRecord={this.state.selectedRecord || {}}
                                            userInfo={this.props.userInfo}
                                            batchComponentDeleteList={this.state.batchComponentDeleteList || []}
                                            userRoleControlRights={this.props.userRoleControlRights}
                                            controlMap={this.props.controlMap}
                                            inputParam={this.props.inputParam}
                                            screenName={this.props.screenName}
                                            deleteComponentSelectAll={this.state.deleteComponentSelectAll}
                                            deleteComponentHeaderSelectionChange={this.deleteComponentHeaderSelectionChange}
                                            deleteSelectionChange={this.deleteSelectionChange}
                                        /> : ""
                                : ""
                        }

                    /> : ""}
            </>
        )
    }


    valiateCheckAll(data) {
        let selectAll = true;
        // let checkRepeatComponent;
        //  let addedComponentList = this.state.addedComponentList || [];
        if (data && data.length > 0) {
            data.forEach(dataItem => {
                if (dataItem.selected) {
                    if (dataItem.selected === false) {
                        selectAll = false;
                    }
                }
                else {
                    selectAll = false;
                    // checkRepeatComponent=this.state.addComponentDataList.filter(item=>item.npreregno==data.npreregno)
                    // if(checkRepeatComponent.length>0){
                    //     selectAll = true;
                    // }else{
                    //     selectAll = false;
                    // }
                }
            })
        }
        else {
            //if (gridType === "originalgrid"){
            selectAll = false;
            // }
        }
        return selectAll;
    }

    selectionChange = (event) => {
        let addedComponentList = this.state.addedComponentList || [];
        const addComponentDataList = this.state.addComponentDataList.map(item => {
            if (item.npreregno === event.dataItem.npreregno) {
                item.selected = !event.dataItem.selected;
                if (item.selected) {
                    const newItem = JSON.parse(JSON.stringify(item));
                    newItem.selected = false;
                    addedComponentList.push(newItem);
                }
                else {
                    addedComponentList = addedComponentList.filter(item1 => item1.npreregno !== item.npreregno)
                }
            }
            return item;
        });
        this.setState({
            addComponentDataList, addedComponentList,
            addSelectAll: this.valiateCheckAll(addComponentDataList),
            deleteSelectAll: this.valiateCheckAll(addedComponentList)
        });
    }

    addedSelectionChange1 = (event) => {
        const addedComponentList = this.state.addedComponentList.filter(item =>
            item.npreregno !== event.dataItem.npreregno
        );

        const addComponentDataList = this.state.addComponentDataList;
        const index = addComponentDataList.findIndex(item1 => item1.npreregno === event.dataItem.npreregno)
        if (index !== -1) {
            addComponentDataList[index].selected = false;
        }
        this.setState({
            addedComponentList, addComponentDataList,
            addSelectAll: this.valiateCheckAll(addComponentDataList),
            deleteSelectAll: this.valiateCheckAll(addedComponentList)
        });
    }

    addedSelectionChange = (event) => {

        let deletedList = this.state.deletedList || [];
        const checked = event.syntheticEvent.target.checked;
        const addedComponentList = this.state.addedComponentList;
        const index1 = addedComponentList.findIndex(item1 => item1.npreregno === event.dataItem.npreregno)
        if (index1 !== -1) {
            addedComponentList[index1].selected = checked;
        }
        const index = deletedList.findIndex(item1 => item1.npreregno === event.dataItem.npreregno)
        if (index === -1) {
            if (checked) {
                deletedList.push(event.dataItem);
            } else {
                deletedList = deletedList.filter(item1 => item1.npreregno !== event.dataItem.npreregno)
            }
        }

        this.setState({ deletedList, addedComponentList });
    }

    onDeleteSelectedComponent = () => {
        if (this.state.deletedList) {
            const addComponentDataList = this.state.addComponentDataList || [];
            let addedComponentList = this.state.addedComponentList || [];
            let deletedList = this.state.deletedList || [];

            //const addComponentDataList = 
            deletedList.map(item => {
                const index = addComponentDataList.findIndex(item1 => item1.npreregno === item.npreregno)
                if (index !== -1) {
                    addComponentDataList[index].selected = false;
                }
                return null;
            });

            addedComponentList = addedComponentList.filter(item =>
                this.state.deletedList.findIndex(item1 => item1.npreregno === item.npreregno) === -1

            );

            this.setState({
                addedComponentList, addComponentDataList, deletedList: [],
                addSelectAll: this.valiateCheckAll(addComponentDataList),
                deleteSelectAll: this.valiateCheckAll(addedComponentList)
            });
        } else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTCOMPONENTTOREMOVE" }))
        }
    }

    // rowClick = event => {
    //     let last = this.lastSelectedIndex;
    //     const data = [...this.state.addComponentDataList];
    //     const current = data.findIndex(dataItem => dataItem === event.dataItem);

    //     if (!event.nativeEvent.shiftKey) {
    //         this.lastSelectedIndex = last = current;
    //     }

    //     if (!event.nativeEvent.ctrlKey) {
    //         data.forEach(item => (item.selected = false));
    //     }
    //     const select = !event.dataItem.selected;
    //     for (let i = Math.min(last, current); i <= Math.max(last, current); i++) {
    //         data[i].selected = select;
    //     }
    //     this.setState({ addComponentDataList: data });
    // };

    headerSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        let addedComponentList = this.state.addedComponentList || [];
        // addedComponentList=this.state.addedComponentList

        // const data = this.state.addComponentDataList.map(item=>{
        //     if (checked){
        //         addedComponentList.push({...item, selected:false});
        //     }else{
        //     const removeCheckedFalse= this.state.addedComponentList.filter(item1=>item1.npreregno==item.npreregno)
        //     if(removeCheckedFalse !== -1){                
        //         addedComponentList[removeCheckedFalse].selected = false;
        //       }
        //     }
        //     item.selected = checked;
        //     return item;
        // });    


        if (checked) {
            const data = this.state.addComponentDataList.map(item => {
                if (addedComponentList.findIndex(x => x.npreregno === item.npreregno) === -1) {
                    addedComponentList.push({ ...item, selected: false });
                    item.selected = checked;
                    return item;
                } else {
                    let olditem = JSON.parse(JSON.stringify(addedComponentList[addedComponentList.findIndex(x => x.npreregno === item.npreregno)]))
                    olditem.selected = checked;
                    return olditem;
                }

            });


            this.setState({
                addComponentDataList: data, addedComponentList,
                addSelectAll: checked, deleteSelectAll: false
            });
        }
        else {
            let addedComponentData = this.state.addedComponentList || [];
            let deletedListdData = this.state.deletedList || [];

            const data = this.state.addComponentDataList.map(item => {
                addedComponentData = addedComponentData.filter(item1 => item1.npreregno !== item.npreregno);
                deletedListdData = deletedListdData.filter(item1 => item1.npreregno !== item.npreregno);
                item.selected = checked;
                return item;
            });

            // console.log("data:",data1, data2);
            this.setState({
                addComponentDataList: data, addedComponentList: addedComponentData, deletedList: deletedListdData,
                addSelectAll: checked, deleteSelectAll: false
            });
        }

        // const data = this.state.addComponentDataList.map(item=>{
        //     if (checked){
        //         addedComponentList.push({...item, selected:false});
        //     }
        //     else{
        //         data1 = data1.filter(item1=>item1.npreregno !== item.npreregno);
        //         data2 = data2.filter(item1=>item1.npreregno !== item.npreregno);      
        //     }  
        //     item.selected = checked;
        //     return item;
        // });

    }

    addedHeaderSelectionChange = (event) => {
        const checked = event.syntheticEvent.target.checked;
        let deletedList = this.state.deletedList || [];
        let addedComponentList = this.state.addedComponentList;
        if (checked) {
            addedComponentList = addedComponentList.map(item => {
                item.selected = true;
                deletedList.push(item);
                return item;
            });
        } else {
            addedComponentList = addedComponentList.map(item => {
                item.selected = false;
                return item;
            });
            deletedList = [];
        }
        // this.setState({ addedComponentList: [], addComponentDataList: data, 
        //             addSelectAll:false, deleteSelectAll: true });

        this.setState({ deletedList, addedComponentList, deleteSelectAll: checked });
    }

    deleteComponentHeaderSelectionChange = (event) => {
        const batchComponentDeleteList = this.state.batchComponentDeleteList;
        batchComponentDeleteList.map(item => item.selected = event.syntheticEvent.target.checked);
        this.setState({ batchComponentDeleteList, deleteComponentSelectAll: event.syntheticEvent.target.checked });
    }

    deleteSelectionChange = (event) => {
        let batchComponentDeleteList = this.state.batchComponentDeleteList || [];
        const index = batchComponentDeleteList.findIndex(item1 => item1.npreregno === event.dataItem.npreregno)
        batchComponentDeleteList[index].selected = !event.dataItem.selected;
        this.setState({
            batchComponentDeleteList,
            deleteComponentSelectAll: this.valiateCheckAll(batchComponentDeleteList)
        });
    }

    tabDetail = () => {
        const tabMap = new Map();
        tabMap.set("IDS_COMPONENT", <BatchComponentTab userRoleControlRights={this.props.userRoleControlRights}
            controlMap={this.props.controlMap}
            inputParam={this.props.inputParam}
            userInfo={this.props.userInfo}
            screenName={"IDS_COMPONENT"}
            getBatchComponentComboService={this.props.getBatchComponentComboService}
            masterData={this.props.masterData}
            dataResult={process(this.props.masterData["BatchComponentCreation"] || [],
                this.props.dataState)}
            dataState={this.props.dataState}
            dataStateChange={this.props.dataStateChange}
            //{(event) => this.setState({ dataState: event.dataState })}
            deleteRecord={this.deleteRecord}
            deleteParam={{ operation: "delete" }}
            selectedId={this.props.selectedId}

            expandField="expanded"
            handleExpandChange={this.handleExpandChange}
            hasChild={true}
            childColumnList={this.testParameterColumnList}
            childMappingField={"npreregno"}
            childList={this.props.testParameterMap || new Map()}
        />);

        tabMap.set("IDS_ATTACHMENTS", <Attachments
            screenName="IDS_ATTACHMENTS"
            selectedMaster={this.props.masterData.SelectedBatchCreation}
            controlMap={this.props.controlMap}
            userRoleControlRights={this.props.userRoleControlRights}
            attachments={this.props.masterData.BatchCreationFile || []}
            deleteRecord={this.props.deleteAttachment}
            onSaveClick={this.onAttachmentSaveClick}
            masterList={[this.props.masterData.SelectedBatchCreation]}
            masterAlertStatus={"IDS_SELECTBATCHTOADDATTACHEMENT"}
            fetchRecord={this.props.getAttachmentCombo}
            addName={"AddBatchAttachment"}
            editName={"EditBatchAttachment"}
            deleteName={"DeleteBatchAttachment"}
            viewName={"ViewBatchAttachment"}
            methodUrl={"BatchCreationFile"}
            userInfo={this.props.Login.userInfo}
            subFields={[{ [designProperties.VALUE]: "screateddate" }]}
            moreField={[
                { [designProperties.LABEL]: "IDS_DESCRIPTION", [designProperties.VALUE]: "sdescription" }
            ]}
            deleteParam={
                {
                    methodUrl: "BatchCreationFile",
                    nreleasebatchcode: this.props.masterData.SelectedBatchCreation ?
                        this.props.masterData.SelectedBatchCreation.nreleasebatchcode : 0,
                    userInfo: this.props.userInfo,
                    masterData: this.props.masterData,
                    esignRights: this.props.esignRights,
                    screenName: this.props.screenName,
                    ncontrolCode: this.props.ncontrolCode

                }
            }
            editParam={{
                methodUrl: "BatchCreationFile",
                nreleasebatchcode: this.props.masterData.SelectedBatchCreation ?
                    this.props.masterData.SelectedBatchCreation.nreleasebatchcode : 0,
                userInfo: this.props.userInfo,
                masterData: this.props.masterData,
                esignRights: this.props.userRoleControlRights,
                masterList: this.props.masterData.SelectedBatchCreation,
                ncontrolCode: this.props.ncontrolCode
            }}
        />);

        tabMap.set("IDS_TESTCOMMENTS", <Comments
            screenName="IDS_TESTCOMMENTS"
            selectedListName="IDS_TEST"
            controlMap={this.props.controlMap}
            userRoleControlRights={this.props.userRoleControlRights}
            Comments={this.props.masterData["BatchCreationComments"] || []}
            methodUrl={"TestComment"}
            isTestComment={false}
            primaryKeyField={"ntestcommentcode"}
            dataState={this.props.testCommentDataState}
            isActionRequired={false}
            dataStateChange={this.props.testCommentDataStateChange}
            //dataStateChange={(event) => this.setState({ testCommentDataState: event.dataState })}
        />
        );

        tabMap.set("IDS_SAMPLEAPPROVALHISTORY", <CerGenTabs userInfo={this.props.userInfo}
            masterData={this.props.masterData}
            inputParam={this.props.inputParam}
            dataResult={process(this.props.masterData["BatchComponentCreation"] || [], this.props.sahDataState
                //{skip:0, take:5}
            )}
            dataState={this.props.sahDataState}
            dataStateChange={this.props.sahDataStateChange}
            // dataState={{skip:0, take:5}}
            //dataStateChange={(event) => this.setState({ sahDataState: event.dataState })}
            screenName="IDS_SAMPLEAPPROVALHISTORY"
            controlMap={this.props.controlMap}
            userRoleControlRights={this.props.userRoleControlRights}
            primaryKeyField=""
            primaryList=""
            columnList={[
                { "idsName": "IDS_ARNO", "dataField": "sarno", "width": "150px" },
                { "idsName": "IDS_COMPONENTNAME", "dataField": "scomponentname", "width": "250px" },
                { "idsName": "IDS_MANUFACTUREBATCHLOTNO", "dataField": "smanuflotno", "width": "250px" },
                { "idsName": "IDS_DATERECEIVED", "dataField": "sreceiveddate", "width": "250px" },
            ]}
            methodUrl={this.props.methodUrl}
            selectedId={0}
            expandField="expanded"
            handleExpandChange={this.handleSAHExpandChange}
            hasChild={true}
            childColumnList={[
                //{ "idsName": "IDS_ARNUMBER", "dataField": "sarno", "width": "200px" },
                { "idsName": "IDS_APPROVALSTATUS", "dataField": "stransdisplaystatus", "width": "200px" },
                { "idsName": "IDS_USERNAME", "dataField": "username", "width": "200px" },
                { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "200px" },
                { "idsName": "IDS_APPROVALDATE", "dataField": "stransactiondate", "width": "450px" },
                { "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "450px" }
            ]}
            childMappingField={"npreregno"}
            childList={this.props.sampleApprovalMap || new Map()}

        />
        );
        tabMap.set("IDS_BATCHAPPROVALHISTORY", <BatchApprovalHistory
            screenName="IDS_BATCHAPPROVALHISTORY"
            primaryKeyField='nbatchapprovalhistorycode'
            ApprovalHistory={this.props.masterData["BatchCreationApprovalHistory"]||[]}
            //dataState={{skip:0, take:5}}
            dataState={this.props.bahDataState}
            dataStateChange={this.props.bahDataStateChange}
            //dataStateChange={(event) => this.setState({ bahDataState: event.dataState })}
            userInfo={this.props.userInfo}
            controlMap={this.props.controlMap}
            userRoleControlRights={this.props.userRoleControlRights}
            inputParam={this.props.inputParam}
            selectedId={null}
        />
        );
        tabMap.set("IDS_BATCHCLOCKHISTORY", <BatchApprovalHistory
            screenName="IDS_BATCHCLOCKHISTORY"
            primaryKeyField='nclockhistorycode'
            ApprovalHistory={this.props.masterData["BatchCreationClockHistory"]||[]}
            //dataState={{skip:0, take:5}}
            dataState={this.props.chDataState}
            dataStateChange={this.props.chDataStateChange}
            //dataStateChange={(event) => this.setState({ chDataState: event.dataState })}
            needActionType={true}
            userInfo={this.props.userInfo}
            controlMap={this.props.controlMap}
            userRoleControlRights={this.props.userRoleControlRights}
            inputParam={this.props.inputParam}
            selectedId={null}
        />
        );

        return tabMap;
    }

    handleExpandChange = (row, dataState) => {
        const viewParam = {
            userInfo: this.props.userInfo, primaryKeyField: "npreregno",
            masterData: this.props.masterData
        };

        this.props.getTestParameter({
            ...viewParam, dataState,
            primaryKeyValue: row["dataItem"][viewParam.primaryKeyField],
            viewRow: row["dataItem"]
        });

    }

    handleSAHExpandChange = (row, dataState) => {
        const viewParam = {
            userInfo: this.props.userInfo, primaryKeyField: "npreregno",
            masterData: this.props.masterData
        };

        this.props.getBatchSampleApprovalHistory({
            ...viewParam, dataState,
            primaryKeyValue: row["dataItem"][viewParam.primaryKeyField],
            viewRow: row["dataItem"]
        });

    }

    onTabChange = (tabProps) => {
        const activeBCTab = tabProps.screenName;
        if (activeBCTab !== this.props.activeBCTab) {
            if (this.props.masterData.SelectedBatchCreation) {
                let inputData = {
                    masterData: this.props.masterData,
                    nreleaseBatchCode: this.props.masterData.SelectedBatchCreation ?
                        this.props.masterData.SelectedBatchCreation.nreleasebatchcode : "-1",
                    userinfo: this.props.userInfo,
                    activeBCTab,
                    screenName: activeBCTab
                }
                this.props.getBatchCreationChildTabDetail(inputData)
            } else {
                toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTTEST" }))
            }
        }
    }

    // onTabChange = (tabProps) =>{
    //     const screenName = tabProps.screenName;
    //     const updateInfo = {
    //         typeName: DEFAULT_RETURN,
    //         data: {screenName}
    //     }
    //     this.props.updateStore(updateInfo);
    // }

    closeModal = () => {
        let loadEsign = this.props.loadEsign;
        let openChildModal = this.props.openChildModal;
        let selectedRecord = this.props.selectedRecord;
        if (this.props.loadEsign) {
            if (this.props.operation === "delete") {
                loadEsign = false;
                openChildModal = false;
            }
            else {
                loadEsign = false;
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

    handleDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }

    getProductByCategory = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
        this.props.getProductByCategory(selectedRecord)
    }

    onComboChange = (comboData, fieldName) => {
        const selectedRecord = this.state.selectedRecord || {};
        selectedRecord[fieldName] = comboData;
        this.setState({ selectedRecord });
    }

    onInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};

        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;

            // if (event.target.name === "dateprompt"  && event.target.checked === true){
            //     selectedRecord["transdatefrom"] = undefined;
            //     selectedRecord["transdateto"] = undefined;
            // }
        }
        else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
    }

    componentDidUpdate(previousProps) {
        let updateState = false;
        let updateStateObject = {};
        if (this.props.addComponentDataList !== previousProps.addComponentDataList) {

            const addComponentDataList = this.props.addComponentDataList.map(item => {
                const index = this.state.addedComponentList.findIndex(item1 => item1.npreregno === item.npreregno)

                if (index !== -1) {
                    item.selected = true
                }
                return item;
            });
            updateStateObject = {
                ...updateStateObject, addComponentDataList: addComponentDataList,
                addedComponentList: this.props.addedComponentList,
                addSelectAll: false, deleteSelectAll: false,
                deleteComponentSelectAll: this.props.deleteComponentSelectAll
            };
            updateState = true;
            //  this.setState({ addComponentDataList : addComponentDataList,
            //                 addedComponentList : this.props.addedComponentList,
            //                 addSelectAll:this.valiateCheckAll(addComponentDataList),
            //                 deleteSelectAll: this.valiateCheckAll(this.props.addedComponentList)
            //              });
        }

        if (this.props.addedComponentList !== previousProps.addedComponentList) {
            // this.setState({ addedComponentList : this.props.addedComponentList});
            updateState = true;
            updateStateObject = { ...updateStateObject, addedComponentList: this.props.addedComponentList };
        }

        if (this.props.batchComponentDeleteList !== previousProps.batchComponentDeleteList) {
            //this.setState({ addedComponentList : this.props.batchComponentDeleteList});
            const batchComponentDeleteList = this.props.batchComponentDeleteList;
            batchComponentDeleteList.map(item => item.selected = false);
            updateState = true;
            updateStateObject = {//...updateStateObject, 
                batchComponentDeleteList: batchComponentDeleteList, deleteComponentSelectAll: false
            };
        }
        if (this.props.selectedRecord !== previousProps.selectedRecord) {
            //this.setState({selectedRecord:this.props.selectedRecord});
            updateState = true;
            updateStateObject = { ...updateStateObject, selectedRecord: this.props.selectedRecord };
        }

        if (updateState) {
            this.setState({ ...updateStateObject });
        }
    }

    onSaveClick = (saveType) => {
        //add / edit  

        let saveList = [];
        if (this.props.operation === "create") {
            const compList = this.state.addedComponentList || [];
            //compList.map(item=>saveList.push({"npreregno": item.npreregno}));

            compList.map(item => saveList.indexOf(item.npreregno) === -1 ?
                saveList.push({ "npreregno": item.npreregno }) : "");
        }
        else if (this.props.operation === "delete") {
            const compList = this.state.batchComponentDeleteList || [];
            compList.map(item => item.selected === true ? saveList.push({ "nbatchcompcode": item.nbatchcompcode }) : "");
        }

        if (saveList.length === 0) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTCOMPONENT" }));
        }
        else {
            let inputData = [];
            inputData["batchcompcreationlist"] = saveList;
            inputData["userinfo"] = this.props.userInfo;
            inputData["batchcreation"] = this.props.masterData.SelectedBatchCreation;

            let dataState = undefined;
            let selectedId = null;
            let postParam = undefined;

            const inputParam = {
                classUrl: "batchcreation",
                methodUrl: "BatchCompCreation",
                inputData: inputData, selectedId, dataState, postParam,
                operation: this.props.operation, saveType
            };


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

    }

    // saveBatchComponent(saveType){
    // let val=this.state.addedComponentList
    //     let inputData = [];
    //     inputData["userinfo"] = this.props.userInfo;
    //     inputData["batchcreation"] = this.props.masterData.SelectedBatchCreation;
    //     inputData["batchcompcreationlist"] = [];

    //     let dataState = undefined;
    //     let selectedId = null;
    //     let postParam = undefined;

    //     const addedComponentList = [];;
    //     this.state.addedComponentList.map(item=>addedComponentList.push({"npreregno": item.npreregno}));
    //     inputData["batchcompcreationlist"] = addedComponentList;
    //     if (addedComponentList.length === 0){

    //     }
    //     else{
    //         const inputParam = {
    //                                 classUrl: "batchcreation",
    //                                 methodUrl: "BatchCompCreation", 
    //                                 inputData: inputData, selectedId, dataState, postParam,
    //                                 operation: this.props.operation , saveType
    //                             }       
    //         return inputParam;
    //     }
    // }   

    getDataForAddComponent = () => {

        const datePrompt = this.state.selectedRecord["dateprompt"];
        const smanuflotno = this.state.selectedRecord["smanuflotno"] || "";
        const ncomponentcode = this.state.selectedRecord["ncomponentcode"];

        let valid = false;
        if (datePrompt === transactionStatus.YES) {
            if (smanuflotno.trim().length !== 0 || (ncomponentcode !== undefined && ncomponentcode !== null
                && ncomponentcode.length !== 0)) {
                valid = true;
            }

        }
        else {
            valid = true;
        }

        if (valid) {
            const inputData = {};//JSON.parse(JSON.stringify(this.state.selectedRecord));
            inputData["userinfo"] = this.props.userInfo;
            inputData["nproductcatcode"] = this.state.selectedRecord["nproductcatcode"].value;
            inputData["nreleasebatchcode"] = this.props.masterData.SelectedBatchCreation.nreleasebatchcode;

            if ((datePrompt === undefined || datePrompt === transactionStatus.NO) && this.state.selectedRecord["transdatefrom"])
                inputData["transdatefrom"] = formatInputDate(this.state.selectedRecord["transdatefrom"], true);
            // inputData["transdatefrom"] = this.state.selectedRecord["transdatefrom"];
            else
                datePrompt === transactionStatus.YES && inputData["transdatefrom"] && delete inputData["transdatefrom"];

            if ((datePrompt === undefined || datePrompt === transactionStatus.NO) && this.state.selectedRecord["transdateto"])
                inputData["transdateto"] = formatInputDate(this.state.selectedRecord["transdateto"], true);
            //inputData["transdateto"] = this.state.selectedRecord["transdateto"];
            else
                datePrompt === transactionStatus.YES && inputData["transdatefrom"] && delete inputData["transdatefrom"];

            if (this.state.selectedRecord["nproductcode"])
                inputData["nproductcode"] = this.state.selectedRecord["nproductcode"].value;

            if (this.state.selectedRecord["ncomponentcode"])
                inputData["ncomponentcode"] = this.state.selectedRecord["ncomponentcode"].value;

            if (this.state.selectedRecord["smanuflotno"])
                inputData["smanuflotno"] = this.state.selectedRecord["smanuflotno"];

            this.props.getDataForAddBatchComponent({ inputData, selectedComponentList: this.state.addedComponentList || [] });

        }
        else {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_COMPONENTORBATCHNOMANDATORY" }));
        }
    }

    onAttachmentSaveClick = (saveType, formRef, selectedRecord) => {
        const masterData = this.props.masterData;
        let inputData = {}
        let inputParam = {}
        inputData["userinfo"] = this.props.userInfo;
        let saveParam = {
            userInfo: this.props.userInfo,
            selectedRecord,
            masterData: this.props.masterData,
            saveType, formRef,
            operation: this.props.operation,
            //selectedMaster: this.props.selectedMaster
        }
        inputParam = onSaveBatchAttachment(saveParam, this.props.masterData.SelectedBatchCreation);
        if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, this.props.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true,
                    screenData: { inputParam, masterData },
                    operation: this.props.operation,
                    screenName: this.props.screenName,
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openAttachmentModal");
        }
    }

    deleteRecord = (deleteParam) => {

        if (this.props.masterData.SelectedBatchCreation.ntransactionstatus === transactionStatus.CANCELLED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_CANNOTDELETECOMPONENTFORCANCELLEDBATCH" }));
        }
        else {
            let dataState = undefined;
            delete deleteParam.selectedRecord["expanded"]

            const postParam = {
                inputListName: "Users", selectedObject: "SelectedBatchCreation",
                primaryKeyField: "nreleasebatchcode",
                primaryKeyValue: this.props.masterData.SelectedBatchCreation.nreleasebatchcode,
                fetchUrl: "batchcreation/getBatchCreation",
                fecthInputObject: { userinfo: this.props.userInfo },
            }
            const inputParam = {
                classUrl: "batchcreation",
                methodUrl: "BatchCompCreation",
                inputData: {
                    "batchcompcreationlist": [deleteParam.selectedRecord],
                    "userinfo": this.props.userInfo,
                    "ncontrolCode": deleteParam.ncontrolCode,
                    "batchcreation": this.props.masterData.SelectedBatchCreation
                },
                operation: "delete", dataState, postParam
            }

            if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, deleteParam.ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, screenData: { inputParam, masterData: this.props.masterData },
                        openChildModal: true, screenName: deleteParam.screenName, operation: deleteParam.operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");
            }
        }
    }

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

}

export default injectIntl(BatchCreationTabs);