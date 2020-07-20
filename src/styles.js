import styled from "styled-components";

export const Wrapper = styled.div`
  font-family: sans-serif;
  text-align: center;
`;

export const Pre = styled.pre`
  text-align: left;
  margin: 1em 0;
  padding: 0.5em;
  overflow: scroll;

  & .token-line {
    line-height: 1.3em;
    height: 1.3em;
  }
`;

export const Line = styled.div`
  display: table-row;
`;

export const LineNo = styled.span`
  display: table-cell;
  text-align: right;
  padding-right: 1em;
  user-select: none;
  opacity: 0.4;
`;

export const LineContent = styled.span`
  display: table-cell;
`;

export const Header = styled.div`
  position: fixed;
  text-align: left;
  width: "100%";
  padding: 2em;
`;

export const Footer = styled.div`
  text-align: left;
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  width: "100%"
  padding: 2em;
`;

export const Code = styled.div`
  text-align: left;
  font-family: "Source Sans Pro", "Source Code Pro", monospace;
  font-size: 18;
  width: "100%"  
  height: "50%"
  padding: 2em;
`;

export const Chart = styled.div`
  width: "100%";
  height: "50%";
  background: #666;
  padding: 2em;
`;
