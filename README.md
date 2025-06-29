
# 🚨 RESQ-AI

**RESQ-AI** is an intelligent SOS alert system that uses natural language processing to detect real-time emergency messages and plot the user's live location on a map. Built for real-world disaster response scenarios.

---

## 🔍 Overview

RESQ-AI allows users to send a message, which is analyzed by an AI model to determine whether it's a real emergency or not. If it's classified as a disaster situation, it triggers an SMS alert via Twilio and maps the user's geolocation with a red pin.

---

## 🧠 Features

- 🔍 **NLP-powered SOS detection** (Logistic Regression + TF-IDF)
- 📍 **Live geolocation tracking**
- 🗺️ **Leaflet.js map integration**
- 📲 **Twilio SMS alerts for emergencies**
- ⚙️ **Lightweight Flask backend**
- 🔐 **Mock login/signup UI**
- 🧪 **Edge-case handling** (sarcasm, slang, multilingual input)

---

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript, Leaflet.js
- **Backend**: Python, Flask
- **ML**: Scikit-learn (TF-IDF + Logistic Regression)
- **Alerts**: Twilio API

---

## 📁 File Structure

```
resq-ai/
├── app.py                      # Flask server
├── nlp_model.py                # Text classification logic
├── train.py                    # Model training
├── twilio_alert.py             # Sends SMS alerts
├── tfidf_vectorizer.pkl        # Saved vectorizer
├── disaster_classifier_model.pkl # Saved classifier
├── augmented_disaster_data.csv # Augmented training data
├── templates/
│   ├── index.html              # Main interface
│   └── auth.html               # Login/Signup page
├── static/
│   ├── style.css               # UI styling
│   ├── script.js               # Frontend logic
│   ├── auth.css                # Auth styles
│   └── auth.js                 # Login/Signup toggle logic
```

---

## 🚀 Getting Started

1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/resq-ai.git
   cd resq-ai
   ```

2. Install requirements:
   ```bash
   pip install -r requirements.txt
   ```

3. Train the model (optional if model files are already provided):
   ```bash
   python train.py
   ```

4. Run the app:
   ```bash
   python app.py
   ```

5. Open in browser:
   ```
   http://localhost:5000
   ```

---

## 📦 Dataset

The model is trained on a dataset combining real disaster tweets and custom edge cases to improve classification under unusual scenarios like sarcasm or slang.

---

## 🔐 Note on Auth

The login/signup system is for UI purposes only — no real backend or database validation is performed.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 👥 Team

Built by Arjun Joshi and Bharat Lalwani 

---
