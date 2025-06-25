import FormInput from '../../components/form-input/form-input.component';
import { Row, Col, Card, Nav, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt, faTrashAlt, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';
import '../../assets/./styles/tree.css';
import React, { Component } from 'react';
import { NavHeader } from '../../components/sidebar/sidebar.styles';
import { ContentPanel, ListWrapper } from './../userroletemplate/userroletemplate.styles';
import {
    callService, crudMaster, updateStore, addModel, validateEsignCredential,
    fetchRecordByTemplateID, getTemplateMasterTree, filterColumnData, getSampleTypeProductCategory,
    getStudyTemplateByCategoryType
} from '../../actions';
import { injectIntl } from 'react-intl';

import { toast } from 'react-toastify';
import { sortData, getControlMap, showEsign, constructOptionList } from '../../components/CommonScript';
import ListMaster from '../../components/list-master/list-master.component';
import TemplateMasterFilter from './../templatemaster/TemplateMasterFilter';
import SlideOutModal from '../../components/slide-out-modal/SlideOutModal';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import Esign from '../audittrail/Esign';
// import ConfirmDialog from '../../components/confirm-alert/confirm-alert.component';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import { transactionStatus, SampleType } from '../../components/Enumeration';
// import { Tooltip } from '@progress/kendo-react-tooltip';
import BreadcrumbComponent from '../../components/Breadcrumb.Component';
import { Affix } from 'rsuite';
// import ReactTooltip from 'react-tooltip';

class templatemaster extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openModal: false,
            userRoleControlRights: [],
            templateTreeData: [],
            TMvalues: [{ TMvalue: "" }],
            selected: {},
            selectedValues: undefined,
            error: "",
            controlMap: new Map(),
            sidebarview: false
        }
        this.searchRef = React.createRef();
        this.confirmMessage = new ConfirmMessage();
        this.searchFieldList = ["stransdisplaystatus", "sversionstatus", "sversiondescription"];
    }
    sidebarExpandCollapse = () => {
        this.setState({
            sidebarview: true
        })          
    }



    closeModel = () => {
        let loadEsign = this.props.Login.loadEsign;
        let openModal = this.props.Login.openModal;
        let selectedRecord=  this.props.Login.selectedRecord;
        if (this.props.Login.loadEsign) {
            if (this.props.Login.operation === "delete" || this.props.Login.operation === "approve") {
                loadEsign = false;
                openModal = false;
            }
            else {
                loadEsign = false;
            }
        }
        else {
            openModal = false;
        }

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { openModal, loadEsign,selectedRecord }
        }
        this.props.updateStore(updateInfo);
    }


    appendInputLevel(e) {
        if (this.props.Login.selectedRecord[this.props.Login.id] !== undefined) {
            if (this.props.Login.id < 9) {
                const totalLevel = this.props.Login.totalLevel ? this.props.Login.totalLevel : 1;
                let id = parseInt(this.props.Login.id) + 1;
                let totalid = totalLevel;
                if (totalid === id) {
                    var newInput = `input-${totalLevel}`;
                    var templateTreeData = this.props.Login.templateTreeData.concat([newInput])
                    const updateInfo = {
                        typeName: DEFAULT_RETURN,
                        data: { templateTreeData, totalLevel: totalLevel + 1, id }
                    }

                    this.props.updateStore(updateInfo)
                }
            }
        }
        else {
            toast.info(this.props.intl.formatMessage({ id: "IDS_PLSENTERTEMPLATELEVEL" }));
        }
    }

    removeTree(event, i) {
        const selectedRecord = this.props.Login.selectedRecord ? this.props.Login.selectedRecord : "";
        const totalLevel = this.props.Login.totalLevel ? this.props.Login.totalLevel : 1;
        let templateTreeData = this.props.Login.templateTreeData
        templateTreeData.splice(i, 10);

        if (selectedRecord[i]) {
            for (let j = i; j < totalLevel; j++) {
                delete selectedRecord[j];
            };
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { templateTreeData, selectedRecord, totalLevel: i, id: i - 1 }
        }
        this.props.updateStore(updateInfo);
    }

    // onComboChange = (event, fieldname) => {
    //     if (event !== null) {
    //         let uRL = "";
    //         let inputData = [];
    //         if (fieldname === "sampleType") {
    //             uRL = 'templatemaster/getSampleTypeProductCatrgory';
    //             inputData = {
    //                 userinfo: this.props.Login.userInfo,
    //                 nsampletypecode: event.item["nsampletypecode"]
    //             }
    //         }
    //         else {
    //             uRL = 'templatemaster/getTemplateMasterVersion';
    //             inputData = {
    //                 userinfo: this.props.Login.userInfo,
    //                 nsampletypecode: event.item["nsampletypecode"],
    //                 ncategorycode: event.item[this.props.Login.masterData.categoryValuemember],
    //                 nformcode: event.item["nformcode"]
    //             }
    //         }
    //         rsapi.post(uRL, inputData)
    //             .then(response => {
    //                 const categroyLable = response.data.lstcategory ? Object.keys(response.data.lstcategory)[0] : this.props.Login.masterData.categroyLable;
    //                 const categoryValuemember = response.data.lstcategory ? Object.keys(response.data.lstcategory[categroyLable][0])[0] : this.props.Login.masterData.categoryValuemember;
    //                 const categoryDisplaymemeber = response.data.lstcategory ? Object.keys(response.data.lstcategory[categroyLable][0])[1] : this.props.Login.masterData.categoryDisplaymemeber;
    //                 const selectedValues = this.props.Login.masterData.selectedValues || [];
    //                 const selectedRecord = this.props.Login.selectedRecord || {};
    //                 let Taglstcategory;

    //                 if (response.data.lstcategory) {
    //                     Taglstcategory = constructOptionList(response.data.lstcategory[categroyLable] || [], categoryValuemember,
    //                         categoryDisplaymemeber, categoryValuemember, "ascending", undefined);
    //                 }
    //                 // let TaglstSampleType;
    //                 // if (response.data.lstSampleType) {
    //                 //     TaglstSampleType = constructOptionList(response.data.lstSampleType || [], "nsampletypecode",
    //                 //         "ssampletypename", "nsampletypecode", "ascending", undefined);
    //                 // }

    //                 selectedValues["nsampletypecode"] = event.item["nsampletypecode"] ? event.item["nsampletypecode"] : this.props.Login.masterData.selectedValues["nsampletypecode"];
    //                 selectedValues["nformcode"] = (fieldname === "sampleType") ? response.data.lstcategory ?
    //                     response.data.lstcategory[categroyLable][0]["nformcode"] : event.item["nformcode"] ? event.item["nformcode"] :
    //                         this.props.Login.masterData.selectedValues["nformcode"] : this.props.Login.masterData.selectedValues["nformcode"];

    //                 selectedValues["ncategorycode"] = (fieldname === "sampleType") ? Taglstcategory ?
    //                     Taglstcategory.get("OptionList")[0].item[categoryValuemember] : this.props.Login.masterData.selectedValues["ncategorycode"]
    //                         ? event.item[this.props.Login.masterData.categoryValuemember] : "" :
    //                     event.item[this.props.Login.masterData.categoryValuemember] ? event.item[this.props.Login.masterData.categoryValuemember] : "";

    //                 if (response.data.lstTreeversionTemplate) {
    //                     sortData(response.data.lstTreeversionTemplate, "descending", "ntreeversiontempcode")
    //                 }
    //                 if (response.data.lstTemplateMasterlevel) {
    //                     sortData(response.data.lstTemplateMasterlevel, "ascending", "nlevelno")
    //                 }

    //                 selectedRecord["ntransactionstatus"] = response.data.lstTreeversionTemplate.length > 0 ? response.data.lstTreeversionTemplate[0]["ntransactionstatus"] : ""

    //                 this.setState({
    //                     selectedSampleType: (fieldname === "sampleType" ? parseInt(event.value) : this.state.selectedSampleType)

    //                 });
    //                 this.props.Login.masterData["defaultsampletype"] = (fieldname === "sampleType") ? event : response.data.lstSampleType ? response.data.lstSampleType.length > 0 ?
    //                     {
    //                         "value": response.data.lstSampleType[0]["nsampletypecode"],
    //                         "label": response.data.lstSampleType[0]["ssampletypename"]
    //                     } : this.props.Login.masterData.defaultsampletype : this.props.Login.masterData.defaultsampletype;
    //                 // this.props.Login.masterData["lstSampleType"] = TaglstSampleType ? TaglstSampleType.get("OptionList") : this.props.Login.masterData.lstSampleType;
    //                 this.props.Login.masterData["lstcategory"] = Taglstcategory ? Taglstcategory.get("OptionList") : fieldname === "cateogryType" ? this.props.Login.masterData["lstcategory"] : "";
    //                 this.props.Login.masterData["lstTreeversionTemplate"] = response.data.lstTreeversionTemplate ? response.data.lstTreeversionTemplate : "";
    //                 this.props.Login.masterData["lstTemplateMasterlevel"] = response.data.lstTemplateMasterlevel ? response.data.lstTemplateMasterlevel : "";
    //                 this.props.Login.masterData["selected"] = response.data.lstTreeversionTemplate ? response.data.lstTreeversionTemplate.length > 0 ?
    //                     response.data.lstTreeversionTemplate[0] : {} : this.props.Login.masterData["selected"];
    //                 this.props.Login.masterData["selectedValues"] = selectedValues;

    //                 this.props.Login.masterData["defaultCatogoryType"] = (fieldname === "cateogryType") ? event : Taglstcategory ? Taglstcategory.get("OptionList") ? {
    //                     "value": Taglstcategory.get("OptionList")[0].item[categoryValuemember],
    //                     "label": Taglstcategory.get("OptionList")[0].item[categoryDisplaymemeber]
    //                 } : this.props.Login.masterData.defaultCatogoryType : this.props.Login.masterData.defaultCatogoryType;

    //                 this.props.Login.masterData["categroyLable"] = categroyLable;
    //                 this.props.Login.masterData["categoryValuemember"] = categoryValuemember;
    //                 this.props.Login.masterData["categoryDisplaymemeber"] = categoryDisplaymemeber;
    //                 this.props.Login.masterData["searchedData"] = undefined;
    //                 this.searchRef.current.value = "";
    //                 const updateInfo = {
    //                     typeName: DEFAULT_RETURN,
    //                     data: { masterData: this.props.Login.masterData, selectedRecord }
    //                 }
    //                 this.props.updateStore(updateInfo);
    //             })
    //             .catch(error => {

    //                 if (error.response.status === 500) {
    //                     toast.error(error.message);
    //                 }
    //                 else {
    //                     toast.info(error.response.data);
    //                 }
    //             })
    //     }
    // }

    onComboChange = (event, fieldName) => {
        //if (event !== null) {
        const filterSelectedRecord = this.state.filterSelectedRecord || {};
        filterSelectedRecord[fieldName] = event;

        if (fieldName === "sampleType") {
            const url = 'templatemaster/getSampleTypeComboChange';
            const inputData = {
                userinfo: this.props.Login.userInfo,
                nsampletypecode: event.item["nsampletypecode"]
            }
            filterSelectedRecord["sampletype"] = event;
            const inputParam = { inputData, url };
            this.props.getSampleTypeProductCategory(filterSelectedRecord, inputParam,
                this.props.Login.masterData)

        }
        else {

            //categoryType

            const masterData = this.props.Login.masterData;
            filterSelectedRecord.masterData["SelectedCategoryFilter"] = event.item;
            //masterData["SelectedCategory"] = event.item;
            filterSelectedRecord.masterData["SelectedSample"] = this.props.Login.masterData.SelectedSampleFilter;
            //masterData["selectedValues"].ncategorycode = event.value;
            filterSelectedRecord["categorytype"] = event;
            const updateInfo = { typeName: DEFAULT_RETURN, data: { masterData, filterSelectedRecord } };

            this.props.updateStore(updateInfo);
        }
    }

    render() {
        const { masterData, userInfo, openModal, templateTreeData, selectedInput, selectedRecord, totalLevel } = this.props.Login;
        let { lstTreeversionTemplate, //selected, 
            lstTemplateMasterlevel } = this.props.Login.masterData;
        const addId = this.state.controlMap.has("AddTempalateMaster") && this.state.controlMap.get("AddTempalateMaster").ncontrolcode;
        const editId = this.state.controlMap.has("EditTempalateMaster") && this.state.controlMap.get("EditTempalateMaster").ncontrolcode;
        const deleteId = this.state.controlMap.has("DeleteTempalateMaster") && this.state.controlMap.get("DeleteTempalateMaster").ncontrolcode;
        const approveId = this.state.controlMap.has("ApproveTempalateMaster") && this.state.controlMap.get("ApproveTempalateMaster").ncontrolcode;
        lstTemplateMasterlevel = lstTemplateMasterlevel ? sortData(lstTemplateMasterlevel,'ascending','nlevelno') :[];

        const filterParam = {
            inputListName: "lstTreeversionTemplate", selectedObject: "selectedTempVersion", primaryKeyField: "ntreeversiontempcode",
            fetchUrl: "templatemaster/getTemplateVersionById", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData, searchFieldList: this.searchFieldList
        };
        const mandatoryFields = [
            { "mandatory": true, "idsName": "IDS_TEMPLATENAME", "dataField": "sversiondescription" , "mandatoryLabel":"IDS_ENTER", "controlType": "textbox"}

        ];

        const breadCrumbData = this.generateBreadCrumData() || [];

        const selected = this.props.Login.masterData.SelectedTreeVersionTemplate;

        return (
            <>
                <ListWrapper className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
                    {breadCrumbData.length > 0 ?
                        <Affix top={53}>
                            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        </Affix> : ""

                    }
                    {/* <Preloader loading={loading} /> */}
                    {/* <div className="client-listing-wrap mtop-4"> */}
                    <Row noGutters={true}>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                            <ListMaster
                                masterData={masterData}
                                formatMessage={this.props.intl.formatMessage}
                                screenName={this.props.intl.formatMessage({ id: "IDS_TEMPLATE" })}
                                masterList={this.props.Login.masterData.searchedData || lstTreeversionTemplate}
                                userInfo={this.props.Login.userInfo}
                                getMasterDetail={(TMvalue) => this.props.getTemplateMasterTree(TMvalue, masterData, userInfo)}
                                //selectedMaster={this.props.Login.masterData.selected}
                                selectedMaster={selected}
                                primaryKeyField="ntreeversiontempcode"
                                mainField="sversiondescription"
                                firstField="sversiondescription"
                                secondField="stransdisplaystatus"
                                isIDSField="No"
                                openModal={() => this.props.addModel("create", addId, this.props.Login.masterData.lstcategory, selectedInput)}
                                // needAccordianFilter={true}
                                userRoleControlRights={this.state.userRoleControlRights}
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                searchRef={this.searchRef}
                                addId={addId}
                                reloadData={this.reloadData}
                                hidePaging={true}


                                needAccordianFilter={false}
                                showFilterIcon={true}
                                showFilter={this.props.Login.showFilter}
                                openFilter={this.openFilter}
                                closeFilter={this.closeFilter}
                                onFilterSubmit={this.onFilterSubmit}

                                filterComponent={[
                                    {
                                        "IDS_TEMPLATEMASTERFILTER":
                                            <TemplateMasterFilter
                                                formatMessage={this.props.intl.formatMessage}
                                                filterSampleType={this.state.TaglstSampleType || []}
                                                filterCateogryType={this.state.Taglstcategory || []}
                                                catogryValuemember={this.props.Login.masterData.SelectedCategoryFilterTextLabel || ""}
                                                categoryDisplaymemeber={this.props.Login.masterData.SelectedCategoryFilterValueLabel || ""}
                                                //labelName={this.state.selectedRecord.categroyLable || ""}
                                                labelName={(this.props.Login.masterData.lstcategory && Object.keys(this.props.Login.masterData.lstcategory)[0])
                                                    || (this.state.filterSelectedRecord && this.state.filterSelectedRecord.categroyLable)}
                                                selectedInput={this.state.selectedInput || []}
                                                onComboChange={this.onComboChange}
                                                filterSelectedRecord={this.state.filterSelectedRecord || {}}
                                                defaultsampletype={this.state.filterSelectedRecord !==undefined?
                                                    this.state.filterSelectedRecord.sampletype
                                                    :
                                                   this.props.Login.masterData.SelectedSampleFilter && {
                                                        label: this.props.Login.masterData.SelectedSampleFilter.ssampletypename,
                                                    value: this.props.Login.masterData.SelectedSampleFilter.nsampletypecode,
                                                    item: this.props.Login.masterData.SelectedSampleFilter
                                                }}

                                                defaultCatogoryType={this.state.filterSelectedRecord !==undefined?
                                                   this.state.filterSelectedRecord.categorytype:
                                               this.props.Login.masterData.SelectedCategoryFilter &&  {
                                                        label: this.props.Login.masterData.SelectedCategoryFilter[this.props.Login.masterData.SelectedCategoryFilterValueLabel],
                                                    value: this.props.Login.masterData.SelectedCategoryFilter[this.props.Login.masterData.SelectedCategoryFilterTextLabel],
                                                    item: this.props.Login.masterData.SelectedCategoryFilter
                                                }}
                                            />
                                    }
                                ]}
                            />
                        </Col>

                        {/* {this.props.Login.masterData.selectedTempVersion && lstTreeversionTemplate && lstTreeversionTemplate.length > 0 ? */}

                        {this.props.Login.masterData.selectedTempVersion && selected ?
                            <Col md={`${!this.props.sidebarview ? '8' : "10"}`} className="position-relative">
                                <div className="sidebar-view-btn-block">
                                    <div className="sidebar-view-btn " onClick={this.props.parentFunction}>
                                        {!this.props.sidebarview ?                    
                                            <i class="fa fa-less-than"></i> :
                                            <i class="fa fa-greater-than"></i> 
                                        }
                                    </div>
                                </div>
                                <ListWrapper className="panel-main-content">
                                    <Card className="border-0">
                                        {/* {(selected) && */}
                                        <Card.Header>
                                            <Card.Title>
                                                <>
                                                    <h1 className="product-title-main">{selected.sversiondescription}</h1>
                                                </>
                                            </Card.Title>
                                            <Card.Subtitle className="readonly-text font-weight-normal">
                                                <Row>
                                                    <Col md={8} className="d-flex">
                                                        {/* <h3 className="product-title-sub">Version : {selected.nversionno === -1 ? "-" : selected.nversionno}</h3> */}
                                                        <h3 className="product-title-sub">{this.props.intl.formatMessage({ id: "IDS_VERSION" })} : {selected.nversionno === -1 ? "-" : selected.nversionno}</h3>
                                                        <span className={`btn btn-outlined ${selected.ntransactionstatus === transactionStatus.DRAFT ? "outline-secondary" : selected.ntransactionstatus === transactionStatus.APPROVED ? "outline-success" : "outline-danger"} btn-sm mx-md-3 mx-sm-2`}>
                                                            {selected.stransdisplaystatus}</span>
                                                    </Col>
                                                    <Col md={4}>
                                                        {/* <ReactTooltip place="bottom" globalEventOff='click' /> */}
                                                        {/* <Tooltip position="bottom" anchorElement="target" openDelay={100} parentTitle={true}> */}
                                                        <Nav style={{ float: "right" }}>
                                                            <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_EDIT" })}
                                                            //    data-for="tooltip_list_wrap"
                                                                //onClick={() => this.props.fetchRecordByTemplateID("ntreeversiontempcode", selected.ntreeversiontempcode, "update", selectedRecord, selectedInput, userInfo, editId)}
                                                                onClick={() => this.props.fetchRecordByTemplateID("ntreeversiontempcode", selected.ntreeversiontempcode, "update",
                                                                    { ntransactionstatus: this.props.Login.masterData["lstTemplateMasterlevel"][0]["ntransactionstatus"] },
                                                                    {}, userInfo, editId)}

                                                                hidden={this.state.userRoleControlRights.indexOf(editId) === -1}>
                                                                <FontAwesomeIcon icon={faPencilAlt} />
                                                            </Nav.Link>
                                                            <Nav.Link className="btn btn-circle outline-grey mr-2 "
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                               // data-for="tooltip_list_wrap"
                                                                hidden={this.state.userRoleControlRights.indexOf(deleteId) === -1}
                                                                onClick={() => this.ConfirmDelete(deleteId)}>
                                                                <FontAwesomeIcon icon={faTrashAlt} />

                                                                {/* <ConfirmDialog
                                                                            name="deleteMessage"
                                                                            message="Are you sure?"
                                                                            doLabel="Ok"
                                                                            doNotLabel={this.props.intl.formatMessage({ id: "IDS_CANCEL" })}
                                                                            icon={faTrashAlt}
                                                                            // title={this.props.intl.formatMessage({ id: "IDS_DELETE" })}
                                                                            hidden={this.props.userRoleControlRights && this.props.userRoleControlRights.indexOf(deleteId) === -1}
                                                                            handleClickDelete={() => this.deleteRecord("delete", deleteId)}
                                                                        /> */}
                                                            </Nav.Link>
                                                            <Nav.Link className="btn btn-circle outline-grey mr-2"
                                                                data-tip={this.props.intl.formatMessage({ id: "IDS_APPROVE" })}
                                                            //    data-for="tooltip_list_wrap"
                                                                hidden={this.state.userRoleControlRights.indexOf(approveId) === -1}
                                                                onClick={() => this.approveRecord("approve", approveId)}>
                                                                <FontAwesomeIcon icon={faThumbsUp} />
                                                            </Nav.Link>
                                                        </Nav>
                                                        {/* </Tooltip> */}
                                                    </Col>
                                                </Row>
                                            </Card.Subtitle>
                                        </Card.Header>
                                        {/* } */}
                                    </Card>
                                </ListWrapper>

                                {<ContentPanel className="panel-main-content">
                                    <ListWrapper className="card-body">
                                        <React.Fragment>
                                            <ListWrapper className="tree-view1 border-left tree-left ">
                                                {lstTemplateMasterlevel ? lstTemplateMasterlevel.map((input, i) =>
                                                    <ListWrapper key={i} className="form-label-group tree-level list_get">
                                                        <NavHeader className="line" style={{ width: (i + 1) * 10 }}> </NavHeader>
                                                        <NavHeader id={i} value={totalLevel}
                                                            className="add_field_button">+</NavHeader>
                                                        {/* <NavHeader className="levelcolour" md={1}>Level {i + 1}</NavHeader>  */}
                                                        <NavHeader className="levelcolour" md={1}>{this.props.intl.formatMessage({ id: "IDS_LEVEL" })} {i + 1}</NavHeader> 
                                                        <ListWrapper style={{ marginLeft: (i + 8) * 10 }}>
                                                            <FormInput className="input_custom" value={input.slabelname} id="levelname" type="text" />
                                                        </ListWrapper>
                                                    </ListWrapper>
                                                ) : ""
                                                }
                                            </ListWrapper>
                                        </React.Fragment>
                                    </ListWrapper>
                                </ContentPanel>}
                            </Col>
                            : ""}
                    </Row >
                    {/* </div> */}
                </ListWrapper>

                {this.props.Login.openModal ?
                    < SlideOutModal
                        operation={this.props.Login.operation}
                        onSaveClick={this.saveTMTreetemplate}
                        validateEsign={this.validateEsign}
                        esign={this.props.Login.loadEsign}
                        screenName="IDS_TEMPLATEMASTER"
                        closeModal={this.closeModel}
                        selectedRecord={this.props.Login.loadEsign ? this.state.selectedRecord : selectedInput}
                        mandatoryFields={mandatoryFields}
                        show={openModal}
                        inputParam={this.props.Login.inputParam}
                        addComponent={this.props.Login.loadEsign ?
                            <Esign
                                operation={this.props.Login.operation}
                                //formatMessage={this.props.intl.formatMessage}
                                onInputOnChange={this.onEsignInputOnChange}
                                inputParam={this.props.Login.inputParam}
                                selectedRecord={this.state.selectedRecord || {}}
                            /> :
                            <Row>
                                <Col md={12}>
                                    <FormInput
                                        label={this.props.intl.formatMessage({ id: "IDS_TEMPLATENAME" })}
                                        name={"sversiondescription"}
                                        as="text"
                                        onChange={(event) => this.onInputOnChange(event, "version")}
                                        placeholder={this.props.intl.formatMessage({ id: "IDS_TEMPLATENAME" })}
                                        defaultValue={selectedInput ? selectedInput["sversiondescription"] : ""}
                                        isMandatory={true}
                                        required={true}
                                        maxLength={100}
                                    />
                                </Col>
                                <Col md={12}>
                                    <ListWrapper className="tree-view border-left">
                                        {templateTreeData ?
                                            templateTreeData.map((input, i) =>
                                                <ListWrapper className="form-label-group tree-level">
                                                    <NavHeader className="line" style={{ width: (i + 1) * 10 }}> </NavHeader>
                                                    <NavHeader id={i} value={totalLevel}
                                                        className="add_field_button">+</NavHeader>
                                                    {/* <NavHeader md={1}>level <NavHeader className="tree-value">{i + 1}</NavHeader> */}
                                                    <NavHeader md={1}>{this.props.intl.formatMessage({ id: "IDS_LEVEL" })} <NavHeader className="tree-value">{i + 1}</NavHeader>

                                                    </NavHeader>
                                                    <Nav className="btn mr-2 action-icons-wrap" style={{ float: "right", visibility: i === 0 ? 'hidden' : 'visible' }} onClick={(event) => this.removeTree(event, i)}>
                                                        <FontAwesomeIcon icon={faTrashAlt} className="ActionIconColor" />
                                                    </Nav>
                                                    <Row>
                                                        <Col md={12} style={{ marginLeft: (i + 3) * 10 }}>
                                                            <Col md={12}>
                                                                <FormInput
                                                                    name={"slabelname"}
                                                                    type="text"
                                                                    onChange={(event) => this.onInputOnChange(event, i)}
                                                                    placeholder={this.props.intl.formatMessage({ id: "IDS_ENTERTEMPLATELEVEL" })}
                                                                    defaultValue={selectedRecord ? selectedRecord[i] : ""}
                                                                    maxLength={50}
                                                                />
                                                            </Col>
                                                        </Col>
                                                    </Row>
                                                </ListWrapper>
                                            ) : ""}
                                    </ListWrapper>
                                    <NavHeader>
                                        <Button onClick={(e) => this.appendInputLevel(e)} className="btn btn-circle solid-blue" role="button">+</Button>
                                    </NavHeader>

                                </Col>
                            </Row>
                        } />
                    : ""}
            </>
        );
    }

    openFilter = () => {
        let showFilter = !this.props.Login.showFilter
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter }
        }
        this.props.updateStore(updateInfo);
    }

    closeFilter = () => {

        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { showFilter: false }
        }
        this.props.updateStore(updateInfo);
    }

    ConfirmDelete = (deleteId) => {
        this.confirmMessage.confirm("deleteMessage", this.props.intl.formatMessage({ id: "IDS_DELETE" }), this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
            this.props.intl.formatMessage({ id: "IDS_OK" }), this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
            () => this.deleteRecord("delete", deleteId));
    }

    onFilterSubmit = () => {

        const filterSelectedRecord = this.state.filterSelectedRecord || {};
        const url = 'templatemaster/getTemplateMasterVersion';
        const dummyNumber = -12;
        this.searchRef.current.value = "";
        const inputData = {
            filterSelectedRecord,
            userinfo: this.props.Login.userInfo,
            nsampletypecode: filterSelectedRecord["sampletype"] ? filterSelectedRecord["sampletype"].value : dummyNumber,
            ncategorycode: filterSelectedRecord["categorytype"] ? filterSelectedRecord["categorytype"].value : dummyNumber,
            nformcode: filterSelectedRecord["categorytype"] ? filterSelectedRecord["categorytype"]["item"]["nformcode"] : dummyNumber
        }
        const inputParam = { url, inputData };
        this.props.getStudyTemplateByCategoryType(inputParam,
             this.props.Login.masterData, filterSelectedRecord, true);
    }

    approveRecord = (operation, ncontrolCode) => {
        const selectedRecord = this.props.Login.selectedRecord ? this.props.Login.selectedRecord : "";
        ///const selected = this.props.Login.masterData["selected"];
        const selected = this.props.Login.masterData.SelectedTreeVersionTemplate;
        if (selectedRecord["ntransactionstatus"] === transactionStatus.APPROVED || selectedRecord["ntransactionstatus"] === transactionStatus.RETIRED) {
            toast.info(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTOAPPROVE" }));
        }
        else {
            let inputData = [];
            inputData = {
                "userinfo": this.props.Login.userInfo,
                "ntreeversiontempcode": selected.ntreeversiontempcode,
                // "ncategorycode": this.props.Login.masterData.selectedValues["ncategorycode"],
                // "nformcode": this.props.Login.masterData.selectedValues["nformcode"],
                "ncategorycode": parseInt(this.props.Login.masterData.SelectedCategory[this.props.Login.masterData.SelectedCategoryFilterTextLabel]),
                "nformcode": parseInt(this.props.Login.masterData.SelectedCategory.nformcode),
                "ntemplatecode": selected.ntemplatecode ? selected.ntemplatecode : undefined,
            }

            const postParam = {
                inputListName: "lstTreeversionTemplate",
                //selectedObject: "selectedTempVersion",
                selectedObject: "SelectedTreeVersionTemplate",
                primaryKeyField: "ntreeversiontempcode",
                primaryKeyValue: selected.ntreeversiontempcode,
                fetchUrl: "templatemaster/getTemplateVersionById",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }

            const inputParam = {
                methodUrl: "TemplateMasterVersion",
                classUrl: this.props.Login.inputParam.classUrl,
                inputData: inputData,
                operation: operation,
                postParam
            }
            const masterData = this.props.Login.masterData;
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, openModal: true, screenData: { inputParam, masterData },
                        operation: operation
                    }
                }
                this.props.updateStore(updateInfo);
            }
            else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }
        }
    }


    //to delete a recored
    deleteRecord = (operation, ncontrolCode) => {
        // const selected = this.props.Login.masterData["selected"];
        const selected = this.props.Login.masterData.SelectedTreeVersionTemplate;
        const selectedLevel = this.props.Login.masterData.lstTemplateMasterlevel
        if (this.props.Login.selectedRecord["ntransactionstatus"] === transactionStatus.APPROVED || this.props.Login.selectedRecord["ntransactionstatus"] === transactionStatus.RETIRED) {
            toast.warn(this.props.intl.formatMessage({ id: "IDS_SELECTDRAFTRECORDTODELETE" }));
        }
        else {
            let inputData = [];
            inputData["userinfo"] = this.props.Login.userInfo;
            inputData = {
                "userinfo": this.props.Login.userInfo,
                "ntreeversiontempcode": selected.ntreeversiontempcode,
                "ntreecontrolcode": selectedLevel.map(item => item.ntreecontrolcode).join(","),
                // "ncategorycode": this.props.Login.masterData.selectedValues["ncategorycode"],
                // "nformcode": this.props.Login.masterData.selectedValues["nformcode"]
                "ncategorycode": parseInt(this.props.Login.masterData.SelectedCategory[this.props.Login.masterData.SelectedCategoryFilterTextLabel]),
                "nformcode": parseInt(this.props.Login.masterData.SelectedCategory.nformcode),
                "nsampletypecode": parseInt(this.props.Login.masterData.SelectedTreeVersionTemplate.nsampletypecode),

            }


            const postParam = {
                inputListName: "lstTreeversionTemplate",
                //selectedObject: "selectedTempVersion",
                selectedObject: "SelectedTreeVersionTemplate",
                primaryKeyField: "ntreeversiontempcode",
                primaryKeyValue: selected.ntreeversiontempcode,
                fetchUrl: "templatemaster/getTemplateVersionById",
                fecthInputObject: { userinfo: this.props.Login.userInfo },
            }


            const inputParam = {
                methodUrl: "TemplateMaster",
                classUrl: this.props.Login.inputParam.classUrl,
                inputData: inputData,
                operation: operation,
                postParam,
                isClearSearch: this.props.Login.isClearSearch
            }
            const masterData = this.props.Login.masterData;
            if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, ncontrolCode)) {
                const updateInfo = {
                    typeName: DEFAULT_RETURN,
                    data: {
                        loadEsign: true, openModal: true, screenData: { inputParam, masterData },
                        operation: operation
                    }
                }
                this.props.updateStore(updateInfo);
            } else {
                this.props.crudMaster(inputParam, masterData, "openModal");
            }
        }

    }

    saveTMTreetemplate = (saveType, formRef) => {
        let listTemplateMasterTree = [];
        let levelno = 0;
        //const selected = this.props.Login.masterData["selected"];
        const selected = this.props.Login.masterData.SelectedTreeVersionTemplate;
        const selectedLevel = this.props.Login.masterData.lstTemplateMasterlevel

        for (let index = 0; index < this.props.Login.totalLevel; index++) {
            levelno = index + 1;
            if (this.props.Login.selectedRecord[index]) {
                listTemplateMasterTree.push((this.props.Login.selectedRecord[index]).toString())
            }
            else {
                return toast.info(this.props.intl.formatMessage({ id: "IDS_PLESEENTERTHELEVEL" }) + levelno);
            }
        }

        let inputData = [];
        let methodUrl = "";
        inputData = {
            "userinfo": this.props.Login.userInfo,
            "ncategorycode": parseInt(this.props.Login.masterData.SelectedCategory[this.props.Login.masterData.SelectedCategoryFilterTextLabel]),
            "nformcode": parseInt(this.props.Login.masterData.SelectedCategory.nformcode),
            "ntreecontrolcode": selectedLevel.map(item => item.ntreecontrolcode).join(","),
            "ntemplatecode": selected ? selected.ntemplatecode : -1,
            "ntreeversiontempcode": selected ? selected.ntreeversiontempcode : -1,
            "specname": this.props.Login.selectedInput.sversiondescription,
            "treetemptranstestgroup": listTemplateMasterTree,
            "nsampletypecode": parseInt(this.props.Login.masterData.SelectedSample["nsampletypecode"])
        }

        let postParam = undefined;

        if (this.props.Login.operation === "create") {
            methodUrl = "Templatemaster";
        }
        else {
            methodUrl = "EditTemplatemasterSubmit";
            postParam = { inputListName: "lstTreeversionTemplate", selectedObject: "selectedTempVersion", primaryKeyField: "ntreeversiontempcode" };
        }

        const inputParam = {
            methodUrl: methodUrl,
            classUrl: this.props.Login.inputParam.classUrl,
            inputData: inputData,
            operation: this.props.Login.operation,
            searchRef: this.searchRef, formRef, postParam
        }
        const masterData = this.props.Login.masterData;
        if (showEsign(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode, this.props.Login.ncontrolCode)) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType
                }
            }
            this.props.updateStore(updateInfo);
        } else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }
    }

    onInputOnChange = (event, levelno) => {
        const selectedRecord = this.props.Login.selectedRecord || {};
        const selectedInput = this.props.Login.selectedInput || {};
        if (levelno === "version") {
            selectedInput[event.target.name] = event.target.value;
        }
        else {
            if (event.target.value.trim() !== "") {
                selectedRecord[levelno] = event.target.value;
            }
            else {
                selectedRecord[levelno] = undefined;
            }
        }
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: { selectedInput, selectedRecord }
        }
        this.props.updateStore(updateInfo);
    }

    onEsignInputOnChange = (event) => {
        const selectedRecord = this.state.selectedRecord || {};
        if (event.target.type === 'checkbox') {
            selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
        } else {
            selectedRecord[event.target.name] = event.target.value;
        }
        this.setState({ selectedRecord });
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

    reloadData = () => {

        console.log("stdy pla reload:", this.props.Login.masterData, this.state.selectedRecord);
        //ALPD-4803 done by Dhanushya RI,To check searchref key is present or not
        if (this.searchRef && this.searchRef.current) {
            this.searchRef.current.value = "";
          }        
        const url = 'templatemaster/getTemplateMasterVersion';
        const dummyNumber = -12;
        const inputData = {
                        userinfo: this.props.Login.userInfo,
                        nsampletypecode: this.props.Login.masterData.SelectedSample ? this.props.Login.masterData.SelectedSample.nsampletypecode :dummyNumber,
                        ncategorycode: this.props.Login.masterData.SelectedCategory ? this.props.Login.masterData.SelectedCategory[this.props.Login.masterData.SelectedCategoryFilterTextLabel] :dummyNumber,
                        nformcode: this.props.Login.masterData.SelectedCategory ? this.props.Login.masterData.SelectedCategory.nformcode : dummyNumber,

                    }
        const masterData = {...this.props.Login.masterData, searchedData:undefined}
        const inputParam = {url, inputData};
        this.props.getStudyTemplateByCategoryType(inputParam, masterData, this.state.selectedRecord, false) ;
        //--------------------------------------------------
        // this.searchRef.current.value = "";
        // const inputParam = {
        //     inputData: { "userinfo": this.props.Login.userInfo },
        //     classUrl: "templatemaster",
        //     methodUrl: "TemplateMaster",
        //     userInfo: this.props.Login.userInfo,
        //     displayName: "IDS_STUDYPLANTEMPLATE"
        // };

        // this.props.callService(inputParam);
        //////////////////---------------------------
       
    }

    componentDidUpdate(previousProps) {
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
        if (this.props.Login.filterSelectedRecord !== previousProps.Login.filterSelectedRecord) {
            this.setState({ filterSelectedRecord: this.props.Login.filterSelectedRecord });
        }
        if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
            if (this.props.Login.masterData !== previousProps.Login.masterData) {

                const userRoleControlRights = this.state.userRoleControlRights || [];
                let controlMap = this.state.controlMap || {};
                let filterSelectedRecord = this.state.filterSelectedRecord || {};

                // if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) 
                // {
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]
                        && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                            userRoleControlRights.push(item.ncontrolcode))
                }
                controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)

                //}
                const selectedValues = {};
                const categroyLable = this.props.Login.masterData.categroyLable ? this.props.Login.masterData.categroyLable : this.props.Login.masterData.lstcategory ? Object.keys(this.props.Login.masterData.lstcategory)[0] : "";
                const categoryValuemember = this.props.Login.masterData.SelectedCategoryFilterTextLabel;
                const categoryDisplaymemeber = this.props.Login.masterData.SelectedCategoryFilterValueLabel;

                filterSelectedRecord["ntransactionstatus"] = this.props.Login.masterData.lstTemplateMasterlevel ? this.props.Login.masterData.lstTemplateMasterlevel.length > 0 ?
                    this.props.Login.masterData.lstTemplateMasterlevel[0]["ntransactionstatus"] :
                    this.props.Login.filterSelectedRecord ? this.props.Login.filterSelectedRecord["ntransactionstatus"] : [] : [];

                let TaglstSampleType = [];
                let Taglstcategory = [];

                // if (this.props.Login.masterData.lstSampleType) {
                //     sortData(this.props.Login.masterData.lstSampleType, "descending", "nsorter");
                // }
                if (this.props.Login.masterData.lstSampleType && !this.props.Login.masterData.lstSampleType[0].item) {
                    const sampleTypeMap = constructOptionList(this.props.Login.masterData.lstSampleType || [], "nsampletypecode",
                        "ssampletypename", "nsorter", "ascending", undefined);
                    TaglstSampleType = sampleTypeMap.get("OptionList");
                }
                if (this.props.Login.masterData.lstcategory && this.props.Login.masterData.lstcategory[categroyLable]) {
                    const categoryTypeMap = this.props.Login.masterData.lstcategory[categroyLable] ? constructOptionList(this.props.Login.masterData.lstcategory[categroyLable]
                        || [], categoryValuemember, categoryDisplaymemeber, categoryValuemember, "ascending", undefined) : this.props.Login.masterData.lstcategory;
                    Taglstcategory = categoryTypeMap.get("OptionList");
                }
                if (this.props.Login.masterData.lstTemplateMasterlevel) {
                    sortData(this.props.Login.masterData.lstTemplateMasterlevel, "ascending", "nlevelno")
                }

                selectedValues["ncategorycode"] = this.props.Login.masterData.selectedValues ? this.props.Login.masterData.selectedValues["ncategorycode"] :
                    Taglstcategory.length > 0 ? Taglstcategory[0].item[categoryValuemember] : -2;

                selectedValues["nformcode"] = this.props.Login.masterData.selectedValues ? this.props.Login.masterData.selectedValues["nformcode"] : Taglstcategory.length > 0 ?
                    Taglstcategory[0].item["nformcode"] : -2;

                // selectedValues["nsampletypecode"] = TaglstSampleType.length > 0 ?
                //     TaglstSampleType[0].item["nsampletypecode"] : this.props.Login.masterData.selectedValues
                //         ? this.props.Login.masterData.selectedValues["nsampletypecode"] : -2;

                selectedValues["nsampletypecode"] = this.props.Login.masterData.SelectedSample !== null ? 
                this.props.Login.masterData.SelectedSample.nsampletypecode : this.props.Login.masterData.selectedValues
                            ? this.props.Login.masterData.selectedValues && this.props.Login.masterData.selectedValues["nsampletypecode"] : -2

                filterSelectedRecord["categroyLable"] = categroyLable;
                filterSelectedRecord["categoryValuemember"] = categoryValuemember;
                filterSelectedRecord["categoryDisplaymemeber"] = categoryDisplaymemeber;
                filterSelectedRecord["sampletype"] = {label:this.props.Login.masterData.SelectedSample.ssampletypename,
                                                      value: this.props.Login.masterData.SelectedSample.nsampletypecode, 
                                                      item: this.props.Login.masterData.SelectedSample};//TaglstSampleType[0];
               // filterSelectedRecord["categorytype"] = Taglstcategory[0];
               if(this.props.Login.masterData.SelectedCategory !== null)
               {
                    filterSelectedRecord["categorytype"] ={label:this.props.Login.masterData.SelectedCategory[categoryDisplaymemeber],
                    value: this.props.Login.masterData.SelectedCategory[categoryValuemember], 
                    item: this.props.Login.masterData.SelectedCategory};
               }
                
                filterSelectedRecord["masterData"] = this.props.Login.masterData;
                this.setState({
                    TaglstSampleType, Taglstcategory,
                    filterSelectedRecord,
                    userRoleControlRights: userRoleControlRights ? userRoleControlRights : this.state.userRoleControlRights,
                    controlMap: controlMap ? controlMap : this.state.controlMap
                });
            }
        }
        else {
            if (this.props.Login.masterData.lstcategory !== previousProps.Login.masterData.lstcategory) {
                this.setState({ Taglstcategory: this.props.Login.Taglstcategory })
            }
        }

    }

    // componentDidUpdate1(previousProps) {
    //     if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
    //         this.setState({ selectedRecord: this.props.Login.selectedRecord });
    //     }
    //     if (this.props.Login.masterData !== previousProps.Login.masterData) {
    //         // if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
    //         //     this.setState({ selectedRecord: this.props.Login.selectedRecord });
    //         // }
    //         const userRoleControlRights = this.state.userRoleControlRights || [];
    //         let controlMap = this.state.controlMap || {};
    //         let selectedRecord = this.state.selectedRecord || {};

    //         if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
    //             if (this.props.Login.userRoleControlRights) {
    //                 this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
    //                     userRoleControlRights.push(item.ncontrolcode))
    //             }
    //             controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)

    //             // selectedRecord["defaultsampletype"] =  this.props.Login.masterData && this.props.Login.masterData.defaultsampletype ? this.props.Login.masterData.defaultsampletype : TaglstSampleType ? {
    //             //     "value": TaglstSampleType.get("OptionList")[0].item["nsampletypecode"],
    //             //     "label": TaglstSampleType.get("OptionList")[0].item["ssampletypename"]
    //             // } : "";

    //             // selectedRecord["defaultCatogoryType"] = this.props.Login.masterData && this.props.Login.masterData.defaultCatogoryType && this.props.Login.masterData.defaultCatogoryType !== "" ?
    //             //                 this.props.Login.masterData.defaultCatogoryType : Taglstcategory ? Taglstcategory.get("OptionList").length > 0 ? {
    //             //                     "value": Taglstcategory.get("OptionList")[0].item[categoryValuemember],
    //             //                     "label": Taglstcategory.get("OptionList")[0].item[categoryDisplaymemeber]
    //             //                 } : "" : "";
    //         }
    //        // const selectedRecord = {}; 
    //         const selectedInput = {}; const selectedValues = {};
    //         const categroyLable = this.props.Login.masterData.categroyLable ? this.props.Login.masterData.categroyLable : this.props.Login.masterData.lstcategory ? Object.keys(this.props.Login.masterData.lstcategory)[0] : "";
    //         const categoryValuemember = this.props.Login.masterData.categoryValuemember ? this.props.Login.masterData.categoryValuemember : this.props.Login.masterData.lstcategory ? Object.keys(this.props.Login.masterData.lstcategory[categroyLable][0])[0] : "";
    //         const categoryDisplaymemeber = this.props.Login.masterData.categoryDisplaymemeber ? this.props.Login.masterData.categoryDisplaymemeber : this.props.Login.masterData.lstcategory ? Object.keys(this.props.Login.masterData.lstcategory[categroyLable][0])[1] : "";

    //         selectedRecord["ntransactionstatus"] = this.props.Login.masterData.lstTemplateMasterlevel ? this.props.Login.masterData.lstTemplateMasterlevel.length > 0 ?
    //             this.props.Login.masterData.lstTemplateMasterlevel[0]["ntransactionstatus"] :
    //             this.props.Login.selectedRecord ? this.props.Login.selectedRecord["ntransactionstatus"] : [] : [];

    //         let TaglstSampleType;
    //         let Taglstcategory;
    //         if (this.props.Login.masterData.lstSampleType && !this.props.Login.masterData.lstSampleType[0].item) {
    //             TaglstSampleType = constructOptionList(this.props.Login.masterData.lstSampleType || [], "nsampletypecode",
    //                 "ssampletypename", "nsampletypecode", "ascending", undefined);
    //         }
    //         if (this.props.Login.masterData.lstcategory && this.props.Login.masterData.lstcategory[categroyLable]) {
    //             Taglstcategory = this.props.Login.masterData.lstcategory[categroyLable] ? constructOptionList(this.props.Login.masterData.lstcategory[categroyLable]
    //                 || [], categoryValuemember, categoryDisplaymemeber, categoryValuemember, "ascending", undefined) : this.props.Login.masterData.lstcategory;
    //         }
    //         if (this.props.Login.masterData.lstTemplateMasterlevel) {
    //             sortData(this.props.Login.masterData.lstTemplateMasterlevel, "ascending", "nlevelno")
    //         }

    //         selectedValues["ncategorycode"] = this.props.Login.masterData.selectedValues ? this.props.Login.masterData.selectedValues["ncategorycode"] : Taglstcategory ?
    //             Taglstcategory.get("OptionList")[0].item[categoryValuemember] : -2;

    //         selectedValues["nformcode"] = this.props.Login.masterData.selectedValues ? this.props.Login.masterData.selectedValues["nformcode"] : Taglstcategory ?
    //             Taglstcategory.get("OptionList")[0].item["nformcode"] : -2;

    //         selectedValues["nsampletypecode"] = TaglstSampleType ? TaglstSampleType.get("OptionList").length > 0
    //             ? TaglstSampleType.get("OptionList")[0].item["nsampletypecode"] : this.props.Login.masterData.selectedValues
    //                 ? this.props.Login.masterData.selectedValues["nsampletypecode"] : -2 : this.props.Login.masterData.selectedValues ? this.props.Login.masterData.selectedValues["nsampletypecode"] : -2;


    //             // selectedRecord["defaultsampletype"] = this.state.selectedRecord ?  this.state.selectedRecord.defaultsampletype 
    //             //         : this.props.Login.masterData.defaultsampletype ? this.props.Login.masterData.defaultsampletype : TaglstSampleType ? {
    //             //     "value": TaglstSampleType.get("OptionList")[0].item["nsampletypecode"],
    //             //     "label": TaglstSampleType.get("OptionList")[0].item["ssampletypename"], item:TaglstSampleType.get("OptionList")[0]
    //             // } : "";

    //             // selectedRecord["defaultCatogoryType"] = this.state.selectedRecord ?  this.state.selectedRecord.defaultCatogoryType 
    //             // : this.props.Login.masterData.defaultCatogoryType && this.props.Login.masterData.defaultCatogoryType !== "" ?
    //             //                 this.props.Login.masterData.defaultCatogoryType : Taglstcategory ? Taglstcategory.get("OptionList").length > 0 ? {
    //             //                     "value": Taglstcategory.get("OptionList")[0].item[categoryValuemember],
    //             //                     "label": Taglstcategory.get("OptionList")[0].item[categoryDisplaymemeber], item: Taglstcategory.get("OptionList")[0]
    //             //                 } : "" : "";
    //         let openModal = false;
    //         this.props.Login.masterData["lstcategory"] = Taglstcategory ? Taglstcategory.get("OptionList") : this.props.Login.masterData.lstcategory;
    //         this.props.Login.masterData["lstTreeversionTemplate"] = this.props.Login.masterData.lstTreeversionTemplate ? this.props.Login.masterData.lstTreeversionTemplate : this.props.Login.masterData["lstTreeversionTemplate"];
    //         this.props.Login.masterData["lstTemplateMasterlevel"] = this.props.Login.masterData.lstTemplateMasterlevel ? this.props.Login.masterData.lstTemplateMasterlevel : this.props.Login.masterData["lstTemplateMasterlevel"];
    //         this.props.Login.masterData["selected"] = this.props.Login.masterData["selectedTempVersion"] ? this.props.Login.masterData["selectedTempVersion"] :
    //             this.props.Login.masterData["selected"];
    //        // this.props.Login.masterData["selectedValues"] = selectedValues;
    //         this.props.Login.masterData["defaultCatogoryType"] = this.props.Login.masterData.defaultCatogoryType 
    //              && this.props.Login.masterData.defaultCatogoryType !== "" ?
    //             this.props.Login.masterData.defaultCatogoryType : Taglstcategory ? Taglstcategory.get("OptionList").length > 0 ? {
    //                 "value": Taglstcategory.get("OptionList")[0].item[categoryValuemember],
    //                 "label": Taglstcategory.get("OptionList")[0].item[categoryDisplaymemeber],
    //                 "item": Taglstcategory.get("OptionList")[0].item
    //             } : "" : "";
    //         this.props.Login.masterData["categroyLable"] = categroyLable;
    //         this.props.Login.masterData["categoryValuemember"] = categoryValuemember;
    //         this.props.Login.masterData["categoryDisplaymemeber"] = categoryDisplaymemeber;
    //         this.props.Login.masterData["lstSampleType"] = TaglstSampleType ? TaglstSampleType.get("OptionList") : this.props.Login.masterData.lstSampleType ? this.props.Login.masterData.lstSampleType : -2;
    //         this.props.Login.masterData["defaultsampletype"] = this.props.Login.masterData.defaultsampletype ? this.props.Login.masterData.defaultsampletype : TaglstSampleType ? {
    //             "value": TaglstSampleType.get("OptionList")[0].item["nsampletypecode"],
    //             "label": TaglstSampleType.get("OptionList")[0].item["ssampletypename"],
    //             "item": TaglstSampleType.get("OptionList")[0].item
    //         } : -2;



    //         //let filterData = this.generateBreadCrumData();
    //         this.setState({//filterData,
    //             selectedRecord, userRoleControlRights: userRoleControlRights ? userRoleControlRights : this.state.userRoleControlRights,
    //             controlMap: controlMap ? controlMap : this.state.controlMap,
    //             selected: this.props.Login.masterData.lstTreeversionTemplate ? this.props.Login.masterData.lstTreeversionTemplate.length > 0 ?
    //                 this.props.Login.masterData.lstTreeversionTemplate[0] : {} : this.state.selected,
    //             selectedSampleType: TaglstSampleType ? TaglstSampleType.get("OptionList")[0]["nsampletypecode"] : this.state.selectedSampleType,

    //         });

    //         const updateInfo = {
    //             typeName: DEFAULT_RETURN,
    //             data: { openModal, masterData: this.props.Login.masterData, selectedRecord, selectedInput }
    //         }
    //         this.props.updateStore(updateInfo);
    //     }
    // }

    generateBreadCrumData() {
        const breadCrumbData = [];
        if (this.props.Login.masterData) {

            breadCrumbData.push(
                {
                    "label": "IDS_SAMPLETYPE",
                    // "value": this.props.Login.masterData.defaultsampletype && this.props.Login.masterData.defaultsampletype.label || '-';
                    "value": (this.props.Login.masterData.SelectedSample && this.props.Login.masterData.SelectedSample.ssampletypename) || '-'
                },
                {
                    // "label": this.props.Login.genericLabel ? this.props.Login.genericLabel["ProductCategory"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] : "IDS_PRODUCTCATEGORY",
                    "label": (
                        // ALPD-5412 Modified by Vishakh for Breadcrumb issue
                        this.props.Login.breadCrumbCategroyLabel !== undefined ? this.props.Login.breadCrumbCategroyLabel : 
                        this.props.Login.genericLabel ? this.props.Login.genericLabel["ProductCategory"]["jsondata"]["sdisplayname"][this.props.Login.userInfo.slanguagetypecode] : "IDS_PRODUCTCATEGORY"
                    ),
                    //  "value": this.props.Login.masterData.defaultCatogoryType && this.props.Login.masterData.defaultCatogoryType.label || '-'
                    "value": ( this.props.Login.masterData.SelectedCategory && this.props.Login.masterData.SelectedCategory[this.props.Login.masterData.SelectedCategoryFilterValueLabel]) || '-'
                }
            );
        }
        return breadCrumbData;
    }

    static getDerivedStateFromProps(props, state) {
        if (props.Login.masterStatus !== "") {
            if (props.Login.errorCode === 417 || props.Login.errorCode === 409) {
                toast.warn(props.Login.masterStatus);
                props.Login.masterStatus = "";
               // props.Login.openModal = false;
            }
        }
        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
            props.Login.openModal = false;
        }
        if (!props.Login.loadEsign) {
            return { selectedRecord: { ...state.selectedRecord , esigncomments: '', esignpassword: '' } }
        }
        return null;
    }

    componentWillUnmount() {
        const updateInfo = {
            typeName: DEFAULT_RETURN,
            data: {
                masterData: [], inputParam: undefined, breadCrumbCategroyLabel: undefined   // ALPD-5412 Added by Vishakh for Breadcrumb issue
            }
        }
        this.props.updateStore(updateInfo);
    }
}

const mapStatetoProps = (state) => {
    return {
        Login: state.Login
    }
}
export default connect(mapStatetoProps, {
    callService, crudMaster, updateStore, addModel,
    fetchRecordByTemplateID, getTemplateMasterTree, validateEsignCredential, filterColumnData,
    getSampleTypeProductCategory, getStudyTemplateByCategoryType
})(injectIntl(templatemaster));



