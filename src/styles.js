import Styled from "styled-components";

export const Header = Styled.div`
  font-family: sans-serif;
  text-align: left;
  padding: 8px 8px 8px 24px;
  background-color: #888;
`;

export const Footer = Styled.div`
  text-align: left;
  padding: 12px;
  background-color: #888;
`;

export const Chart = Styled.div`
  text-align: center;
  background-color: #fff;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 50px 1fr 50px;
`;

export const Container = Styled.div`
  text-align: center;
  background-color: #fff;
  width: 100vw;
  height: 100vh;
  display: grid;
  grid-template-rows: 50px 1fr 50px;
`;

export const ChartContainer = Styled.div`
  text-align: center;
  background-color: #fff;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 20px 1fr 20px;
`;

export const Button = Styled.div`
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
  border-radius: 4px;
  &:hover {
    border: 2px solid #33adcc;
    cursor: pointer;
  }
  &:click {
    color: #b3e0ff;
  }
`;