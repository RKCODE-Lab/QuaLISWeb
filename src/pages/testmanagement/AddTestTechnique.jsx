// import React from 'react';
// import FormSelectSearch from '../../components/form-select-search/form-select-search.component';
// import { Col } from 'react-bootstrap';
// import { injectIntl } from 'react-intl';

// const AddTestTechnique = (props) => {
//     return (
//         //  <Col md="12">
//             <FormSelectSearch
//                 formLabel={props.intl.formatMessage({ id: "IDS_TECHNIQUE" })}
//                 name={"ntechniquecode"}
//                 isDisabled={false}
//                 placeholder={props.intl.formatMessage({ id: "IDS_SELECTRECORD" })}
//                 isMandatory={props.isMulti}
//                 showOption={props.isMulti}
//                 options={props.technique}
//                 optionId='ntechniquecode'
//                 optionValue='stechniquename'
//                 onChange={value => props.onComboChange(value, props.isMulti?"availableData":"ntechniquecode", 1)}
//                 isMulti={props.isMulti}
//                 value={props.selectedRecord?props.selectedRecord[props.isMulti?"availableData":"ntechniquecode"]:""}
//                 isSearchable={true}
//                 closeMenuOnSelect={!props.isMulti}
//                 alphabeticalSort={true}
//                 isClearable={true}
//             >
//             </FormSelectSearch>
//         //  </Col>
//     );
// };

// export default injectIntl(AddTestTechnique);