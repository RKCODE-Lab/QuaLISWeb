import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { injectIntl } from 'react-intl';
import FormTextarea from '../../components/form-textarea/form-textarea.component';
import { intl } from '../../components/App';
import { MediaHeader, MediaLabel, MediaSubHeader } from '../../components/App.styles';

const ResultEntryParamCommetsForm = (props) => {
    return (
        <>
            {Object.values(props.selecteRecord).length > 0 ?
                <Row className="mb-4">
                    <Col md={12}>

                        <MediaHeader className={`labelfont`}>Test:{" " + props.selecteRecord.stestsynonym}</MediaHeader>
                        <MediaSubHeader>
                            <MediaLabel className={`labelfont`}>Parameter: {props.selecteRecord.sparametersynonym}</MediaLabel>
                        </MediaSubHeader>
                    </Col>
                </Row>

                : ""}

            <Row>
                <Col md={12}>
                    <FormTextarea
                        name={"parametercomments"}
                        label={""}
                        placeholder={intl.formatMessage({ id: "IDS_PARAMETERCOMMENTS" })}
                        type="text"
                        value={Object.values(props.selecteRecord).length > 0 ? props.selecteRecord.sresultcomment : ""}
                        isMandatory={false}
                        required={true}
                        maxLength={255}
                        onChange={(event) => props.onInputChange(event, "sresultcomment")}
                    />
                </Col>
            </Row>
        </>
    )
}
export default injectIntl(ResultEntryParamCommetsForm);
