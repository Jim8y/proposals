import React, { useState } from 'react';

/**
 * ContactPage component provides a form for users to contact the Neo N3 Proposals team.
 * This form is integrated with Netlify Forms for serverless form handling.
 */
const ContactPage = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: null
  });

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Encode form data for Netlify
      const formData = new FormData();
      Object.entries(formState).forEach(([key, value]) => {
        formData.append(key, value);
      });
      formData.append('form-name', 'contact');
      
      // Submit the form data to Netlify
      await fetch('/', {
        method: 'POST',
        body: formData
      });
      
      // Reset form and show success message
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setFormStatus({
        submitted: true,
        error: null
      });
    } catch (error) {
      console.error('Form submission error:', error);
      setFormStatus({
        submitted: false,
        error: 'There was an error submitting the form. Please try again.'
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="mb-8">Contact Us</h1>
      
      {formStatus.submitted ? (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6" role="alert">
          <p className="font-bold">Thank you for your message!</p>
          <p>We'll get back to you as soon as possible.</p>
        </div>
      ) : null}
      
      {formStatus.error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
          <p className="font-bold">Error</p>
          <p>{formStatus.error}</p>
        </div>
      ) : null}
      
      <form 
        name="contact" 
        method="POST" 
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        {/* Hidden input for Netlify Forms */}
        <input type="hidden" name="form-name" value="contact" />
        
        {/* Honeypot field to prevent spam */}
        <p className="hidden">
          <label>
            Don't fill this out if you're human: <input name="bot-field" />
          </label>
        </p>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            name="name"
            value={formState.name}
            onChange={handleChange}
            required
            placeholder="Your name"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            required
            placeholder="your.email@example.com"
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subject">
            Subject
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="subject"
            type="text"
            name="subject"
            value={formState.subject}
            onChange={handleChange}
            required
            placeholder="Subject of your message"
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="message">
            Message
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline h-32"
            id="message"
            name="message"
            value={formState.message}
            onChange={handleChange}
            required
            placeholder="Your message here..."
          />
        </div>
        
        <div className="flex items-center justify-between">
          <button
            className="bg-neo-green-600 hover:bg-neo-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Send Message
          </button>
        </div>
      </form>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Other Ways to Connect</h2>
        <p className="mb-2">You can also reach us through:</p>
        <ul className="list-disc pl-5">
          <li className="mb-1">
            <a 
              href="https://github.com/neo-project/proposals" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neo-green-600 hover:text-neo-green-800"
            >
              GitHub Repository
            </a>
          </li>
          <li className="mb-1">
            <a 
              href="https://discord.gg/neo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neo-green-600 hover:text-neo-green-800"
            >
              Neo Discord Community
            </a>
          </li>
          <li className="mb-1">
            <a 
              href="https://twitter.com/neo_blockchain" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-neo-green-600 hover:text-neo-green-800"
            >
              Twitter
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ContactPage;
