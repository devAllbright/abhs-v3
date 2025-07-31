import "../../../styles/pricing/shopping-cart/scroll-steps/contact-info.css";
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";

export default function ContactInfo({ stepNumber }) {
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
          />
        </div>

        <div className="form-group">
          <TextField
            className="form-input input-address"
            fullWidth
            label="Your Address"
            variant="outlined"
            name="address"
          />
        </div>

        <div className="form-group">
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker label="Select Date & Time" renderInput={(params) => <TextField {...params} fullWidth />} />
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
          />
        </div>
      </div>
    </div>
  );
}
