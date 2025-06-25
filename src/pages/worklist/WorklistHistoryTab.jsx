import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Nav, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataGrid from '../../components/data-grid/data-grid.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { transactionStatus } from '../../components/Enumeration';
import { process } from '@progress/kendo-data-query';
//const InstrumentSectionTab = (props) =>
class WorklistHistoryTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            sectionDataState: { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 },
        });
    }


    // dataStateChange = (event) => {
    //     this.setState({
    //         dataResult: process(this.props.Login.masterData["selectedSection"], event.dataState),
    //         sectionDataState: event.dataState
    //     });
    //}
    render() {

        const instSectionColumnList = [
            { "idsName": "IDS_STATUS", "dataField": "stransdisplaystatus", "width": "150px" },
            { "idsName": "IDS_USERNAME", "dataField": "username", "width": "150px" },
            { "idsName": "IDS_ROLE", "dataField": "suserrolename", "width": "150px" },                               
            { "idsName": "IDS_TRANSDATE", "dataField": "stransactiondate", "width": "150px" }
            // {"idsName":"IDS_STATUS","dataField":"stransdisplaystatus","width":"150px", "componentName": "switch", 
            // "switchFieldName": "ndefaultstatus", "switchStatus": transactionStatus.YES, "needRights": true, "controlName": "DefaultSection"}
        ];
        const methodUrl = "Section";
        return (
            <>

                <Row noGutters={true}>
                    <Col md="12">
                        <DataGrid
                            key="worklisthistorykey"
                           primaryKeyField="nworkhistorycode"
                            dataResult={process(this.props.selectedWorklistHistory ||[],  this.state.sectionDataState)}
                           // dataResult={this.props.selectedWorklistHistory ||[]}
                           // dataState={{}}
                            dataState={this.state.sectionDataState}
                            dataStateChange={(event) => this.setState({ sectionDataState: event.dataState })}
                            data={this.props.InstrumentSection}
                            extractedColumnList={instSectionColumnList}
                            //controlMap={this.state.controlMap}
                            pageable={false}
                            scrollable={'scrollable'}
                            gridHeight={'335px'}
                            isActionRequired={false}
                            //userRoleControlRights={this.props.userRoleControlRights}
                            

                        >
                        </DataGrid>
                    </Col>
                </Row>
            </>
        );
    }
    componentDidUpdate(previousProps) {
        if (this.props.InstrumentSection !== previousProps.InstrumentSection) {
            let { sectionDataState } = this.state;
            if (this.props.dataState === undefined) {
                sectionDataState = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
            }
            this.setState({ sectionDataState });
        }

    }
};

export default injectIntl(WorklistHistoryTab);