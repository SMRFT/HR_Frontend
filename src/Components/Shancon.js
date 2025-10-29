import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import shancon1 from './Components/Images/shancon-main-poster.jpg';
import shancon2 from './Components/Images/shancon-program-schedule.jpg';
import shancon3 from './Components/Images/shancon-workshop.jpg';
import shancon4 from './Components/Images/shancon-details.jpg';

// Animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const shimmer = keyframes`
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: 'Segoe UI', 'Arial', sans-serif;
  background: linear-gradient(135deg, #e8f5f3 0%, #d4e9f7 50%, #e1f0e8 100%);
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 20px 15px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 50px;
  padding: 40px 30px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%);
  border-radius: 24px;
  box-shadow: 0 10px 40px rgba(72, 187, 172, 0.15), 0 2px 8px rgba(66, 153, 225, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(72, 187, 172, 0.1);

  @media (max-width: 768px) {
    padding: 30px 20px;
    margin-bottom: 30px;
  }

  @media (max-width: 480px) {
    padding: 25px 15px;
  }
`;

const Title = styled.h1`
  color: #2c5f5d;
  font-size: 2.8rem;
  margin-bottom: 15px;
  font-weight: 700;
  background: linear-gradient(135deg, #48bbac 0%, #4299e1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 2.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
  }
`;

const Subtitle = styled.p`
  color: #5a8a87;
  font-size: 1.15rem;
  margin: 8px 0;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 1.05rem;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const Badge = styled.div`
  display: inline-block;
  background: linear-gradient(135deg, #48bbac 0%, #38a89d 100%);
  color: white;
  padding: 10px 24px;
  border-radius: 25px;
  font-size: 0.95rem;
  font-weight: 600;
  margin-top: 20px;
  box-shadow: 0 4px 15px rgba(72, 187, 172, 0.3);

  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 8px 20px;
  }
`;

const ImageGallerySection = styled.div`
  margin-bottom: 50px;

  @media (max-width: 768px) {
    margin-bottom: 35px;
  }
`;

const ImageGalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-top: 30px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const ImageCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 15px;
  box-shadow: 0 8px 25px rgba(72, 187, 172, 0.12);
  transition: all 0.4s ease;
  cursor: pointer;
  border: 1px solid rgba(72, 187, 172, 0.1);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 45px rgba(72, 187, 172, 0.2), 0 5px 15px rgba(66, 153, 225, 0.15);
    border-color: rgba(72, 187, 172, 0.3);
  }

  @media (max-width: 768px) {
    &:hover {
      transform: translateY(-5px);
    }
  }
`;

const GalleryImage = styled.img`
  width: 100%;
  height: auto;
  border-radius: 14px;
  object-fit: cover;
`;

const ImageCaption = styled.p`
  text-align: center;
  color: #48bbac;
  font-weight: 600;
  margin-top: 12px;
  font-size: 0.95rem;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const RegistrationTypeSection = styled.div`
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  text-align: center;
  color: #2c5f5d;
  font-size: 2rem;
  margin-bottom: 30px;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.7rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 30px;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 40px;

  @media (max-width: 768px) {
    gap: 20px;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
  }
`;

const RegistrationButton = styled.button`
  padding: 22px 40px;
  font-size: 1.2rem;
  font-weight: 600;
  border: 3px solid transparent;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.4s ease;
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, #48bbac 0%, #4299e1 100%)' 
    : 'white'};
  color: ${props => props.$active ? 'white' : '#48bbac'};
  border-color: ${props => props.$active ? 'transparent' : '#48bbac'};
  box-shadow: ${props => props.$active 
    ? '0 10px 30px rgba(72, 187, 172, 0.35)' 
    : '0 4px 15px rgba(72, 187, 172, 0.1)'};
  min-width: 280px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 35px rgba(72, 187, 172, 0.4);
    background: ${props => props.$active 
      ? 'linear-gradient(135deg, #4299e1 0%, #48bbac 100%)' 
      : 'linear-gradient(135deg, #48bbac 0%, #4299e1 100%)'};
    color: white;
    border-color: transparent;
  }

  &:active {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 20px 35px;
    font-size: 1.1rem;
    min-width: 250px;
  }

  @media (max-width: 480px) {
    min-width: 100%;
    padding: 18px 30px;
    font-size: 1.05rem;
  }
`;

const ContentCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(255, 255, 255, 0.95) 100%);
  border-radius: 24px;
  padding: 45px;
  box-shadow: 0 10px 40px rgba(72, 187, 172, 0.15);
  animation: fadeIn 0.5s ease-in;
  border: 1px solid rgba(72, 187, 172, 0.15);
  margin-bottom: 30px;
  backdrop-filter: blur(10px);

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: 35px 25px;
  }

  @media (max-width: 480px) {
    padding: 25px 20px;
    border-radius: 20px;
  }
`;

const EventTitle = styled.h3`
  color: #48bbac;
  font-size: 2.2rem;
  margin-bottom: 20px;
  text-align: center;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.9rem;
  }

  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 25px;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const InfoItem = styled.div`
  padding: 22px;
  background: linear-gradient(135deg, #e8f5f3 0%, #d4e9f7 100%);
  border-radius: 14px;
  border-left: 4px solid #48bbac;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 15px rgba(72, 187, 172, 0.15);
  }

  @media (max-width: 480px) {
    padding: 18px;
  }
`;

const InfoLabel = styled.div`
  font-weight: 600;
  color: #2c5f5d;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const InfoValue = styled.div`
  color: #3a7773;
  font-size: 1.15rem;
  font-weight: 600;

  @media (max-width: 480px) {
    font-size: 1.05rem;
  }
`;

const Description = styled.p`
  color: #4a6a68;
  line-height: 1.8;
  margin: 20px 0;
  text-align: center;
  font-size: 1.05rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    line-height: 1.7;
  }
`;

const HighlightBox = styled.div`
  background: linear-gradient(135deg, #48bbac 0%, #4299e1 100%);
  color: white;
  padding: 22px;
  border-radius: 14px;
  margin: 25px 0;
  text-align: center;
  box-shadow: 0 6px 20px rgba(72, 187, 172, 0.3);

  @media (max-width: 480px) {
    padding: 18px;
    font-size: 0.95rem;
  }
`;

const PaymentSection = styled.div`
  margin-top: 30px;
  padding: 40px;
  background: white;
  border-radius: 20px;
  border: 2px solid #48bbac;
  box-shadow: 0 8px 25px rgba(72, 187, 172, 0.12);

  @media (max-width: 768px) {
    padding: 30px 25px;
  }

  @media (max-width: 480px) {
    padding: 25px 20px;
    border-radius: 16px;
  }
`;

const PaymentTitle = styled.h4`
  color: #48bbac;
  margin-bottom: 20px;
  font-size: 1.6rem;
  text-align: center;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.4rem;
  }

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const AmountDisplay = styled.div`
  text-align: center;
  margin: 25px 0;
  padding: 25px;
  background: linear-gradient(135deg, #e8f5f3 0%, #d4e9f7 100%);
  border-radius: 14px;
  border: 1px solid rgba(72, 187, 172, 0.2);

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const AmountLabel = styled.div`
  color: #5a8a87;
  font-size: 1.05rem;
  margin-bottom: 10px;
  font-weight: 500;

  @media (max-width: 480px) {
    font-size: 0.95rem;
  }
`;

const AmountValue = styled.div`
  color: #2c5f5d;
  font-size: 2.8rem;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 2.4rem;
  }

  @media (max-width: 480px) {
    font-size: 2rem;
  }
`;

const PaymentButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 30px 0;
  
  form {
    width: 100%;
    max-width: 400px;
  }

  @media (max-width: 480px) {
    form {
      max-width: 100%;
    }
  }
`;

const PaymentInstruction = styled.div`
  margin-top: 25px;
  padding: 22px;
  background: linear-gradient(135deg, #fff8e1 0%, #ffe9b3 100%);
  border-left: 4px solid #ffa726;
  border-radius: 12px;
  box-shadow: 0 3px 10px rgba(255, 167, 38, 0.15);

  @media (max-width: 480px) {
    padding: 18px;
  }
`;

const InstructionTitle = styled.h5`
  color: #e65100;
  margin-bottom: 12px;
  font-size: 1.15rem;
  font-weight: 700;

  @media (max-width: 480px) {
    font-size: 1.05rem;
  }
`;

const InstructionList = styled.ol`
  color: #e65100;
  margin-left: 20px;
  line-height: 1.9;

  @media (max-width: 480px) {
    margin-left: 18px;
    font-size: 0.95rem;
    line-height: 1.7;
  }
`;

const ContactSection = styled.div`
  margin-top: 30px;
  padding: 25px;
  background: linear-gradient(135deg, #e8f5f3 0%, #d4e9f7 100%);
  border-radius: 14px;
  text-align: center;
  border: 1px solid rgba(72, 187, 172, 0.2);

  @media (max-width: 480px) {
    padding: 20px;
  }
`;

const ContactTitle = styled.h4`
  color: #2c5f5d;
  margin-bottom: 15px;
  font-size: 1.35rem;
  font-weight: 700;

  @media (max-width: 480px) {
    font-size: 1.2rem;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
  margin-top: 15px;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const ContactItem = styled.a`
  color: #48bbac;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;

  &:hover {
    color: #4299e1;
    text-decoration: underline;
  }

  @media (max-width: 480px) {
    font-size: 1.05rem;
  }
`;

const RegisterLink = styled.a`
  display: inline-block;
  margin-top: 25px;
  padding: 16px 45px;
  background: linear-gradient(135deg, #48bbac 0%, #4299e1 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.15rem;
  transition: all 0.4s ease;
  box-shadow: 0 6px 20px rgba(72, 187, 172, 0.3);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(72, 187, 172, 0.4);
    background: linear-gradient(135deg, #4299e1 0%, #48bbac 100%);
  }

  @media (max-width: 768px) {
    padding: 14px 40px;
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 14px 30px;
    font-size: 1.05rem;
  }
`;

const NextStepButton = styled.button`
  padding: 16px 45px;
  background: linear-gradient(135deg, #66bb6a 0%, #43a047 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.15rem;
  cursor: pointer;
  transition: all 0.4s ease;
  box-shadow: 0 6px 20px rgba(102, 187, 106, 0.3);
  margin-top: 20px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(102, 187, 106, 0.4);
    background: linear-gradient(135deg, #43a047 0%, #66bb6a 100%);
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 14px 40px;
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    padding: 14px 30px;
    font-size: 1.05rem;
  }
`;

const SuccessBox = styled.div`
  background: linear-gradient(135deg, #e8f5e9 0%, #c8e6c9 100%);
  border: 2px solid #66bb6a;
  padding: 35px;
  border-radius: 16px;
  text-align: center;
  margin: 30px 0;
  box-shadow: 0 6px 20px rgba(102, 187, 106, 0.2);

  @media (max-width: 768px) {
    padding: 30px 25px;
  }

  @media (max-width: 480px) {
    padding: 25px 20px;
  }
`;

const SuccessIcon = styled.div`
  font-size: 4.5rem;
  color: #66bb6a;
  margin-bottom: 15px;

  @media (max-width: 768px) {
    font-size: 3.8rem;
  }

  @media (max-width: 480px) {
    font-size: 3.2rem;
  }
`;

const SuccessTitle = styled.h3`
  color: #2e7d32;
  font-size: 2rem;
  margin-bottom: 12px;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.75rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const SuccessMessage = styled.p`
  color: #2e7d32;
  font-size: 1.1rem;
  line-height: 1.8;

  @media (max-width: 768px) {
    font-size: 1.05rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    line-height: 1.7;
  }
`;

const FormSection = styled.div`
  margin-top: 30px;
  padding: 30px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
  border-radius: 14px;
  text-align: center;
  border: 1px solid rgba(72, 187, 172, 0.15);

  @media (max-width: 480px) {
    padding: 25px 20px;
  }
`;

const FormDescription = styled.p`
  color: #4a6a68;
  line-height: 1.8;
  margin-bottom: 20px;
  font-size: 1.05rem;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.95rem;
    line-height: 1.7;
  }
`;

// Custom hook for loading Razorpay payment button
const useRazorpayButton = (paymentButtonId, shouldLoad) => {
 useEffect(() => {
 if (!shouldLoad || !paymentButtonId) return;

 const formId = `rzp_payment_form_${paymentButtonId}`;
 const form = document.getElementById(formId);

 if (form && !form.hasChildNodes()) {
 const script = document.createElement('script');
 script.src = 'https://checkout.razorpay.com/v1/payment-button.js';
 script.async = true;
 script.setAttribute('data-payment_button_id', paymentButtonId);
 form.appendChild(script);
 }

 // Cleanup function
 return () => {
 if (form) {
 while (form.firstChild) {
 form.removeChild(form.firstChild);
 }
 }
 };
 }, [paymentButtonId, shouldLoad]);
};

const ShanconRegistration = () => {
 const [selectedType, setSelectedType] = useState(null);
 const [paymentCompleted, setPaymentCompleted] = useState(false);

 // Payment button IDs for each registration type
 const PAYMENT_BUTTONS = {
 conference: 'pl_RUOaY53qreOwSR', // ₹200
 workshop: 'pl_RUOc7Ry8IKxyPi' // ₹1000
 };

 // Google Form links for registration
 const REGISTRATION_FORMS = {
 conference: 'https://docs.google.com/forms/d/e/1FAIpQLSc2FfI9T6QcgPgUUs_K9fW-awBy870PHzkh2v9_m1ejChuqzA/viewform?usp=sharing&ouid=106200274007764411374', // Add conference form link
 workshop: 'https://docs.google.com/forms/d/e/1FAIpQLSc2FfI9T6QcgPgUUs_K9fW-awBy870PHzkh2v9_m1ejChuqzA/viewform?usp=sharing&ouid=106200274007764411374'
 };

 // Event promotional images
 const eventImages = [
 {
 src: shancon1,
 alt: 'SHANCON 3.0 - Main Conference',
 caption: 'Main Conference'
 },
 {
 src: shancon2,
 alt: 'Program Schedule',
 caption: 'Program Schedule'
 },
 {
 src: shancon3,
 alt: 'Pre-Conference Workshop',
 caption: 'Robotic Surgery Workshop'
 },
 {
 src: shancon4,
 alt: 'Conference Details',
 caption: 'Event Details'
 }
 ];

 const currentPaymentButtonId = selectedType ? PAYMENT_BUTTONS[selectedType] : null;
 
 // Load the appropriate Razorpay button when type is selected and payment not completed
 useRazorpayButton(currentPaymentButtonId, selectedType !== null && !paymentCompleted);

 const getAmount = () => {
 return selectedType === 'conference' ? '200' : '1000';
 };

 const handlePaymentComplete = () => {
 setPaymentCompleted(true);
 };

 const getRegistrationFormLink = () => {
 return selectedType ? REGISTRATION_FORMS[selectedType] : null;
 };

 const renderPaymentStep = () => (
 <PaymentSection>
 <PaymentTitle>💳 Step 1: Complete Your Payment</PaymentTitle>
 
 <AmountDisplay>
 <AmountLabel>{selectedType === 'conference' ? 'Registration Fee' : 'Workshop Fee'}</AmountLabel>
 <AmountValue>₹{getAmount()}</AmountValue>
 </AmountDisplay>

 <PaymentButtonWrapper>
 <form id={`rzp_payment_form_${currentPaymentButtonId}`}></form>
 </PaymentButtonWrapper>

 <PaymentInstruction>
 <InstructionTitle>📋 Payment Instructions:</InstructionTitle>
 <InstructionList>
 <li>Click the Razorpay payment button above</li>
 <li>Complete your payment using UPI, Card, Net Banking, or Wallet</li>
 <li>After successful payment, you will receive a confirmation</li>
 <li>Click "I've Completed Payment" button below to proceed to registration</li>
 </InstructionList>
 </PaymentInstruction>

 <div style={{ textAlign: 'center', marginTop: '30px' }}>
 <NextStepButton onClick={handlePaymentComplete}>
 ✓ I've Completed Payment - Proceed to Registration
 </NextStepButton>
 </div>

 <ContactSection>
 <ContactTitle>Need Help?</ContactTitle>
 <ContactInfo>
 <ContactItem href="https://wa.me/919994718784">📱 WhatsApp: 9994718784</ContactItem>
 <ContactItem href="https://wa.me/918526738028">📱 WhatsApp: 8526738028</ContactItem>
 </ContactInfo>
 </ContactSection>
 </PaymentSection>
 );

 const renderRegistrationStep = () => (
 <PaymentSection>
 <SuccessBox>
 <SuccessIcon>✓</SuccessIcon>
 <SuccessTitle>Payment Successful!</SuccessTitle>
 <SuccessMessage>
 Thank you for your payment. Please complete your registration by filling out the form below.
 </SuccessMessage>
 </SuccessBox>

 <FormSection>
 <ContactTitle>📝 Step 2: Complete Your Registration</ContactTitle>
 <FormDescription>
 Please fill out the registration form with your details. This is required to confirm your attendance 
 and provide you with event updates.
 </FormDescription>
 <RegisterLink 
 href={getRegistrationFormLink()}
 target="_blank"
 rel="noopener noreferrer"
 >
 Complete Registration Form →
 </RegisterLink>
 </FormSection>

 <PaymentInstruction style={{ marginTop: '30px' }}>
 <InstructionTitle>📋 Next Steps:</InstructionTitle>
 <InstructionList>
 <li>Click the "Complete Registration Form" button above</li>
 <li>Fill out all required fields in the Google Form</li>
 <li>Take a screenshot of your payment confirmation</li>
 <li>Share the payment screenshot via WhatsApp to the numbers below</li>
 <li>You will receive a confirmation email within 24 hours</li>
 </InstructionList>
 </PaymentInstruction>

 <ContactSection>
 <ContactTitle>Share Payment Screenshot</ContactTitle>
 <ContactInfo>
 <ContactItem href="https://wa.me/919994718784">📱 WhatsApp: 9994718784</ContactItem>
 <ContactItem href="https://wa.me/918526738028">📱 WhatsApp: 8526738028</ContactItem>
 </ContactInfo>
 <Description style={{ marginTop: '15px', fontSize: '0.95rem' }}>
 Your registration will be confirmed once we receive your payment screenshot
 </Description>
 </ContactSection>
 </PaymentSection>
 );

 const renderConferenceDetails = () => (
 <ContentCard>
 <EventTitle>SHANCON 3.0 – Main Conference</EventTitle>
 <Description>
 Join us for a comprehensive update on Gastroenterology, bringing together leading experts 
 to discuss the latest advancements in clinical practice, surgical innovation, and robotic surgery.
 </Description>

 <InfoGrid>
 <InfoItem>
 <InfoLabel>📅 Date</InfoLabel>
 <InfoValue>26th October 2025</InfoValue>
 </InfoItem>
 <InfoItem>
 <InfoLabel>📍 Venue</InfoLabel>
 <InfoValue>Radisson, Salem</InfoValue>
 </InfoItem>
 <InfoItem>
 <InfoLabel>🕗 Time</InfoLabel>
 <InfoValue>From 8:30 AM onwards</InfoValue>
 </InfoItem>
 <InfoItem>
 <InfoLabel>💰 Registration Fee</InfoLabel>
 <InfoValue>₹200</InfoValue>
 </InfoItem>
 </InfoGrid>

 <HighlightBox>
 <strong>TNMC Approved – 2 Credit Points</strong>
 </HighlightBox>

 <Description>
 <strong>Post Conference Workshop (4:05 PM - 6:00 PM)</strong><br/>
 Esophageal manometry & 24 hr pH study<br/>
 Limited seats: 30 participants | Prior Registration Required
 </Description>

 {!paymentCompleted ? renderPaymentStep() : renderRegistrationStep()}
 </ContentCard>
 );

 const renderWorkshopDetails = () => (
 <ContentCard>
 <EventTitle>Pre-Conference Workshop</EventTitle>
 <Description>
 <strong>Hands-on Robotic Surgery Simulation Workshop</strong><br/>
 An exclusive practical session for surgical professionals
 </Description>

 <InfoGrid>
 <InfoItem>
 <InfoLabel>📅 Date</InfoLabel>
 <InfoValue>25th October 2025</InfoValue>
 </InfoItem>
 <InfoItem>
 <InfoLabel>📍 Venue</InfoLabel>
 <InfoValue>Shanmuga Hospital, Salem</InfoValue>
 </InfoItem>
 <InfoItem>
 <InfoLabel>🕗 Time</InfoLabel>
 <InfoValue>8:30 AM – 11:00 AM</InfoValue>
 </InfoItem>
 <InfoItem>
 <InfoLabel>💰 Course Fee</InfoLabel>
 <InfoValue>₹1,000</InfoValue>
 </InfoItem>
 </InfoGrid>

 <HighlightBox>
 <strong>⚠️ Limited to 10 Participants Only</strong><br/>
 Registration is Mandatory
 </HighlightBox>

 <Description>
 <strong>Workshop Instructors:</strong><br/>
 Dr. P. Prabusankar - M.S., M.R.C.S. (General, Laparoscopic & Robotic Surgeon)<br/>
 Dr. P. Arunraj – MS, M.Ch(SGE) (Surgical Gastroenterologist & Robotic Surgeon)
 </Description>

 {!paymentCompleted ? renderPaymentStep() : renderRegistrationStep()}
 </ContentCard>
 );

 return (
 <Container>
 <Header>
 <Title>SHANCON 3.0</Title>
 <Subtitle>Gastro Update 2025</Subtitle>
 <Subtitle>Organized by Shanmuga Hospital Ltd., Salem</Subtitle>
 <Badge>TNMC Approved – 2 Credit Points</Badge>
 </Header>

 <ImageGallerySection>
 <SectionTitle>Event Information</SectionTitle>
 <ImageGalleryGrid>
 {eventImages.map((image, index) => (
 <ImageCard key={index}>
 <GalleryImage 
 src={image.src} 
 alt={image.alt}
 loading="lazy"
 />
 <ImageCaption>{image.caption}</ImageCaption>
 </ImageCard>
 ))}
 </ImageGalleryGrid>
 </ImageGallerySection>

 <RegistrationTypeSection>
 <SectionTitle>Select Registration Type</SectionTitle>
 <ButtonGroup>
 <RegistrationButton
 $active={selectedType === 'conference'}
 onClick={() => {
 setSelectedType('conference');
 setPaymentCompleted(false);
 }}
 >
 Main Conference<br/>
 <small style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>₹200 | 26 Oct 2025</small>
 </RegistrationButton>
 <RegistrationButton
 $active={selectedType === 'workshop'}
 onClick={() => {
 setSelectedType('workshop');
 setPaymentCompleted(false);
 }}
 >
 Pre-Conference Workshop<br/>
 <small style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>₹1000 | 25 Oct 2025</small>
 </RegistrationButton>
 </ButtonGroup>
 </RegistrationTypeSection>

 {selectedType === 'conference' && renderConferenceDetails()}
 {selectedType === 'workshop' && renderWorkshopDetails()}
 </Container>
 );
};

export default ShanconRegistration;