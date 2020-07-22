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
  font-family: sans-serif;
  text-align: left;
  padding: 8px 8px 8px 24px;
  background-color: #888;
`;

export const Footer = styled.div`
  text-align: left;
  padding: 12px;
  background-color: #888;
`;

export const Chart = styled.div`
  text-align: center;
  background-color: #fff;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 50px 1fr 50px;
`;

export const Container = styled.div`
  text-align: center;
  background-color: #fff;
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-rows: 50px 1fr 50px;
`;

export const ChartContainer = styled.div`
  text-align: center;
  background-color: #fff;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 50px 1fr 50px;
`;

export const Button = styled.div`
  text-align: center;
  background-color: #3399ff;
  font-family: sans-serif;
  width: 140px;
  height: 22px;
  color: #fff;
  font-size: 16;
  display: table-cell;
  padding-top: 4px;
  border: 2px solid #3399ee;
  border-radius: 10px;
  &:hover {
    border: 2px solid #33adff;
    border-radius: 10px;
    cursor: pointer;
  }
  &:click {
    color: #b3e0ff;
  }
`;