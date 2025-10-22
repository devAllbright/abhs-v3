import { useEffect, useState } from "react";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import "../../../styles/pricing/shopping-cart/scroll-steps/contact-info.css";

export default function ContactInfo({ stepNumber }) {
  const [contactInfo, setContactInfo] = useState(() => {
    const stored = sessionStorage.getItem("contactInfo");
    return stored
      ? JSON.parse(stored)
      : {
          fullName: "",
          phoneNumber: "",
          address: "",
          appointment: null,
          comments: "",
        };
  });

  const handleChange = (field) => (event) => {
    const value = event?.target?.value ?? event;
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    sessionStorage.setItem("contactInfo", JSON.stringify(contactInfo));
  }, [contactInfo]);

  return (
    <div className="scroll-contact-info">
      <div className="scroll-title">
        <p>{stepNumber}. Contact Information</p>
      </div>

      <div className="info-container">
        <div className="form-group">
          <TextField
            className="form-input input-name"
            fullWidth
            label="Full Name"
            variant="outlined"
            name="fullName"
            value={contactInfo.fullName}
            onChange={handleChange("fullName")}
          />
        </div>

        <div className="form-group">
          <TextField
            className="form-input input-phone"
            fullWidth
            label="Phone Number"
            variant="outlined"
            type="tel"
            name="phoneNumber"
            value={contactInfo.phoneNumber}
            onChange={handleChange("phoneNumber")}
          />
        </div>

        <div className="form-group">
          <TextField
            className="form-input input-address"
            fullWidth
            label="Your Address"
            variant="outlined"
            name="address"
            value={contactInfo.address}
            onChange={handleChange("address")}
          />
        </div>

        <div className="form-group">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Select Date & Time"
              views={['year', 'day', 'hours']}
              value={contactInfo.appointment ? dayjs(contactInfo.appointment) : null}
              onChange={(date) => handleChange("appointment")(date?.toISOString())}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </div>

        <div className="form-group">
          <TextField
            className="form-input input-comments"
            fullWidth
            label="Comments"
            variant="outlined"
            multiline
            rows={4}
            name="comments"
            value={contactInfo.comments}
            onChange={handleChange("comments")}
          />
        </div>
      </div>
    </div>
  );
}
