import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { FiMessageCircle, FiX } from 'react-icons/fi';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const INITIAL_MESSAGE = {
  text: "Hello! I'm the WellTrack assistant. Ask me about stroke risk factors, health tips, or how to use this system.",
  sender: 'bot',
  timestamp: new Date().toISOString(),
};

const getResponse = (input) => {
  const lower = input.toLowerCase();

  if (/\b(hello|hi|hey)\b/.test(lower)) {
    return "Hi there! How can I help you today? You can ask me about stroke risk factors, symptoms, health tips, or how to use WellTrack.";
  }

  if (/\b(thank|thanks)\b/.test(lower)) {
    return "You're welcome! Let me know if there's anything else I can help with.";
  }

  if (/\b(help|topics|what can you|what do you know|what can i ask)\b/.test(lower)) {
    return "Here are some topics you can ask me about:\n- How to use WellTrack\n- Stroke risk factors & symptoms\n- Blood pressure / hypertension\n- Diabetes / glucose management\n- BMI / weight / obesity\n- Smoking risks\n- Exercise recommendations\n- Diet & nutrition tips\n- Finding doctors in the app\n- Using the prediction feature\n- Health plans\n- Emergency info\n- Heart disease\n- Age-related risks\n- Stress & mental health\n- Medication questions";
  }

  if (/\b(how to use|how do i use|guide|tutorial|getting started|navigate|walkthrough|use this|use welltrack|use the app|use the system|features|overview|about welltrack|what is welltrack)\b/.test(lower)) {
    return "Welcome to WellTrack! Here's how to get started:\n\n1. 📊 Prediction — Go to the Prediction page, fill in your health details (age, BMI, glucose, etc.) and get your stroke risk score (Low / Medium / High).\n\n2. 📋 History — View all your past predictions on the History page.\n\n3. 🥗 Health Plans — After each prediction, personalized diet and workout plans are automatically generated for you.\n\n4. 🩺 Doctors — Browse recommended doctors filtered by your risk level and specialization.\n\n5. 💬 Feedback — Share your experience or report issues via the Feedback page.\n\n6. 👤 Account — Update your profile from the Account menu in the top right.\n\nNote: Your account must be verified by an admin before you can access the Prediction feature.";
  }

  if (/\b(register|sign up|signup|create account|new account|new user)\b/.test(lower)) {
    return "To register on WellTrack:\n1. Click 'Register' on the login page\n2. Fill in your full name, email, and password\n3. Submit the form\n4. Wait for admin verification — you'll be able to use all features once your account is approved.\n\nNote: Admin verification is required before you can run stroke risk predictions.";
  }

  if (/\b(login|log in|sign in|cant login|cannot login|login problem)\b/.test(lower)) {
    return "To log in to WellTrack:\n1. Go to the login page and enter your email and password\n2. If you've forgotten your password, contact your admin\n3. After 5 failed login attempts, your account will be locked for 30 minutes\n\nIf you see 'Pending Verification', your account hasn't been approved by an admin yet.";
  }

  if (/\b(verif|verified|pending|not verified|account status|approve|approval)\b/.test(lower)) {
    return "After registration, your account needs admin verification before you can use the Prediction feature.\n\n- You can check your status on the Profile page (Account → Profile)\n- A 'Pending Verification' badge means your account is under review\n- Once verified, you'll have full access to stroke risk predictions and health plans\n\nContact your administrator if verification is taking too long.";
  }

  if (/\b(history|past prediction|previous result|old prediction|my prediction)\b/.test(lower)) {
    return "To view your prediction history:\n1. Click 'View History' on the Dashboard, or select it from the navigation menu\n2. You'll see a table of all your past predictions with date, risk level, and probability\n3. Click 'View' on any row to see the full result details including top risk features\n\nYour history is private and only visible to you.";
  }

  if (/\b(health plan|my plan|diet plan|workout plan|plans page|personalized plan)\b/.test(lower)) {
    return "WellTrack automatically generates personalized health plans after each prediction:\n- 🥗 Diet Plan — food recommendations, meal plan, and foods to avoid based on your risk level\n- 🏃 Workout Plan — exercise routine and weekly schedule suited to your condition\n\nTo view your plans:\n1. Go to the Result page after a prediction, or\n2. Navigate directly to the Plans section from the dashboard\n\nPlans are updated every time you run a new prediction.";
  }

  if (/\b(doctor|find doctor|specialist|recommendation|recommended doctor)\b/.test(lower)) {
    return "You can find healthcare professionals through WellTrack:\n- Go to the Doctors page from the navigation menu\n- Doctors are recommended based on your latest risk level:\n  • High risk → Cardiologist, Neurologist\n  • Medium risk → General Physician, Endocrinologist\n  • Low risk → General Physician\n- Browse by specialization, rating, and availability\n- View doctor profiles, hospital, contact, and consultation fee\n\nRegular check-ups are important for stroke prevention!";
  }

  if (/\b(feedback|report|complaint|suggestion|review)\b/.test(lower)) {
    return "To submit feedback on WellTrack:\n1. Click 'Feedback' in the navigation menu\n2. Choose a category (General, Bug Report, Feature Request, etc.)\n3. Write your subject, description, and give a rating\n4. Optionally attach screenshots\n5. Submit — an admin will review and respond\n\nYou can view your submitted feedback and admin responses from the Feedback page.";
  }

  if (/\b(profile|account setting|update profile|change name|change phone|personal info)\b/.test(lower)) {
    return "To update your profile:\n1. Click 'Account' in the top-right navigation\n2. Select 'Profile'\n3. Click 'Edit Profile' to update your name, phone, gender, date of birth, or address\n4. Click 'Save Changes'\n\nNote: Your email cannot be changed after registration.";
  }

  if (/\b(emergency|911|urgent)\b/.test(lower)) {
    return "If you or someone else is experiencing a medical emergency, call 911 immediately. Stroke warning signs include sudden numbness, confusion, trouble speaking, vision problems, severe headache, or difficulty walking. Every minute counts!";
  }

  if (/\b(symptom|symptoms)\b/.test(lower)) {
    return "Remember the FAST acronym for stroke warning signs:\n\nF - Face drooping: Is one side of the face numb or drooping?\nA - Arm weakness: Is one arm weak or numb?\nS - Speech difficulty: Is speech slurred or hard to understand?\nT - Time to call 911: If any of these signs are present, call emergency services immediately.\n\nOther symptoms include sudden confusion, trouble seeing, severe headache, and difficulty walking.";
  }

  if (/\b(stroke|stroke risk)\b/.test(lower)) {
    return "Key stroke risk factors include:\n- High blood pressure (the leading cause)\n- Diabetes\n- High cholesterol\n- Smoking\n- Obesity / high BMI\n- Physical inactivity\n- Excessive alcohol use\n- Heart disease (atrial fibrillation)\n- Age (risk increases after 55)\n- Family history\n\nUse our Prediction feature to assess your personal risk level!";
  }

  if (/\b(blood pressure|hypertension)\b/.test(lower)) {
    return "High blood pressure (hypertension) is the single most important risk factor for stroke. A normal reading is below 120/80 mmHg. Tips to manage it:\n- Reduce sodium intake\n- Exercise regularly (150 min/week)\n- Maintain a healthy weight\n- Limit alcohol\n- Take prescribed medications consistently\n- Monitor your blood pressure at home regularly.";
  }

  if (/\b(diabetes|glucose|sugar)\b/.test(lower)) {
    return "Diabetes significantly increases stroke risk because high blood sugar damages blood vessels over time. Key management tips:\n- Monitor blood glucose levels regularly\n- Follow your prescribed diet plan\n- Take medications as directed\n- Exercise regularly to improve insulin sensitivity\n- Maintain a healthy weight\n- Keep HbA1c below 7% (or as advised by your doctor).";
  }

  if (/\b(bmi|weight|obesity|obese)\b/.test(lower)) {
    return "A healthy BMI is between 18.5 and 24.9. Being overweight or obese increases your risk of stroke, diabetes, and heart disease. Tips:\n- Set realistic weight loss goals (1-2 lbs per week)\n- Focus on whole foods: fruits, vegetables, lean protein\n- Reduce portion sizes\n- Stay physically active\n- Avoid sugary drinks and processed foods\n\nUse our Prediction tool to see how BMI affects your risk score.";
  }

  if (/\b(smoking|smoke|tobacco)\b/.test(lower)) {
    return "Smoking doubles your risk of stroke. It damages blood vessels, raises blood pressure, and reduces oxygen in your blood. The good news: quitting smoking significantly reduces your risk within just a few years.\n- Talk to your doctor about cessation programs\n- Consider nicotine replacement therapy\n- Avoid secondhand smoke as well\n- Your stroke risk drops substantially 2-5 years after quitting.";
  }

  if (/\b(exercise|workout|fitness|physical activity)\b/.test(lower)) {
    return "Regular exercise reduces stroke risk by up to 27%. Recommendations:\n- Aim for at least 150 minutes of moderate aerobic activity per week (brisk walking, swimming, cycling)\n- Or 75 minutes of vigorous activity per week\n- Include strength training 2+ days per week\n- Break up long periods of sitting\n- Even 10-minute walks help!\n\nCheck out our Health Plans section for personalized workout plans.";
  }

  if (/\b(diet|food|nutrition|eat)\b/.test(lower)) {
    return "A healthy diet can significantly reduce stroke risk. Follow these guidelines:\n- Eat plenty of fruits and vegetables (5+ servings/day)\n- Choose whole grains over refined grains\n- Include lean protein (fish, poultry, beans)\n- Limit saturated fats and trans fats\n- Reduce sodium to less than 2,300 mg/day\n- The Mediterranean and DASH diets are highly recommended\n\nVisit our Health Plans page for personalized diet plans!";
  }

  if (/\b(doctor|specialist|find a doctor)\b/.test(lower)) {
    return "You can find healthcare professionals through WellTrack:\n- Go to the Doctors page from the navigation menu\n- Browse specialists by category (Cardiologist, Neurologist, etc.)\n- View doctor profiles, ratings, and availability\n- Filter by specialization and location\n\nRegular check-ups are important for stroke prevention!";
  }

  if (/\b(prediction|assess|risk)\b/.test(lower)) {
    return "Our Prediction feature uses a machine learning model to assess your stroke risk:\n- Navigate to the Prediction page\n- Enter your health data (age, BMI, glucose, blood pressure, etc.)\n- Click 'Predict' to get your risk assessment\n- You'll receive a Low, Medium, or High risk result\n- View personalized recommendations based on your results\n\nRemember: this is for informational purposes and does not replace professional medical advice.";
  }

  if (/\b(plan|diet plan|workout plan|health plan)\b/.test(lower)) {
    return "WellTrack provides personalized health plans:\n- After completing a risk prediction, you'll receive tailored plans\n- Diet plans with meal suggestions based on your risk factors\n- Workout plans suited to your fitness level\n- Go to the Plans page to view your current recommendations\n- Plans are updated based on your latest prediction results.";
  }

  if (/\b(heart|heart disease|cardiac|atrial fibrillation)\b/.test(lower)) {
    return "Heart disease, especially atrial fibrillation (AFib), is a major stroke risk factor. AFib causes irregular heartbeat, which can form blood clots that travel to the brain.\n- Get regular heart check-ups\n- Know your resting heart rate\n- Watch for symptoms: palpitations, shortness of breath, dizziness\n- Take blood thinners if prescribed\n- Manage related conditions like high blood pressure and cholesterol.";
  }

  if (/\b(age|elderly|senior|older)\b/.test(lower)) {
    return "Age is a significant stroke risk factor:\n- Risk doubles every decade after age 55\n- About 75% of strokes occur in people over 65\n- While you can't change your age, you can control other factors\n- Regular screening becomes more important as you age\n- Stay active, eat well, and manage chronic conditions\n- Discuss preventive measures with your doctor.";
  }

  if (/\b(stress|mental health|anxiety|depression)\b/.test(lower)) {
    return "Chronic stress contributes to stroke risk by raising blood pressure and promoting unhealthy habits. Tips for managing stress:\n- Practice deep breathing or meditation\n- Exercise regularly (it reduces stress hormones)\n- Get 7-9 hours of sleep per night\n- Stay socially connected\n- Consider professional counseling if needed\n- Limit caffeine and alcohol\n- Take regular breaks during work.";
  }

  if (/\b(medication|medicine|drug|prescription)\b/.test(lower)) {
    return "Important medication reminders:\n- Always take medications as prescribed by your doctor\n- Never stop or change dosages without consulting your healthcare provider\n- Keep a list of all your medications\n- Report any side effects to your doctor promptly\n- WellTrack does not provide medication advice\n\nPlease consult your doctor or pharmacist for any medication-related questions.";
  }

  return "I'm not sure about that. Here are things I can help with:\n- How to use WellTrack\n- Stroke risk factors & symptoms\n- Blood pressure, diabetes, BMI, smoking\n- Exercise & diet tips\n- Finding doctors\n- Health plans\n- Account & verification\n\nTry asking something like \"how do I start a prediction?\" or \"what are stroke symptoms?\".";
};

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, scrollToBottom]);

  const handleSend = (text) => {
    const userMessage = {
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const botMessage = {
        text: getResponse(text),
        sender: 'bot',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 400);
  };

  const toggleButton = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: 1050,
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
    border: 'none',
  };

  const chatWindow = {
    position: 'fixed',
    bottom: '85px',
    right: '20px',
    width: '300px',
    height: '400px',
    zIndex: 1050,
    borderRadius: '12px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
    backgroundColor: '#fff',
    border: '1px solid #dee2e6',
  };

  const header = {
    backgroundColor: '#0d6efd',
    color: '#fff',
    padding: '10px 14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '0.95rem',
    fontWeight: 600,
    flexShrink: 0,
  };

  const messageArea = {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
    backgroundColor: '#f8f9fa',
  };

  return (
    <>
      {isOpen && (
        <div style={chatWindow}>
          <div style={header}>
            <span>WellTrack Assistant</span>
            <Button
              variant="link"
              size="sm"
              onClick={() => setIsOpen(false)}
              style={{ color: '#fff', padding: 0, lineHeight: 1 }}
            >
              <FiX size={18} />
            </Button>
          </div>

          <div style={messageArea}>
            {messages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ borderTop: '1px solid #dee2e6', flexShrink: 0 }}>
            <ChatInput onSend={handleSend} />
          </div>
        </div>
      )}

      <Button
        variant="primary"
        style={toggleButton}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? <FiX /> : <FiMessageCircle />}
      </Button>
    </>
  );
};

export default ChatWidget;
