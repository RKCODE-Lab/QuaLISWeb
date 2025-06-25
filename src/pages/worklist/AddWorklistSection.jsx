import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { intl } from '../../components/App';
import { MediaHeader, MediaLabel } from '../../components/App.styles';
import { ListWrapper } from '../../components/client-group.styles';
import { injectIntl } from 'react-intl';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
const AddWorklistSection = (props) => {
    return (
        <>


            <Row>

                <Col md={8}>
                    <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_ADDSECTION" })}
                        isSearchable={true}
                        name={"nsectioncode"}
                        isDisabled={false}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={true}
                        isClearable={false}
                        options={props.SectionValue}
                        value={props.selectedRecord["nsectioncode"] || ""}
                        defaultValue={props.selectedRecord["nsectioncode"]}
                        onChange={(event) => props.onComboChange(event, "nsectioncode", 1)}
                        closeMenuOnSelect={true}
                    >
                    </FormSelectSearch>
                </Col>

            </Row>

            <Row>

                <Col md={8}>
                    <FormSelectSearch
                        formLabel={props.intl.formatMessage({ id: "IDS_TEST" })}
                        isSearchable={true}
                        name={"ntestcode"}
                        isDisabled={false}
                        placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                        isMandatory={true}
                        isClearable={false}
                        options={props.TestValue}
                        value={props.selectedRecord["ntestcode"] || ""}
                        defaultValue={props.selectedRecord["ntestcode"]}
                        onChange={(event) => props.onComboChange(event, "ntestcode", 1)}
                        closeMenuOnSelect={true}
                    >
                    </FormSelectSearch>
                </Col>

            </Row>
        </>
    )
}
export default injectIntl(AddWorklistSection);
