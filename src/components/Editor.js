import React, {  Component } from 'react'
import {Footer, Header, Container, ChartContainer, Chart, Button } from "../styles";

import AceEditor from 'react-ace';

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

import SplitPane from 'react-split-pane';
import '../assets/split-pane.css';

import CanvasJSReact from '../assets/canvasjs.react';

var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const MAX_LINES = 12;

const exampleCode = `{type: 'start', timestamp: 0, select: ['min_response_time', 'max_response_time'], group: ['os', 'browser']}
{type: 'span', timestamp: 1519780251000, begin: 1519780251000, end: 1519780260201}
{type: 'data', timestamp: 1519780251000, os: 'linux', browser: 'chrome', min_response_time: 0.1, max_response_time: 0.9}
{type: 'data', timestamp: 1519780251000, os: 'mac', browser: 'chrome', min_response_time: 0.2, max_response_time: 0.8}
{type: 'data', timestamp: 1519780251000, os: 'mac', browser: 'firefox', min_response_time: 0.3, max_response_time: 1.0}
{type: 'data', timestamp: 1519780251000, os: 'linux', browser: 'firefox', min_response_time: 0.1, max_response_time: 1.3}
{type: 'data', timestamp: 1519780260201, os: 'linux', browser: 'chrome', min_response_time: 0.2, max_response_time: 0.9}
{type: 'data', timestamp: 1519780260201, os: 'mac', browser: 'chrome', min_response_time: 0.1, max_response_time: 1.0}
{type: 'data', timestamp: 1519780260201, os: 'mac', browser: 'firefox', min_response_time: 0.2, max_response_time: 1.1}
{type: 'data', timestamp: 1519780260201, os: 'linux', browser: 'firefox', min_response_time: 0.3, max_response_time: 1.4}
{type: 'stop', timestamp: 1519780260201}`


// Here in this class, it was used some components as
// Styled-Components, AceEditor to code edition, SplitPane
// to plit screen in two part and slide one of them and 
// CanvasJSReact to plot the charts. A master reset was 
// caused too in index.jsto clean styles before redecorate them
// with styled components.
export default class Editor extends Component {
  state = { 
    code: exampleCode,
    chartOptions: {},
    select: [],
    group: [],
    begin: 0,
    end: 0,
    datas: []
  }

  // It loads the code example (initial load) to be an example
  // of amount of data.
  componentDidMount() {
    this.readInput(this.state.code);
  }

  // It converts the text parammeter, getting
  // item by item and transforming them into a JSON objects
  // using a Array.prototype.map function.
  convertToJson = (text) => {
	  let lines = text.split('\n').filter(e => e.trim());
	  return lines.map((e) => JSON.parse(JSON.stringify(eval("(" + e + ")"))));
  }

  // It reads the text presents in code editor, converting it in a JSON format
  // and calls the chart ploter, considering two checks where one blocks 
  // process if the max line numbers was exceded and other that checks
  // the code structure.
  readInput = async (code) => {
    const lines = this.convertToJson(code);

    await this.setState({datas: []});
    
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
    
    await this.setChart();
  }

  // It checks the data structure considering the data type in each line
  // setting tha states with some datas to use next and also returning
  // a boolean value according the conditions.
  checkStructure = async (line, index, length) => {
    const {type} = line;
    if (index === 0 && type === 'start') {
      const {select, group} = line;
      this.setState({select, group});
      return true;
    }
    else if (index === 1 && type === 'span') {
      const {begin, end} = line;
      this.setState({begin: begin, end: end});
      return true; 
    }
    else if (index === length - 1 && type === 'stop') { return true; }
    else if (index > 1 && index < length - 1 && type === 'data') {
      
      this.setDatas(line);

      return true;
    }
    else { return false; }
  }

  // It process the data and transforms in a format that grouping
  // them by group properties presents in state previusly stored
  // to easier to manipulate next, in the chart, storeing these
  // new structured data in state.
  setDatas = async (line) => {
    let groupName = '';
    this.state.group.map(groupItem => {
      groupName += line[groupItem] + '_';
    });

    let data = this.state.datas.find(data => data.group === groupName);

    if (!data) {
      data = {
        group: groupName,
        lines: [line]
      }
      this.setState({datas: this.state.datas.concat(data)});
    } else {
      const newDatas = await this.state.datas.map(d => {
        if (d.group === groupName) {
          d.lines.push(line);
        }
      });
      this.setState({datas: newDatas});
    }
  }

  // Is builds the chart according the data structure present
  // in state, previusly processed.
  setChart = async () => {
    const {datas, select} = this.state;
    let chartData = []; 

    select.map(select => {
      datas.map(data => {
        chartData.push({
          type: "spline",
          name: data.group + select,
          showInLegend: true,
          dataPoints: this.getPoints(data.lines, select)
        });
      });
    });

    const chartOptions = {
      animationEnabled: true,	
      responsive: true,
      data: chartData,
    }

    this.setState({chartOptions});
  }

  // It get the points that will be ploted in the chart
  // considering the ChartJS pattern.
  getPoints = (lines, select) => {
    let points = [];
    points.push(
      { y: lines[0][select], label: this.state.begin.toString() },
      { y: lines[1][select], label: this.state.end.toString() }
    );
    return points;
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
