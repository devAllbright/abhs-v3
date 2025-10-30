import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  TextField,
} from "@mui/material";
import pricingDefaults from "../data/pricingDefaults";

// --- Pricing Constants ---
const BEDROOM_INCREMENT = 25;
const BATHROOM_INCREMENT = 25;
const LINEN_PRICE = 15;
const PETS_PRICE = 15;
const SHUTTERS_PRICE = 15;
const OVEN_PRICE = 45;
const REFRIGERATOR_PRICE = 45;

export default function ShoppingLogic() {
  const [formData, setFormData] = useState({
    sqFtRange: "",
    basicPrice: 0,
    bedrooms: 0,
    bathrooms: 0,
    linens: 0,
    pets: "NO",
    shutters: "NO",
    oven: "NO",
    refrigerator: "NO",
    initialCleaningYesNo: "NO",
    initialCleaning: 0,
    minimum: 0,
    total: 0,
  });

  const [isInitialEnabled, setIsInitialEnabled] = useState(false);
  const [defaults, setDefaults] = useState(null);
  const [minValues, setMinValues] = useState({ bedrooms: 0, bathrooms: 0 });

  const getSegmentDefaults = (range) =>
    pricingDefaults.find((r) => r.sqFtRange === range);

  // ✅ Recalculate total using constants and reactive minValues
  const calculateTotal = (data) => {
    if (!defaults) return 0;

    const {
      basicPrice,
      bedrooms,
      bathrooms,
      linens,
      pets,
      shutters,
      oven,
      refrigerator,
      initialCleaningYesNo,
      initialCleaning,
      minimum,
    } = data;

    // --- Bedroom & Bathroom increments ---
    const extraBedrooms =
      bedrooms > minValues.bedrooms
        ? (bedrooms - minValues.bedrooms) * BEDROOM_INCREMENT
        : 0;

    const extraBathrooms =
      bathrooms > minValues.bathrooms
        ? (bathrooms - minValues.bathrooms) * BATHROOM_INCREMENT
        : 0;

    // --- Extras ---
    const linenCost = linens * LINEN_PRICE;
    const petsCost = pets === "YES" ? PETS_PRICE : 0;
    const shuttersCost = shutters === "YES" ? SHUTTERS_PRICE : 0;
    const ovenCost = oven === "YES" ? OVEN_PRICE : 0;
    const refrigeratorCost = refrigerator === "YES" ? REFRIGERATOR_PRICE : 0;
    const initialCost = initialCleaningYesNo === "YES" ? initialCleaning : 0;

    // --- Total calculation ---
    let total =
      basicPrice +
      linenCost +
      petsCost +
      shuttersCost +
      ovenCost +
      refrigeratorCost +
      initialCost +
      extraBedrooms +
      extraBathrooms;

    // enforce minimum total
    if (total < minimum) total = minimum;

    return total;
  };

  // ✅ When selecting a Sq Ft range
  const handleSqFtChange = (e) => {
    const range = e.target.value;
    const selected = getSegmentDefaults(range);
    if (!selected) return;

    setDefaults(selected);
    setMinValues({
      bedrooms: selected.bedrooms,
      bathrooms: selected.bathrooms,
    });

    const updated = {
      ...selected,
      sqFtRange: range,
      basicPrice: selected.minimum, // ✅ Base price to start from
      bedrooms: selected.bedrooms,
      bathrooms: selected.bathrooms,
      initialCleaningYesNo: "NO",
      initialCleaning: selected.initialCleaning,
      minimum: selected.minimum,
      total: selected.minimum,
    };

    setIsInitialEnabled(false);
    setFormData(updated);
  };

  // ✅ Handle field changes
  const handleChange = (field, value) => {
    setFormData((prev) => {
      let updated = { ...prev, [field]: value };

      if (field === "initialCleaningYesNo") {
        if (value === "YES") {
          setIsInitialEnabled(true);
          updated.initialCleaning = defaults?.initialCleaning || 0;
        } else {
          setIsInitialEnabled(false);
          updated.initialCleaning = 0;
        }
      }

      updated.total = calculateTotal(updated);
      return updated;
    });
  };

  // ✅ Auto recalc total whenever relevant data changes
  useEffect(() => {
    if (defaults) {
      setFormData((prev) => ({
        ...prev,
        total: calculateTotal(prev),
      }));
    }
  }, [
    defaults,
    minValues,
    formData.bedrooms,
    formData.bathrooms,
    formData.linens,
    formData.pets,
    formData.shutters,
    formData.oven,
    formData.refrigerator,
    formData.initialCleaningYesNo,
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
        Recurring Services Pricing
      </Typography>

      {/* Sq. Ft. Range */}
      <FormControl fullWidth margin="normal" sx={{ minWidth: "100%" }}>
        <InputLabel>Sq. Ft. Range</InputLabel>
        <Select
          value={formData.sqFtRange}
          onChange={handleSqFtChange}
          label="Sq. Ft. Range"
          MenuProps={largeMenuProps}
        >
          {pricingDefaults.map((r) => (
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
          {/* Initial Cleaning YES/NO */}
          <FormControl>
            <InputLabel>Initial Cleaning</InputLabel>
            <Select
              value={formData.initialCleaningYesNo}
              onChange={(e) =>
                handleChange("initialCleaningYesNo", e.target.value)
              }
              label="Initial Cleaning"
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
              onChange={(e) => handleChange("bedrooms", Number(e.target.value))}
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
              onChange={(e) =>
                handleChange("bathrooms", Number(e.target.value))
              }
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

          {/* Linens */}
          <FormControl>
            <InputLabel>Linens</InputLabel>
            <Select
              value={formData.linens}
              onChange={(e) => handleChange("linens", Number(e.target.value))}
              label="Linens"
              MenuProps={largeMenuProps}
            >
              {[0, 1, 2, 3].map((num) => (
                <MenuItem key={num} value={num}>
                  {num}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* YES/NO Extras */}
          {["pets", "shutters", "oven", "refrigerator"].map((field) => (
            <FormControl key={field}>
              <InputLabel>
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </InputLabel>
              <Select
                value={formData[field]}
                onChange={(e) => handleChange(field, e.target.value)}
                label={field}
                MenuProps={largeMenuProps}
              >
                <MenuItem value="YES">YES</MenuItem>
                <MenuItem value="NO">NO</MenuItem>
              </Select>
            </FormControl>
          ))}

          {/* Initial Cleaning Price */}
          <TextField
            label="Initial Cleaning Price"
            value={
              isInitialEnabled ? `$${formData.initialCleaning}` : "Disabled"
            }
            InputProps={{ readOnly: true }}
            sx={{ minWidth: "260px", fontSize: "1.9rem" }}
          />

          {/* Minimum */}
          <TextField
            label="Minimum"
            value={`$${formData.minimum}`}
            InputProps={{ readOnly: true }}
            sx={{ minWidth: "260px", fontSize: "1.9rem" }}
          />

          {/* Total */}
          <TextField
            label="Total"
            value={`$${formData.total}`}
            InputProps={{ readOnly: true }}
            sx={{
              minWidth: "260px",
              fontSize: "2rem",
              "& input": {
                color: formData.total <= formData.minimum ? "#c62828" : "#2e7d32",
                fontWeight: "700",
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
}
