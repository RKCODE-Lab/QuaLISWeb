import axios from 'axios';
const baseURL = window.location.origin + '/QuaLIS'
//Uncomment below for java 8 and comment for Java 21
//const baseURL = 'http://localhost:7072/QuaLIS';
//Comment below for Java 8 and uncomment for Java 21
//const baseURL = 'http://localhost:6063/QuaLIS';
//const baseURL = 'http://localhost:8010/QuaLIS';
export default axios.create({
  baseURL: baseURL
});

export const serverUrl = () => {
  return baseURL
}

export const clientUrl = () => {
  return baseURL
}

export const fileViewUrl = () => {
  //return 'http://localhost:9091'
   return window.location.origin
}

export const reportUrl = () => {
  //return 'http://localhost:9091' + '/JavaReportingTool/';
  //return 'http://localhost:9090';
  return window.location.origin + '/JavaReportingTool/';
}
