import { genChartByAiUsingPOST } from '@/services/mybi/chartController';
import { UploadOutlined } from '@ant-design/icons';
import {Button, Card, Col, Divider, Form, Input, message, Row, Select, Space, Spin, Upload} from 'antd';
import ReactECharts from 'echarts-for-react';
import React,{ useState } from 'react';

const { TextArea } = Input;
/**
 * 提交图表页面
 * @constructor
 */
const AddChart: React.FC = () => {
  const [chart, setChart] = useState<API.BiResponse>();
  const [option, setOption] = useState<any>();
  const [submitting, setSubmitting] = useState<boolean>(false);


  /**
   * 提交
   * @param values
   */
  const onFinish = async (values: any) => {
    console.log('表单内容：', values);
    //避免重复提交
    if (submitting) {
      return;
    }
    setSubmitting(true);
    setOption(undefined);
    setChart(undefined);

    //todo 对接后端调用数据
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await genChartByAiUsingPOST(params, {}, values.file.file.originFileObj);
      console.log(res);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析成功');
        const chartOption = JSON.parse(res.data.genChart ?? '');
        if (!chartOption) {
          throw new Error('图表代码解析错误');
        }else {
          setChart(res.data);
          setOption(chartOption);
        }
      }
    } catch (e: any) {
      message.error('分析失败' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="add-chart">
      <Row gutter={24}>
        <Col span={12}>
          <Card title="智能分析">
            <Form
              onFinish={onFinish}
              labelCol={{span: 4}}
              wrapperCol={{span: 14}}
              layout="horizontal"
              style={{maxWidth: 600}}
            >
              <Form.Item
                name="goal"
                label="分析目标"
                rules={[{required: true, message: '分析目标不能为空！'}]}
              >
                <TextArea placeholder="请输入你的分析目标，比如分析网站用户的增长情况"/>
              </Form.Item>

              <Form.Item name="name" label="图表名称">
                <input placeholder="输入生成图表的名称"/>
              </Form.Item>

              <Form.Item name="chartType" label="图表类型">
                <Select
                  options={[
                    {
                      value: '折线图',
                      label: '折线图',
                    },
                    {
                      value: '柱状图',
                      label: '柱状图',
                    },
                    {
                      value: '饼图',
                      label: '饼图',
                    },
                    {
                      value: '雷达图',
                      label: '雷达图',
                    },
                    {
                      value: '堆叠图',
                      label: '堆叠图',
                    },
                  ]}
                ></Select>
              </Form.Item>


              <Form.Item name="file" label="原始数据">
                <Upload name="file" maxCount={1}>
                  <Button icon={<UploadOutlined/>}>上传 CSV 文件</Button>
                </Upload>
              </Form.Item>

              <Form.Item wrapperCol={{ span: 16, offset: 4 }}>
                <Space>
                  {/*loading={submitting} disabled={submitting}*/}
                  {/*如果正在提交就不能重复提交*/}
                  <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                    智能分析
                  </Button>
                  <Button htmlType="reset">重置</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="图表">
              {
                //chart?.genChart 是字符串 不是一个对象，用工具转成对象, 并且做一下校验
                option ?  <ReactECharts option={option}/> : <div>请先在左侧进行提交</div>
              }
              {/*等待的时候转圈圈*/}
              <Spin spinning={submitting}/>

          </Card>
          <Divider/>
          <Card title="分析结论">
              {/*分析结论:{chart?.genResult}*/}
              {chart?.genResult ?? <div>请先在左侧进行提交</div>}
              <Spin spinning={submitting}/>
          </Card>

        </Col>
      </Row>
    </div>
  );
};
export default AddChart;
