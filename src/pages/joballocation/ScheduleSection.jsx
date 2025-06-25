import React from 'react';
import { Row, Col } from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
import {injectIntl } from 'react-intl';

const ScheduleSection = (props) => {
    console.log("Change Section",props.selectedRecord["nsectioncode"] )
    return (
        
        <>   
             
        <Row>

            <Col md={12}>
                <Row>
                 <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_SECTION" })}
                            isSearchable={true}
                            name={"nsectioncode"}
                            isDisabled={false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.section}
                            value = { props.selectedRecord["nsectioncode"] || "" }
                            onChange={(event)=>props.onComboChange(event, "nsectioncode")}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>
                                  
                </Row>
            </Col>
                      
        </Row>
      
            </>


    );
}
export default injectIntl(ScheduleSection);