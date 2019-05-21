import React, { PureComponent } from 'react';
import { Card, Select, Spin } from 'antd';
import debounce from 'lodash/debounce';
// import RemoteSelectInput from '@/components/RemoteSelectInput'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
// import styles from './Log.less'

class RemoteSelectInput extends PureComponent {

  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchUser = debounce(this.fetchUser, 500);
    this.fetchUser("");
  }

  state = {
    data: [],
    value: [],
    fetching: false,
  };

  fetchUser = value => {
    // console.log('fetching user', value);
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    fetch(`/api/remote/input/object?num=10&key=${value}`)
      .then(response => response.json())
      .then(body => {
        if (fetchId !== this.lastFetchId) {
          // for fetch callback order
          return;
        }
        this.setState({ data: body, fetching: false });
      });
  };

  handleChange = value => {
    this.setState({
      value,
      data: [],
      fetching: false,
    });
  };

  render() {
    const { fetching, data, value } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Select
            // mode="multiple"
            // mode="tags"
            allowClear={true}
            labelInValue
            value={value}
            placeholder="Select users"
            notFoundContent={fetching ? <Spin delay={300} size="small" /> : null}
            filterOption={false}
            showSearch
            onSearch={this.fetchUser}
            onChange={this.handleChange}
            style={{ width: 350 }}
          >
            {data.map(d => (
              <Select.Option key={d.column1}>{d.column1}</Select.Option>
            ))}
          </Select>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default RemoteSelectInput;
