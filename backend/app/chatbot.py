import re

# Fact checking knowledge base for instant high-fidelity answers
KNOWLEDGE_BASE = [
    {
        "keywords": [r"vaccine", r"microchip", r"5g"],
        "reply": (
            "### 🔍 MediTruth AI Fact-Check: Vaccine Microchips & 5G\n\n"
            "**Verdict: ❌ COMPLETE HOAX**\n\n"
            "**Clinical Summary:**\n"
            "- There is **zero scientific or physical evidence** that any COVID-19 or general vaccines contain microchips, nanites, or tracking devices.\n"
            "- The biological ingredients of mRNA and viral-vector vaccines are fully public, consisting of mRNA, lipids, salts, and sugars. These compounds dissolve naturally in the body after stimulating an immune response.\n"
            "- **Sources:** World Health Organization (WHO), Centers for Disease Control and Prevention (CDC)."
        )
    },
    {
        "keywords": [r"alter.*dna", r"dna.*change", r"mrna.*gene"],
        "reply": (
            "### 🧬 MediTruth AI Fact-Check: mRNA and Human DNA\n\n"
            "**Verdict: ❌ BIOLOGICALLY IMPOSSIBLE**\n\n"
            "**Clinical Summary:**\n"
            "- mRNA (messenger RNA) vaccines **cannot alter human DNA**.\n"
            "- mRNA delivers instructions to ribosomes in the cell cytoplasm to produce a harmless spike protein. It **never enters the cell nucleus**, where human DNA resides.\n"
            "- Once the protein is built, the cell breaks down and disposes of the mRNA molecule within hours.\n"
            "- **Sources:** National Institutes of Health (NIH), The Lancet."
        )
    },
    {
        "keywords": [r"apricot.*seed", r"vitamin b17", r"b17.*cancer", r"laetrile"],
        "reply": (
            "### 🍑 MediTruth AI Fact-Check: Vitamin B17 (Laetrile) for Cancer\n\n"
            "**Verdict: ⚠️ CRITICAL WARNING & INACCURATE**\n\n"
            "**Clinical Summary:**\n"
            "- Vitamin B17 (also known as Laetrile or Amygdalin), found in apricot pits, is **not a cure for cancer** and is banned by the FDA.\n"
            "- When ingested, Laetrile is converted in the gut into **cyanide**, which can lead to severe cyanide poisoning, oxygen deprivation, and death.\n"
            "- Multi-phase clinical trials show zero efficacy in shrinking tumors.\n"
            "- **Sources:** National Cancer Institute (NCI), FDA."
        )
    },
    {
        "keywords": [r"alkaline.*diet", r"baking soda.*cancer", r"acid.*cancer"],
        "reply": (
            "### 🍋 MediTruth AI Fact-Check: Alkaline Diet and Cancer\n\n"
            "**Verdict: ❌ UNFOUNDED BIOLOGICAL CLAIM**\n\n"
            "**Clinical Summary:**\n"
            "- The theory that cancer can be cured by eating an alkaline diet (or drinking baking soda) to alter body pH is **biologically false**.\n"
            "- The human body regulates blood pH within a very tight, slightly alkaline range (7.35 to 7.45) using the lungs and kidneys. Dietary intake cannot change blood pH.\n"
            "- While cancer cells thrive in an acidic *microenvironment* in the lab, this acidity is a *byproduct* of rapid cellular growth, not the cause of it.\n"
            "- **Sources:** American Cancer Society, Journal of Clinical Oncology."
        )
    },
    {
        "keywords": [r"garlic", r"lemon juice", r"cure.*covid", r"ginger"],
        "reply": (
            "### 🧄 MediTruth AI Fact-Check: Herbal Remedies for COVID-19\n\n"
            "**Verdict: ❌ EXAGGERATED THERAPEUTIC CLAIM**\n\n"
            "**Clinical Summary:**\n"
            "- While garlic, lemon, ginger, and honey possess mild antimicrobial and anti-inflammatory properties that soothe cold symptoms, they **do not cure or prevent COVID-19**.\n"
            "- Believing herbal remedies eliminate viral loads can cause high-risk patients to delay seeking proven clinical antivirals (like Paxlovid).\n"
            "- **Sources:** WHO guidelines, Clinical Trials Database."
        )
    },
    {
        "keywords": [r"colloidal.*silver", r"silver.*nanoparticle"],
        "reply": (
            "### 🥈 MediTruth AI Fact-Check: Colloidal Silver\n\n"
            "**Verdict: ❌ DANGEROUS PSEUDOSCIENCE**\n\n"
            "**Clinical Summary:**\n"
            "- Colloidal silver has **no known essential function or health benefit** in the human body.\n"
            "- The FDA has warned that colloidal silver is not safe or effective for treating any disease. Prolonged use causes **argyria**, a permanent cosmetic condition that turns the skin a slate-blue color, and can cause organ toxicity.\n"
            "- **Sources:** FDA Consumer Advisory, Mayo Clinic."
        )
    },
    {
        "keywords": [r"apple cider vinegar", r"acv.*weight", r"burn.*fat"],
        "reply": (
            "### 🍎 MediTruth AI Fact-Check: Apple Cider Vinegar Fat Burning\n\n"
            "**Verdict: ⚠️ EXAGGERATED WELLNESS CLAIM**\n\n"
            "**Clinical Summary:**\n"
            "- Apple cider vinegar (ACV) does **not burn abdominal fat overnight** or trigger major weight loss without calorie restrictions.\n"
            "- Some studies show ACV may moderately improve insulin response or increase short-term satiety, but it is not a replacement for balanced diets.\n"
            "- Undiluted ACV is highly acidic and can erode tooth enamel and irritate the esophagus.\n"
            "- **Sources:** Harvard Medical School Health Publication."
        )
    }
]

DEFAULT_REPLY = (
    "### 🤖 MediTruth AI Assistant\n\n"
    "Hello! I am your **MediTruth AI Medical Assistant**, trained to analyze health claims, debunk fake news, and evaluate scientific credibility.\n\n"
    "It looks like you are asking a general health question! Here are some hot topics you can ask me to fact-check:\n"
    "1. *'Do mRNA vaccines alter human DNA?'*\n"
    "2. *'Can apricot seeds cure cancer?'*\n"
    "3. *'Does drinking alkaline water or baking soda eliminate tumors?'*\n"
    "4. *'Is colloidal silver a safe immune booster?'*\n\n"
    "You can also **copy and paste any medical news headline or paragraph** directly into the **Fake News Analyzer dashboard** to get a comprehensive Scikit-Learn evaluation, NLP highlight tokenization, risk index, and detailed explanation report!"
)

def get_chatbot_reply(user_message: str) -> str:
    message_lower = user_message.lower().strip()
    
    if not message_lower:
        return "Please input a message so I can assist you with healthcare fact-checking!"
        
    # Match keywords in knowledge base
    for item in KNOWLEDGE_BASE:
        for pattern in item["keywords"]:
            if re.search(pattern, message_lower):
                return item["reply"]
                
    # Direct answers for common simple greetings
    if message_lower in ["hi", "hello", "hey", "greetings", "good morning", "good afternoon"]:
        return (
            "### 👋 Welcome to MediTruth AI Chatbot!\n\n"
            "I am ready to help you dissect medical news and fact-check suspicious clinical claims. "
            "Type a medical question or ask me about vaccines, cancer cures, or diet myths!"
        )
        
    return DEFAULT_REPLY
