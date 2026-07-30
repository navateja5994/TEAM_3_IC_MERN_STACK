import "./Contact.css";

function Contact() {
  return (
    <section className="contact-page">
      <div className="container">

        <h1>Contact Us</h1>

        <div className="contact-container">

          <div className="contact-info">

            <h2>Get in Touch</h2>

            <p>
              We'd love to hear from you.
            </p>

            <p>
              📍 Andhra Pradesh, India
            </p>

            <p>
              📞 +91 9876543210
            </p>

            <p>
              ✉ support@bagworld.com
            </p>

          </div>

          <form className="contact-form">

            <input
              type="text"
              placeholder="Your Name"
            />

            <input
              type="email"
              placeholder="Email Address"
            />

            <textarea
              rows="6"
              placeholder="Your Message"
            ></textarea>

            <button className="btn">
              Send Message
            </button>

          </form>

        </div>

      </div>
    </section>
  );
}

export default Contact;