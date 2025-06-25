import React from 'react';
import { injectIntl } from 'react-intl';
import { Row, Col} from 'react-bootstrap';
import FormSelectSearch from '../../components/form-select-search/form-select-search.component';


const SiteScheduler = (props) => {
    return (
        <>
            <Row>
                
                <Col md={6}>
                <Col md={12}>
                        <FormSelectSearch
                            formLabel={props.intl.formatMessage({ id: "IDS_SITE" })}
                            isSearchable={true}
                            name={"nsitecode"}
                            isDisabled={ false}
                            placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
                            isMandatory={true}
                            isClearable={false}
                            options={props.siteList}
                            value={props.selectedRecord["nsitecode"] || ""}
                            defaultValue={props.selectedRecord["nsitecode"]}
                            onChange={(event) => props.onComboChange(event, "nsitecode")}
                            closeMenuOnSelect={true}
                        >
                        </FormSelectSearch>
                    </Col>

                  
                   
                </Col>
            </Row>
            
        </>


    )
}
export default injectIntl(SiteScheduler);
