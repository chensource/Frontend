import React, { Component } from 'react';
import config from './config.json'
import styles from './Greeter.css';//导入

var moment = require('moment');

class Greeter extends Component {
  render() {
    return (
      <div className={styles.root}>
        {config.greetText}
        现在的时间是： {moment().format()}
      </div>
    );
  }
}

export default Greeter