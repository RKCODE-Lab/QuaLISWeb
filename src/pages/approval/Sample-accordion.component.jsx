import React from 'react';
import { injectIntl } from 'react-intl';
import {Accordion, Card, Media, useAccordionToggle} from "react-bootstrap";
import AccordionContext from "react-bootstrap/AccordionContext";
import {AtAccordion} from '../../components/custom-accordion/custom-accordion.styles';
// import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Form} from 'react-bootstrap';   
import { ClientList, MediaHeader, MediaLabel, MediaSubHeader } from '../../components/App.styles';

const CustomToggle = ({ children,accordionObject,selectedKey, eventKey}) => {
  const currentEventKey = React.useContext(AccordionContext);
  const isCurrentEventKey = currentEventKey === eventKey;
  const decoratedOnClick = useAccordionToggle( eventKey,
      () => isCurrentEventKey ? "" : children.props.onExpandCall()
    );
  return (
      <div className="d-flex"onClick={decoratedOnClick}>
        <ClientList className="product-list">
          <Media>
        <Form.Check custom type="checkbox" id="customControl" className="mr-3" >
            <Form.Check.Input type="checkbox" id={`tm_customCheck_${accordionObject.preregno}`}
                checked={accordionObject.preregno === selectedKey? true : false}
                readOnly
            />
            <Form.Check.Label htmlFor={`tm_customCheck_${accordionObject.preregno}`}></Form.Check.Label>
        </Form.Check>
        {isCurrentEventKey ? 
            <FontAwesomeIcon className="mr-3" icon={faChevronUp}/>
          : <FontAwesomeIcon className="mr-3" icon={faChevronDown}/>}
        {children}    
        </Media>
        </ClientList>                        
      </div>
    );
}

const CustomAccordion = (props) => { 
  const keys = [...props.accordionComponent.keys()];

    return (
      <AtAccordion>
        <Accordion activeKey={String(props.selectedKey)}>
          <Card>
            { keys.map((item, index) =>{
              const accordionObject = props.accordionComponent.get(item)["props"][props.accordionObjectName];
                return(<> 
                  <Card.Header>
                  <Media>
                    <CustomToggle accordionObject={accordionObject} selectedKey={props.selectedKey} eventKey={String(accordionObject[props.accordionPrimaryKey])}>
                    <Media.Body onExpandCall={()=> props.accordionClick({...props.inputParam, [props.accordionObjectName]:accordionObject})}>
                    <MediaHeader className="mt-0 text-wrap">
                        { accordionObject[props.accordionTitle]}
                      </MediaHeader>
                      <MediaSubHeader>
                        <MediaLabel>Registered</MediaLabel>
                        <MediaLabel className="seperator">|</MediaLabel>
                        <MediaLabel>10/10/2020 11:24 AM</MediaLabel>
                      </MediaSubHeader>
                      </Media.Body> 
                    </CustomToggle>
                    
                    </Media>
                  </Card.Header>
                  <Accordion.Collapse eventKey={String(accordionObject[props.accordionPrimaryKey])}>
                    <Card.Body>
                    {props.accordionComponent.get(item)} 
                    </Card.Body>
                  </Accordion.Collapse>
               </>)})}  
          </Card>
          
      </Accordion>
    </AtAccordion>
    )}

export default injectIntl(CustomAccordion);