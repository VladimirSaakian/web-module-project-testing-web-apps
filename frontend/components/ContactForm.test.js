import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

test("renders without errors", () => {
    render(<ContactForm />);
  });
  
  test("renders the contact form header", () => {
    render(<ContactForm />);
    const headerContact = screen.getByText("Contact Form", { exact: true });
    expect(headerContact).toBeInTheDocument();
  });
  
  test("renders ONE error message if user enters less then 5 characters into firstname.", async () => {
    render(<ContactForm />);
  
    const firstNameField = screen.getByLabelText(/First Name*/i);
    userEvent.type(firstNameField, "123");
  
    const errorMessages = await screen.findAllByTestId("error");
    expect(errorMessages).toHaveLength(1);
  });
  
  test("renders THREE error messages if user enters no values into any fields.", async () => {
    render(<ContactForm />);
    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);
  
    await waitFor(() => {
      const errorMessages = screen.queryAllByTestId("error");
      expect(errorMessages).toHaveLength(3);
    });
  });
  
  test("renders ONE error message if user enters a valid first name and last name but no email.", async () => {
    render(<ContactForm />);
    const firstNameField = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameField, "Vladimir");
    const lastNameField = screen.getByLabelText(/last name*/i);
    userEvent.type(lastNameField, "Saakian");
  
    const button = screen.getByRole("button");
    userEvent.click(button);
  
    const errorMessages = await screen.getAllByTestId("error");
    expect(errorMessages).toHaveLength(1);
  });
  
  test('renders "email must be a valid email address" if an invalid email is entered', async () => {
	render(<ContactForm />);
	const emailField = screen.getByLabelText(/email*/i);
	userEvent.type(emailField, 'vladimirsaakian@gmail.com');

	waitFor(() => {
		const errorMessage = screen.findByText(
			/email must be a valid email address/i
		);
		expect(errorMessage).toBeInTheDocument();
	});
});
  
  test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
    render(<ContactForm />);
    const submitButton = screen.getByRole("button");
    userEvent.click(submitButton);
  
    const errorMessages = await screen.findByText(
      /lastName is a required field/i
    );
    expect(errorMessages).toBeInTheDocument();
  });
  
  test("renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.", async () => {
    render(<ContactForm />);
    const firstNameField = screen.getByLabelText(/first name*/i);
    userEvent.type(firstNameField, "Vladimir");
    const lastNameField = screen.getByLabelText(/last name*/i);
    userEvent.type(lastNameField, "Saakian");
    const emailField = screen.getByLabelText(/email*/i);
    userEvent.type(emailField, "vladimirsaakian@gmail.com");
  
    const button = screen.getByRole("button");
    userEvent.click(button);
  
    await waitFor(() => {
      const firstNameDisplay = screen.queryByText("Vladimir");
      const lastNameDisplay = screen.queryByText("Saakian");
      const emailDisplay = screen.queryByText("vladimirsaakian@gmail.com");
      const messageDisplay = screen.queryByTestId("messageDisplay");
  
      expect(firstNameDisplay).toBeInTheDocument();
      expect(lastNameDisplay).toBeInTheDocument();
      expect(emailDisplay).toBeInTheDocument();
      expect(messageDisplay).not.toBeInTheDocument();
    });
  });
  
  test('renders all fields text when all fields are submitted.', async () => {
	render(<ContactForm />);

	const firstName = screen.getByLabelText(/first name*/i);
	const lastName = screen.getByLabelText(/last name*/i);
	const email = screen.getByLabelText(/email*/i);
	const messageField = screen.getByLabelText(/message/i);

	userEvent.type(firstName, 'Vladimir');
	userEvent.type(lastName, 'Saakian');
	userEvent.type(email, 'vladimirsaakian@gmail.com');
	userEvent.type(messageField, 'Message Text');

	const button = screen.getByRole('button');
	userEvent.click(button);

	waitFor(() => {
		const firstNameDisplay = screen.queryByText(/Vladimir/i);
		const lastNameDisplay = screen.queryByText(/Saakian/i);
		const emailDisplay = screen.queryByText(/vladimirsaakian@gmail.com/i);
		const messageDisplay = screen.queryByTestId(/message text/i);

		expect(firstNameDisplay).toBeInTheDocument();
		expect(lastNameDisplay).toBeInTheDocument();
		expect(emailDisplay).toBeInTheDocument();
		expect(messageDisplay).toBeInTheDocument();
	});
});
