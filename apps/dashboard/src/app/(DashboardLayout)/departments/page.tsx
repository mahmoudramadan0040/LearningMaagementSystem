"use client";
import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Typography,
  Popconfirm,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  useListDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  DepartmentDto,
} from "@/store/services/departmentsApi";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";

export default function DepartmentPage() {
  const {
    data: departments = [],
    isLoading,
    refetch,
  } = useListDepartmentsQuery();
  const [createDepartment, { isLoading: isCreating }] =
    useCreateDepartmentMutation();
  const [updateDepartment, { isLoading: isUpdating }] =
    useUpdateDepartmentMutation();
  const [deleteDepartment, { isLoading: isDeleting }] =
    useDeleteDepartmentMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<DepartmentDto | null>(null);
  const [form] = Form.useForm<{ name: string; description?: string }>();

  const openCreate = () => {
    setEditing(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const openEdit = (record: DepartmentDto) => {
    setEditing(record);
    form.setFieldsValue({ name: record.name, description: record.Faculty });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditing(null);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editing) {
        await updateDepartment({
          id: editing.id as unknown as string,
          body: values,
        }).unwrap();
        message.success("Department updated");
      } else {
        await createDepartment(values).unwrap();
        message.success("Department created");
      }
      setIsModalOpen(false);
      setEditing(null);
      form.resetFields();
      refetch();
    } catch (err) {
      // validation error or API error is handled implicitly; show message if API failed
      if ((err as any)?.data?.message) {
        message.error(String((err as any).data.message));
      }
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDepartment(id).unwrap();
      message.success("Department deleted");
      refetch();
    } catch (err) {
      message.error("Failed to delete department");
    }
  };

  const columns: ColumnsType<DepartmentDto> = useMemo(
    () => [
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Faculty",
        dataIndex: "Faculty",
        key: "Faculty",
        render: (text: string | undefined) => text || "-",
      },
      {
        title: "Actions",
        key: "actions",
        width: 160,
        render: (_value, record) => (
          <Space>
            <Button icon={<EditOutlined />} onClick={() => openEdit(record)}>
              Edit
            </Button>
            <Popconfirm
              title="Delete department"
              description="Are you sure you want to delete this department?"
              okText="Delete"
              okButtonProps={{ danger: true, loading: isDeleting }}
              onConfirm={() => handleDelete(record.id as unknown as string)}
            >
              <Button danger icon={<DeleteOutlined />}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [isDeleting]
  );

  return (
    <Card>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 16,
        }}
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
          Departments
        </Typography.Title>
        <Space>
          <Button icon={<ReloadOutlined />} onClick={() => refetch()}>
            Refresh
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>
            New Department
          </Button>
        </Space>
      </div>

      <Table
        rowKey={(r) => (r.id as unknown as string) || r.name}
        loading={isLoading}
        dataSource={departments}
        columns={columns}
        pagination={{ pageSize: 10, showSizeChanger: true }}
      />

      <Modal
        title={editing ? "Edit Department" : "Create Department"}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleSubmit}
        okButtonProps={{ loading: isCreating || isUpdating }}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" preserve={false}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              { required: true, message: "Please enter department name" },
            ]}
          >
            <Input placeholder="e.g., Computer Science" />
          </Form.Item>
          <Form.Item label="Faculty" name="Faculty">
            <Input.TextArea
              placeholder="Faculty of indutry and energy "
              autoSize={{ minRows: 3 }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
