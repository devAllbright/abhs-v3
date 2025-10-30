import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import pricingDefaultsOneTime from "../data/pricingDefaultsOneTime";

// --- Pricing Constants ---
const BEDROOM_INCREMENT = 25;
const BATHROOM_INCREMENT = 25;

// Safe numeric conversion
const N = (v) => {
  const n = Number(String(v ?? "").toString().replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

export default function OneTimeLogic() {
  const [formData, setFormData] = useState({
    sqFtRange: "",
    bedrooms: 0,
    bathrooms: 0,
    proServices: "NO", // default
    minimum: 0,
    total: 0,
  });

  const [defaults, setDefaults] = useState(null);
  const [minValues, setMinValues] = useState({ bedrooms: 0, bathrooms: 0 });

  const getSegmentDefaults = (range) =>
    pricingDefaultsOneTime.find((r) => r.sqFtRange === range);

  // ✅ Compute the active base (minimum) depending on Pro Services
  const activeBaseMinimum = useMemo(() => {
    if (!defaults) return 0;
    const normal = N(defaults.normal);
    const bad = N(defaults.badCondition);
    return formData.proServices === "YES" ? normal : bad;
  }, [defaults, formData.proServices]);

  // ✅ Total calculation
  const calculateTotal = (data) => {
    if (!defaults) return 0;

    const { bedrooms, bathrooms } = data;

    // Bedrooms & Bathrooms increments
    const extraBedrooms =
      N(bedrooms) > N(minValues.bedrooms)
        ? (N(bedrooms) - N(minValues.bedrooms)) * BEDROOM_INCREMENT
        : 0;

    const extraBathrooms =
      N(bathrooms) > N(minValues.bathrooms)
        ? (N(bathrooms) - N(minValues.bathrooms)) * BATHROOM_INCREMENT
        : 0;

    let total = activeBaseMinimum + extraBedrooms + extraBathrooms;

    // enforce minimum floor
    if (total < activeBaseMinimum) total = activeBaseMinimum;

    return total;
  };

  // ✅ When selecting a Sq Ft range
  const handleSqFtChange = (e) => {
    const range = e.target.value;
    const selected = getSegmentDefaults(range);
    if (!selected) return;

    setDefaults(selected);
    setMinValues({
      bedrooms: N(selected.bedrooms),
      bathrooms: N(selected.bathrooms),
    });

    // initialize base minimum immediately
    const baseMin =
      formData.proServices === "YES"
        ? N(selected.normal)
        : N(selected.badCondition);

    setFormData({
      sqFtRange: range,
      bedrooms: N(selected.bedrooms),
      bathrooms: N(selected.bathrooms),
      proServices: formData.proServices,
      minimum: baseMin,
      total: baseMin, // ✅ total starts at least at minimum
    });
  };

  // ✅ Handle field changes
  const handleChange = (field, value) => {
    setFormData((prev) => {
      let updated = { ...prev, [field]: value };

      if (field === "proServices" && defaults) {
        const newMin =
          value === "YES" ? N(defaults.normal) : N(defaults.badCondition);
        updated.minimum = newMin;
      }

      updated.total = calculateTotal(updated);
      return updated;
    });
  };

  // ✅ Auto recalc and resync minimum on dependency change
  useEffect(() => {
    if (defaults) {
      setFormData((prev) => {
        const syncedMin = activeBaseMinimum;
        const syncedTotal = calculateTotal({
          ...prev,
          minimum: syncedMin,
        });
        return {
          ...prev,
          minimum: syncedMin,
          total: syncedTotal,
        };
      });
    }
  }, [
    defaults,
    activeBaseMinimum,
    minValues,
    formData.proServices,
    formData.bedrooms,
    formData.bathrooms,
  ]);

  const largeMenuProps = {
    PaperProps: {
      sx: {
        "& .MuiMenuItem-root": {
          fontSize: "1.9rem",
          padding: "16px 22px",
        },
      },
    },
  };

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: "1000px",
        mx: "auto",
        "& .MuiFormControl-root": {
          fontSize: "1.9rem !important",
          minWidth: "260px",
          flex: "1 1 280px",
        },
        "& .MuiInputLabel-root": { fontSize: "1.8rem !important" },
        "& .MuiSelect-select, & .MuiInputBase-input": {
          fontSize: "1.9rem !important",
          padding: "16px 14px !important",
        },
        "& .MuiTextField-root input": { fontSize: "1.9rem !important" },
        "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
          { borderColor: "#1976d2 !important" },
        "& .MuiInputLabel-root.Mui-focused": { color: "#1976d2 !important" },
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontSize: "2.4rem !important",
          mb: 3,
          fontWeight: 600,
        }}
      >
        One-Time Maid Services Pricing
      </Typography>

      {/* Sq Ft Range */}
      <FormControl fullWidth margin="normal" sx={{ minWidth: "100%" }}>
        <InputLabel>Sq. Ft. Range</InputLabel>
        <Select
          value={formData.sqFtRange}
          onChange={handleSqFtChange}
          label="Sq. Ft. Range"
          MenuProps={largeMenuProps}
        >
          {pricingDefaultsOneTime.map((r) => (
            <MenuItem key={r.sqFtRange} value={r.sqFtRange}>
              {r.sqFtRange}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {formData.sqFtRange && (
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "flex-start",
          }}
        >
          {/* Pro Services */}
          <FormControl>
            <InputLabel>Pro Services</InputLabel>
            <Select
              value={formData.proServices}
              onChange={(e) => handleChange("proServices", e.target.value)}
              label="Pro Services"
              MenuProps={largeMenuProps}
            >
              <MenuItem value="YES">YES</MenuItem>
              <MenuItem value="NO">NO</MenuItem>
            </Select>
          </FormControl>

          {/* Bedrooms */}
          <FormControl>
            <InputLabel>Bedrooms</InputLabel>
            <Select
              value={formData.bedrooms}
              onChange={(e) => handleChange("bedrooms", N(e.target.value))}
              label="Bedrooms"
              MenuProps={largeMenuProps}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Bathrooms */}
          <FormControl>
            <InputLabel>Bathrooms</InputLabel>
            <Select
              value={formData.bathrooms}
              onChange={(e) => handleChange("bathrooms", N(e.target.value))}
              label="Bathrooms"
              MenuProps={largeMenuProps}
            >
              {[0, 1, 2, 3, 4, 5, 6, 7].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Minimum */}
          <TextField
            label="Minimum"
            value={`$${N(formData.minimum)}`}
            InputProps={{ readOnly: true }}
            sx={{ minWidth: "260px", fontSize: "1.9rem" }}
          />

          {/* Total */}
          <TextField
            label="Total"
            value={`$${N(formData.total)}`}
            InputProps={{ readOnly: true }}
            sx={{
              minWidth: "260px",
              fontSize: "2rem",
              "& input": {
                color:
                  N(formData.total) <= N(formData.minimum)
                    ? "#c62828"
                    : "#2e7d32",
                fontWeight: "700",
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
