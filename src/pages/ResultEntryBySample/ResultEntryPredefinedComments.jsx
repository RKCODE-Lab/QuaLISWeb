import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import { intl } from '../../components/App';
import { MediaHeader, MediaLabel, MediaSubHeader } from '../../components/App.styles';
import FormMultiSelectComponent from '../../components/form-multi-select/form-multi-select.component';

const ResultEntryPredefinedComments = (props) => {
    return (
        <>
            {props.showMultiSelectCombo === true ?
                <Row>
                    <Col md={12}>
                        <FormMultiSelectComponent
                            name={"ntestgrouptestpredefsubcode"}
                            label={props.salertmessage//props.intl.formatMessage({ id: "IDS_SUBCODEDRESULT" })
                            }
                            options={props.testgrouptestpredefsubresultOptions || []}
                            optionId="ntestgrouptestpredefsubcode"
                            optionValue="ssubcodedresult"
                            value={props.selectedRecord && props.selectedRecord["ntestgrouptestpredefsubcode"] || []}
                            isClearable={true}
                            disableSearch={false}
                            disabled={false}
                            closeMenuOnSelect={false}
                            alphabeticalSort={true}
                            allItemSelectedLabel={props.intl.formatMessage({ id: "IDS_ALLITEMSELECTED" })}
                            noOptionsLabel={props.intl.formatMessage({ id: "IDS_NOOPTION" })}
                            searchLabel={props.intl.formatMessage({ id: "IDS_SEARCH" })}
                            selectAllLabel={props.intl.formatMessage({ id: "IDS_SELECTALL" })}
                            onChange={(event) => props.onComboChange(event, "ntestgrouptestpredefsubcode",1)}
                            isMandatory={false}
                        />
                    </Col>

                </Row> :
                props.onlyAlertMsgAvailable === true ?
                    <Row>
                        <Col md={12}>
                            <FormTextarea
                                name={"ntestgrouptestpredefsubcode"}
                                label={props.salertmessage }
                                placeholder={intl.formatMessage({ id: "IDS_SUBCODEDRESULT" })}
                                type="text"
                                value={props.selectedRecord !== undefined ? props.selectedRecord.ntestgrouptestpredefsubcode : ""}
                                isMandatory={false}
                                required={true}
                                maxLength={255}
                                onChange={(event) => props.onInputChange(event, "ntestgrouptestpredefsubcode")}
                            />
                        </Col>
                    </Row>
                    : <Row>
                        <Col md={12}>
                            <FormTextarea 
                                name={"spredefinedcomments"}
                                label={intl.formatMessage({ id: "IDS_RESULTPARAMETERCOMMENTS" })
                                }
                                placeholder={intl.formatMessage({ id: "IDS_RESULTPARAMETERCOMMENTS" })}
                                type="text"
                                value={props.selectedRecord !== undefined ? props.selectedRecord.spredefinedcomments : ""} 
                                required={true}
                                maxLength={255}
                                onChange={(event) => props.onInputChange(event, "spredefinedcomments")}
                            />
                        </Col>
                    </Row>
            }
            {/* {props.showMultiSelectCombo === false ? "" :} */}

        </>
    )
}
export default injectIntl(ResultEntryPredefinedComments);
