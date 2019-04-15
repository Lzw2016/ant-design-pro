import React, { PureComponent } from 'react';
// import classNames from 'classnames';
// import { Button } from 'antd';
// import styles from './index.less';

class FormEngine extends PureComponent {
  static defaultProps = {
    backText: 'back to home',
    redirect: '/',
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        FormEngine
      </div>
    );
  }
}

export default FormEngine;
