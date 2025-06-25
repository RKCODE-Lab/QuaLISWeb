import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormTextarea from '../../components/form-textarea/form-textarea.component';

const ResultEntryEnforceResult = (props) => {
    return (
        <>
            <Row>
                <Col md={12}>
                    <FormTextarea
                        name="senforceresult"
                        label={props.intl.formatMessage({ id: "IDS_RESULTS" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_RESULTS" })}
                        value={props.selectedRecord ? props.selectedRecord["senforceresult"] : ""}
                        rows="2"
                        isMandatory={true}
                        required={false}
                        maxLength={255}
                        onChange={(event) => props.onInputChange(event, "senforceresult")}
                    />
                </Col>
                <Col md={12}>
                    <FormTextarea
                        name="senforceresultcomment"
                        label={props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_COMMENTS" })}
                        value={props.selectedRecord ? props.selectedRecord["senforceresultcomment"] : ""}
                        rows="2"
                        isMandatory={true}
                        required={false}
                        maxLength={255}
                        onChange={(event) => props.onInputChange(event, "senforceresultcomment")}
                    />
                </Col>
                {/* <Col md={12}>
                    <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_PASSFLAG" })}
                        isSearchable={true}
                        name={"ngradecode"}
                        showOption={true}
                        options={props.GradeList || []}
                        optionId='ngradecode'
                        optionValue='sgradename'
                        value={props.selectedRecord["ngradecode"] && props.selectedRecord["ngradecode"] || ""}
                        onChange={(event) => props.onComboChange(event, "ngradecode")}
                        isMandatory={true}
                        isDisabled={false}
                    ></FormSelectSearch>
                </Col> */}
            </Row>
        </>
    )
}
export default injectIntl(ResultEntryEnforceResult);
