export const useOpenAI = () => {
  const getPrediction = async (title: string, description: string) => {
    try {
      const response = await $fetch('/api/predictions', {
        method: 'POST',
        body: { title, description }
      })

      return response.prediction
    } catch (error: any) {
      console.error('Error getting prediction:', error)
      throw new Error(error.data?.message || 'Failed to get prediction')
    }
  }

  return {
    getPrediction
  }
} 