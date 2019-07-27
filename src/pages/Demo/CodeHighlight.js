
import React, { PureComponent } from 'react';
import { Card } from 'antd';
// import lodash from 'lodash';
// import moment from 'moment';
import CodeHighlight from '@/components/CodeHighlight';
import RemoteSelect from '@/components/RemoteSelect';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
// import classNames from 'classnames';
// import styles from './Log.less'

class Demo1 extends PureComponent {

  state = {
    count: 0,
    value: `package com.jzt.b2b3.activity.entry;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@ApiModel("满减活动销售")
@Getter
@Setter
public class RebateSale extends BaseSale {

    @ApiModelProperty("满减编号")
    private Long rebateId;

    @ApiModelProperty("满减类型(MJJ=满金额减 / MSJ=满数量减 / MJZ满金额折 / MSZ满数量折 / MMJJ每满金额减 / MMSJ每满数量减)")
    private String rebateType;

    @ApiModelProperty("叠加优惠券(0=不允许 / 1=允许)")
    private Boolean couponEnable;

    @ApiModelProperty("满减-每满门槛(数量)-只会在MMSJ满数量减时有用")
    private BigDecimal everyLeast;

    @ApiModelProperty("满减-每满额度(数量或金额)")
    private BigDecimal everyRequire;

    @ApiModelProperty("满减-每满优惠金额")
    private BigDecimal everyRebate;

    @ApiModelProperty("满减-单笔订单封顶(金额)")
    private BigDecimal eachOrderLimit;

    @ApiModelProperty("满减-每客户封顶(金额)")
    private BigDecimal eachUserLimit;

    @ApiModelProperty("满减-满减梯度信息")
    private List<ResultRebateLadder> rebateLadders;
}



`,
  }

  render() {
    const { count, value } = this.state;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          {count}
          <span style={{ display: "inline-block", width: 24 }} />
          <RemoteSelect
            defaultLoadData={this.codeHighlight ? this.codeHighlight.getAllThemes() : []}
            defaultValue="darcula"
            selectProps={{
              allowClear: false,
              filterOption: true,
              labelInValue: false,
            }}
            onChange={(newObject) => {
              if (this.codeHighlight) {
                this.codeHighlight.setTheme(newObject);
              }
            }}
          />
          <span style={{ display: "inline-block", width: 24 }} />
          <a
            onClick={() => {
              if (this.codeHighlight) {
                this.codeHighlight.setTheme("atom-one-dark");
              }
            }}
          >
            atom-one-dark
          </a>
          <br />
          <br />
          <br />
          <CodeHighlight
            ref={codeHighlight => {
              this.codeHighlight = codeHighlight;
            }}
            width="calc(100% - 50px)"
            height={600}
            // height="100%"
            codeHighlightProps={{
              value,
              theme: "darcula", // darcula monokai-sublime atom-one-dark atom-one-light
            }}
            onInited={() => this.setState({ count: count + 1 })}
          />
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Demo1;
