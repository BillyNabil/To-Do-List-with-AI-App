import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GOOGLE_AI_API_KEY || 'placeholder-key'
const genAI = new GoogleGenerativeAI(apiKey)

export interface ParsedSchedule {
  title: string
  description?: string | null
  due_date?: string | null
  status?: 'todo' | 'inProgress' | 'completed'
}

export async function parseScheduleMessage(message: string): Promise<ParsedSchedule | ParsedSchedule[] | { error: string }> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
    
    const prompt = `
You are an AI assistant that parses natural language messages into structured schedule data.
Parse the following message and extract ALL schedule/task information from paragraphs.
Support both English and Indonesian languages with advanced understanding of long texts and complex sentences.

Rules:
1. Look for multiple tasks/phrases in the message - each separate task should be a separate object
2. If multiple tasks are mentioned (even in different sentences/paragraphs), return an array of objects
3. If only one task, return a single object
4. Parse relative dates in both languages (tomorrow/besok, next week/minggu depan, next monday/senin depan, etc.) to actual dates
5. Default time: 9:00 AM if not specified
6. Default date: today if not specified
7. Return dates in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
8. Handle various date formats naturally (Oct 15, October 15th, 15/10, etc.)
9. Extract task titles from action verbs, todo items, or clear task descriptions
10. Look for comprehensive keywords in both languages:
    English: "need to", "should", "must", "have to", "plan to", "going to", "schedule", "create", "finish", "complete", "start", "meeting", "call", "email", "review", "submit", "attend", "visit", "buy", "shop", "exercise", "study", "work", "practice", "prepare", "organize", "clean", "cook", "pick up", "drop off", "appointment", "deadline", "event", "activity"
    Indonesian: "harus", "perlu", "akan", "mau", "jadwal", "buat", "selesai", "mulai", "rapat", "telepon", "email", "review", "kumpulkan", "hadiri", "kunjungi", "beli", "belanja", "olahraga", "belajar", "kerja", "latihan", "siapkan", "organisir", "bersihkan", "masak", "ambil", "antar", "janji temu", "deadline", "acara", "kegiatan", "ngantor", "kuliah", "main", "fokus", "cek", "update", "kirim", "terima"
11. Each bullet point, numbered list, or separate sentence that mentions an action should be treated as a separate task
12. Handle time expressions in both languages (9 AM/9 pagi, 1 PM/1 siang, 12 PM/12 siang, sore, malam, pagi, tengah malam, etc.)
13. Parse long texts and complex paragraphs - break down into individual actionable items
14. Handle conversational Indonesian including slang and informal language
15. Recognize contextual time references (setelah itu, nanti, besoknya, minggu depannya, dll)
16. Extract implied tasks from descriptive sentences
17. Handle compound sentences with multiple actions
18. Parse task status from keywords:
    - "inProgress" status: keywords like "starting", "working on", "mulai", "sedang", "sedang dikerjakan", "sedang berlangsung", "ongoing", "in progress", "proses"
    - "completed" status: keywords like "done", "finished", "completed", "selesai", "telah selesai", "sudah", "already", "accomplished"
    - "todo" status: default for new tasks, keywords like "need to", "should", "must", "harus", "perlu", "akan", "mau", "plan to"
19. Default status: "todo" if no status keywords are found
20. If no clear schedule information, return { error: "Could not understand the request format" }

Advanced Indonesian Examples:
Long text:
"Hari ini saya punya banyak sekali kegiatan. Pagi-pagi jam 7 saya harus pergi ke gym untuk olahraga, setelah itu jam 9 saya ada meeting dengan team di kantor. Siangnya jam 12 makan siang sama client, lalu jam 2 kuliah di kampus. Sorenya jam 5 saya mau belanja ke supermarket sebelum pulang ke rumah. Malamnya jam 8 saya harus belajar untuk ujian besok."

Complex sentences:
"Besok saya perlu ke bank pagi-pagi untuk urusan administrasi, kemudian lunch dengan teman lama jam 1 siang, setelah itu lanjut ke kantor untuk meeting penting jam 3, dan malamnya ada family dinner jam 7."

Conversational:
"Gue mau gym jam 6 sore, terus makan, nanti malem mau nonton film. Besoknya harus ke kantor jam 9, meeting sama boss jam 10, terus lunch jam 12."

Message: "${message}"

Response format (single task):
{
  "title": "Task title",
  "description": "Optional description",
  "due_date": "2025-10-17T14:00:00.000Z",
  "status": "todo"
}

Response format (multiple tasks):
[
  {
    "title": "Task 1 title",
    "description": "Optional description",
    "due_date": "2025-10-17T09:00:00.000Z",
    "status": "todo"
  },
  {
    "title": "Task 2 title", 
    "description": "Optional description",
    "due_date": "2025-10-18T14:00:00.000Z",
    "status": "inProgress"
  }
]

Status examples:
- "todo": "I need to finish the report", "Saya harus belajar", "Create a presentation"
- "inProgress": "I'm working on the project", "Sedang mengerjakan tugas", "Starting the review"
- "completed": "I finished the assignment", "Tugas sudah selesai", "The meeting is done"

Current date: ${new Date().toISOString()}
Current time: ${new Date().toLocaleTimeString()}
Timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}

Parse and respond with valid JSON only:
`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()
    
    // Remove markdown code blocks if present
    text = text.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim()
    
    try {
      const parsed = JSON.parse(text)
      return parsed
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError)
      console.error('Raw response:', text)
      return { error: 'Could not understand the request format' }
    }
  } catch (error) {
    console.error('AI parsing error:', error)
    return { error: 'Failed to process request' }
  }
}
