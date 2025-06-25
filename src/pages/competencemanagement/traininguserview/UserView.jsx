
import React, { Component } from 'react';
import { Row, Col, Card, FormGroup, FormLabel } from 'react-bootstrap';
import { connect } from 'react-redux';

import {
    callService,filterColumnData,changeTrainingUserViewDateFilter,getTrainingUserViewDetails,viewAttachment
} from '../../../actions'
import { FormattedMessage, injectIntl } from 'react-intl';
import { toast } from 'react-toastify';
import { getControlMap ,convertDateValuetoString } from '../../../components/CommonScript';
import ListMaster from '../../../components/list-master/list-master.component';
import { ReadOnlyText, ContentPanel} from '../../../components/App.styles';
import { DEFAULT_RETURN } from '../../../actions/LoginTypes';
import 'react-perfect-scrollbar/dist/css/styles.css';
// import ReactTooltip from 'react-tooltip';
import BreadcrumbComponent from '../../../components/Breadcrumb.Component';
import { Affix } from 'rsuite';
import TrainingUserViewDateFilter from '../../../pages/competencemanagement/traininguserview/TrainingUserViewDateFilter';
import UserViewTrainingDocumentTab from './UserViewTrainingDocumentTab';
import CustomTab from "../../../components/custom-tabs/custom-tabs.component";
import { designProperties } from '../../../components/Enumeration';


const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class UserView extends React.Component {

    constructor(props) {
        super(props);
        this.state = ({
            selectedRecord: {},
            error: "",
            userRoleControlRights: [],
            controlMap: new Map(),
            skip: 0,
            take: this.props.Login.settings ? this.props.Login.settings[3] : 25,
            sidebarview: false
        });
        this.searchRef = React.createRef();
        this.searchFieldList = ["strainingvenue", "strainingtopic", "strainername"]
    }
    sidebarExpandCollapse = () => {
        this.setState({
            sidebarview: true
        })          
    }

    static getDerivedStateFromProps(props, state) {
        if (props.Login.masterStatus !== "") {
            if (props.Login.errorCode === 417 || props.Login.errorCode === 409) {
                toast.warn(props.Login.masterStatus);
                props.Login.masterStatus = "";
            }
        }
        if (props.Login.error !== state.error) {
            toast.error(props.Login.error)
            props.Login.error = "";
        }
        return null;
    }

    render() {

        let obj = convertDateValuetoString(this.state.selectedRecord["fromdate"] || (this.props.Login.masterData && this.props.Login.masterData.FromDate),
            this.state.selectedRecord["todate"] || (this.props.Login.masterData && this.props.Login.masterData.ToDate),
            this.props.Login.userInfo)

        let fromDate = obj.fromDate;
        let toDate = obj.toDate;
        const { SelectedTrainingUserView } = this.props.Login.masterData;
        const filterParam = {
            inputListName: "TrainingUserView", selectedObject: "SelectedTrainingUserView", primaryKeyField: "nparticipantcode",
            fetchUrl: "userview/getTrainingUserViewDetails", fecthInputObject: { userinfo: this.props.Login.userInfo }, masterData: this.props.Login.masterData,
            searchFieldList: this.searchFieldList
        };
              
        let breadCrumbData = this.state.filterData || [];
        return (
            <>
                <div className="client-listing-wrap mtop-fixed-breadcrumb fixed_breadcrumd">
                    {breadCrumbData.length > 0 ?
                        <Affix top={53}>
                            <BreadcrumbComponent breadCrumbItem={breadCrumbData} />
                        </Affix> : ""
                    }
                    {/* <ReactTooltip place="bottom" globalEventOff='click' id="tooltip_list_wrap" /> */}
                    <Row noGutters={true}>
                        <Col md={`${!this.props.sidebarview ? '4' : "2"}`}> 
                        <ListMaster
                         searchRef={this.searchRef}
                         screenName={"UserView"}
                         userRoleControlRights={this.state.userRoleControlRights}
                         masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.TrainingUserView}
                         showFilterIcon={true}
                         openFilter={this.openFilter}
                         closeFilter={this.closeFilter}
                         onFilterSubmit={this.onFilterSubmit}
                         reloadData={this.reloadData}
                         getMasterDetail={(master) => this.props.getTrainingUserViewDetails(master, this.props.Login.userInfo, this.props.Login.masterData)}       
                         selectedMaster={this.props.Login.masterData.SelectedTrainingUserView}
                         showFilter={this.props.Login.showFilter}
                         filterColumnData={this.props.filterColumnData}
                         filterParam={filterParam}
                         primaryKeyField="nparticipantcode"
                                mainField="strainingtopic"
                                firstField="strainername"
                                secondField="strainingvenue"
                                filterComponent={[
                                {
                                  "IDS_TRAININGUSERVIEWDATEFILTER": (
                                    <TrainingUserViewDateFilter
                                                selectedRecord={this.state.selectedRecord || {}}
                                                value={this.state.value || {}}
                                                handleDateChange={this.handleDateChange}
                                                fromDate={fromDate}
                                                toDate={toDate}
                                                userInfo={this.props.Login.userInfo}
                                                onFilterChange={this.onFilterChange}
                                               
                                            />
                                  ),
                                },
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
                            <Row>
                                <Col md={12}>
                                    <ContentPanel className="panel-main-content">
                                        <Card className="border-0">
                                            {this.props.Login.masterData.SelectedTrainingUserView ?
                                                <>
                                                    <Card.Header>
                                                       
                                                        <Card.Title className="product-title-main">
                                                            {this.props.Login.masterData.SelectedTrainingUserView.strainingtopic}
                                                        </Card.Title>
                                                        <Card.Subtitle>
                                                            <div className="d-flex product-category">
                                                                <h2 className="product-title-sub flex-grow-1">

                                                                    
                                                                </h2>
                                                                
                                                            </div>

                                                        </Card.Subtitle>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <Row>
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_TRAININGTOPIC" message="Training Topic" /></FormLabel>
                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedTrainingUserView.strainingtopic}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>
                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_TRAINERNAME" message="Trainer Name" /></FormLabel>
                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedTrainingUserView.strainername}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>

                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_TRAININGVENUE" message="Training Venue" /></FormLabel>
                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedTrainingUserView.strainingvenue }
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>

                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_TRAININGDATETIME" message="Training Date" /></FormLabel>
                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedTrainingUserView.strainingdatetime}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>

                                                            {/* <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_TRAININGTIME" message="Training Time" /></FormLabel>
                                                                    <ReadOnlyText>{this.props.Login.masterData.SelectedTrainingUserView.strainingtime}</ReadOnlyText>
                                                                </FormGroup>
                                                            </Col> */}

                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_TRAININGSTATUS" message="Training Status" /></FormLabel>
                                                                    <ReadOnlyText>
                                                                        {this.props.Login.masterData.SelectedTrainingUserView.strainingstatus}
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>

                                                            <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_TRAININGCATEGORY" message="Training Category" /></FormLabel>
                                                                    <ReadOnlyText>
                                                                        {this.props.Login.masterData.SelectedTrainingUserView.strainingcategoryname}
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>

                                                            {/* <Col md={4}>
                                                                <FormGroup>
                                                                    <FormLabel><FormattedMessage id="IDS_ATTENDANCESTATUS" message="Attendance Status" /></FormLabel>
                                                                    <ReadOnlyText>
                                                                        {this.props.Login.masterData.SelectedTrainingUserView.sattendancestatus}
                                                                    </ReadOnlyText>
                                                                </FormGroup>
                                                            </Col>  */}
                                                                                    
                                                                                                                      
                                                        </Row>
                                                        {SelectedTrainingUserView && <CustomTab tabDetail={this.tabDetail()} onTabChange={this.onTabChange} />}

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

            </>
        );
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
        this.searchRef.current.value = "";
       let fromDate= this.state.selectedRecord["fromdate"] ?this.state.selectedRecord["fromdate"]: this.props.Login.masterData.FromDate;
       let toDate= this.state.selectedRecord["todate"] ? this.state.selectedRecord["todate"]: this.props.Login.masterData.ToDate;

        let obj = convertDateValuetoString(fromDate, toDate, this.props.Login.userInfo);  
        let inputParam ={
             inputData : {
            fromDate: obj.fromDate,
            toDate: obj.toDate,
            
            usercode: this.props.Login.userInfo.nusercode,
            userinfo: this.props.Login.userInfo,
        },
        
        classUrl: "userview",
        methodUrl: "UserView",
        displayName: "IDS_TRAININGUSERVIEW",
        userInfo: this.props.Login.userInfo
    };
    this.props.changeTrainingUserViewDateFilter(inputParam);

    }
    tabDetail = () => {
        const moreField=[
            {[designProperties.LABEL]: "IDS_LINK",[designProperties.VALUE]:"slinkname"}, 
            {[designProperties.LABEL]: "IDS_CREATEDDATE",[designProperties.VALUE]:"screateddate"}, 
            {[designProperties.LABEL]: "IDS_DESCRIPTION",[designProperties.VALUE]:"sfiledesc"}
        ];
        const subFields=[
            {[designProperties.LABEL]: "IDS_FILESIZE",[designProperties.VALUE]:"sfilesize","fieldType":"size"}
        ];

        const tabMap = new Map();
        tabMap.set("IDS_USERVIEWTRAININGDOCUMENT",
            <UserViewTrainingDocumentTab
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
                masterData={this.props.Login.masterData}
                userInfo={this.props.Login.userInfo}
                TrainingDocuments={this.props.Login.masterData.TrainingDocuments}
                screenName="IDS_USERVIEWTRAININGDOCUMENT"
                viewTrainingDocumentFile={this.viewTrainingDocumentFile}
                moreField={moreField}
                subFields={subFields}
            />
    
            );
            return tabMap;

    }

    handleDateChange = (dateName, dateValue) => {
        const { selectedRecord } = this.state;
        selectedRecord[dateName] = dateValue;
        this.setState({ selectedRecord });
    }
    
    generateBreadCrumData() {
        const breadCrumbData = [];
            let obj = convertDateValuetoString(this.props.Login.masterData.FromDate,
                this.props.Login.masterData.ToDate,
                this.props.Login.userInfo);
            breadCrumbData.push(

                {
                    "label": "IDS_FROM",
                    "value": obj.breadCrumbFrom
                },
                {
                    "label": "IDS_TO",
                    "value": obj.breadCrumbto
                }
            );
        
        return breadCrumbData;
    }

   
    reloadData = (selectedRecord, isDateChange) => {
        this.searchRef.current.value = "";

        let fromDate = this.props.Login.masterData.FromDate;
        let toDate = this.props.Login.masterData.ToDate;       
        let obj = convertDateValuetoString(fromDate,toDate, this.props.Login.userInfo, true);
        const inputParam = {
            inputData: {
                "userinfo": this.props.Login.userInfo,
                fromDate:obj.fromDate, 
                toDate:obj.toDate,
            },
            classUrl: 'userview',
            methodUrl: "UserView",
            displayName: "IDS_TRAININGUSERVIEW",
            userInfo: this.props.Login.userInfo
        };
        this.props.callService(inputParam);
    }

    viewTrainingDocumentFile = (filedata) => {
        const inputParam = {
            inputData: {
                userviewfile: filedata,
                userinfo: this.props.Login.userInfo
            },
            classUrl: "userview",
            operation: "view",
            methodUrl: "UserViewFile",
            screenName: "User View File"
        }
        this.props.viewAttachment(inputParam);
    }

    componentDidUpdate(previousProps) {
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
        if (this.props.Login.masterData !== previousProps.Login.masterData) {

            if (this.props.Login.userInfo.nformcode !== previousProps.Login.userInfo.nformcode) {
                const userRoleControlRights = [];
                if (this.props.Login.userRoleControlRights) {
                    this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode] && Object.values(this.props.Login.userRoleControlRights[this.props.Login.userInfo.nformcode]).map(item =>
                        userRoleControlRights.push(item.ncontrolcode))
                }
                const controlMap = getControlMap(this.props.Login.userRoleControlRights, this.props.Login.userInfo.nformcode)
                this.setState({
                    userRoleControlRights, controlMap, data: this.props.Login.masterData.TrainingUserView,
                });
            }
            else {
                if (this.props.Login.masterData.TrainingUserView) {
                    this.setState({
                        data: this.props.Login.masterData.TrainingUserView,
                        dataState : {skip:0,take:this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5},
                    });
                }
            }
        }

        if (this.props.Login.masterData !== previousProps.Login.masterData) {
            const filterData = this.generateBreadCrumData();
            this.setState({ filterData });
        }
    }

}


export default connect(mapStateToProps, {
    callService,filterColumnData,changeTrainingUserViewDateFilter,getTrainingUserViewDetails,viewAttachment
})(injectIntl(UserView));

