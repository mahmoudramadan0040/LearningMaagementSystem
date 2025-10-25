"use client";

import { Table, Tag, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useState } from "react";

interface Student {
  key: string;
  name: string;
  student_id: string;
  username: string;
  email: string;
  class_code: string;
  phone: string;
  address: string;
  national_id: string;
  role: string;
  level_status: string;
  level: number;
  Graduated: boolean;
}

const initialData: Student[] = [
  {
    key: "1",
    name: "Ahmed Hassan",
    student_id: "STU20251021",

    username: "ahmed_hassan",
    email: "ahmed.hassan@example.com",
    class_code: "CSE301",
    phone: "+201023456789",
    address: "25 El Tahrir St, Cairo, Egypt",
    national_id: "29805121501234",
    role: "Student",
    level_status: "Active",
    level: 3,
    Graduated: false,
  },
  {
    key: "2",
    name: "Omar Ali",
    student_id: "STU20251022",
    username: "omar_ali",
    email: "omar.ali@example.com",
    class_code: "CSE301",
    phone: "+201023456799",
    address: "15 Naser St, Giza, Egypt",
    national_id: "29905121501111",
    role: "Student",
    level_status: "Inactive",
    level: 2,
    Graduated: false,
  },
  {
    key: "3",
    name: "Mona Ibrahim",
    student_id: "STU20251023",
    username: "mona_ibrahim",
    email: "mona.ibrahim@example.com",
    class_code: "CSE302",
    phone: "+201023456700",
    address: "10 Dokki St, Giza, Egypt",
    national_id: "30005121503333",
    role: "Student",
    level_status: "Active",
    level: 4,
    Graduated: true,
  },
];

export default function StudentsPage() {
  const [data, setData] = useState(initialData);

  const columns: ColumnsType<Student> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      filterSearch: true,
      filters: initialData.map((s) => ({
        text: s.name,
        value: s.name,
      })),
      onFilter: (value, record) => record.name === value,
    },
    {
      title: "Student ID",
      dataIndex: "student_id",
      key: "student_id",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Class",
      dataIndex: "class_code",
      key: "class_code",
      filters: [
        { text: "CSE301", value: "CSE301" },
        { text: "CSE302", value: "CSE302" },
      ],
      onFilter: (value, record) => record.class_code === value,
    },
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      sorter: (a, b) => a.level - b.level,
    },
    {
      title: "Status",
      dataIndex: "level_status",
      key: "level_status",
      filters: [
        { text: "Active", value: "Active" },
        { text: "Inactive", value: "Inactive" },
      ],
      onFilter: (value, record) => record.level_status === value,
      render: (status) =>
        status === "Active" ? (
          <Tag color="green">Active</Tag>
        ) : (
          <Tag color="red">Inactive</Tag>
        ),
    },
    {
      title: "Graduated",
      dataIndex: "Graduated",
      key: "Graduated",
      filters: [
        { text: "Graduated", value: true },
        { text: "Not Graduated", value: false },
      ],
      onFilter: (value, record) => record.Graduated === value,
      render: (val: boolean) =>
        val ? <Tag color="blue">Yes</Tag> : <Tag color="default">No</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Tag color="gray">Edit</Tag>
          <Tag color="red">delete</Tag>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-6">🎓 Students List</h1>

      <Table
        columns={columns}
        dataSource={data}
        pagination={{
          position: ["bottomCenter"], // center pagination
          pageSize: 5,
        }}
        bordered
        size="small"
      />
    </div>
  );
}
