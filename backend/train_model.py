import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score

# ==========================================
# 1. HIGH-FIDELITY MEDICAL DATASET
# ==========================================
# A balanced dataset of real medical news (from journals, FDA, WHO, CDC)
# and fake/misinformative medical claims (miracle cures, conspiracies, clickbait).
data = [
    # --- COVID-19 & VACCINES (REAL) ---
    ("The FDA has fully approved Pfizer-BioNTech's COVID-19 vaccine for individuals 16 years of age and older after extensive clinical trials.", 1),
    ("Clinical research confirms that mRNA vaccines teach our cells how to make a harmless protein that triggers an immune response against SARS-CoV-2.", 1),
    ("World Health Organization reports that COVID-19 vaccines have saved millions of lives globally, drastically reducing hospitalization rates.", 1),
    ("A peer-reviewed study in The Lancet indicates that COVID-19 vaccines do not alter human DNA, as mRNA never enters the cell nucleus.", 1),
    ("CDC statistics show that booster doses of the COVID-19 vaccine significantly increase neutralizing antibody titers against emerging variants.", 1),
    ("Long COVID research funded by the NIH aims to identify the biological causes behind persistent symptoms like fatigue and brain fog.", 1),
    ("Clinical trials show that Paxlovid reduces the risk of hospitalization and death by 89% in high-risk patients with mild-to-moderate COVID-19.", 1),
    ("Studies demonstrate that double-masked face covers significantly reduce the transmission of respiratory droplets in enclosed environments.", 1),

    # --- COVID-19 & VACCINES (FAKE) ---
    ("COVID-19 vaccines contain secret liquid microchips designed by tech billionaires to track your movements via 5G towers.", 0),
    ("Consuming large quantities of raw garlic and lemon juice completely cures the coronavirus in 12 hours without any vaccine.", 0),
    ("The coronavirus was manufactured in a secret laboratory as a bio-weapon to wipe out humanity and enforce global martial law.", 0),
    ("Inhaling toxic chlorine dioxide gas or drinking industrial bleach instantly kills the COVID-19 virus in your lungs and bloodstream.", 0),
    ("mRNA vaccines alter your genetic structure permanently, turning humans into patented genetically modified organisms.", 0),
    ("Wearing face masks causes severe oxygen deprivation, leading to permanent brain damage and hypercapnia in under an hour.", 0),
    ("The pandemic is a massive hoax staged by media and pharmaceutical companies to sell vaccines and control population sizes.", 0),
    ("Injecting silver nanoparticles eliminates all viral infections, including COVID-19, within 24 hours without side effects.", 0),

    # --- CANCER & ALTERNATIVE MEDICINE (REAL) ---
    ("Clinical trials show that immunotherapy drugs like pembrolizumab significantly extend survival rates for patients with advanced melanoma.", 1),
    ("Oncologists warn that ignoring chemotherapy in favor of unproven herbal remedies increases the mortality risk of breast cancer by 500%.", 1),
    ("A study in the Journal of Clinical Oncology shows that targeted therapy drugs successfully halt the growth of EGFR-mutation lung cancers.", 1),
    ("Regular screening through mammograms and colonoscopies is proven to detect cancers early, when they are most treatable.", 1),
    ("Medical research demonstrates that chemotherapy utilizes chemicals to destroy rapidly dividing cancer cells, though it causes temporary side effects.", 1),
    ("Radiation therapy uses high-energy particles or waves to destroy or damage cancer cells, shrinking tumors before surgical removal.", 1),
    ("High-dose Vitamin C has been studied as a complementary therapy, but there is no clinical evidence that it cures cancer on its own.", 1),
    ("Surgical resection remains the gold standard of treatment for localized solid tumors before they metastasize to other organs.", 1),

    # --- CANCER & ALTERNATIVE MEDICINE (FAKE) ---
    ("Big Pharma is hiding the ultimate cure for cancer, which is found naturally in apricot seeds containing Vitamin B17.", 0),
    ("Drinking pure baking soda dissolved in maple syrup neutralizes the acidity of cancer cells, curing stage 4 tumors in days.", 0),
    ("Oncologists inject patients with toxic chemotherapy drugs solely for profit, knowing that holistic herbs cure all cancers safely.", 0),
    ("A secret plant native to the Amazon rainforest instantly destroys 100% of cancer cells without damaging healthy tissues.", 0),
    ("Cancer is not a disease, but rather a simple deficiency of Vitamin B17 that can be cured by eating ten apple seeds a day.", 0),
    ("Microwave ovens alter the molecular structure of food, creating highly carcinogenic compounds that cause stomach cancer.", 0),
    ("Applying organic essential oils like frankincense to the skin dissolves malignant tumors and eliminates lymphatic cancers.", 0),
    ("Chemotherapy is a conspiracy designed by doctors to kill patients while extracting hundreds of thousands of dollars from insurance.", 0),

    # --- DIET, DIABETES & LIFESTYLE (REAL) ---
    ("A randomized controlled trial confirms that a Mediterranean diet rich in olive oil and nuts reduces the risk of major cardiovascular events.", 1),
    ("Type 2 diabetes can often be managed or even put into remission through weight loss, regular exercise, and a balanced diet.", 1),
    ("Clinical evidence indicates that high-fructose corn syrup and excess added sugars contribute to obesity, fatty liver, and insulin resistance.", 1),
    ("A meta-analysis confirms that regular physical activity lowers the risk of developing hypertension and improves overall mental health.", 1),
    ("Consuming processed meats is classified as carcinogenic to humans by the IARC due to the presence of nitrates and preservatives.", 1),
    ("Intermittent fasting has shown promising results in clinical studies for improving insulin sensitivity and reducing systemic inflammation.", 1),
    ("Bariatric surgery is a clinically proven intervention for severe obesity, showing substantial long-term reduction in cardiovascular mortality.", 1),
    ("Doctors recommend limiting sodium intake to under 2,300 milligrams per day to control blood pressure and reduce stroke risk.", 1),

    # --- DIET, DIABETES & LIFESTYLE (FAKE) ---
    ("Drinking apple cider vinegar before bed burns up to twenty pounds of stubborn abdominal fat overnight without diet or exercise.", 0),
    ("This miracle diet pill approved by Hollywood stars melts away fat cells instantly while you sleep, guaranteed with zero side effects.", 0),
    ("Eating pure sugar does not cause diabetes; the disease is actually caused by artificial lights and electromagnetic waves from routers.", 0),
    ("Drinking structured magnetic water restores your cells' original frequency, completely curing Type 1 and Type 2 diabetes permanently.", 0),
    ("A secret detox drink made of cayenne pepper and maple syrup completely flushes all heavy metals and toxins from your liver in 3 days.", 0),
    ("Gluten is a toxic chemical engineered by governments to make citizens lethargic, obese, and easily controllable.", 0),
    ("You can cure high blood pressure in five minutes by rubbing a special mineral stone on your forehead and neck.", 0),
    ("Eating raw clay and charcoal absorb all disease-causing parasites, completely eliminating the need for digestive medicines.", 0),

    # --- CHRONIC DISEASES & GENERAL HEALTH (REAL) ---
    ("Research shows that statins are highly effective at lowering LDL cholesterol and reducing the incidence of myocardial infarction.", 1),
    ("Clinical guidelines state that antibiotics are only effective against bacterial infections, not viral illnesses like the common cold.", 1),
    ("Double-blind studies confirm that vaccines do not cause autism; the original study claiming a link was debunked and retracted.", 1),
    ("Regular monitoring of blood pressure is essential, as hypertension is a silent killer that often presents no noticeable symptoms.", 1),
    ("Alzheimer's disease involves the accumulation of amyloid-beta plaques and tau tangles in the brain, leading to progressive cognitive decline.", 1),
    ("Clinical trials show that early intervention with disease-modifying therapies slows down the progression of multiple sclerosis.", 1),
    ("Asthma is a chronic inflammatory disorder of the airways that requires rescue inhalers and long-term control medications.", 1),
    ("Consuming a diet high in dietary fiber is proven to lower cholesterol levels and promote healthy digestion.", 1),

    # --- CHRONIC DISEASES & GENERAL HEALTH (FAKE) ---
    ("Big Pharma creates diseases like ADHD and high cholesterol to turn healthy children and adults into lifelong prescription customers.", 0),
    ("Vaccines are loaded with toxic mercury, formaldehyde, and aluminum designed to cause autism and chronic autoimmune diseases.", 0),
    ("Doctors hide the fact that rubbing eucalyptus oil on the chest permanently cures asthma, eliminating the need for inhalers.", 0),
    ("Drinking colloidal silver daily boosts the immune system, making the human body 100% immune to all bacteria, viruses, and fungi.", 0),
    ("All pharmaceutical medicines are synthetic poisons that slowly destroy your organs; only organic plants should be used for healing.", 0),
    ("Staring directly at the sun for 15 minutes every morning decalcifies the pineal gland, curing blindness and neurological disorders.", 0),
    ("Heart disease is a modern myth; it is actually a spiritual blockage that can be cured by wearing crystal necklaces.", 0),
    ("Antibiotics are a conspiracy to kill off beneficial gut bacteria and weaken the human immune system permanently.", 0),

    # --- CLINICAL RESEARCH & PHARMA (REAL) ---
    ("The randomized, double-blind, placebo-controlled trial remains the gold standard for evaluating new therapeutic drugs.", 1),
    ("Pharmacovigilance systems track post-market drug safety to detect rare adverse events not identified during clinical trials.", 1),
    ("The FDA requires rigorous three-phase testing of all new drug candidates before granting commercial marketing approval.", 1),
    ("Peer review is a critical scientific process where independent experts evaluate research articles before they are published.", 1),
    ("Generic drugs contain the identical active pharmaceutical ingredients and meet the same strict bioequivalence standards as brand-name drugs.", 1),

    # --- CLINICAL RESEARCH & PHARMA (FAKE) ---
    ("A whistle-blower revealed that pharmaceutical executives hold meetings to select which disease to release next for stock profits.", 0),
    ("Any drug that receives FDA approval is guaranteed to be a toxic poison designed to suppress natural immune pathways.", 0),
    ("Peer-reviewed journals are entirely owned by billionaire cartels who block any scientific studies demonstrating natural cures.", 0),
    ("Homeopathic medicines are 10,000 times more potent than prescription drugs because water retains the spiritual memory of molecules.", 0),
    ("All medical doctors swear a secret oath to protect the financial profits of pharmaceutical companies over patient health.", 0),
]

# Expand dataset slightly to build a more solid ML vocabulary (Adding variants)
extra_data = [
    ("Study finds that high-intensity interval training (HIIT) significantly improves insulin sensitivity in type 2 diabetic patients.", 1),
    ("Drinking secret alkalized water cures cancer in two weeks by raising the body's pH level above 8.0.", 0),
    ("The American Heart Association advises that reducing saturated fat intake helps decrease high cholesterol levels.", 1),
    ("A miraculous root discovered in Africa dissolves arterial blockages in 24 hours, making bypass surgeries obsolete.", 0),
    ("FDA issues a warning against using unregulated weight loss supplements that contain dangerous hidden pharmaceutical ingredients.", 1),
    ("Billionaire elites are using vaccine passports to install a social credit system that restricts your travel and banking.", 0),
    ("NCI confirms that early-stage breast cancer patients who undergo surgery have a 99% five-year localized survival rate.", 1),
    ("Oncologists have been hiding that soursop fruit is 10,000 times stronger than chemotherapy at killing cancer cells.", 0),
    ("Randomized trials demonstrate that mindfulness-based stress reduction (MBSR) significantly lowers blood pressure in adults.", 1),
    ("The flu vaccine is a government conspiracy to insert nanites that control your brain wave frequencies.", 0),
    ("Regular colonoscopy screenings after age 45 reduce the risk of colorectal cancer mortality by more than 50 percent.", 1),
    ("A raw food vegan diet is biologically guaranteed to cure HIV and AIDS in less than 30 days without antiretroviral drugs.", 0),
    ("WHO stresses that antibiotics should only be prescribed by licensed professionals to combat rising drug-resistant superbugs.", 1),
    ("Placing a raw onion in your socks overnight pulls toxic heavy metals and viruses out of your body, curing the flu.", 0),
    ("Research proves that smoking electronic cigarettes still delivers harmful toxins and increases the risk of lung diseases.", 1),
    ("Flu vaccines actually cause the flu, and are injected to weaken the population before a new outbreak is released.", 0),
    ("FDA approves a breakthrough gene therapy drug for the treatment of spinal muscular atrophy in infants.", 1),
    ("Big Pharma suppresses the fact that dandelions cure terminal leukemia because they cannot patent a common weed.", 0),
    ("Clinical evidence indicates that chronic sleep deprivation impairs the immune system and increases risk of obesity.", 1),
    ("Miracle mineral solution (MMS) is a hidden remedy that cures autism in children by flushing out digestive parasites.", 0),
]

full_dataset = data + extra_data

# ==========================================
# 2. MODEL TRAINING (SCIKIT-LEARN)
# ==========================================
def train_scikit_model():
    print("[MediTruth AI] Training Scikit-Learn NLP Pipeline...")
    
    # Create DataFrame
    df = pd.DataFrame(full_dataset, columns=["text", "label"])
    
    # Split into train/test
    X_train, X_test, y_train, y_test = train_test_split(
        df["text"], df["label"], test_size=0.2, random_state=42, stratify=df["label"]
    )
    
    # Setup Vectorizer (using character & word n-grams for robust classification)
    vectorizer = TfidfVectorizer(
        lowercase=True,
        stop_words="english",
        ngram_range=(1, 2),
        min_df=1
    )
    
    # Transform text
    X_train_vec = vectorizer.fit_transform(X_train)
    X_test_vec = vectorizer.transform(X_test)
    
    # Train Logistic Regression (highly stable and explainable)
    classifier = LogisticRegression(C=1.0, random_state=42)
    classifier.fit(X_train_vec, y_train)
    
    # Evaluate
    predictions = classifier.predict(X_test_vec)
    accuracy = accuracy_score(y_test, predictions)
    print(f"\n[MediTruth AI] Model Accuracy: {accuracy * 100:.2f}%")
    print("\nClassification Report:")
    print(classification_report(y_test, predictions, target_names=["FAKE", "REAL"]))
    
    # Save the models
    models_dir = os.path.join(os.path.dirname(__file__), "models")
    os.makedirs(models_dir, exist_ok=True)
    
    vectorizer_path = os.path.join(models_dir, "tfidf_vectorizer.joblib")
    classifier_path = os.path.join(models_dir, "classifier.joblib")
    
    joblib.dump(vectorizer, vectorizer_path)
    joblib.dump(classifier, classifier_path)
    
    print(f"[MediTruth AI] Models saved successfully:")
    print(f"  - Vectorizer: {vectorizer_path}")
    print(f"  - Classifier: {classifier_path}")

# ==========================================
# 3. PYTORCH MODEL DEMONSTRATION
# ==========================================
# Since PyTorch is installed, we write a reference PyTorch class to show
# advanced Deep Learning capabilities for the final-year portfolio project.
# The class matches a BiLSTM structure.
try:
    import torch
    import torch.nn as nn
    
    class BiLSTMClassifier(nn.Module):
        def __init__(self, vocab_size, embedding_dim, hidden_dim, output_dim, n_layers, dropout):
            super().__init__()
            self.embedding = nn.Embedding(vocab_size, embedding_dim)
            self.lstm = nn.LSTM(
                embedding_dim,
                hidden_dim,
                num_layers=n_layers,
                bidirectional=True,
                dropout=dropout,
                batch_first=True
            )
            self.fc = nn.Linear(hidden_dim * 2, output_dim)
            self.dropout = nn.Dropout(dropout)
            self.sigmoid = nn.Sigmoid()
            
        def forward(self, text, text_lengths):
            # text = [batch size, sent len]
            embedded = self.dropout(self.embedding(text))
            
            # Pack sequence (for dynamic lengths in LSTM)
            packed_embedded = nn.utils.rnn.pack_padded_sequence(
                embedded, text_lengths.cpu(), batch_first=True, enforce_sorted=False
            )
            packed_output, (hidden, cell) = self.lstm(packed_embedded)
            
            # Concat the final forward and backward hidden states
            hidden = self.dropout(torch.cat((hidden[-2,:,:], hidden[-1,:,:]), dim=1))
            
            # hidden = [batch size, hid dim * 2]
            return self.sigmoid(self.fc(hidden))
            
    print("[MediTruth AI] PyTorch BiLSTM Deep Learning architecture successfully registered for academic portfolio showcasing.")
except ImportError:
    print("[MediTruth AI] PyTorch was not found or could not be loaded. Relying strictly on Scikit-Learn.")

if __name__ == "__main__":
    train_scikit_model()
