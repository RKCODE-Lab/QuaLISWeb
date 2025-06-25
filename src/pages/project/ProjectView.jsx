import React, { Component } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { connect } from "react-redux";
import { toast } from "react-toastify";
import { injectIntl } from "react-intl";
import {
  callService, crudMaster, validateEsignCredential, updateStore, changeSampleTypeFilter, filterColumnData,
  viewAttachment, addProjectMaster, getProjectView, getProjectmasterAddMemberService, addProjectMasterFile, getuserComboServices
} from "../../actions";

import ListMaster from "../../components/list-master/list-master.component";
import { transactionStatus } from "../../components/Enumeration";
import { DEFAULT_RETURN } from "../../actions/LoginTypes";

import { getControlMap, constructOptionList }
  from "../../components/CommonScript"
import { ContentPanel } from "../../components/App.styles";
import { process } from "@progress/kendo-data-query";
import ConfirmMessage from "../../components/confirm-alert/confirm-message.component";
import BreadcrumbComponent from "../../components/Breadcrumb.Component";
import { Affix } from "rsuite";
import { intl } from "../../components/App";
import ProjectViewFilter from "../../pages/project/ProjectViewFilter";
import DataGrid from '../../components/data-grid/data-grid.component';
import { convertDateValuetoString,formatInputDate } from '../../components/CommonScript';
import ViewInfoDetails from "../../components/ViewInfoDetails";
import SlideOutModal from "../../components/slide-out-modal/SlideOutModal";


const mapStateToProps = (state) => {
  return { Login: state.Login };
};

class ProjectView extends Component {
  constructor(props) {
    super(props);
    const dataState = { skip: 0, take: 10 };
    this.state = {
      selectedRecord: {},
      error: "",
      userRoleControlRights: [],
      selectedProjectView: undefined,
      controlMap: new Map(),
      Instrument: [],
      dataState: dataState,
      dataResult: [], data: [],
      childListMap: [],
      sidebarview: false
    };
    this.searchRef = React.createRef();
    this.searchFieldList = ["sprojectcode", "sprojecttitle", "ncost", "sprojecttypename", "stransdisplaystatus","sprojectname","sclientname"]
    this.confirmMessage = new ConfirmMessage();
  }
  sidebarExpandCollapse = () => {
      this.setState({
          sidebarview: true
      })          
  }

  handleDateChange = (dateName, dateValue) => {
    const { selectedRecord } = this.state;
    selectedRecord[dateName] = dateValue;
    this.setState({ selectedRecord });
  };



  // onInputOnChange = (event, optional) => {
  //   const selectedRecord = this.state.selectedRecord || {};
  //   if (event.target.type === "checkbox") {
  //     selectedRecord[event.target.name] = event.target.checked === true ? 3 : 4;
  //   } else if (event.target.type === 'radio') {
  //     selectedRecord[event.target.name] = optional;
  //   } else {
  //     selectedRecord[event.target.name] = event.target.value;
  //   }
  //   this.setState({ selectedRecord });
  // };


  static getDerivedStateFromProps(props, state) {
    if (props.Login.masterStatus !== "") {
      if (props.Login.errorCode === 417 || props.Login.errorCode === 409) {
        toast.warn(props.Login.masterStatus);
        props.Login.masterStatus = "";
      }
    }
    if (props.Login.error !== state.error) {
      toast.error(props.Login.error);
      props.Login.error = "";
    }
    if (props.Login.selectedRecord === undefined) {
      return { selectedRecord: {} };
    }
    return null;
  }


  render() {


    let versionStatusCSS = "outline-secondary";
    let activeIconCSS = "fa fa-check"


    if (this.props.Login.masterData.SelectedProjectView && this.props.Login.masterData.SelectedProjectView.ntransactionstatus === transactionStatus.APPROVED) {
      versionStatusCSS = "outline-success";
    }
    else if (this.props.Login.masterData.SelectedProjectView && ((this.props.Login.masterData.SelectedProjectView.ntransactionstatus === transactionStatus.RETIRED) || (this.props.Login.masterData.SelectedProjectView.ntransactionstatus === transactionStatus.CLOSED))) {
      versionStatusCSS = "outline-danger";
      activeIconCSS = "";
    }


    // if (this.props.Login.openModal) {
    //   this.mandatoryFields = this.findMandatoryFields(this.props.Login.screenName, this.state.selectedRecord, this.props.Login.operation)
    // }

    //console.log("master main", this.props.Login.masterData);
    // let mandatoryFields = [];
    //const { userInfo } = this.props.Login;



    // const { SelectedProjectView } = this.props.Login.masterData;
    // const selectedMaster = this.props.Login.masterData.SelectedProjectView;
    const selectedProjectView = this.props.Login.masterData.SelectedProjectView;
    const viewProjectId = this.state.controlMap.has("View") && this.state.controlMap.get("View").ncontrolcode;

    this.extractedColumnList = [
      { "idsName": "IDS_ARNO", "dataField": "sarno", "width": "150px" },
      { "idsName": "IDS_SAMPLETYPE", "dataField": "sproductname", "width": "150px" },
      { "idsName": "IDS_REGISTRATIONTYPE", "dataField": "sregtypename", "width": "200px" },
      { "idsName": "IDS_REGISTRATIONSUBTYPE", "dataField": "sregsubtypename", "width": "200px" },
      { "idsName": "IDS_TRANSACTIONSTATUS", "dataField": "stransdisplaystatus", "width": "200px" },

    ]

    let obj = convertDateValuetoString(this.state.selectedRecord["fromdate"] || (this.props.Login.masterData && this.props.Login.masterData.FromDate),
            this.state.selectedRecord["todate"] || (this.props.Login.masterData && this.props.Login.masterData.ToDate),
            this.props.Login.userInfo)

        let fromDate = obj.fromDate;
        let toDate = obj.toDate;

    const filterParam = {
      inputListName: "ProjectView",
      selectedObject: "SelectedProjectView",
      primaryKeyField: "nprojectmastercode",
      fetchUrl: "projectview/getActiveProjectViewById",
      fecthInputObject: { userinfo: this.props.Login.userInfo, nsampletypecode: this.props.Login.masterData.SelectedSampleType && this.props.Login.masterData.SelectedSampleType.nsampletypecode },
      masterData: this.props.Login.masterData,
      searchFieldList: this.searchFieldList,


    };
    const breadCrumbData = this.state.filterData || [];
    return (
      <>
        <div className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
          {breadCrumbData.length > 0 ? (
            <Affix top={53}>
              <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
            </Affix>
          ) : (
            ""
          )}
          <Row noGutters={true}>
            <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
              <ListMaster
                screenName={this.props.intl.formatMessage({ id: "IDS_PROJECTVIEW" })}
                masterData={this.props.Login.masterData}
                userInfo={this.props.Login.userInfo}
                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.ProjectView}
                getMasterDetail={(ProjectViewdata) => this.props.getProjectView(ProjectViewdata, this.props.Login.userInfo, this.props.Login.masterData)}
                selectedMaster={selectedProjectView}
                primaryKeyField="nprojectmastercode"
                mainField="sprojecttitle"
                firstField="sprojectcode"
                secondField="sprojecttypename"
                filterColumnData={this.props.filterColumnData}
                filterParam={filterParam}
                userRoleControlRights={this.state.userRoleControlRights}
                searchRef={this.searchRef}
                reloadData={this.reloadData}
                isMultiSelecct={false}
                hidePaging={false}
                isClearSearch={this.props.Login.isClearSearch}

                openFilter={this.openFilter}
                closeFilter={this.closeFilter}
                onFilterSubmit={this.onFilterSubmit}
                showFilterIcon={true}
                showFilter={this.props.Login.showFilter}
                filterComponent={[
                  {
                    "IDS_PROJECTVIEWFILTER":
                      <ProjectViewFilter
                        filterSampleType={this.state.ProjectViewFilterList || []}
                        nfilterSampleType={this.props.Login.masterData.SelectedSampleType || {}}
                        handleDateChange={this.handleDateChange}
                        fromDate={fromDate}
                        toDate={toDate}
                        userInfo={this.props.Login.userInfo}
                        filterProjectType={this.state.ProjectTypeFilterList || []}
                        nfilterProjectType={this.props.Login.masterData.SelectedProjectType || {}}
                        onComboChange={this.onComboChange}
                        selectedRecord={this.state.selectedRecordfilter || {}}
                      // selectedRecord1={this.state.selectedRecordfilter1 || {}}
                        // onFilterChange={this.onFilterChange}
                        handleFilterDateChange={this.handleFilterDateChange}

                      />
                  }
                ]}

              />
            </Col>
            <Col md={`${!this.props.sidebarview ? '8' : "10"}`} className="position-relative">
                <div className="sidebar-view-btn-block">
                    <div className="sidebar-view-btn " onClick={this.props.parentFunction}>
                        {!this.props.sidebarview ?                    
                            <i class="fa fa-less-than"></i> :
                            <i class="fa fa-greater-than"></i> 
                        }
                    </div>
                </div>
              {selectedProjectView ?
                <ContentPanel className="panel-main-content">
                  <Card className="border-0">
                    <Card.Header>
                      <Card.Title className="product-title-main">
                        {this.props.intl.formatMessage({ id: "IDS_TOTALCOST" }) + " : " + selectedProjectView.ncost}
                      </Card.Title>
                      <Card.Subtitle>
                        <div className="d-flex product-category">
                          <h2 className="product-title-sub flex-grow-1">
                            <span className={`btn btn-outlined ${versionStatusCSS} btn-sm ml-3`}>
                              {/* <i class={activeIconCSS}></i> */}
                              {selectedProjectView.stransdisplaystatus}
                            </span>
                          </h2>
                          <div className="d-inline">

                          <ViewInfoDetails 
                                selectedObject ={this.props.Login.masterData.SelectedProjectView}
                                screenHiddenDetails={this.state.userRoleControlRights.indexOf(viewProjectId) === -1}
                                screenName={this.props.Login.screenName}
                                dataTip={this.props.intl.formatMessage({ id: "IDS_VIEW" })}
                                rowList={[
                                  [
                                    {dataField:"sprojecttitle", idsName:"IDS_PROJECTTITLE"},                                    
                                    {dataField:"sprojectdescription", idsName:"IDS_PROJECTDESCRIPTION"}                     
                                  ],
                                  [
                                    {dataField:"sprojectname", idsName:"IDS_PROJECTNAME"},
                                    {dataField: "sclientname", idsName: "IDS_CLIENT"}                
                                  ],
                                  [
                                    {dataField:"sprojectcode", idsName:"IDS_PROJECTCODE"},
                                    {dataField: "stransdisplaystatus", idsName: "IDS_PROJECTSTATUS"}            
                                  ],
                                  [                        
                                    {dataField:"sprojectstartdate", idsName:"IDS_PROJECTSTARTDATE"},
                                    {dataField:"sexpectcompletiondate", idsName:"IDS_PROJECTCOMPLETIONDATE"}                
                                  ]
                                                   
                                ]}
                            />
                          </div>
                        </div>
                      </Card.Subtitle>
                    </Card.Header>
                    <Card.Body className="form-static-wrap">

                      {/* <Col md={12}>
                        <div className="horizontal-line"></div>
                      </Col> */}
                      <Row noGutters>
                        <Col md={12}>
                          <DataGrid
                            expandField="expanded"
                            handleExpandChange={this.handleExpandChange}
                            dataResult={this.props.Login.masterData.ParentProjectView && process(
                              this.props.Login.masterData.ParentProjectView || [],
                              this.state.dataState ? this.state.dataState : { skip: 0, take: 10 }
                            )}
                            // dataResult={this.state.dataResult}
                            dataState={this.state.dataState
                              ? this.state.dataState : { skip: 0, take: 10 }}
                            // dataState={this.state.dataState}
                            dataStateChange={this.dataStateChange}
                            extractedColumnList={this.extractedColumnList}
                            controlMap={this.state.controlMap}
                            userRoleControlRights={this.state.userRoleControlRights}
                            pageable={true}
                            scrollable={'scrollable'}
                            hideColumnFilter={false}
                            selectedId={0}
                            hasChild={true}
                            childMappingField={'npreregno'}
                            childColumnList={[
                              { "idsName": "IDS_SAMPLEARNO", "dataField": "ssamplearno", "width": "250px" },
                              { "idsName": "IDS_TESTNAME", "dataField": "stestsynonym", "width": "250px" },
                              { "idsName": "IDS_COST", "dataField": "ncost", "width": "100px" },
                              { "idsName": "IDS_TRANSACTIONSTATUS", "dataField": "stransdisplaystatus", "width": "200px" },


                            ]}
                            childList={this.state.childListMap}
                            gridHeight={'600px'}
                            isActionRequired={false}
                          //  actionColWidth={'250px'}   
                          //  gridWidth={'800px'}
                          />
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </ContentPanel>
                : ""
              }
            </Col>
          </Row>


        </div>

      {/* {this.props.Login.openModal &&
        <SlideOutModal
        show={this.props.Login.openModal}
        size={this.props.Login.modalScreenSize===true ? "xl" : "lg" }
        closeModal={this.closeModal}
        hideSave={this.props.Login.screenName ===  "IDS_VIEW" ? true :  false}
        operation={( this.props.Login.screenName === "IDS_VIEW") ? "" :  this.props.Login.operation}
        inputParam={this.props.Login.inputParam}
        screenName={this.props.Login.screenName}
        onSaveClick={this.onSaveClick}
        esign={this.props.Login.loadEsign}
        validateEsign={this.validateEsign}
        selectedRecord={this.state.selectedRecord || {}} 
        addcomponent = {this.props.Login.screenName === "IDS_VIEW" ?
        <AddQuotationPreview

                selectedQuotation ={this.props.Login.masterData.SelectedQuotation}
                userInfo={this.props.Login.userInfo}
                genericlabel={this.props.Login.genericLabel}
              ></AddQuotationPreview> : ""
      }
        />
      } */}
      </>
    );
  }

  handleExpandChange = () => {

    let childListMap = new Map();
    let keylst = this.props.Login.masterData.ChildProjectView.map(key => key.npreregno);

    keylst.map((key, i) => {
      let ChildProjectView = this.props.Login.masterData.ChildProjectView;

      ChildProjectView = ChildProjectView.filter(x => x['npreregno'] === key);
      childListMap.set(parseInt(key), ChildProjectView);
    })
    this.setState({ childListMap })

  };

  onComboChange = (comboData, fieldName, caseNo) => {

    const selectedRecord = this.state.selectedRecord || {};
    switch (caseNo) {

      case 2:
        const selectedRecordfilter = this.state.selectedRecordfilter || {};
        selectedRecordfilter[fieldName] = comboData;
        this.setState({ selectedRecordfilter });
        break;

      case 3:

        selectedRecord[fieldName] = comboData;
        this.setState({ selectedRecord });
        break;

      default:
        break;
    }
  }



  // onInputOnChange = (event, optional) => {
  //   const selectedRecord = this.state.selectedRecord || {};
  //   if (event.target.type === 'checkbox') {
  //     if (event.target.name === "ntransactionstatus")
  //       selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.ACTIVE : transactionStatus.DEACTIVE;
  //     // else if (event.target.name === "nlockmode")
  //     //     selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.UNLOCK : transactionStatus.LOCK;
  //     else
  //       selectedRecord[event.target.name] = event.target.checked === true ? transactionStatus.YES : transactionStatus.NO;
  //   }
  //   else if (event.target.type === 'radio') {
  //     selectedRecord[event.target.name] = optional;
  //   }
  //   else {
  //     selectedRecord[event.target.name] = event.target.value;
  //   }
  //   this.setState({ selectedRecord });
  // }




  // onTabChange = (tabProps) => {
  //   const screenName = tabProps.screenName;
  //   const updateInfo = {
  //     typeName: DEFAULT_RETURN,
  //     data: { screenName },
  //   };
  //   this.props.updateStore(updateInfo);
  // };



  dataStateChange = (event) => {
    this.setState({
      dataResult: process(this.state.data, event.dataState),
      dataState: event.dataState
    });
  }


  ConfirmDelete = (selectedProjectView, operation, deleteId, screenName) => {
    this.confirmMessage.confirm(
      "deleteMessage",
      this.props.intl.formatMessage({ id: "IDS_DELETE" }),
      this.props.intl.formatMessage({ id: "IDS_DEFAULTCONFIRMMSG" }),
      this.props.intl.formatMessage({ id: "IDS_OK" }),
      this.props.intl.formatMessage({ id: "IDS_CANCEL" }),
      () =>
        this.DeleteProjectMaster(
          screenName,
          selectedProjectView,
          operation,
          deleteId

        )
    );
  };



  reloadData = (onFilterSubmit) => {
    this.searchRef.current.value = "";

    // if (Object.values(this.state.selectedRecordfilter.nsampletypecodevalue).length && this.state.selectedRecordfilter.nsampletypecodevalue !== undefined) {
    // if ( this.props.Login.masterData.SelectedSampleType !== undefined) {
    let fromDate = this.props.Login.masterData.FromDate;
    let toDate = this.props.Login.masterData.ToDate;
    if(onFilterSubmit){
      let selectedRecord = this.state.selectedRecord || {};
      if (selectedRecord && selectedRecord["fromdate"] !== undefined) {
        fromDate = selectedRecord["fromdate"];
      }
      if (selectedRecord && selectedRecord["todate"] !== undefined) {
        toDate = selectedRecord["todate"];
      }
    }

    let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo);
    if (this.state.selectedRecordfilter !== undefined) {
      if (this.state.selectedRecordfilter.nsampletypecodevalue !== undefined && this.state.selectedRecordfilter.nprojecttypecodevalue !== "") {
        if (Object.values(this.props.Login.masterData.SelectedSampleType).length && this.props.Login.masterData.SelectedSampleType !== undefined) {
          let inputParam = {
            inputData: {
              nsampletypecode: this.state.selectedRecordfilter.nsampletypecodevalue.value,
              nprojecttypecode: this.state.selectedRecordfilter.nprojecttypecodevalue.value,
              userinfo: this.props.Login.userInfo,
              // nfilterSampleType: this.state.nfilterSampleType,
              nfilterSampleType: this.state.selectedRecordfilter.nsampletypecodevalue,
              fromDate: obj.fromDate,
              toDate: obj.toDate,
              currentdate: null,
            },
            // classUrl: "projectview",
            methodUrl: "ProjectViewBySampleType",
          };
          this.props.changeSampleTypeFilter(
            inputParam,
            this.props.Login.masterData.filterSampleType,this.state.selectedRecordfilter.nsampletypecodevalue
          );
        }
      } else {
        toast.warn(this.props.intl.formatMessage({ id: "IDS_PROJECTTYPENOTAVAILABLE", }));
      }
    } else {
      toast.warn(this.props.intl.formatMessage({ id: "IDS_SAMPLETYPENOTAVAILABLE", }));
    }
  };



  // closeModal = () => {
  //   let loadEsign = this.props.Login.loadEsign;
  //   let openModal = this.props.Login.openModal;
  //   let selectedRecord = this.state.selectedRecord;
  //   //    let selectedRecord = this.state.selectedRecord;
  //   if (this.props.Login.loadEsign) {
  //     if (this.props.Login.operation === "delete" || this.props.Login.operation === "approve" || this.props.Login.operation === "retire") {
  //       loadEsign = false;
  //       openModal = false;
  //       selectedRecord = {};
  //     }
  //     else {
  //       loadEsign = false;
  //       selectedRecord['esignpassword'] = '';
  //       selectedRecord['esigncomments'] = '';
  //       selectedRecord['esignreason'] = '';
  //     }
  //   }
  //   else {
  //     openModal = false;
  //     selectedRecord = {};
  //   }

  //   const updateInfo = {
  //     typeName: DEFAULT_RETURN,
  //     data: { openModal, loadEsign, selectedRecord }
  //   }
  //   this.props.updateStore(updateInfo);

  // }

  componentDidUpdate(previousProps) {
    let updateState = false;
    let {
      selectedRecord,
      selectedRecordfilter,
      userRoleControlRights,
      controlMap,
      filterData,
      nfilterSampleType,
      filterSampleType,
      nfilterProjectType,
      selectedRecordfilter1,


    } = this.state;

    if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
      selectedRecord = this.props.Login.selectedRecord;
      updateState = true;
      this.setState({ selectedRecord, selectedRecordfilter });
    }
    if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
      userRoleControlRights = [];
      if (this.props.Login.userRoleControlRights) {
        this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode
        ] &&
          Object.values(
            this.props.Login.userRoleControlRights[
            this.props.Login.userInfo.nformcode
            ]
          ).map((item) => userRoleControlRights.push(item.ncontrolcode));
      }
      controlMap = getControlMap(
        this.props.Login.userRoleControlRights,
        this.props.Login.userInfo.nformcode
      );
      this.setState({ controlMap, userRoleControlRights });
      //   updateState = true;
    }

    let nsampletypecode = this.state.nfilterSampleType || {};
    let nprojecttypecode = this.state.nfilterProjectType || {};

    if (this.props.Login.masterData !== previousProps.Login.masterData) {
      if (this.props.Login.masterData.filterProjectType !== previousProps.Login.masterData.filterProjectType) {
      nfilterSampleType = this.state.nfilterSampleType || {};

      const filterSampleType = constructOptionList(this.props.Login.masterData.filterSampleType || [], "nsampletypecode",
        "ssampletypename", undefined, undefined, undefined);

      let ProjectViewFilterList = filterSampleType.get("OptionList");
      nsampletypecode = ProjectViewFilterList[0];
      selectedRecordfilter = { nsampletypecodevalue: nsampletypecode }
      selectedRecord = { nsampletypecodevalue: nsampletypecode }

      const filterProjectType = constructOptionList(this.props.Login.masterData.filterProjectType || [], "nprojecttypecode",
        "sprojecttypename", undefined, undefined, undefined);

      let ProjectTypeFilterList = filterProjectType.get("OptionList");
      nprojecttypecode = ProjectTypeFilterList[0];
      selectedRecordfilter = { ...selectedRecordfilter, nprojecttypecodevalue: nprojecttypecode }
      selectedRecord = { ...selectedRecord, nprojecttypecodevalue: nprojecttypecode }

      this.setState({
        ProjectViewFilterList, ProjectTypeFilterList,
        selectedRecordfilter, selectedRecord, data: this.props.Login.masterData.ParentProjectView,
        dataResult: process(this.props.Login.masterData.ParentProjectView || [], this.state.dataState)
      });
    }

      if (this.props.Login.masterData.SelectedSampleType && this.props.Login.masterData.SelectedSampleType !== previousProps.Login.masterData.SelectedSampleType) {
        nfilterSampleType = {
          label: this.props.Login.masterData.SelectedSampleType.ssampletypename,
          value: this.props.Login.masterData.SelectedSampleType.nsampletypecode,
          item: this.props.Login.masterData.SelectedSampleType,
        };
      }

      if (this.props.Login.masterData.SelectedProjectType && this.props.Login.masterData.SelectedProjectType !== previousProps.Login.masterData.SelectedProjectType) {
        nfilterProjectType = {
          label: this.props.Login.masterData.SelectedProjectType.sprojecttypename,
          value: this.props.Login.masterData.SelectedProjectType.nprojecttypecode,
          item: this.props.Login.masterData.SelectedProjectType,
        };
      }
      //  selectedRecordfilter = {nsampletypecodevalue:nfilterSampleType}
      filterData = this.generateBreadCrumData();
      updateState = true;
      this.setState({ filterData, selectedRecordfilter });
    }


    if (this.props.Login.masterData.SelectedSampleType !== previousProps.Login.masterData.SelectedSampleType) {

      let nsampletypecodevalue = this.props.Login.masterData.SelectedSampleType ?
        {
          label: this.props.Login.masterData.SelectedSampleType.ssampletypename,
          value: this.props.Login.masterData.SelectedSampleType.nsampletypecode,
          item: this.props.Login.masterData.SelectedSampleType
        } : ""
      //  nsampletypecode=ProjectViewFilterList[ProjectViewFilterList.length-1];
      selectedRecordfilter = { ...selectedRecordfilter, nsampletypecodevalue }
      selectedRecord = { ...selectedRecord, nsampletypecodevalue: nsampletypecode }
      // nfilterSampleType = this.props.Login.masterData.nfilterSampleType;
      this.setState({
        selectedRecordfilter, selectedRecord

      });

    }
    ////
    if (this.props.Login.masterData.SelectedProjectType !== previousProps.Login.masterData.SelectedProjectType) {

      let nprojecttypecodevalue = this.props.Login.masterData.SelectedProjectType ?
        {
          label: this.props.Login.masterData.SelectedProjectType.sprojecttypename,
          value: this.props.Login.masterData.SelectedProjectType.nprojecttypecode,
          item: this.props.Login.masterData.SelectedProjectType
        } : ""
      //  nsampletypecode=ProjectViewFilterList[ProjectViewFilterList.length-1];
      selectedRecordfilter = { ...selectedRecordfilter, nprojecttypecodevalue }
      selectedRecord = { ...selectedRecord, nprojecttypecodevalue: nprojecttypecode }
      // nfilterSampleType = this.props.Login.masterData.nfilterSampleType;
      this.setState({
        selectedRecordfilter, selectedRecord

      });

    }
    // if (this.props.Login.masterData.nfilterSampleType !== previousProps.Login.masterData.nfilterSampleType) {

    // }

  }
  generateBreadCrumData() {
    const breadCrumbData = [];
    if (this.props.Login.masterData && this.props.Login.masterData.FromDate ) {
      let obj = convertDateValuetoString(this.props.Login.masterData.FromDate,this.props.Login.masterData.ToDate,this.props.Login.userInfo);
      breadCrumbData.push(
        {
          "label": "IDS_FROM",
          "value": obj.breadCrumbFrom
        },
        {
          "label": "IDS_TO",
          "value": obj.breadCrumbto
        })
      }
      if(this.props.Login.masterData&&this.props.Login.masterData.SelectedSampleType){
        breadCrumbData.push(
      {
        label: "IDS_SAMPLETYPE",
        value: this.props.Login.masterData.SelectedSampleType
          ? this.props.Login.masterData.SelectedSampleType.ssampletypename
          : "NA",
      })
    }
    if(this.props.Login.masterData&&this.props.Login.masterData.SelectedProjectType){
      breadCrumbData.push(
        {
          label: "IDS_PROJECTTYPE",
          value: this.props.Login.masterData.SelectedProjectType
            ? this.props.Login.masterData.SelectedProjectType.sprojecttypename
            : "NA",
        });

    } 
    return breadCrumbData;
  }

  openFilter = () => {
    let showFilter = !this.props.Login.showFilter;
    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { showFilter },
    };
    this.props.updateStore(updateInfo);
  };

  closeFilter = () => {
    const updateInfo = {
      typeName: DEFAULT_RETURN,
      data: { showFilter: false },
    };
    this.props.updateStore(updateInfo);
  };

  onFilterSubmit = () => {
    this.reloadData(true);
  //   this.searchRef.current.value = "";

  //   // if (this.state.nfilterSampleType.value) {
  //   // if (this.state.selectedRecord.nsampletypecodevalue.value) {
  //   //if ((this.state.selectedRecord).length>0) {

  //   // if (Object.values(this.state.selectedRecordfilter.nsampletypecodevalue).length && this.state.selectedRecordfilter.nsampletypecodevalue !== undefined) {
  //   let fromDate = this.props.Login.masterData.FromDate;
  //   let toDate = this.props.Login.masterData.ToDate;
  //   let selectedRecord = this.state.selectedRecord || {};
  //   if (selectedRecord && selectedRecord["fromdate"] !== undefined) {
  //     fromDate = selectedRecord["fromdate"];
  //   }
  //   if (selectedRecord && selectedRecord["todate"] !== undefined) {
  //     toDate = selectedRecord["todate"];
  //   }
  //   let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo);

  //   if (this.state.selectedRecordfilter !== undefined) {
  //     if (this.state.selectedRecordfilter.nsampletypecodevalue !== undefined && this.state.selectedRecordfilter.nprojecttypecodevalue !== "") {
  //       let inputParam = {
  //         inputData: {
  //           nsampletypecode: this.state.selectedRecordfilter.nsampletypecodevalue.value,
  //           nprojecttypecode: this.state.selectedRecordfilter.nprojecttypecodevalue.value,
  //           userinfo: this.props.Login.userInfo,
  //           // nfilterSampleType: this.state.nfilterSampleType,
  //           nfilterSampleType: this.state.selectedRecordfilter.nsampletypecodevalue,
  //           fromDate: obj.fromDate,
  //           toDate: obj.toDate,
  //           currentDate: null
  //         },
  //         // classUrl: "projectview",
  //         methodUrl: "ProjectViewBySampleType",
  //       };
  //       this.props.changeSampleTypeFilter(
  //         inputParam,
  //         this.props.Login.masterData.filterSampleType,this.state.selectedRecordfilter.nsampletypecodevalue
  //       );
  //     } else {

  //       toast.warn(this.props.intl.formatMessage({ id: "IDS_PROJECTTYPENOTAVAILABLE", }));

  //     }
  //   } else {

  //     toast.warn(this.props.intl.formatMessage({ id: "IDS_SAMPLETYPENOTAVAILABLE", }));

  //   }
   }
}

export default connect(mapStateToProps, {
  callService,
  crudMaster,
  filterColumnData,
  updateStore,
  validateEsignCredential,
  changeSampleTypeFilter,
  viewAttachment, addProjectMaster, getProjectView, getProjectmasterAddMemberService, addProjectMasterFile, getuserComboServices
})(injectIntl(ProjectView));
