import React from 'react';
import { injectIntl, FormattedMessage } from 'react-intl';
import { Nav, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DataGrid from '../../components/data-grid/data-grid.component';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { process } from '@progress/kendo-data-query';
class WorklistSampleTab extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            sampleDataState: { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 },
        });
    }
    render() {

        const methodUrl = "WorklistSample";
        return (
            <>
                <div className="actions-stripe">
                    <div className="d-flex justify-content-end">

                        <Nav.Link
                            name="editSample" className="add-txt-btn"
                            data-tip={this.props.intl.formatMessage({ id: "IDS_ADDSAMPLE", })}
                             hidden={this.props.userRoleControlRights.indexOf(this.props.addSampleId) === -1 }
                            onClick={() =>
                                this.props.getWorklistSample(
                                    "IDS_WORKLISTSAMPLE",
                                    "create",
                                    "nworklistcode",
                                    // this.props.Login.masterData,
                                    this.props.masterData,
                                    // this.props.Login.userInfo,
                                    this.props.userInfo,
                                    this.props.addSampleId,
                                    this.props.dataStateSample
                                )
                            }
                        >
                            <FontAwesomeIcon icon={faPlus} /> { }
                            <FormattedMessage id="IDS_SAMPLE" defaultMessage="Sample"></FormattedMessage>
                        </Nav.Link>
                    </div>
                </div>
                <Row noGutters={true}>
                    <Col md="12">
                        <DataGrid
                            key="worklistsamplekey"
                            primaryKeyField="nworklistsamplecode"
                            data={this.props.WorklistSamples}
                            dataResult={process(this.props.selectedWorklist || [], this.state.sampleDataState)}
                            //dataResult={this.props.selectedWorklist || []}
                            expandField="expanded"
                            dataState={this.state.sampleDataState}
                            dataStateChange={(event) => this.setState({ sampleDataState: event.dataState })}
                            controlMap={this.props.controlMap}
                            userRoleControlRights={this.props.userRoleControlRights}
                            extractedColumnList={this.props.extractedColumnList}
                            detailedFieldList={this.props.detailedFieldList}
                            deleteRecord={this.props.deleteRecord}
                            deleteParam={{ operation: "delete", methodUrl, screenName: this.props.screenName }}
                            pageable={true}
                            scrollable={'scrollable'}
                            gridHeight={'335px'}
                            isActionRequired={true}
                            methodUrl={methodUrl}
                            actionIcons={[{
                                title: this.props.intl.formatMessage({ id: "IDS_PREVIOUSRESULTVIEW" }),
                                controlname: "faEye",
                                objectName: "ExceptionLogs",
                                hidden: this.props.userRoleControlRights.indexOf(this.props.viewSampleId) === -1,
                               onClick: (viewSample) => this.props.viewSample(viewSample)
                            }]}
                        >
                        </DataGrid>
                    </Col>
                </Row>
            </>
        );
    }
    componentDidUpdate(previousProps) {
        if (this.props.WorklistSamples !== previousProps.WorklistSamples) {
            let { sampleDataState } = this.state;
            if (this.props.dataState === undefined) {
                sampleDataState = { skip: 0, take: this.props.settings ? parseInt(this.props.settings[14]) : 5 };
            }
            this.setState({ sampleDataState });
        }

    }
};

export default injectIntl(WorklistSampleTab);