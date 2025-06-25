import React, { Component } from 'react';
import { Row, Col,Card,FormGroup, FormLabel} from 'react-bootstrap';
import { connect } from 'react-redux';
import { injectIntl,FormattedMessage } from 'react-intl';
import { callService,filterColumnData,getUserTechniqueViewDetail,changeUserTechniqueViewFilter,getUserTechniqueViewFilterChange } from '../../../actions';
import ListMaster from '../../../components/list-master/list-master.component';
// import ReactTooltip from 'react-tooltip';
import { convertDateValuetoString, getControlMap,constructOptionList,formatInputDate  } from '../../../components/CommonScript';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import BreadcrumbComponent from '../../../components/Breadcrumb.Component';
import { Affix } from 'rsuite';
import UserTechniqueViewDateFilter from '../../../pages/competencemanagement/trainingusertechniqueview/UserTechniqueViewDateFilter';
import { ReadOnlyText, ContentPanel } from '../../../components/App.styles';
 
const mapStateToProps = state => {
    return ({ Login: state.Login })
}
class UserTechniqueView extends React.Component {

    constructor(props){
        super(props);

        this.state={
            selectedRecord: {},
            userRoleControlRights: [],
            controlMap: new Map()
        }
        this.searchRef = React.createRef();
        this.searchFieldList = ["strainingvenue", "strainingtopic", "strainername","susername"]


    }

    render(){
        let obj = convertDateValuetoString(this.state.selectedRecord["fromdate"] || (this.props.Login.masterData && this.props.Login.masterData.FromDate),
            this.state.selectedRecord["todate"] || (this.props.Login.masterData && this.props.Login.masterData.ToDate),
            this.props.Login.userInfo)

        let fromDate = obj.fromDate;
        let toDate = obj.toDate;

        const filterParam = {
            inputListName: "UserTechniqueView", selectedObject: "SelectedUserTechniqueView", primaryKeyField: "nparticipantcode",
            fetchUrl: "usertechniqueview/getUserTechniqueViewDetails", fecthInputObject: { userinfo: this.props.Login.userInfo }, masterData: this.props.Login.masterData,
            searchFieldList: this.searchFieldList
        };

        let breadCrumbData = this.state.filterData || [];

        return(
            <>
                <div className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
                {breadCrumbData.length > 0 ?
                        <Affix top={53}>
                            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        </Affix> : ""
                }
                {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                    <Row noGutters={true}>
                    <Col md={4}>
                    <ListMaster 
                                searchRef={this.searchRef}
                                screenName={this.props.intl.formatMessage({ id: "IDS_USERTECHNIQUEVIEW" })}
                                userRoleControlRights={this.state.userRoleControlRights}
                                masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.UserTechniqueView}
                                showFilter={this.props.Login.showFilter}
                                showFilterIcon={true}
                                openFilter={this.openFilter}
                                closeFilter={this.closeFilter}
                                onFilterSubmit={this.onFilterSubmit}
                                reloadData={this.reloadData}
                                getMasterDetail={(UserTechniqueView) => this.props.getUserTechniqueViewDetail(UserTechniqueView, this.props.Login.userInfo, this.props.Login.masterData)}
                                selectedMaster={this.props.Login.masterData.SelectedUserTechniqueView}
                                filterColumnData={this.props.filterColumnData}
                                filterParam={filterParam}
                                primaryKeyField="nparticipantcode"
                                mainField="susername"
                                firstField="strainingtopic"
                                secondField="stechniquename"
                                filterComponent={[
                                    {
                                      "IDS_USERTECHNIQUEVIEWFILTER": (
                                        <UserTechniqueViewDateFilter
                                                    selectedRecord={this.state.selectedRecord || {}}
                                                    value={this.state.value || {}}
                                                    handleDateChange={this.handleDateChange}
                                                    fromDate={fromDate}
                                                    toDate={toDate}
                                                    userInfo={this.props.Login.userInfo}
                                                    //onFilterChange={this.onFilterChange}

                                                    filterTechnique={this.state.filterTechnique || []}
                                                    filterUsers={this.state.filterUsers || []}
                                                    onComboChange={this.onComboChange}
                                                    handleFilterDateChange={this.handleFilterDateChange}
                                                    FilterStatusValue={this.props.Login.masterData.FilterStatusValue || {}}
                                                    FilterStatus={this.state.stateFilterStatus || []}


                                                    
                                                  


                                                   
                                                />
                                      ),
                                    },
                                  ]}
                                

                                
                           
                            />
                    </Col>
                    <Col md={8}>
                            <ContentPanel className="panel-main-content">
                                <Card className="border-0">
                                {this.props.Login.masterData.UserTechniqueView && this.props.Login.masterData.UserTechniqueView.length > 0 && this.props.Login.masterData.SelectedUserTechniqueView ?
                                <>
                                   <Card.Header>
                                     <Card.Title>
                                       {this.props.Login.masterData.SelectedUserTechniqueView.susername}

                                     </Card.Title>
                                     <Card.Subtitle>
                                     <div className="d-flex product-category">
                                       <h2 className="product-title-sub flex-grow-1">
                                            
                                       </h2>
                                       
                                     </div>
                                     </Card.Subtitle>
  
                                    </Card.Header>   
                                    <Card.Body className="form-static-wrap">
                                        <Row>
                                            <Col md={4}>
                                            <FormGroup>
                                            <FormLabel><FormattedMessage id="IDS_PARITCIPANTNAME" message="Patient Name" /></FormLabel>
                                            <ReadOnlyText>{this.props.Login.masterData.SelectedUserTechniqueView.susername}</ReadOnlyText>
                                            </FormGroup>
                                            </Col>

                                            <Col md={4}>
                                            <FormGroup>
                                            <FormLabel><FormattedMessage id="IDS_TRAININGTOPIC" message="Training Topic" /></FormLabel>
                                            <ReadOnlyText>{this.props.Login.masterData.SelectedUserTechniqueView.strainingtopic}</ReadOnlyText>
                                            </FormGroup>
                                            </Col>

                                            <Col md={4}>
                                            <FormGroup>
                                            <FormLabel><FormattedMessage id="IDS_TECHNIQUE" message="Technique" /></FormLabel>
                                            <ReadOnlyText>{this.props.Login.masterData.SelectedUserTechniqueView.stechniquename}</ReadOnlyText>
                                            </FormGroup>
                                            </Col>

                                            <Col md={4}>
                                            <FormGroup>
                                            <FormLabel><FormattedMessage id="IDS_TRAINERNAME" message="Trainer Name" /></FormLabel>
                                            <ReadOnlyText>{this.props.Login.masterData.SelectedUserTechniqueView.strainername}</ReadOnlyText>
                                            </FormGroup>
                                            </Col>

                                            <Col md={4}>
                                            <FormGroup>
                                            <FormLabel><FormattedMessage id="IDS_TRAININGVENUE" message="Training Venue" /></FormLabel>
                                            <ReadOnlyText>{this.props.Login.masterData.SelectedUserTechniqueView.strainingvenue}</ReadOnlyText>
                                            </FormGroup>
                                            </Col>
                                        </Row>

                                        


                                    </Card.Body>

                                </>:""
                                }
                                </Card>
                            </ContentPanel>   
                            </Col>
                    </Row>
                    
                </div>
            </>
        )
    }
 
    handleDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }


    onComboChange = (comboData, fieldName) => {
        if(fieldName === "ntechniquecode"){

            const selectedRecord =this.state.selectedRecord || {};
            selectedRecord['ntechniquecode']=comboData;
            this.props.getUserTechniqueViewFilterChange(comboData.item.ntechniquecode, this.props.Login.masterData, this.props.Login.userInfo);
           
        }else if(fieldName === "nusercode"){
            const selectedRecord = this.state.selectedRecord || {};
            selectedRecord["nusercode"] = comboData;
            this.setState({ selectedRecord });

        }
           
          
    }

    onFilterSubmit = () => {
        this.searchRef.current.value = "";
        let fromDate = this.props.Login.masterData.FromDate;
        let toDate = this.props.Login.masterData.ToDate;
        let selectedRecord = this.state.selectedRecord || {};
        if (selectedRecord && selectedRecord["fromdate"] !== undefined) {
            fromDate = selectedRecord["fromdate"];
        }
        if (selectedRecord && selectedRecord["todate"] !== undefined) {
            toDate = selectedRecord["todate"];
        }
        let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo);
        let inputParam = {
            inputData: {
                "userinfo": this.props.Login.userInfo,
                fromDate: obj.fromDate,
                toDate: obj.toDate,
                currentDate: null,
                ntechniquecode: this.state.selectedRecord['ntechniquecode'].value,
                nusercode: this.state.selectedRecord['nusercode'].value,
                userinfo: this.props.Login.userInfo
            },

            classUrl: "usertechniqueview",
            methodUrl: "UserTechniqueByFilter",
            displayName: "IDS_USERTECHNIQUEVIEW",
            userInfo: this.props.Login.userInfo
        };
        this.props.changeUserTechniqueViewFilter(inputParam, this.props.Login.masterData.filterTechnique,this.props.Login.masterData.filterUsers);

    }

    reloadData = () => {
        this.searchRef.current.value = "";
        let fromDate = this.props.Login.masterData.FromDate;
        let toDate = this.props.Login.masterData.ToDate;
            let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo);
            let inputParam = {
                inputData: {

                    userinfo: this.props.Login.userInfo,
                    currentdate: formatInputDate(new Date(), true)
                },
                classUrl: "usertechniqueview",
                methodUrl: "UserTechniqueView",
                userInfo: this.props.Login.userInfo,
                displayName:"IDS_USERTECHNIQUEVIEW"

            };
            this.props.callService(inputParam);
    }

      generateBreadCrumData() {
          const breadCrumbData = [];
          let object =convertDateValuetoString(this.props.Login.masterData.FromDate,this.props.Login.masterData.ToDate,this.props.Login.userInfo)
            breadCrumbData.push(
              {
                    "label":"IDS_FROM",
                    "value":object.breadCrumbFrom
              },
              {
                    "label":"IDS_TO",
                    "value":object.breadCrumbto
              },
              {
                    "label":"IDS_TECHNIQUE",
                    "value": this.props.Login.masterData.SelectedTechnique ? this.props.Login.masterData.SelectedTechnique["stechniquename"]: "NA"
               },
               {
                    "label":"IDS_USER",
                    "value": this.props.Login.masterData.SelectedUsers ? this.props.Login.masterData.SelectedUsers["susername"]: "NA"
               }

         );
          return breadCrumbData;
        }
      

        componentDidUpdate(previousProps) {
            let isComponentUpdated = false;
            let selectedRecord = this.state.selectedRecord || {};
            if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
                selectedRecord = this.props.Login.selectedRecord;
                isComponentUpdated = true;
            }
    
            let userRoleControlRights = this.state.userRoleControlRights || [];
            let controlMap = this.state.controlMap || new Map();
            if (this.props.Login.userInfo && this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const nformCode = this.props.Login.userInfo.nformcode;
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[nformCode] && Object.values(this.props.Login.userRoleControlRights[nformCode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode));
                }
                controlMap = getControlMap(this.props.Login.userRoleControlRights, nformCode);
                isComponentUpdated = true;
            }
            let filterTechnique = this.state.filterTechnique || {};
            let filterUsers = this.state.filterUsers || {};
    
           

            if (this.props.Login.masterData.filterTechnique !== previousProps.Login.masterData.filterTechnique) {
                const trainingupdateMap = constructOptionList(this.props.Login.masterData.filterTechnique || [], "ntechniquecode",
                                          "stechniquename", 'ntechniquecode', 'ascending', false);
              filterTechnique = trainingupdateMap.get("OptionList");

               
              selectedRecord['ntechniquecode']= this.props.Login.masterData.filterTechnique && this.props.Login.masterData.filterTechnique.length > 0 ? {
                                                "value": this.props.Login.masterData.filterTechnique[0].ntechniquecode,
                                                "label": this.props.Login.masterData.filterTechnique[0].stechniquename
                    } : ""
               isComponentUpdated = true;
            }


            if (this.props.Login.masterData.filterUsers !== previousProps.Login.masterData.filterUsers) {
                const usersmap = constructOptionList(this.props.Login.masterData.filterUsers || [], "nusercode",
                                          "susername", 'nusercode', 'ascending', false);
                                          filterUsers = usersmap.get("OptionList");

               
                selectedRecord['nusercode']= this.props.Login.masterData.filterUsers && this.props.Login.masterData.filterUsers.length > 0 ? {
                                             "value": this.props.Login.masterData.filterUsers[0].nusercode,
                                             "label": this.props.Login.masterData.filterUsers[0].susername
                    } : ""
                
                isComponentUpdated = true;
            }

            if (isComponentUpdated) {
                this.setState({ userRoleControlRights, controlMap, selectedRecord, filterTechnique,filterUsers });
            }


            if (this.props.Login.masterData !== previousProps.Login.masterData) {
                const filterData = this.generateBreadCrumData();
                this.setState({ filterData });
            }
        }

}
export default connect(mapStateToProps, {
    callService,filterColumnData,getUserTechniqueViewDetail,changeUserTechniqueViewFilter,getUserTechniqueViewFilterChange
})(injectIntl(UserTechniqueView));
