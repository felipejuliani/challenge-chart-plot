import React, {  Component } from 'react'
import {Footer, Header, Container, ChartContainer, Chart, Button } from "./styles";

import AceEditor from 'react-ace';

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

import SplitPane from 'react-split-pane';
import './assets/split-pane.css';

import CanvasJSReact from './assets/canvasjs.react';

var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const MAX_LINES = 12;

const exampleCode = `{type: 'start', timestamp: 0, select: ['min_response_time', 'max_response_time'], group: ['os', 'browser']}
{type: 'span', timestamp: 0, begin: 0, end: 1}
{type: 'data', timestamp: 0, os: 'linux', browser: 'chrome', min_response_time: 0.1, max_response_time: 0.2}
{type: 'data', timestamp: 0, os: 'mac', browser: 'chrome', min_response_time: 0.2, max_response_time: 0.5}
{type: 'data', timestamp: 0, os: 'mac', browser: 'firefox', min_response_time: 0.3, max_response_time: 0.4}
{type: 'data', timestamp: 0, os: 'linux', browser: 'firefox', min_response_time: 0.1, max_response_time: 0.3}
{type: 'data', timestamp: 0, os: 'linux', browser: 'chrome', min_response_time: 0.8, max_response_time: 0.9}
{type: 'data', timestamp: 0, os: 'mac', browser: 'chrome', min_response_time: 0.7, max_response_time: 1.0}
{type: 'data', timestamp: 0, os: 'mac', browser: 'firefox', min_response_time: 0.8, max_response_time: 1.1}
{type: 'data', timestamp: 0, os: 'linux', browser: 'firefox', min_response_time: 0.9, max_response_time: 1.4}
{type: 'stop', timestamp: 1}`

class EditorExample extends Component {
  state = { 
    code: exampleCode,
    chartOptions: {},
    select: [],
    begin: 0,
    end: 1,
    data: [
      {
        timestamp: 0,
        os: null,
        browser: null,
        min_response_time: 0,
        max_response_time: 0
      }
    ]
  }

  // This load the code exemple (initial load)
  componentDidMount() {
    this.readInput(this.state.code);
  }

  // This convert the text line comeing to the read input
  convertToJson = (text) => {
	  let lines = text.split('\n').filter(e => e.trim());
	  return lines.map((e) => JSON.parse(JSON.stringify(eval("(" + e + ")"))));
  }

  // This read the text presents in code editor, convert it in a JSON format, check the
  // code structure, line by line, and calls the chart ploter
  readInput = async (code) => {
    const lines = this.convertToJson(code);

    await this.setState({data: []});
    
    let ok = true;
    for (let i = 0; i < lines.length; i++){
      if (i > MAX_LINES) { 
        alert("The maximum number of lines has been exceeded. Please, please try again with fewer data lines.");
        return
      }
      
      if (!this.checkStructure(lines[i], i, lines.length)) {
        alert("The structure is wrong. Please, check the pattern.");
        return
      }
    }

    console.log(this.state.data);
    
    await this.setChart();
  }

  // This check the data structure considering data type in each line
  //checked returning a boolean value according the conditions
  checkStructure = async (line, index, length) => {
    const {type} = line;
    if (index === 0 && type === 'start') {
      const {select} = line;
      await this.setState({select});
      return true;
    }
    else if (index === 1 && type === 'span') {
      const {begin, end} = line;
      await this.setState({begin: begin, end: end});
      return true; 
    }
    else if (index === length - 1 && type === 'stop') { return true; }
    else if (index > 1 && index < length - 1 && type === 'data') {
      const {timestamp, os, browser, min_response_time, max_response_time} = line;
      const dataInstance = {timestamp, os, browser, min_response_time, max_response_time };
      const newData = this.state.data.concat(dataInstance);
      await this.setState({data: newData});
      return true;
    }
    else { return false; }
  }

  // This build chart according the data structure...
  // But I did'nt understand ridht the labels about minimum
  // and maximum response times for key pair os and browser.
  // Example: linux and mac have two lines, but both have
  // minimum and maximum response times. So what's the real
  // minimum and maximum response times to be considered?
  // For this reason I have had implemented labels without
  // minimum and maximuns response times.
  setChart = async () => {
    const {data} = this.state;
    let chartData = [];

    data.map(data => {
      let cd = {
        type: "spline",
        name: data.os + "_" + data.browser,
        showInLegend: true,
        dataPoints: [
          { y: data.min_response_time, label: this.state.begin.toString() },
          { y: data.max_response_time, label: this.state.end.toString() },
        ]
      }
      chartData.push(cd);
    });

    console.log(chartData);

    const chartOptions = {
      animationEnabled: true,	
      responsive: true,
      toolTip: {
        shared: true
      },
      data: chartData,
    }

    await this.setState({chartOptions});
  }

  render() {
    const options = this.state.chartOptions;

    return (
      <Container>
        <Header>
          <h1>Felipe's Challenge</h1>
        </Header>

        <SplitPane split="horizontal"
                   minSize={220}
                   style={{position: 'relative'}}
                   pane1Style={{}}
                   pane2Style={{backgroundColor: '#fff'}}>
          <AceEditor mode="javascript"
                     theme="monokai"
                     width="100%"
                     height="100%"
                     showGutter={true}
                     fontSize={16}
                     value={this.state.code}
                     onChange={(value) => this.setState({code: value})}
          />

          <ChartContainer>
            <div></div>
            <Chart>
              <div></div>
              <CanvasJSChart options={options} 
                             onRef={ref => this.chart = ref}
			        />
              <div></div>
            </Chart>
            <div></div>
          </ChartContainer>
        </SplitPane>

        <Footer>
          <Button onClick={() => this.readInput(this.state.code)}>
            Generate Chart
          </Button>
        </Footer>
      </Container>
    )
  }
}
export default EditorExample
