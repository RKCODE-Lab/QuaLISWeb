import React from 'react';
import {injectIntl } from 'react-intl';
import {Row, Col} from 'react-bootstrap';
import DataGridWithSelection from '../../../components/data-grid/DataGridWithSelection';


const RemoveBatchComponent = (props) =>{    
       return (      
        <Row> 
                 <Col>      
                        <DataGridWithSelection
                                primaryKeyField={"nbatchcompcode"}                               
                                data={props.batchComponentDeleteList }
                                selectAll={props.deleteComponentSelectAll}
                                title={props.intl.formatMessage({id:"IDS_SELECTTODELETE"})}
                                headerSelectionChange={props.deleteComponentHeaderSelectionChange}
                                selectionChange={props.deleteSelectionChange}
                                extractedColumnList={[  {idsName:"IDS_ARNO", dataField:"sarno"},
                                                        {idsName:"IDS_COMPONENTNAME", dataField:"scomponentname"},
                                                        {idsName:"IDS_BATCHLOTNO", dataField:"smanuflotno"},
                                                        {idsName:"IDS_SPECNAME", dataField:"sspecname"}]}
                              
                        /> 
                </Col>
        </Row>      
       )
   }
   export default injectIntl(RemoveBatchComponent);
