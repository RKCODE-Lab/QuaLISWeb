import React from 'react';
import { Row, Col } from 'react-bootstrap';
import DataGrid from '../../components/data-grid/data-grid.component';


const BatchResultTab = (props) =>{
    const batchViewList = [];
    const batchCSViewList = [];
    

    batchViewList .push(        
      {"idsName":"IDS_ARNO","dataField":"sarno","width":"155px"},
    );
    if (props.nneedsubsample){
        batchViewList.push({"idsName":"IDS_SAMPLEARNO","dataField":"ssamplearno", "width": "155px"} );
    }
      batchViewList .push(  
        //{"idsName":"IDS_LIIMSPRIMARYCODE","dataField":"limsprimarycode","width":"155px"}, 
       // {"idsName":"IDS_BATCHNO","dataField":"sbatcharno","width":"155px"},
        // {"idsName":"IDS_SAMPLEARNO","dataField":"ssamplearno","width":"155px"},
        {"idsName":"IDS_TEST","dataField":"stestsynonym","width":"250px"},
        {"idsName":"IDS_REPEATRETEST","dataField":"repretest","width":"250px"},
        {"idsName":"IDS_PARAMETERNAME","dataField":"sparametersynonym","width":"200px"},
        {"idsName":"IDS_RESULT","dataField":"sresult","width":"250px"},
        {"idsName":"IDS_RESULTFLAG","dataField":"sgradename","width":"250px"},
       //{"idsName":"IDS_RETEST","dataField":"ntestretestno","width":"250px"},
        // {"idsName":"IDS_TRANSDATE","dataField":"stransactiondate","width":"250px"},
        // {"idsName":"IDS_REMARKS","dataField":"scomments","width":"250px"},
        
     );


     batchCSViewList.push(
      //{ label:props.intl.formatMessage({ id: "IDS_LIIMSPRIMARYCODE"}), key: "limsprimarycode","width":"250px"},
      //{ label:props.intl.formatMessage({ id: "IDS_LIIMSPRIMARYCODE"}), key: "sampleID","width":"250px"},
      { label:props.intl.formatMessage({ id: "IDS_BATCHNOGROUPID"}), key: "sbatcharno","width":"250px"},
      { label:props.intl.formatMessage({ id: "IDS_ARNO" }), key: "sarno","width":"250px"},
      );
     if (props.nneedsubsample){
       batchCSViewList.push({label:props.intl.formatMessage({ id: "IDS_SAMPLEARNO" }), key: "ssamplearno","width":"250px"});
      }
      
      batchCSViewList.push(
      //  { label:props.intl.formatMessage({ id: "IDS_LIIMSPRIMARYCODE"}), key: "limsprimarycode","width":"250px"},
        //{ label:props.intl.formatMessage({ id: "IDS_SAMPLEARNO" }), key: "ssamplearno","width":"250px"},
        { label:props.intl.formatMessage({ id: "IDS_LIIMSPRIMARYCODE"}), key: "sampleID","width":"250px"},
        { label:props.intl.formatMessage({ id: "IDS_TEST" }),key:"stestsynonym","width":"250px"},
        { label:props.intl.formatMessage({ id: "IDS_REPEATRETEST" }),key:"repretest","width":"250px"},
        //{ label:props.intl.formatMessage({ id: "IDS_PARAMETERNAME"}),key:"sparametersynonym","width":"200px"},
        // label:props.intl.formatMessage({ id: "IDS_RESULT" }),key:"sresult","width":"250px"},
       // { label:props.intl.formatMessage({ id: "IDS_RESULTFLAG" }),key:"sgradename","width":"250px"},
        //{ label:props.intl.formatMessage({ id: "IDS_RETEST" }),key:"ntestretestno","width":"250px"},
     );

     const csvReport = {
        data: props.resultview && props.resultview.length > 0 ? props.resultview :[],
        headers: batchCSViewList,
        filename: 'Clue_Mediator_Report.csv'
      };
    
    return (
    
        <Row noGutters>
            <Col md={12}>
                <DataGrid
                    key="ntransactionresultcode"
                    primaryKeyField = "ntransactionresultcode"
                    data = {props.resultview && props.resultview.length > 0 ? props.resultview :[]}
                    ELNTest={props.ELNTest && props.ELNTest.length > 0 ? props.ELNTest :[]}
                   // dataResult = {process(props.printHistory || [], { skip: 0, take: 10 })}
                    dataResult = {props.dataResult}
                    dataState = {props.dataState}
                    batchCSViewList={batchCSViewList}
                    dataStateChange = {props.dataStateChange}
                    extractedColumnList = {batchViewList}
                    userInfo={props.userInfo}
                    pageable={true}
                    scrollable={'scrollable'}
                    gridHeight = {'375px'}
                    iscsv={"true"}
                    //csvReport={csvReport}
                    isActionRequired={false}
                    methodUrl={props.methodUrl}
                    selectedId={0}
                    isToolBarRequired={true}
                    isAddRequired={false}
                    isRefreshRequired={false}
                    isDownloadPDFRequired={false}
                    isImportRequired={false}
                    isExportExcelRequired={false}
                    isDownloadExcelRequired={false}
                    selectedfilename={props.selectedfilename}
                >
                </DataGrid>
            </Col>
        </Row>
    
    );
};
export default BatchResultTab;


