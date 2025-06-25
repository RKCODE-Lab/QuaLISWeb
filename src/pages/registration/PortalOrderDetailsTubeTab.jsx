import React from 'react';
import { injectIntl} from 'react-intl';
import {Row, Col } from 'react-bootstrap';
import DataGrid from '../../components/data-grid/data-grid.component';
import { process } from '@progress/kendo-data-query';
import { showEsign } from '../../components/CommonScript';
import { DEFAULT_RETURN } from '../../actions/LoginTypes';
class  PortalOrderDetailsTubeTab extends React.Component{
    constructor(props) {
    super(props);
    this.state = ({
        tubeDataState: { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 },
    });
}
    render(){
        const portalTubeColumnList = [
            {"idsName":"IDS_CONTAINERTYPE","dataField":"scontainertype","width":"150px"},
            // {"idsName":"IDS_TUBETYPE","dataField":"stubename","width":"150px"},
            {"idsName":"IDS_TUBEQTY","dataField":"ntubeqty","width":"150px"},
            {"idsName":"IDS_SAMPLETYPE","dataField":"ssampletype","width":"150px"},
            {"idsName":"IDS_STATUS","dataField":"sdisplaystatus","width":"150px"}

        ];
        const receivedId = this.props.controlMap.has("ReceivedPortalOrder") && this.props.controlMap.get("ReceivedPortalOrder").ncontrolcode;
    return (
        <>
            
            <Row noGutters={true}>
                <Col md="12">
                    <DataGrid
                       key="portalordercontainerkey"
                       primaryKeyField = "nportalordercontainercode"
                       data = {this.props.PortalOrderTube}
                       dataResult = {process(this.props.PortalOrderTube||[],this.state.tubeDataState)}
                       dataState = {this.state.tubeDataState}
                       dataStateChange = {(event) => this.setState({ tubeDataState: event.dataState })}
                       extractedColumnList = {portalTubeColumnList}
                       controlMap = {this.props.controlMap}
                       userRoleControlRights={this.props.userRoleControlRights}
                       inputParam = {this.props.inputParam}
                       userInfo = {this.props.userInfo}
                       pageable={true}
                       scrollable={'scrollable'}
                       isActionRequired={true}
                       actionIcons={[
                        {
                            title: this.props.intl.formatMessage({ id: "IDS_RECEIVE" }),
                            controlname: "faReceivedItem",
                            objectName: "mastertoedit",
                            hidden: this.props.userRoleControlRights.indexOf(receivedId) === -1,
                            onClick: this.onReceiveOrderClick,
                            inputData: {}
                        }
                    ]
                }
                    >
                    </DataGrid>
                </Col>
            </Row>
        </>
    );
}
componentDidUpdate(previousProps) {
    if (this.props.PortalOrderTube !== previousProps.PortalOrderTube) {
        let { tubeDataState} = this.state;
        if (this.props.dataState=== undefined) {
            tubeDataState = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
        }
        this.setState({ tubeDataState });
    }

}
onReceiveOrderClick = (row) => {

   
        const ncontrolCode = this.props.controlMap.has("ReceivedPortalOrder") && this.props.controlMap.get("ReceivedPortalOrder").ncontrolcode
        let inputData = [];
        inputData["userinfo"] = this.props.userInfo;

        let postParam = undefined;
        inputData["portalorder"] = {
            "nportalordercode": row.nportalordercode
        };
        inputData["portalorder"]["nportalordercontainercode"] = row.nportalordercontainercode;

        inputData["portalorder"]["nportalordercode"] = this.props.masterData.selectedPortalOrder.nportalordercode;
        postParam = { inputListName: "PortalOrderDetails", selectedObject: "PortalOrderDetails", primaryKeyField: "nportalordercontainercode" };
        const inputParam = {
            classUrl: 'portalorderdetails',
            methodUrl: "PortalOrderDetails",
            inputData: inputData,
            operation: "received", postParam,
            selectedId: row.nportalordercontainercode
        }
        let saveType;

        const masterData = this.props.masterData;

        const esignNeeded = showEsign(this.props.userRoleControlRights, this.props.userInfo.nformcode, ncontrolCode);



        if (esignNeeded) {
            const updateInfo = {
                typeName: DEFAULT_RETURN,
                data: {
                    loadEsign: true, screenData: { inputParam, masterData }, saveType, openModal: true, operation: "received"
                }
            }
            this.props.updateStore(updateInfo);
        }
        else {
            this.props.crudMaster(inputParam, masterData, "openModal");
        }


    }
//}

};

export default injectIntl(PortalOrderDetailsTubeTab);