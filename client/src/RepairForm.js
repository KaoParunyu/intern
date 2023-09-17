import React, { useState } from 'react';

function RepairForm({ onSubmit }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'รอดำเนินการ',
    repairType: '1', // ประเภทการซ่อมเริ่มต้น
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">หัวข้อการแจ้งซ่อม:</label>
      <input
        type="text"
        id="title"
        name="title"
        required
        value={formData.title}
        onChange={handleChange}
      /><br />

      <label htmlFor="description">รายละเอียด:</label>
      <textarea
        id="description"
        name="description"
        required
        value={formData.description}
        onChange={handleChange}
      ></textarea><br />

      <label htmlFor="status">สถานะ:</label>
      <select
        id="status"
        name="status"
        value={formData.status}
        onChange={handleChange}
      >
        <option value="รอดำเนินการ">รอดำเนินการ</option>
        <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
        <option value="เสร็จสมบูรณ์">เสร็จสมบูรณ์</option>
      </select><br />

      <label htmlFor="repairType">ประเภทการซ่อม:</label>
      <select
        id="repairType"
        name="repairType"
        value={formData.repairType}
        onChange={handleChange}
      >
        <option value="1">คอมพิวเตอร์</option>
        <option value="2">เครื่องปริ้น</option>
        <option value="3">อินเทอร์เน็ต</option>
      </select><br />

      <label htmlFor="image">รูปภาพ:</label>
      <input
        type="file"
        id="image"
        name="image"
        onChange={handleChange}
      /><br />

      <button type="submit">ส่งแบบฟอร์ม</button>
    </form>
  );
}

export default RepairForm;
