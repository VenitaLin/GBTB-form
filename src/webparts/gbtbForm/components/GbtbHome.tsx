import * as React from "react";
import * as ReactDOM from "react-dom";
import styles from "./GbtbForm.module.scss";
import {GbtbForm} from './GbtbForm';
import * as App from "./GbtbFormApp";
// type MyProps = { ... };
type MyState = { date: Date};

export default class HomePage extends React.Component <{}, MyState> {
    timerID: number;
    constructor(props) {
      super(props);
      this.state = {
          date: new Date()
        };
    }
  
    componentDidMount() {
      this.timerID = setInterval(
        () => this.tick(),
        1000
      );
    }
  
    tick() {
      this.setState({
        date: new Date()
      });
    }
  
    render() {
      return (
        <div>
          <h1>Hello, world!</h1>
          <h2>It is {this.state.date.toLocaleTimeString()}.</h2>
            <GbtbForm siteDetails={this.props}/>
        </div>
      );
    }
  }
  

  