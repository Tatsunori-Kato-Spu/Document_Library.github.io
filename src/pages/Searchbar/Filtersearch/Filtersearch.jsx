import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

import { docdata } from "../../../data/docdata"; // ข้อมูลเอกสาร

import "./Filtersearch.css";

const Filtersearch = ({ open, onClose, onApply }) => {
  const [formData, setFormData] = useState({
    docNumber: "",
    docName: "",
    department: "",
    docType: "",
    timeRange: "ทั้งหมด",
  });

  const [filteredDocs, setFilteredDocs] = useState(docdata);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleReset = () => {
    setFormData({
      docNumber: "",
      docName: "",
      department: "",
      docType: "",
      timeRange: "ทั้งหมด",
    });
    setFilteredDocs(docdata);
  };

  const handleSubmit = () => {
    let filtered = docdata;

    // กรองตามหมายเลขเอกสาร
    if (formData.docNumber) {
      filtered = filtered.filter(
        (doc) => doc["หมายเลข"] && doc["หมายเลข"].includes(formData.docNumber)
      );
    }

    // กรองตามชื่อเอกสาร
    if (formData.docName) {
      filtered = filtered.filter(
        (doc) =>
          doc["ชื่อเอกสาร"] && doc["ชื่อเอกสาร"].includes(formData.docName)
      );
    }

    // กรองตามหน่วยงาน
    if (formData.department) {
      filtered = filtered.filter(
        (doc) => doc["หน่วยงาน"] && doc["หน่วยงาน"] === formData.department
      );
    }

    // กรองตามช่วงเวลา
    if (formData.timeRange && formData.timeRange !== "ทั้งหมด") {
      const today = new Date();
      let days = 1;
      if (formData.timeRange === "7 วัน") days = 7;
      if (formData.timeRange === "30 วัน") days = 30;
      const pastDate = new Date(today.setDate(today.getDate() - days));

      filtered = filtered.filter((doc) => {
        const dateParts = doc["วันที่"].split("/"); // แยกวันที่
        const docDate = new Date(
          parseInt(dateParts[2]) - 543, // ปีเป็นพุทธศักราช ต้องลบ 543
          parseInt(dateParts[1]) - 1, // เดือนเริ่มที่ 0
          parseInt(dateParts[0]) // วัน
        );
        console.log("Doc Date:", docDate); // ดีบักวันที่ที่แปลงแล้ว
        return docDate >= pastDate;
      });
    }

    setFilteredDocs(filtered); // ปรับปรุงข้อมูลที่กรองแล้ว
    onClose();
    onApply(filtered); // ส่งข้อมูลที่กรองแล้วไปยัง Pagedoc
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>ค้นหาในเอกสาร</DialogTitle>
      <DialogContent className="filter-search-content">
        <TextField
          name="docNumber"
          label="เลขเอกสาร"
          value={formData.docNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          name="docName"
          label="ชื่อเอกสาร"
          value={formData.docName}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>หน่วยงาน</InputLabel>
          <Select
            name="department"
            value={formData.department}
            onChange={handleChange}
            sx={{ color: "white" }}
          >
            <MenuItem value="">เลือกทั้งหมด</MenuItem>
            {["บัญชี", "การตลาด", "ไอที", "ทรัพยากรบุคคล", "การเงิน"].map(
              (department) => (
                <MenuItem key={department} value={department}>
                  {department}
                </MenuItem>
              )
            )}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>ประเภทเอกสาร</InputLabel>
          <Select
            name="docType"
            value={formData.docType}
            onChange={handleChange}
          >
            <MenuItem value="">เลือกทั้งหมด</MenuItem>
            <MenuItem value="type1">ประเภท 1</MenuItem>
            <MenuItem value="type2">ประเภท 2</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>ช่วงเวลา</InputLabel>
          <Select
            name="timeRange"
            onChange={handleChange}
            sx={{ color: "white" }}
          >
            <MenuItem value="">ทั้งหมด</MenuItem>
            <MenuItem value="1 วัน">1 วัน</MenuItem>
            <MenuItem value="7 วัน">7 วัน</MenuItem>
            <MenuItem value="30 วัน">30 วัน</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReset} color="secondary" sx={{ color: "white" }}>
          รีเซ็ต
        </Button>
        <Button
          onClick={handleSubmit}
          color="primary"
          sx={{
            backgroundColor: "#FF8539", // สีพื้นหลังของปุ่ม "ค้นหา" เป็นสีส้ม
            color: "white",
            "&:hover": {
              backgroundColor: "#ff6c00", // เมื่อ hover ปุ่ม "ค้นหา" เป็นส้มเข้ม
            },
          }}
        >
          ค้นหา
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Filtersearch;
