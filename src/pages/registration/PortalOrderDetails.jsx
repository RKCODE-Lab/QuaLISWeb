import React from 'react';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Row, Col, FormGroup, FormLabel, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { process } from '@progress/kendo-data-query';
import { callService, crudMaster, updateStore,fetchRecord,filterColumnData, validateEsignCredential,getPortalOrderClickDetails} from '../../actions';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
import { getControlMap, rearrangeDateFormatDateOnly } from '../../components/CommonScript';
import { ContentPanel } from '../product/product.styled';
import ListMaster from '../../components/list-master/list-master.component';
import { ReadOnlyText } from '../../components/App.styles';
import ConfirmMessage from '../../components/confirm-alert/confirm-message.component';
import { transactionStatus } from '../../components/Enumeration';
import CustomTab from '../../components/custom-tabs/custom-tabs.component'
import PortalOrderDetailsTubeTab from './PortalOrderDetailsTubeTab';
import PortalOrderDetailsTestTab from './PortalOrderDetailsTestTab';

const mapStateToProps = state => {
    return ({ Login: state.Login })
}

class PortalOrderDetails extends React.Component {
    constructor(props) {
        super(props);
        this.formRef = React.createRef();
        this.extractedColumnList = [];
        this.fieldList = [];
        const dataState = {
            skip: 0,
            take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5,
        };
        this.state = {
            addScreen: false, data: [], masterStatus: "", error: "", operation: "create",
            dataResult: [],
            dataState: dataState,
            userRoleControlRights: [],
            controlMap: new Map(),
            selectedRecord: {}, 
        };
        this.confirmMessage = new ConfirmMessage();
        this.searchRef = React.createRef();

    }

    dataStateChange = (event) => {
        this.setState({
            dataResult: process(this.state.data, event.dataState),
            dataState: event.dataState
        });
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
        if (props.Login.selectedRecord === undefined) {
            return { selectedRecord: {} }
        }
        return null;
    }

    render() {
        let userStatusCSS = "";
        if (this.props.Login.masterData.selectedPortalOrder && this.props.Login.masterData.selectedPortalOrder.ntransactionstatus === transactionStatus.DRAFT) {
            userStatusCSS = "outline-secondary";
        }
        else if (this.props.Login.masterData.selectedPortalOrder && this.props.Login.masterData.selectedPortalOrder.ntransactionstatus === transactionStatus.RECEIVED) {
            userStatusCSS = "outline-success";
        }
        else if (this.props.Login.masterData.selectedPortalOrder && this.props.Login.masterData.selectedPortalOrder.ntransactionstatus === transactionStatus.PARTIAL) {
            userStatusCSS = "outline-danger";
        }
        else {
            userStatusCSS = "outline-Final";
        }
        const {selectedPortalOrder}=this.props.Login.masterData;

        const filterParam = {
            inputListName: "PortalOrderDetails", selectedObject: "selectedPortalOrder", primaryKeyField: "nportalordercode",
            fetchUrl: "portalorderdetails/getPortalOrderDetails", fecthInputObject: { userinfo: this.props.Login.userInfo },
            masterData: this.props.Login.masterData,
            searchFieldList: ["sorderid", "sfirstname","slastname","sfathername" ,"stransdisplaystatus"]
        };
        return (
            <>
            <div className="client-listing-wrap mtop-4">
                <Row noGutters={true}>
                    <Col md={4}>
                        <ListMaster
                            formatMessage={this.props.intl.formatMessage}
                            screenName={"IDS_PORTALORDERDETAILS"}
                            masterData={this.props.Login.masterData}
                            userInfo={this.props.Login.userInfo}
                            masterList={this.props.Login.masterData.searchedData || this.props.Login.masterData.PortalOrderDetails}
                            getMasterDetail={(PortalOrderDetails) => this.props.getPortalOrderClickDetails(PortalOrderDetails, this.props.Login.userInfo, this.props.Login.masterData)}
                            selectedMaster={this.props.Login.masterData.selectedPortalOrder}
                            primaryKeyField="nportalordercode"
                            mainField="sorderid"
                            firstField="stransdisplaystatus"
                            isIDSField="Yes"
                            filterColumnData={this.props.filterColumnData}
                            filterParam={filterParam}
                            userRoleControlRights={this.state.userRoleControlRights}
                            searchRef={this.searchRef}
                            reloadData={this.reloadData}
                            hidePaging={false}
                        />
                    </Col>
                    <Col md='8'>
                        <Row><Col md={12}>
                            <ContentPanel className="panel-main-content">
                                {this.props.Login.masterData.selectedPortalOrder && this.props.Login.masterData.PortalOrderDetails.length > 0 && this.props.Login.masterData.selectedPortalOrder ?
                                    <Card className="border-0">
                                        <Card.Header>
                                            <Card.Title className="product-title-main">{this.props.Login.masterData.selectedPortalOrder.sorderid}</Card.Title>
                                            <Card.Subtitle>
                                                <div className="d-flex product-category">
                                                    <h2 className="product-title-sub flex-grow-1">
                                                        <span className={`btn btn-outlined ${userStatusCSS} btn-sm ml-3`}>
                                                            {this.props.Login.masterData.selectedPortalOrder.stransdisplaystatus}
                                                        </span>
                                                    </h2>
                                                    
                                                </div>
                                            </Card.Subtitle>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id={'IDS_FIRSTNAME'} message="First Name" /></FormLabel>
                                                        <ReadOnlyText> {this.props.Login.masterData.selectedPortalOrder["jsondata"].sfirstname === null || this.props.Login.masterData.selectedPortalOrder["jsondata"].length === 0 ? '-' :
                                                           this.props.Login.masterData.selectedPortalOrder["jsondata"].sfirstname}</ReadOnlyText>
                                                       
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id={'IDS_LASTNAME'} message="Last Name" /></FormLabel>
                                                        <ReadOnlyText> {this.props.Login.masterData.selectedPortalOrder["jsondata"].slastname === null || this.props.Login.masterData.selectedPortalOrder["jsondata"].length === 0 ? '-' :
                                                           this.props.Login.masterData.selectedPortalOrder["jsondata"].slastname}</ReadOnlyText>
                                                       
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id={'IDS_NATIONALID'} message="National Id" /></FormLabel>
                                                        <ReadOnlyText> {this.props.Login.masterData.selectedPortalOrder["jsondata"].snationalid === null || this.props.Login.masterData.selectedPortalOrder["jsondata"].length === 0 ? '-' :
                                                            this.props.Login.masterData.selectedPortalOrder["jsondata"].snationalid}</ReadOnlyText>
                                                       
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id={'IDS_DATEOFBIRTH'} message="Date of Birth" /></FormLabel>
                                                        <ReadOnlyText> {this.props.Login.masterData.selectedPortalOrder["jsondata"].sdob === null || this.props.Login.masterData.selectedPortalOrder["jsondata"].length === 0 ? '-' :
                                                          rearrangeDateFormatDateOnly(this.props.Login.userInfo,this.props.Login.masterData.selectedPortalOrder["jsondata"].sdob)}</ReadOnlyText>
                                                       
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id={'IDS_AGE'} message="Age" /></FormLabel>
                                                        <ReadOnlyText> {this.props.Login.masterData.selectedPortalOrder["jsondata"].sage === null || this.props.Login.masterData.selectedPortalOrder["jsondata"].length === 0 ? '-' :
                                                           this.props.Login.masterData.selectedPortalOrder["jsondata"].sage}</ReadOnlyText>
                                                       
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id={'IDS_SEX'} message="Sex" /></FormLabel>
                                                        <ReadOnlyText> {this.props.Login.masterData.selectedPortalOrder.sgendername === null || this.props.Login.masterData.selectedPortalOrder["jsondata"].length === 0 ? '-' :
                                                           this.props.Login.masterData.selectedPortalOrder.sgendername}</ReadOnlyText>
                                                       
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id={'IDS_FATHERNAME'} message="Father Name" /></FormLabel>
                                                        <ReadOnlyText> {this.props.Login.masterData.selectedPortalOrder["jsondata"].sfathername === null || this.props.Login.masterData.selectedPortalOrder["jsondata"].length === 0 ? '-' :
                                                           this.props.Login.masterData.selectedPortalOrder["jsondata"].sfathername}</ReadOnlyText>
                                                       
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id={'IDS_ADDRESS'} message="Address" /></FormLabel>
                                                        <ReadOnlyText> {this.props.Login.masterData.selectedPortalOrder["jsondata"].saddress === null || this.props.Login.masterData.selectedPortalOrder["jsondata"].length === 0 ? '-' :
                                                           this.props.Login.masterData.selectedPortalOrder["jsondata"].saddress}</ReadOnlyText>
                                                       
                                                    </FormGroup>
                                                </Col>
                                                <Col md='4'>
                                                    <FormGroup>
                                                        <FormLabel><FormattedMessage id={'IDS_PHONENO'} message="Phoneno" /></FormLabel>
                                                        <ReadOnlyText> {this.props.Login.masterData.selectedPortalOrder["jsondata"].sphoneno === null || this.props.Login.masterData.selectedPortalOrder["jsondata"].length === 0 ? '-' :
                                                           this.props.Login.masterData.selectedPortalOrder["jsondata"].sphoneno}</ReadOnlyText>
                                                       
                                                    </FormGroup>
                                                </Col>


                                            </Row>
                                            {selectedPortalOrder && <CustomTab tabDetail={this.tabDetail()} onTabChange={this.onTabChange} />}

                                       
                                        </Card.Body>
                                    </Card> : ""}
                            </ContentPanel>
                        </Col></Row>
                    </Col>
                </Row>
            </div>
        </>
    );
        
    }
    tabDetail = () => {
        const tabMap = new Map();
        tabMap.set("IDS_TUBE",
           <PortalOrderDetailsTubeTab
            controlMap={this.state.controlMap}
            userRoleControlRights={this.state.userRoleControlRights}
                masterData={this.props.Login.masterData}
                userInfo={this.props.Login.userInfo}
                PortalOrderTube={this.props.Login.masterData.PortalOrderTube}
                crudMaster={this.props.crudMaster}
                fetchRecord={this.props.fetchRecord}

                screenName="IDS_TUBE"
           />
    
            );
            tabMap.set("IDS_TEST",
            <PortalOrderDetailsTestTab
            
                masterData={this.props.Login.masterData}
                userInfo={this.props.Login.userInfo}
                PortalOrderTest={this.props.Login.masterData.PortalOrderTest}
                screenName="IDS_TUBE"
           />);
            return tabMap;

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
                this.setState({
                    userRoleControlRights, controlMap, data: this.props.Login.masterData,
                });
            }
            else {

                let { dataState } = this.state;
                if (this.props.Login.dataState === undefined) {
                    dataState = { skip: 0, take: this.props.Login.settings ? parseInt(this.props.Login.settings[14]) : 5 }
                }

                this.setState({
                    data: this.props.Login.masterData,
                    dataState
                });
            }
        }
        if (this.props.Login.selectedRecord !== previousProps.Login.selectedRecord) {
            this.setState({ selectedRecord: this.props.Login.selectedRecord });
        }
    }
    onTabChange = (tabProps) => {
        const screenName = tabProps.screenName;
        const updateInfo = {
          typeName: DEFAULT_RETURN,
          data: { screenName },
        };
        this.props.updateStore(updateInfo);
      };
    reloadData = () => {
        this.searchRef.current.value = "";

        const inputParam = {
            inputData: { "userinfo": this.props.Login.userInfo },
            classUrl: this.props.Login.inputParam.classUrl,
            //methodUrl: this.props.Login.inputParam.methodUrl,
            methodUrl:"PortalOrderDetails",
            displayName:this.props.intl.formatMessage({ id: "IDS_PORTALORDERDETAILS" }),
           // displayName: this.props.Login.inputParam.displayName,
            userInfo: this.props.Login.userInfo
        };

        this.props.callService(inputParam);
    }
}
export default connect(mapStateToProps, {
    callService, crudMaster,fetchRecord, updateStore, validateEsignCredential,getPortalOrderClickDetails,filterColumnData
})(injectIntl(PortalOrderDetails));