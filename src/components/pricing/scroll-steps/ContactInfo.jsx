import { useEffect, useState } from "react";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import "../../../styles/pricing/shopping-cart/scroll-steps/contact-info.css";

export default function ContactInfo() {
  const [contactInfo, setContactInfo] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    appointment: null,
    comments: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = sessionStorage.getItem("contactInfo");
      if (stored) {
        setContactInfo(JSON.parse(stored));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("contactInfo", JSON.stringify(contactInfo));
    }
  }, [contactInfo]);

  const handleChange = (field) => (event) => {
    const value = event?.target?.value ?? event;
    setContactInfo((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="scroll-contact-info">
      <div className="scroll-title">
        <p>Contact Information</p>
      </div>

      <div className="info-container">
        <div className="form-group">
          <span className="form-label">Full Name</span>
          <TextField
            className="form-input input-name"
            fullWidth
            placeholder="Enter your full name"
            variant="outlined"
            name="fullName"
            value={contactInfo.fullName}
            onChange={handleChange("fullName")}
            InputLabelProps={{ shrink: false }}
          />
        </div>

        <div className="form-group">
          <span className="form-label">Phone Number</span>
          <TextField
            className="form-input input-phone"
            fullWidth
            placeholder="Enter your phone number"
            variant="outlined"
            type="tel"
            name="phoneNumber"
            value={contactInfo.phoneNumber}
            onChange={handleChange("phoneNumber")}
            InputLabelProps={{ shrink: false }}
          />
        </div>

        <div className="form-group">
          <span className="form-label">Your Address</span>
          <TextField
            className="form-input input-address"
            fullWidth
            placeholder="Enter your address"
            variant="outlined"
            name="address"
            value={contactInfo.address}
            onChange={handleChange("address")}
            InputLabelProps={{ shrink: false }}
          />
        </div>

        <div className="form-group">
          <span className="form-label">Select Date & Time</span>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              views={["year", "day", "hours"]}
              value={contactInfo.appointment ? dayjs(contactInfo.appointment) : null}
              onChange={(date) => handleChange("appointment")(date?.toISOString())}
              slotProps={{
                textField: {
                  fullWidth: true,
                  placeholder: "Pick a date and hour",
                  InputLabelProps: { shrink: false },
                },
              }}
            />
          </LocalizationProvider>
        </div>

        <div className="form-group full-width">
          <span className="form-label">Comments / Details</span>
          <TextField
            className="form-input input-comments"
            fullWidth
            placeholder="Add additional details"
            variant="outlined"
            multiline
            rows={4}
            name="comments"
            value={contactInfo.comments}
            onChange={handleChange("comments")}
            InputLabelProps={{ shrink: false }}
          />
        </div>
      </div>
    </div>
  );
}
