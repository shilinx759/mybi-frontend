import {genChartByAiAsyncUsingPOST} from "@/services/mybi/chartController";
import { UploadOutlined } from '@ant-design/icons';
import { Button,Card,Form,Input,message,Select,Space,Upload } from 'antd';
import { useForm } from "antd/es/form/Form";
import React,{ useState } from 'react';

const { TextArea } = Input;
/**
 * 提交图表(异步)页面
 * @constructor
 */
const AddChartAsync: React.FC = () => {
  const [form] = useForm();
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

    //todo 对接后端调用数据
    const params = {
      ...values,
      file: undefined,
    };
    try {
      const res = await genChartByAiAsyncUsingPOST(params, {}, values.file.file.originFileObj);
      console.log(res);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        message.success('分析任务提交成功，稍后请在我的图表界面查看结果');
        form.resetFields();
      }
    } catch (e: any) {
      message.error('分析失败' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="add-chart-async">
      <Card title="智能分析">
        <Form
          form={form}
          name="addChart"
          initialValues={{}}
          onFinish={onFinish}
          labelAlign="left"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          // layout="horizontal"
          style={{ maxWidth: 600 }}
        >
          <Form.Item
            name="goal"
            label="分析目标"
            rules={[{ required: true, message: '分析目标不能为空！' }]}
          >
            <TextArea placeholder="请输入你的分析目标，比如分析网站用户的增长情况" />
          </Form.Item>

          <Form.Item name="name" label="图表名称">
            <input placeholder="输入生成图表的名称" />
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
              <Button icon={<UploadOutlined />}>上传 CSV 文件</Button>
            </Upload>
          </Form.Item>

          <Form.Item wrapperCol={{ span: 16, offset: 4 }}>
            <Space>
              <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                智能分析
              </Button>
              <Button htmlType="reset">重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};
export default AddChartAsync;
