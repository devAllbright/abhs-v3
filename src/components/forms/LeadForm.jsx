import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .min(7, "Phone number is required")
    .regex(/^[0-9+\-() ]+$/, "Invalid phone number"),
  service_details: z.string().min(1, "Service details are required"),
  home_size: z.string().min(1, "Please select a home size"),
});

export default function LeadForm({ onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const [submitError, setSubmitError] = useState("");

  async function onSubmit(values) {
    setSubmitError("");

    const payload = {
      customer: {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        mobile_number: values.phone,
        notifications_enabled: true,
      },
      note: `Service details: ${values.service_details}\nHome Sq. Ft.: ${values.home_size}`,
    };

    try {
      const res = await fetch(
        "https://allbright-app-production.up.railway.app/api/service-request",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        const serverMessage =
          data?.error?.message ||
          data?.error ||
          JSON.stringify(data) ||
          "Failed to submit request";

        throw new Error(serverMessage);
      }

    window.location.href = "/thank-you"
    
    } catch (err) {
      console.error("Submission error:", err);
      setSubmitError(
        err?.message || "An unexpected error occurred during submission"
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="lead-form">
      <div className="lead-form__title">
        <span>Service Request</span>
      </div>
      <div className="lead-form__subtitle">
        <span>Fill out your contact information and we will call you</span>
      </div>

      <div className="lead-form__group">
        <input placeholder="First name" {...register("first_name")} />
        {errors.first_name && (
          <span className="lead-form__err">{errors.first_name.message}</span>
        )}
      </div>

      <div className="lead-form__group">
        <input placeholder="Last name" {...register("last_name")} />
        {errors.last_name && (
          <span className="lead-form__err">{errors.last_name.message}</span>
        )}
      </div>

      <div className="lead-form__group">
        <input placeholder="Email" type="email" {...register("email")} />
        {errors.email && (
          <span className="lead-form__err">{errors.email.message}</span>
        )}
      </div>

      <div className="lead-form__group">
        <input placeholder="Phone number" {...register("phone")} />
        {errors.phone && (
          <span className="lead-form__err">{errors.phone.message}</span>
        )}
      </div>

      <div className="lead-form__group">
        <input placeholder="Service details" {...register("service_details")} />
        {errors.service_details && (
          <span className="lead-form__err">
            {errors.service_details.message}
          </span>
        )}
      </div>

      <div className="lead-form__group">
        <select defaultValue="" {...register("home_size")}>
          <option value="" disabled>
            Home Sq. Ft.
          </option>
          <option value="900-1500">900 - 1500</option>
          <option value="1500-2500">1500 - 2500</option>
          <option value="2500-3500">2500 - 3500</option>
        </select>
        {errors.home_size && (
          <span className="lead-form__err">{errors.home_size.message}</span>
        )}
      </div>

      {submitError && (
        <div className="lead-form__err" role="alert" aria-live="polite">
          {submitError}
        </div>
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
