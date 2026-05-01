import express from 'express'
import cors from 'cors'

const app = express()
app.use(cors())
app.use(express.json({ limit: '20mb' }))

const GHANA_DRUGS = `Simple Linctus, Epicrom 2%, Eyecopen, Alka 5, Evening Primrose, Exforge 10/160, Carbocisteine, Tothema, Zentokid, Pregnacare, Daktacort, Cetirizine, Klovinal, LIV 52, Koflet, Lactulose, Loratadine, No-Spa, Strepsils, Calpol, Paracetamol, Amoxicillin, Amoxyclav, Azithromycin, Clarithromycin, Ciprofloxacin, Metronidazole, Cefuroxime, Cefpodoxime, Cephalexin, Cotrimoxazole, Doxycycline, Erythromycin, Zinnat, Biofluor, Brufen, Ibuprofen, Diclofenac, Tramadol, Doreta, Prednisolone, Dexamethasone, Omeprazole, Metoclopramide, Buscopan, Zincovit, Loperamide, Salbutamol, Augmentin, D-Artepp, Coartem, Artesunate, Fansidar, Chloroquine, Amlodipine, Lisinopril, Methyldopa, Atenolol, Metformin, Glibenclamide, Carvedilol`

app.post('/extract', async (req, res) => {
  try {
    // Step 1: Read raw text from image
    const readResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 800,
        system: 'You are reading a Ghanaian prescription. Read ALL text including printed tables, typed text, stamps, and handwriting. For tables, read each row including item descriptions and doses. Do not skip any text. Do not interpret or normalize — write exactly what you see. Mark unclear words with ?',
        messages: req.body.messages
      })
    })
    const readData = await readResponse.json()
    const rawText = readData.content[0].text

    // Step 2: Normalize drugs and structure
    const normalizeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 800,
        system: `You are a Ghanaian pharmacist correcting OCR errors in prescriptions.

Common misreadings to correct:
- "Simole", "Simols" + "Lrous/Linous/lictus" = "Simple Linctus"
- "Catrizine", "Cetrizine" = "Cetirizine"
- "Aospa", "ADOSPA", "A003PA", "Nospa" = "No-Spa"
- "Strepsons", "Strepsols" = "Strepsils"
- "Amoxy", "Amoxly" = "Amoxicillin"
- "Clanthromyen" = "Clarithromycin"
- "Calpool" = "Calpol"
- "Lactalose", "hactelose", "hacterlose" = "Lactulose"
- "Amoksiclav", "Amoxiclav" = "Amoxyclav"
- "Cefurocime" = "Cefuroxime"
- "Icoflet" = "Koflet"
- "Pregnacane" = "Pregnacare"
- "Totehma" = "Tothema"
- "Primerase" = "Evening Primrose"

Keep brand names as written. Match against this drug list: ${GHANA_DRUGS}

Abbreviations: OD=once daily, BD=twice daily, TDS=three times daily, QDS=four times daily, 7/7=7 days, 14/7=14 days, 5/7=5 days, 3/7=3 days, 1/52=1 week, 2/52=2 weeks, gtt/gutt=drops, Pess=pessary, nocte=at night, mane=in the morning, stat=immediately.
Return ONLY valid JSON, no markdown.`,
        messages: [{
          role: 'user',
          content: `Normalize this prescription text into structured JSON:

"${rawText}"

Return ONLY:
{
  "prescriber": "string or null",
  "date": "string or null",
  "medications": [
    { "drug": "string", "dose": "string or null", "frequency": "string or null", "duration": "string or null" }
  ],
  "confidence": "high/medium/low"
}`
        }]
      })
    })
    const normalizeData = await normalizeResponse.json()
    const normalized = JSON.parse(normalizeData.content[0].text.replace(/```json|```/g, '').trim())
    const drugNames = normalized.medications.map(m => m.drug).join(', ')

    // Step 3: Clinical intelligence
    const clinicalResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        system: 'You are a clinical pharmacist in Ghana providing dispensing intelligence. Be concise and practical. Return ONLY valid JSON, no markdown.',
        messages: [{
          role: 'user',
          content: `For this prescription with drugs: ${drugNames}

Return ONLY this JSON:
{
  "drug_info": [
    {
      "drug": "string",
      "indication": "what it is used for in one sentence",
      "key_side_effects": ["up to 3 most important"],
      "counselling_points": ["up to 3 practical points for the patient"]
    }
  ],
  "interactions": [
    {
      "drugs": ["drug1", "drug2"],
      "severity": "mild/moderate/severe",
      "description": "one sentence"
    }
  ],
  "interaction_summary": "string — overall safety note or 'No significant interactions identified'"
}`
        }]
      })
    })
    const clinicalData = await clinicalResponse.json()
    const clinical = JSON.parse(clinicalData.content[0].text.replace(/```json|```/g, '').trim())

    res.json({ ...normalized, ...clinical })

  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(3001, () => console.log('Server running on http://localhost:3001'))