import React from 'react';
import { injectIntl } from 'react-intl';
import { process } from '@progress/kendo-data-query';
import {Row, Col, Card} from 'react-bootstrap';

import DataGrid from '../../../components/data-grid/data-grid.component';
import CustomTabs from '../../../components/custom-tabs/custom-tabs.component';

class ClockMontoringTabs extends React.Component{
    constructor(props){
        super(props);  
    
        this.state = { selectedRecord:{},  dataResult:[],
                        chDataState :{skip:0, take:5},
                        dataState:{skip:0, take:5},
                    };   
    }    

    render(){
      
        return(
          
                <Row noGutters>
                    <Col md={12}>  
                        <Card className="at-tabs border-0">                           
                            <Row noGutters>
                                <Col md={12}>
                                    <CustomTabs tabDetail={this.tabDetail()} onTabChange={this.onTabChange}/> 
                                </Col>
                            </Row>
                         </Card>   
                    </Col>
                </Row>

        ) 
    }


    tabDetail = () => {
        const tabMap = new Map();
   
        const editClockId = this.props.controlMap.has("EditClock") && this.props.controlMap.get("EditClock").ncontrolcode;
   
        const editParam = {screenName:"IDS_CLOCKHISTORY", operation:"update",  primaryKeyField:"nclockhistorycode", 
                                masterData:this.props.masterData,   
                                selectedBatch: this.props.masterData.SelectedClockBatch,
                                userInfo:this.props.userInfo,  ncontrolCode:editClockId};

        const deleteParam ={screenName:"IDS_CLOCKHISTORY", methodUrl:"ClockHistory", operation:"delete"};    

         tabMap.set("IDS_CLOCKHISTORY",   <DataGrid
                                                    primaryKeyField='nclockhistorycode'
                                                    data={this.props.masterData["CM_ClockHistoryList"]}
                                                    dataResult={process(this.props.masterData["CM_ClockHistoryList"] || [], 
                                                                                                         this.state.chDataState
                                                                                                         )}
                                                    dataState={this.state.chDataState}
                                                    dataStateChange={(event)=> this.setState({chDataState: event.dataState})}
                                                    extractedColumnList={[
                                                                            { "idsName": "IDS_CLOCKSTATUS", "dataField": "stransdisplaystatus", "width": "150px" },
                                                                            { "idsName": "IDS_ACTIONTYPE", "dataField": "sactionstatus", "width": "150px" },                                                                           
                                                                            {"idsName": "IDS_TRANSDATE", "dataField": "sapproveddate", "width": "250px" },
                                                                            { "idsName": "IDS_USERNAME", "dataField": "sloginid", "width": "250px" },
                                                                            { "idsName": "IDS_USERROLE", "dataField": "suserrolename", "width": "200px" },
                                                                            { "idsName": "IDS_COMMENTS", "dataField": "scomments", "width": "250px" },
                                                                           
                                                                        ]}
                                                    controlMap={this.props.controlMap}
                                                    userRoleControlRights={this.props.userRoleControlRights}
                                                    inputParam={this.props.inputParam}
                                                    userInfo={this.props.userInfo}
                                                    methodUrl="Clock"
                                                    fetchRecord={this.props.getClockMonitoringComboService}
                                                    editParam={editParam}
                                                    deleteRecord={this.props.deleteRecord} 
                                                    deleteParam={deleteParam}                                                                                          
                                                    pageable={false}
                                                    scrollable={"scrollable"}
                                                    isActionRequired={true}
                                                    isToolBarRequired={false}
                                                    selectedId={this.props.selectedId}
                                                    hideColumnFilter={true}
                                                />                                             
                                        );

       return tabMap;
    }  

    onTabChange = (tabProps) => {}
   

    // deleteRecord = (deleteParam) =>{       
       
    //     if (this.props.masterData.SelectedClockBatch.ntransactionstatus === transactionStatus.CERTIFIED
    //         || this.props.masterData.SelectedClockBatch.ntransactionstatus === transactionStatus.NULLIFIED
    //         || this.props.masterData.SelectedClockBatch.ntransactionstatus === transactionStatus.SENT)
    //     {
    //         const message = "IDS_CANNOTDELETE"+this.props.masterData.SelectedClockBatch.stransactionstatus.screenName.toUpperCase() +"RECORD";
    //         toast.warn(this.props.intl.formatMessage({id:message}));
    //     }
    //     else{
    //         let dataState = undefined;
           
    //         postParam = { inputListName: "ClockMonitoringBatchList", selectedObject: "SelectedClockBatch", 
    //                         primaryKeyField: "nreleasebatchcode", unchangeList: ["FromDate", "ToDate"] };

    //         const postParam = { inputListName : "ClockMonitoringBatchList", selectedObject : "SelectedClockBatch",
    //                             primaryKeyField : "nreleasebatchcode", 
    //                             primaryKeyValue : this.props.masterData.SelectedClockBatch.nreleasebatchcode,
    //                             fetchUrl : "clockmonitoring/getClockMonitoring",
    //                             fecthInputObject : {userinfo:this.props.userInfo},
    //     } 
    //         const inputParam = {
    //                                 classUrl: this.props.inputParam.classUrl,
    //                                 methodUrl:deleteParam.methodUrl,                                  
    //                                 inputData: {clockhistory :deleteParam.selectedRecord,
    //                                             "userinfo": this.props.userInfo},
    //                                 operation:deleteParam.operation , dataState, postParam   
    //                         }        
         
    //         if (showEsign(this.props.esignRights, this.props.userInfo.nformcode, deleteParam.ncontrolCode)){
    //             const updateInfo = {
    //                  typeName: DEFAULT_RETURN,
    //                  data: {
    //                      loadEsign:true, screenData:{inputParam, masterData:this.props.masterData}, 
    //                      openChildModal:true, screenName:deleteParam.screenName, operation:deleteParam.operation
    //                      }
    //                  }
    //              this.props.updateStore(updateInfo);
    //          }
    //          else{
    //              this.props.crudMaster(inputParam, this.props.masterData, "openChildModal");
    //          }
    //     }
    // }  

    // validateEsign = () =>{       
    //     const inputParam = {
    //                             inputData: {"userinfo": {...this.props.userInfo, 
    //                                                     sreason: this.state.selectedRecord["esigncomments"] },
    //                                          password : this.state.selectedRecord["esignpassword"]
    //                                         },
    //                             screenData : this.props.screenData
    //                         }        
    //     this.props.validateEsignCredential(inputParam, "openChildModal");
    // }
}

export default injectIntl(ClockMontoringTabs);