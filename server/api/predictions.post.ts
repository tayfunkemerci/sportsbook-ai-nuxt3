import { GoogleGenerativeAI } from '@google/generative-ai'

interface PromptTemplate {
  title: string
  sections: {
    historical: string
    current: string
  }
  historicalPoints: string[]
  currentPoints: string[]
  response: {
    include: string
    points: string[]
    format: string
    template: string
    note: string
  }
}

interface PromptTemplates {
  en: PromptTemplate
  tr: PromptTemplate
}

const promptTemplates: PromptTemplates = {
  en: {
    title: 'You are an expert sports betting analyst with deep knowledge of football statistics and historical data.',
    sections: {
      historical: 'HISTORICAL ANALYSIS',
      current: 'CURRENT SEASON PERFORMANCE'
    },
    historicalPoints: [
      'Head-to-head record in the last 5 seasons',
      'Home/Away performance patterns in these matchups',
      'Goal scoring trends in their meetings',
      'Notable matches or significant results'
    ],
    currentPoints: [
      'Current league position and points',
      'Last 5 matches form and results',
      'Home/Away record this season',
      'Goals scored and conceded',
      'Key player availability and injuries',
      'Recent tactical changes or formations'
    ],
    response: {
      include: 'Your response should include:',
      points: [
        'A clear prediction about the outcome',
        'A confidence level as a percentage (e.g., 75%)',
        'Key factors combining historical patterns, current form, and match analysis'
      ],
      format: 'Format your response exactly like this:',
      template: '[Main Prediction] with [X]% confidence.\nKey factors:\n- Historical: [Key point from 5-season analysis]\n- Current Form: [Key points from current season]\n- Analysis: [Key points from match analysis]',
      note: 'Keep your response concise but include historical, current, and match analysis insights.'
    }
  },
  tr: {
    title: 'Futbol istatistikleri ve geçmiş veriler konusunda derin bilgiye sahip uzman bir bahis analistisiniz.',
    sections: {
      historical: 'GEÇMİŞ ANALİZİ',
      current: 'MEVCUT SEZON PERFORMANSI'
    },
    historicalPoints: [
      'Son 5 sezondaki karşılıklı maç sonuçları',
      'Bu karşılaşmalardaki ev sahibi/deplasman performans desenleri',
      'Karşılaşmalardaki gol atma trendleri',
      'Önemli maçlar ve dikkat çeken sonuçlar'
    ],
    currentPoints: [
      'Mevcut lig sıralaması ve puan durumu',
      'Son 5 maçtaki form ve sonuçlar',
      'Bu sezonki ev sahibi/deplasman performansı',
      'Atılan ve yenilen goller',
      'Önemli oyuncuların durumu ve sakatlıklar',
      'Son dönemdeki taktiksel değişiklikler ve dizilişler'
    ],
    response: {
      include: 'Yanıtınız şunları içermelidir:',
      points: [
        'Sonuç hakkında net bir tahmin',
        'Yüzdelik güven seviyesi (örn: %75)',
        'Hem geçmiş desenler hem de mevcut form kaynaklı anahtar faktörler'
      ],
      format: 'Yanıtınızı tam olarak bu formatta verin:',
      template: '[Ana Tahmin] %[X] güven ile.\nAnahtar faktörler:\n- Geçmiş: [5 sezonluk analizden çıkan önemli nokta]\n- Güncel Form: [Bu sezonki performanstan çıkan noktalar]\n- Analiz: [Maç analizinden çıkan noktalar]',
      note: 'Yanıtınızı kısa tutun ancak hem geçmiş hem de güncel bilgileri dahil edin.'
    }
  }
}

interface RequestBody {
  title: string
  description: string
  lang?: 'en' | 'tr'
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const body = await readBody<RequestBody>(event)

  if (!body.title || !body.description) {
    throw createError({
      statusCode: 400,
      message: 'Title and description are required'
    })
  }

  const lang = body.lang || 'en'
  const template = promptTemplates[lang]

  try {
    // Initialize Gemini API
    const genAI = new GoogleGenerativeAI(config.geminiApiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    // Calculate current and past seasons
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    const currentMonth = currentDate.getMonth() + 1
    
    const seasonStartYear = currentMonth < 8 ? currentYear - 1 : currentYear
    const seasonEndYear = seasonStartYear + 1
    const currentSeason = `${seasonStartYear}-${seasonEndYear.toString().slice(2)}`

    // Calculate last 5 seasons range
    const lastFiveStart = seasonStartYear - 5
    const seasonRange = `${lastFiveStart}-${lastFiveStart + 1} to ${currentSeason}`

    const prompt = `${template.title}
    
Provide a comprehensive analysis considering:

${template.sections.historical} (${seasonRange}):
${template.historicalPoints.map((point: string, index: number) => `${index + 1}. ${point}`).join('\n')}

${template.sections.current} (${currentSeason}):
${template.currentPoints.map((point: string, index: number) => `${index + 1}. ${point}`).join('\n')}

Analyze this betting scenario and provide a detailed prediction:
Title: ${body.title}
Description: ${body.description}

${template.response.include}
${template.response.points.map((point: string, index: number) => `${index + 1}. ${point}`).join('\n')}

${template.response.format}
"${template.response.template}"

${template.response.note}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const prediction = response.text()

    // Validate the prediction format
    if (!prediction.includes('confidence') && !prediction.includes('güven')) {
      throw new Error('Invalid prediction format')
    }

    return {
      prediction
    }
  } catch (error: any) {
    console.error('Gemini API Error:', error)
    
    // If there's an API key error
    if (error.message?.includes('API key')) {
      throw createError({
        statusCode: 401,
        message: lang === 'tr' ? 'Geçersiz API anahtarı. Lütfen Gemini API yapılandırmanızı kontrol edin.' : 'Invalid API key. Please check your Gemini API configuration.'
      })
    }

    // For rate limiting or quota errors
    if (error.message?.includes('quota') || error.message?.includes('rate')) {
      throw createError({
        statusCode: 429,
        message: lang === 'tr' ? 'AI tahminleri geçici olarak kullanılamıyor. Lütfen daha sonra tekrar deneyin.' : 'AI predictions are temporarily unavailable. Please try again later.'
      })
    }

    // For other errors
    throw createError({
      statusCode: 500,
      message: lang === 'tr' ? 'Tahmin oluşturulamadı. Lütfen daha sonra tekrar deneyin.' : 'Failed to generate prediction. Please try again later.'
    })
  }
}) 