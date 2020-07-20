import React, { Fragment, Component } from 'react'

import {Pre, Line, LineNo, LineContent, Footer, Header, Wrapper, Chart, Code } from "./styles";
import Editor from 'react-simple-code-editor'
import Highlight, { defaultProps } from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/nightOwl'

import CanvasJSReact from './assets/canvasjs.react';
//var CanvasJSReact = require('./canvasjs.react');
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

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

const styles = {
  root: {
    boxSizing: 'border-box',
    fontFamily: '"Source Sans Pro", "Source Code Pro", monospace',
    ...theme.plain
  }
}

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

  onValueChange = code => {
    this.setState({ code })
  }

  highlight = code => (
    <Highlight {...defaultProps} theme={theme} code={code} language="javascript">
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Fragment>
          {tokens.map((line, i) => (
            <Line key={i} {...getLineProps({ line, key: i })}>
              <LineNo>{i + 1}</LineNo>
              <LineContent>
                <div>
                  {line.map((token, key) => <span {...getTokenProps({ token, key })} />)}
                </div>             
              </LineContent>
            </Line>
          ))}
        </Fragment>
      )}
    </Highlight>
  )


  convertToJson = (text) => {
	  let lines = text.split('\n').filter(e => e.trim());
	  return lines.map((e) => JSON.parse(JSON.stringify(eval("(" + e + ")"))));
  }

  readInput = async (code) => {
    const lines = this.convertToJson(code);

    await this.setState({data: []});
    
    let ok = true;
    for (let i = 0; i < lines.length; i++){
      if (!this.checkStructure(lines[i], i, lines.length)) {
        return
      }
    }

    console.log(this.state.data);
    
    await this.setChart();
  }

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

  setChart = async () => {
    let chartData = [];

    this.state.data.map(data => {

      //this.state.select.map(select => {
        let cd = {
          type: "spline",
          name: data.os + "_" + data.browser,// + "_" + select,
          showInLegend: true,
          dataPoints: [
            { y: data.min_response_time, label: this.state.begin.toString() },
            { y: data.max_response_time, label: this.state.end.toString() },
          ]
        }
        chartData.push(cd);
      //});

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
      <div>
        <Wrapper>
          <Header>
            <h1>Felipe's Challenge</h1>
          </Header>
        
          <Code>
            <Editor
              value={this.state.code}
              onValueChange={this.onValueChange}
              highlight={this.highlight}
              padding={10}
              style={styles.root}
            />
          </Code>

          <Chart>
            <CanvasJSChart options = {options} />
          </Chart>

          <Footer>
            <button onClick={() => this.readInput(this.state.code)}>
              Generate Chart
            </button>
          </Footer>
        </Wrapper>
      </div>
    )
  }
}
export default EditorExample
