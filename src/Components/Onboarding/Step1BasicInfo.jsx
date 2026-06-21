import { useState } from "react";
import "./Step1BasicInfo.css";

const BRANCHES = [
  "CSE", "ECE", "EEE", "IT", "Mechanical", "Civil",
  "Chemical", "Biotech", "Aerospace", "Other",
];
const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduated"];

export default function Step1BasicInfo({ data, onNext }) {
  const [form, setForm] = useState({
    name:    data.name    || "",
    college: data.college || "",
    branch:  data.branch  || "",
    year:    data.year    || "",
    gender:  data.gender  || "",
    phone:   data.phone   || "",
  });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = "Your name is required.";
    if (!form.college.trim()) e.college = "College name is required.";
    if (!form.branch)         e.branch  = "Select your branch.";
    if (!form.year)           e.year    = "Select your current year.";
    if (!form.gender)         e.gender  = "Select your gender.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onNext(form);
  };

  const field = (key) => ({
    value:    form[key],
    onChange: set(key),
    className: `am-input${errors[key] ? " am-input--error" : ""}`,
  });

  return (
    <form className="ob-form" onSubmit={handleSubmit} noValidate>

      <div className="ob-field-grid">
        <div className="am-field ob-field--full">
          <label className="am-label">FULL NAME <span className="ob-required">*</span></label>
          <div className="am-input-wrap">
            <input {...field("name")} type="text" placeholder="e.g. Arjun Sharma" autoFocus autoComplete="name" />
          </div>
          {errors.name && <span className="ob-field-err">{errors.name}</span>}
        </div>

        <div className="am-field ob-field--full">
          <label className="am-label">COLLEGE / UNIVERSITY <span className="ob-required">*</span></label>
          <div className="am-input-wrap">
            <input {...field("college")} type="text" placeholder="e.g. IIT Bombay, VIT, BITS Pilani…" autoComplete="organization" />
          </div>
          {errors.college && <span className="ob-field-err">{errors.college}</span>}
        </div>

        <div className="am-field">
          <label className="am-label">BRANCH <span className="ob-required">*</span></label>
          <div className="am-input-wrap">
            <select {...field("branch")} className={`am-input ob-select${errors.branch ? " am-input--error" : ""}`}>
              <option value="">Select branch…</option>
              {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          {errors.branch && <span className="ob-field-err">{errors.branch}</span>}
        </div>

        <div className="am-field">
          <label className="am-label">CURRENT YEAR <span className="ob-required">*</span></label>
          <div className="am-input-wrap">
            <select {...field("year")} className={`am-input ob-select${errors.year ? " am-input--error" : ""}`}>
              <option value="">Select year…</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          {errors.year && <span className="ob-field-err">{errors.year}</span>}
        </div>

        <div className="am-field ob-field--full">
          <label className="am-label">GENDER <span className="ob-required">*</span></label>
          <div className="ob-gender-options" role="radiogroup" aria-label="Gender">
            {['Male', 'Female'].map(option => (
              <button
                key={option}
                type="button"
                className={`ob-gender-option${form.gender === option.toLowerCase() ? ' ob-gender-option--active' : ''}`}
                aria-pressed={form.gender === option.toLowerCase()}
                onClick={() => setForm(f => ({ ...f, gender: option.toLowerCase() }))}
              >
                <span className="ob-gender-dot" />
                {option}
              </button>
            ))}
          </div>
          {errors.gender && <span className="ob-field-err">{errors.gender}</span>}
        </div>

        <div className="am-field ob-field--full">
          <label className="am-label">PHONE <span className="ob-optional">(optional)</span></label>
          <div className="am-input-wrap">
            <input {...field("phone")} type="tel" placeholder="+91 98765 43210" autoComplete="tel" />
          </div>
        </div>
      </div>

      <div className="ob-actions">
        <button type="submit" className="ob-btn-primary">
          Save &amp; Continue →
        </button>
      </div>

    </form>
  );
}
