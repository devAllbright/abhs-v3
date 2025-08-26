// components/forms/ContactForm.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const schema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z
    .string()
    .min(7, "Phone number is required")
    .regex(/^[0-9+\-() ]+$/, "Invalid phone number"),
  message: z.string().min(1, "Message is required"),
});

export default function ContactForm() {
  const [submitError, setSubmitError] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: zodResolver(schema) });

  async function onSubmit(values) {
    setSubmitError(null);

    const payload = {
      customer: {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        mobile_number: values.phone,
        notifications_enabled: true,
      },
      note: `Message: ${values.message}`,
    };

    try {
      const res = await fetch(
        "https://allbright-app-production.up.railway.app/api/contact-request",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to submit request");

      // ✅ Success behavior
      reset();
      setSubmitted(true);

      // Redirect to homepage after 3 seconds
      setTimeout(() => {
        window.location.href = "/";
      }, 3000);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="lead-form" noValidate>
      {submitError && (
        <div className="lead-form__err lead-form__err--global" role="alert">
          {submitError}
        </div>
      )}

      {submitted && (
        <div className="lead-form__success" role="status">
          ✅ Thanks! Your message was sent. Redirecting to homepage…
        </div>
      )}

      <div className="lead-form__title">
        <span>Get in Touch!</span>
      </div>
      <div className="lead-form__subtitle">
        <span>We will love to hear from you</span>
      </div>

      <div className="lead-form__subtitle"></div>

      <div className="lead-form__group">
        <input
          placeholder="First name"
          autoComplete="given-name"
          {...register("first_name")}
        />
        {errors.first_name && (
          <span className="lead-form__err">{errors.first_name.message}</span>
        )}
      </div>

      <div className="lead-form__group">
        <input
          placeholder="Last name"
          autoComplete="family-name"
          {...register("last_name")}
        />
        {errors.last_name && (
          <span className="lead-form__err">{errors.last_name.message}</span>
        )}
      </div>

      <div className="lead-form__group">
        <input
          placeholder="Email"
          type="email"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && (
          <span className="lead-form__err">{errors.email.message}</span>
        )}
      </div>

      <div className="lead-form__group">
        <input
          placeholder="Phone number"
          inputMode="tel"
          autoComplete="tel"
          {...register("phone")}
        />
        {errors.phone && (
          <span className="lead-form__err">{errors.phone.message}</span>
        )}
      </div>

      <div className="lead-form__group">
        <textarea
          placeholder="Your message"
          rows={4}
          {...register("message")}
        />
        {errors.message && (
          <span className="lead-form__err">{errors.message.message}</span>
        )}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
