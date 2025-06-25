import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';

import { injectIntl } from 'react-intl';
import { MediaHeader } from '../../components/App.styles';

const TestEditForm = (props) => {
    return (
        <>
            {
                Object.values(props.selecteRecord).length > 0 ?
                    <Row className="mb-4">
                        <Col md={12}>
                            <MediaHeader className={`labelfont`}>Test: {" " + props.selecteRecord.stestsynonym}</MediaHeader>
                        </Col>
                    </Row>
                    : ""
            }

            < Row >
                <Col md={12}>
                    <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_SOURCE" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isSearchable={false}
                        name={"nsourcecode"}
                        isDisabled={false}
                        isMandatory={true}
                        options={props.sourceValues || []}
                        optionId='nsourcecode'
                        optionValue='ssourcename'
                        value={props.selecteRecord ? props.selecteRecord.nsourcecode : ""}
                        showOption={true}
                        required={true}
                        onChange={(event) => props.onComboChange(event, 'nsourcecode')}
                        isMulti={false}
                        closeMenuOnSelect={true}
                    //alphabeticalSort={true}
                    />
                </Col>

                <Col md={12}>

                    <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_METHOD" })}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isSearchable={false}
                        name={"nmethodcode"}
                        isDisabled={false}
                        isMandatory={true}
                        options={props.methodValues || []}
                        optionId='nmethodcode'
                        optionValue='smethodname'
                        value={props.selecteRecord ? props.selecteRecord.nmethodcode : ""}
                        showOption={true}
                        required={true}
                        onChange={(event) => props.onComboChange(event, 'nmethodcode')}
                        isMulti={false}
                        closeMenuOnSelect={true}
                    //alphabeticalSort={true}
                    />
                </Col>
            </Row >
        </>
    )
}
export default injectIntl(TestEditForm);
