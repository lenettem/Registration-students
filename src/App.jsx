



import { useState } from 'react';

const initialForm = {
  name: '',
  email: '',
  phone: '',
  date: '',
  age: '',
  portfolio: '',
  workshop: ''
};

function RegistrationCard({ registration, onRemove }) {
  return (
    <article className="card">
      <h3>{registration.name}</h3>
      <p><strong>Email:</strong> {registration.email}</p>
      <p><strong>Phone:</strong> {registration.phone}</p>
      <p><strong>Workshop:</strong> {registration.workshop}</p>
      <p><strong>Date:</strong> {registration.date}</p>
      <p><strong>Age:</strong> {registration.age}</p>

      {registration.portfolio && (
        <p>
          <strong>Portfolio:</strong>{' '}
          <a
            href={registration.portfolio}
            target="_blank"
            rel="noreferrer"
          >
            View portfolio
          </a>
        </p>
      )}

      <button
        type="button"
        onClick={() => onRemove(registration.id)}
      >
        Remove
      </button>
    </article>
  );
}

export default function App() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [registrations, setRegistrations] = useState([]);
  const [success, setSuccess] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;

    setForm(previous => ({
      ...previous,
      [name]: value
    }));

    setErrors(previous => ({
      ...previous,
      [name]: ''
    }));

    setSuccess('');
  }

  function validateForm() {
    const newErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\+?[0-9\s()-]{9,16}$/;

    if (!form.name.trim()) {
      newErrors.name = 'Please enter your full name.';
    }

    if (!emailPattern.test(form.email.trim())) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (!phonePattern.test(form.phone.trim())) {
      newErrors.phone = 'Enter a valid phone number.';
    }

    if (!form.date) {
      newErrors.date = 'Please select a workshop date.';
    } else {
      const selectedDate = new Date(`${form.date}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = 'Choose today or a future date.';
      }
    }

    const age = Number(form.age);

    if (!form.age || !Number.isFinite(age) ||
        age < 16 || age > 100) {
      newErrors.age = 'Age must be between 16 and 100.';
    }

    if (
      form.portfolio.trim() &&
      !/^https?:\/\/\S+\.\S+/i.test(form.portfolio.trim())
    ) {
      newErrors.portfolio =
        'Enter a valid URL beginning with http:// or https://.';
    }

    if (!form.workshop) {
      newErrors.workshop = 'Please select a workshop.';
    }

    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);
    setSuccess('');

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const newRegistration = {
      ...form,
      id: Date.now()
    };

    setRegistrations(previous => [
      ...previous,
      newRegistration
    ]);

    setForm({ ...initialForm });
    setErrors({});
    setSuccess('Registration completed successfully!');
  }

  function handleRemove(id) {
    setRegistrations(previous =>
      previous.filter(item => item.id !== id)
    );

    setSuccess('Registration removed.');
  }

  return (
    <main>
      <h1>Workshop Registration</h1>
      <p>Complete the form to register for a workshop.</p>

      <form onSubmit={handleSubmit} noValidate>
        <div className="grid">
          <label>
            Full name
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && (
              <span className="error">{errors.name}</span>
            )}
          </label>

          <label>
            Email address
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
            />
            {errors.email && (
              <span className="error">{errors.email}</span>
            )}
          </label>

          <label>
            Phone number
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              required
              autoComplete="tel"
              pattern="[+]?[0-9 ()-]{9,16}"
              aria-invalid={Boolean(errors.phone)}
            />
            {errors.phone && (
              <span className="error">{errors.phone}</span>
            )}
          </label>

          <label>
            Workshop date
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
              aria-invalid={Boolean(errors.date)}
            />
            {errors.date && (
              <span className="error">{errors.date}</span>
            )}
          </label>

          <label>
            Age
            <input
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              min="16"
              max="100"
              required
              aria-invalid={Boolean(errors.age)}
            />
            {errors.age && (
              <span className="error">{errors.age}</span>
            )}
          </label>

          <label>
            Portfolio URL (optional)
            <input
              name="portfolio"
              type="url"
              value={form.portfolio}
              onChange={handleChange}
              placeholder="https://example.com"
              aria-invalid={Boolean(errors.portfolio)}
            />
            {errors.portfolio && (
              <span className="error">{errors.portfolio}</span>
            )}
          </label>

          <label>
            Select workshop
            <select
              name="workshop"
              value={form.workshop}
              onChange={handleChange}
              required
              aria-invalid={Boolean(errors.workshop)}
            >
              <option value="">Choose a workshop</option>
              <option value="Web Development">
                Web Development
              </option>
              <option value="React Fundamentals">
                React Fundamentals
              </option>
              <option value="Database Design">
                Database Design
              </option>
            </select>
            {errors.workshop && (
              <span className="error">{errors.workshop}</span>
            )}
          </label>
        </div>

        <button type="submit">Register</button>

        <button
          type="button"
          onClick={() => {
            setForm({ ...initialForm });
            setErrors({});
            setSuccess('');
          }}
        >
          Reset form
        </button>

        {success && (
          <p className="success" role="status">
            {success}
          </p>
        )}
      </form>

      <section aria-labelledby="registrations-heading">
        <h2 id="registrations-heading">
          Registered Students ({registrations.length})
        </h2>

        {registrations.length === 0 ? (
          <p>No registrations yet. Complete the form above.</p>
        ) : (
          <div className="grid">
            {registrations.map(registration => (
              <RegistrationCard
                key={registration.id}
                registration={registration}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
