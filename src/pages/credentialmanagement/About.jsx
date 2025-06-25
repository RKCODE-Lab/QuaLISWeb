import React, { useEffect, useRef, useState } from "react"
import { FormattedMessage, injectIntl } from "react-intl"
import {  Row, Col, Modal,Container,Image  } from 'react-bootstrap'
import { ReadOnlyText } from '../../components/App.styles';
import Logo from '../../assets/image/qualis-lims@3x.png';
import PrimaryLogo from '../../assets/image/sidebar-logo.png';
import {LoginLeftContainer, LoginRightContainer, 
    LogoContainer, VersionTxt, WelcomeTxt, SubTxt,CardImgRight, TagLine} from '..//..//components//login//login.styles';
    import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
    import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

    const About =(props)=>{
    let jsondata=[];

     jsondata=props.aboutInfo;
    let width=props.width;
    let height=props.height;
    //const dataObject = JSON.parse(jsondata);
    // const styles = {
    //     "margin-left":'-rem !important'
    //     // Add more styles as needed
    //   };
    return( 
        <>
          <Modal show={props.isOpen} onHide={()=>props.closeAbout()} size="md" centered backdrop="static" keyboard={false} height={height} width={width}>
            
          <div className="about-logo-dummy "></div>

            <div>

                <Container fluid={true} className="px-0">
                    <div className="d-flex about-logo">
                        <Col md="2" className=" align-self-center">
                            <div className="d-flex align-items-center" >                    
                                <Image src={PrimaryLogo} alt="Primary-Logo" width="55" className="mt-auto" />
                            </div>
                        </Col>
                        <Col md="10" className="bg-white">
                        <Modal.Header closeButton className="border-0 pb-0">
           <strong> <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />{props.intl.formatMessage({
          id: "IDS_ABOUT",
        })}</strong> 
            </Modal.Header>
                            <Modal.Body>
                        
                                {Object.entries(jsondata).map(([key, value]) => (
                                    <>
                                <span key={key}>{`${value['label']} : ${value['value']}`}</span><br/></>
                            ))}                         
                            </Modal.Body>
                        </Col>
                    </div>
                </Container>
            </div>
            
            {/* <div>
                <Modal.Body>
            
                    {Object.entries(jsondata).map(([key, value]) => (
                    <ReadOnlyText key={key}>{`${key}: ${value}`}</ReadOnlyText>
                   ))}                         
              </Modal.Body>
            </div> */}
            
          </Modal>    
          </>
      )
}
export default injectIntl(About)